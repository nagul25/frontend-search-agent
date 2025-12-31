import React, { createContext, useState, useEffect } from 'react';

// Define the structure of the column configuration
export interface ColumnConfig {
  id: string;
  label: string;
  enabled: boolean;
}

// Default columns (from ToolsTable)
const defaultColumns: ColumnConfig[] = [
  { id: 'name', label: 'Name', enabled: true },
  { id: 'manufacturer', label: 'Manufacturer', enabled: true },
  { id: 'version', label: 'Version', enabled: true },
  { id: 'tebStatus', label: 'TEB Status', enabled: true },
  { id: 'capability', label: 'Capability', enabled: true },
  { id: 'subCapability', label: 'Sub-Capability', enabled: true },
  { id: 'standardCategory', label: 'Standard Category', enabled: true },
  { id: 'eaReferenceId', label: 'EA Reference ID', enabled: true },
  { id: 'capabilityManager', label: 'Capability Manager', enabled: true },
  { id: 'metaTags', label: 'Meta Tags', enabled: true },
  { id: 'standardsComments', label: 'Standards Comments', enabled: true },
  { id: 'eaNotes', label: 'EA Notes', enabled: true },
  { id: 'description', label: 'Description', enabled: true },
];

// Create the context
// eslint-disable-next-line react-refresh/only-export-components
export const ColumnConfigContext = createContext<{
  columns: ColumnConfig[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnConfig[]>>;
} | null>(null);

// Provider component
export const ColumnConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [columns, setColumns] = useState<ColumnConfig[]>(() => {
    const storedColumns = sessionStorage.getItem('columnConfig');
    return storedColumns ? JSON.parse(storedColumns) : defaultColumns;
  });

  useEffect(() => {
    sessionStorage.setItem('columnConfig', JSON.stringify(columns));
  }, [columns]);

  return (
    <ColumnConfigContext.Provider value={{ columns, setColumns }}>
      {children}
    </ColumnConfigContext.Provider>
  );
};

