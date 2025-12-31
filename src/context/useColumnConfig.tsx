import { useContext } from "react";
import { ColumnConfigContext } from "./ColumnConfigContext";

export const useColumnConfig = () => {
  const context = useContext(ColumnConfigContext);
  if (!context) {
    throw new Error('useColumnConfig must be used within a ColumnConfigProvider');
  }
  return context;
}