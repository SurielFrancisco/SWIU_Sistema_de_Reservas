import { TableInfo } from './types';

export const MOCK_TABLES: TableInfo[] = [
  // Fila 1 (y: 25%) - 4 mesas
  { id: 'T-01', label: 'T-01', capacity: 2, status: 'available', shape: 'square-2', position: { x: 20, y: 25 } },
  { id: 'T-02', label: 'T-02', capacity: 4, status: 'available', shape: 'round-4', position: { x: 40, y: 25 } },
  { id: 'T-03', label: 'T-03', capacity: 4, status: 'available', shape: 'square-4', position: { x: 60, y: 25 } },
  { id: 'T-04', label: 'T-04', capacity: 6, status: 'available', shape: 'rect-6', position: { x: 80, y: 25 } },
  
  // Fila 2 (y: 50%) - 5 mesas
  { id: 'G-10', label: 'G-10', capacity: 4, status: 'available', shape: 'round-4', position: { x: 12, y: 50 } },
  { id: 'G-11', label: 'G-11', capacity: 4, status: 'available', shape: 'round-4', position: { x: 31, y: 50 } },
  { id: 'G-12', label: 'G-12', capacity: 2, status: 'available', shape: 'square-2', position: { x: 50, y: 50 } },
  { id: 'G-14', label: 'G-14', capacity: 6, status: 'available', shape: 'rect-6', position: { x: 69, y: 50 } },
  { id: 'G-15', label: 'G-15', capacity: 8, status: 'available', shape: 'large-group', position: { x: 88, y: 50 } },
  
  // Fila 3 (y: 75%) - 4 mesas
  { id: 'V-01', label: 'V-01', capacity: 4, status: 'available', shape: 'square-4', position: { x: 20, y: 75 }, isAccessible: true },
  { id: 'V-02', label: 'V-02', capacity: 4, status: 'available', shape: 'square-4', position: { x: 40, y: 75 } },
  { id: 'V-03', label: 'V-03', capacity: 6, status: 'available', shape: 'rect-6', position: { x: 60, y: 75 } },
  { id: 'V-04', label: 'V-04', capacity: 2, status: 'available', shape: 'square-2', position: { x: 80, y: 75 }, isAccessible: true },
];
