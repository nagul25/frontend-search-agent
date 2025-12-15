interface Tool {
  number: number;
  name: string;
  manufacturer?: string;
  status?: string;
  capabilities?: string;
  subCapability?: string;
  version?: string;
  standardCategory?: string;
  earReferenceId?: string;
  capabilityManager?: string;
  description?: string;
  metaTags?: string[];
  [key: string]: any;
}

interface ParsedResponse {
  hasTools: boolean;
  headerText?: string;
  tools: Tool[];
  footerText?: string;
}

/**
 * Parses the new markdown-style format:
 * - Tool Name
 *   - Manufacturer: Value
 *   - Version: Value
 *   ...
 */
const parseMarkdownStyleFormat = (content: string): ParsedResponse => {
  const result: ParsedResponse = {
    hasTools: false,
    tools: [],
  };

  const lines = content.split('\n');
  const headerLines: string[] = [];
  const footerLines: string[] = [];
  const toolsData: Array<{ name: string; properties: Record<string, string> }> = [];
  
  let currentTool: { name: string; properties: Record<string, string> } | null = null;
  let inToolSection = false;
  let passedToolSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Check if this is a tool name line (starts with "- " followed by a name, not a property)
    // Tool name lines: "- Cohere Embed" (no colon on this line)
    // Property lines: "  - Manufacturer: IBM" (has colon)
    const isToolNameLine = /^-\s+[^-]/.test(trimmedLine) && !trimmedLine.includes(':');
    const isPropertyLine = /^\s*-\s+[^:]+:\s*.+/.test(line) || /^-\s+[^:]+:\s*.+/.test(trimmedLine);
    
    if (isToolNameLine) {
      // Save previous tool if exists
      if (currentTool) {
        toolsData.push(currentTool);
      }
      
      inToolSection = true;
      const toolName = trimmedLine.replace(/^-\s+/, '').trim();
      currentTool = { name: toolName, properties: {} };
    } else if (isPropertyLine && currentTool) {
      // Parse property line
      const propertyMatch = trimmedLine.match(/^-\s+([^:]+):\s*(.+)$/);
      if (propertyMatch) {
        const key = propertyMatch[1].trim();
        const value = propertyMatch[2].trim();
        currentTool.properties[key] = value;
      }
    } else if (!inToolSection && trimmedLine) {
      headerLines.push(trimmedLine);
    } else if (inToolSection && !isPropertyLine && trimmedLine && !isToolNameLine) {
      // Check if we're past the tool section (notes, guidance, etc.)
      if (trimmedLine.startsWith('Notes') || trimmedLine.startsWith('If you want') || passedToolSection) {
        passedToolSection = true;
        footerLines.push(trimmedLine);
      }
    }
  }

  // Don't forget the last tool
  if (currentTool) {
    toolsData.push(currentTool);
  }

  if (toolsData.length === 0) {
    return result;
  }

  // Convert to Tool objects
  const tools: Tool[] = toolsData.map((data, index) => {
    const tool: Tool = {
      number: index + 1,
      name: data.name,
    };

    for (const [key, value] of Object.entries(data.properties)) {
      const normalizedKey = normalizeKeyName(key);
      
      if (normalizedKey === 'metaTags') {
        tool[normalizedKey] = value.split(',').map(v => v.trim());
      } else if (normalizedKey === 'capabilitySubCapability') {
        // Split "Analytics / Pub/Sub" into capabilities and subCapability
        const parts = value.split('/').map(p => p.trim());
        if (parts.length >= 2) {
          tool.capabilities = parts[0];
          tool.subCapability = parts.slice(1).join('/');
        } else {
          tool.capabilities = value;
        }
      } else {
        tool[normalizedKey] = value;
      }
    }

    return tool;
  });

  result.hasTools = tools.length > 0;
  result.tools = tools;
  result.headerText = headerLines.join('\n');
  result.footerText = footerLines.join('\n');

  return result;
};

/**
 * Parses the old numbered list format:
 * 1. Tool Name - Manufacturer: IBM - Version: 1.0
 */
const parseNumberedListFormat = (content: string): ParsedResponse => {
  const result: ParsedResponse = {
    hasTools: false,
    tools: [],
  };

  const lines = content.split('\n');
  const toolLines: string[] = [];
  const headerLines: string[] = [];
  const footerLines: string[] = [];
  let inToolSection = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (/^\d+\.\s+/.test(trimmedLine)) {
      inToolSection = true;
      toolLines.push(trimmedLine);
    } else if (!inToolSection && trimmedLine) {
      headerLines.push(trimmedLine);
    } else if (inToolSection && trimmedLine) {
      if (toolLines.length > 0) {
        toolLines[toolLines.length - 1] += ' ' + trimmedLine;
      } else {
        footerLines.push(trimmedLine);
      }
    }
  }

  if (toolLines.length === 0) {
    return result;
  }

  const tools: Tool[] = toolLines.map(line => {
    const numberMatch = line.match(/^(\d+)\.\s+/);
    const number = numberMatch ? parseInt(numberMatch[1]) : 0;
    const contentWithoutNumber = line.replace(/^\d+\.\s+/, '');
    const parts = contentWithoutNumber.split(' - ');
    
    const tool: Tool = { number, name: '' };
    
    for (const part of parts) {
      const trimmedPart = part.trim();
      const keyValueMatch = trimmedPart.match(/^([^:]+):\s*(.+)$/);
      
      if (keyValueMatch) {
        let key = keyValueMatch[1].trim();
        const value = keyValueMatch[2].trim();
        
        if (key.includes('/')) {
          key = key.split('/')[0];
        }
        
        const normalizedKey = normalizeKeyName(key);
        
        if (normalizedKey === 'metaTags') {
          tool[normalizedKey] = value.split(',').map(v => v.trim());
        } else {
          tool[normalizedKey] = value;
        }
      }
    }
    
    return tool;
  });

  result.hasTools = tools.length > 0;
  result.tools = tools;
  result.headerText = headerLines.join('\n');
  result.footerText = footerLines.join('\n');

  return result;
};

/**
 * Parses the backend response to extract tool information
 * Supports both old numbered list format and new markdown-style format
 */
export const parseToolsFromResponse = (content: string): ParsedResponse => {
  // Check for markdown-style format first (new format)
  // Pattern: "- ToolName" followed by "  - Property: Value" lines
  const markdownToolPattern = /^-\s+[A-Za-z][^\n:]*\n\s+-\s+[^:]+:/m;
  
  if (markdownToolPattern.test(content)) {
    const result = parseMarkdownStyleFormat(content);
    if (result.hasTools) {
      return result;
    }
  }

  // Fall back to numbered list format (old format)
  const numberedListPattern = /^\d+\.\s+/m;
  
  if (numberedListPattern.test(content)) {
    return parseNumberedListFormat(content);
  }

  return {
    hasTools: false,
    tools: [],
  };
};

/**
 * Normalizes key names to camelCase
 */
const normalizeKeyName = (key: string): string => {
  const keyMap: Record<string, string> = {
    'name': 'name',
    'nameoftools': 'name',
    'tools': 'name',
    'manufacturer': 'manufacturer',
    'tebstatus': 'status',
    'status': 'status',
    'capabilities': 'capabilities',
    'subcapability': 'subCapability',
    'capabilitysubcapability': 'capabilitySubCapability',
    'version': 'version',
    'standardcategory': 'standardCategory',
    'earreferenceid': 'earReferenceId',
    'eareferenceid': 'earReferenceId',
    'capabilitymanager': 'capabilityManager',
    'description': 'description',
    'metatags': 'metaTags',
    'metatagsdescription': 'metaTags',
    'standardscomments': 'standardsComments',
    'standardscommentseanotes': 'standardsComments',
    'eanotes': 'eaNotes',
  };

  const normalizedInput = key.toLowerCase().replace(/[\/\s]+/g, '');
  return keyMap[normalizedInput] || key;
};

