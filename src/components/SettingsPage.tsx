import React from 'react';
import styles from '../styles/SettingsPage.module.css';
import { useColumnConfig } from '../context/useColumnConfig';

const SettingsPage: React.FC = () => {
  const { columns, setColumns } = useColumnConfig();

  const toggleColumn = (id: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === id ? { ...column, enabled: !column.enabled } : column,
      ),
    );
  };

  return (
    <div className={styles.settingsPage}>
      <h2 className={styles.title}>Configure Columns</h2>
      <div className={styles.columnList}>
        {columns.map((column) => (
          <div key={column.id} className={styles.columnItem}>
            <label>
              <input
                type='checkbox'
                checked={column.enabled}
                onChange={() => toggleColumn(column.id)}
              />
              {column.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
