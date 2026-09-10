import { MOCK_TABLES } from '../../mockData';
import Table from './Table';

export default function TableMapContainer() {
  return (
    <div className="w-full h-[600px] min-w-[600px] relative">
      
      {/* Background Grid Pattern - Very subtle */}
      <div className="absolute inset-0 opacity-50" style={{ 
        backgroundImage: 'radial-gradient(#E5E5E5 1px, transparent 1px)', 
        backgroundSize: '30px 30px' 
      }}></div>

      {/* Mesas */}
      <div className="absolute inset-0 z-10">
        {MOCK_TABLES.map(table => (
          <Table key={table.id} table={table} />
        ))}
      </div>
      
      {/* Static Labels (Scenery) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 font-serif uppercase tracking-widest text-xs pointer-events-none z-0">
        ENTRADA PRINCIPAL
      </div>
    </div>
  );
}
