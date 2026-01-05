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
  [key: string]: unknown;
}

interface ParsedResponse {
  hasTools: boolean;
  headerText?: string;
  tools: Tool[];
  footerText?: string;
}

/**
 * Parses the backend response to extract tool information
 */
export const parseToolsFromResponse = (content: string): ParsedResponse => {
  const result: ParsedResponse = {
    hasTools: false,
    tools: [],
  };

  // Check if the content contains tool information
  // Pattern: "Found X pub/sub tools" or numbered list with " - " separators
  const toolPattern = /^\d+\.\s+/m;
  const hasNumberedList = toolPattern.test(content);

  if (!hasNumberedList) {
    return result;
  }

  // Split content into sections
  const lines = content.split('\n');
  const toolLines: string[] = [];
  const headerLines: string[] = [];
  const footerLines: string[] = [];
  let inToolSection = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if this is a tool line (starts with number followed by period)
    if (/^\d+\.\s+/.test(trimmedLine)) {
      inToolSection = true;
      toolLines.push(trimmedLine);
    } else if (!inToolSection && trimmedLine) {
      headerLines.push(trimmedLine);
    } else if (inToolSection && trimmedLine) {
      // This might be a continuation of the previous tool or footer text
      if (toolLines.length > 0) {
        // Append to the last tool line
        toolLines[toolLines.length - 1] += ' ' + trimmedLine;
      } else {
        footerLines.push(trimmedLine);
      }
    }
  }

  if (toolLines.length === 0) {
    return result;
  }

  // Parse each tool line
  const tools: Tool[] = toolLines.map((line) => {
    // Extract the number
    const numberMatch = line.match(/^(\d+)\.\s+/);
    const number = numberMatch ? parseInt(numberMatch[1]) : 0;

    // Remove the number prefix
    const contentWithoutNumber = line.replace(/^\d+\.\s+/, '');

    // Split by " - " to get individual attributes
    const parts = contentWithoutNumber.split(' - ');

    const tool: Tool = { number, name: '' };

    for (const part of parts) {
      const trimmedPart = part.trim();

      // Try to extract key-value pairs
      // Patterns: "Key: Value" or "Key/Alternate: Value"
      const keyValueMatch = trimmedPart.match(/^([^:]+):\s*(.+)$/);

      if (keyValueMatch) {
        let key = keyValueMatch[1].trim();
        const value = keyValueMatch[2].trim();

        // Handle compound keys like "Name/Tools"
        if (key.includes('/')) {
          key = key.split('/')[0];
        }

        // Normalize key names
        const normalizedKey = normalizeKeyName(key);

        // Handle special cases
        if (normalizedKey === 'metaTags') {
          tool[normalizedKey] = value.split(',').map((v) => v.trim());
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
 * Normalizes key names to camelCase
 */
const normalizeKeyName = (key: string): string => {
  const keyMap: Record<string, string> = {
    name: 'name',
    nameoftools: 'name',
    tools: 'name',
    manufacturer: 'manufacturer',
    tebstatus: 'status',
    status: 'status',
    capabilities: 'capabilities',
    subcapability: 'subCapability',
    version: 'version',
    standardcategory: 'standardCategory',
    earreferenceid: 'earReferenceId',
    capabilitymanager: 'capabilityManager',
    description: 'description',
    metatags: 'metaTags',
    metatagsdescription: 'metaTags',
    standardscomments: 'standardsComments',
    eanotes: 'eaNotes',
  };

  const normalizedInput = key.toLowerCase().replace(/[/\s]+/g, '');
  return keyMap[normalizedInput] || key;
};
