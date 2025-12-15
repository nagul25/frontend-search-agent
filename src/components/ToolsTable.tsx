import React from 'react';
import styles from '../styles/ToolsTable.module.css';

interface Tool {
  number: number;
  name: string;
  manufacturer?: string;
  version?: string;
  status?: string;
  capabilities?: string;
  subCapability?: string;
  standardCategory?: string;
  earReferenceId?: string;
  capabilityManager?: string;
  standardsComments?: string;
  eaNotes?: string;
  description?: string;
  metaTags?: string[];
  [key: string]: any; // For any additional fields
}

interface ToolsTableProps {
  tools: Tool[];
}

const ToolsTable: React.FC<ToolsTableProps> = ({ tools }) => {
  if (tools.length === 0) return null;

  // Determine which fields are present across all tools
  const allFields = new Set<string>();
  tools.forEach(tool => {
    Object.keys(tool).forEach(key => {
      if (key !== 'number' && tool[key] !== undefined) {
        allFields.add(key);
      }
    });
  });

  // Define the preferred order of fields
  const fieldOrder = [
    'name',
    'manufacturer',
    'version',
    'status',
    'capabilities',
    'subCapability',
    'earReferenceId',
    'capabilityManager',
    'standardCategory',
    'standardsComments',
    'eaNotes',
    'description',
    'metaTags'
  ];

  // Sort fields based on preferred order, with unknowns at the end
  const sortedFields = Array.from(allFields).sort((a, b) => {
    const indexA = fieldOrder.indexOf(a);
    const indexB = fieldOrder.indexOf(b);
    
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const formatFieldName = (field: string): string => {
    // Convert camelCase to readable format
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value || '-');
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.toolsTable}>
          <thead>
            <tr>
              <th className={styles.numberColumn}>#</th>
              {sortedFields.map(field => (
                <th key={field}>{formatFieldName(field)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool.number}>
                <td className={styles.numberColumn}>{tool.number}</td>
                {sortedFields.map(field => (
                  <td key={field} className={styles[`field_${field}`] || ''}>
                    {formatValue(tool[field])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToolsTable;

