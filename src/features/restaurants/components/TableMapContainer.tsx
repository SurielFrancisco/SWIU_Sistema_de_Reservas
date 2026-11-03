import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { getRestaurantLayout } from '../repository';
import Table from './Table';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch } from '@/app/hooks';
import { initializeDraft } from '@/features/reservations/store/reservationsSlice';
import type { RestaurantLayout } from '../types';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface TableMapContainerProps {
  restaurantId?: string;
  layout?: RestaurantLayout;
}

type ActivePointer = Point & { id: number };

type Point = { x: number; y: number };

function getTableScale(width: number) {
  if (!width) return 1;
  if (width < 480) return 0.56;
  if (width < 768) return 0.68;
  if (width < 1024) return 0.8;
  return 1;
}

export default function TableMapContainer({ restaurantId, layout: suppliedLayout }: TableMapContainerProps) {
  const dispatch = useAppDispatch();
  const layout = suppliedLayout ?? getRestaurantLayout(restaurantId);

  // Default to the first floor if available
  const [selectedFloorId, setSelectedFloorId] = useState('');
  const activeFloorId = layout?.floors.some((floor) => floor.id === selectedFloorId)
    ? selectedFloorId
    : (layout?.floors[0]?.id || '');

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isPinching, setIsPinching] = useState(false);

  // Refs for tracking pointer gestures without relying on browser-specific touch events.
  const canvasRef = useRef<HTMLDivElement>(null);
  const activePointersRef = useRef<ActivePointer[]>([]);
  const pinchStartRef = useRef<{ dist: number; zoom: number } | null>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number } | null>(null);

  useEffect(() => {
    const firstFloorId = layout?.floors[0]?.id;
    if (restaurantId && firstFloorId) {
      dispatch(initializeDraft({ restaurantId, floorId: activeFloorId }));
    }
  }, [activeFloorId, dispatch, layout, restaurantId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const bounds = canvas.getBoundingClientRect();
      setCanvasSize({ width: bounds.width, height: bounds.height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [activeFloorId]);

  if (!layout) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Plano no disponible para este restaurante.
      </div>
    );
  }

  const activeFloor = layout.floors.find(f => f.id === activeFloorId) || layout.floors[0];
  const tableScale = getTableScale(canvasSize.width);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    const pointer = { id: e.pointerId, x: e.clientX, y: e.clientY };
    activePointersRef.current = [...activePointersRef.current.filter(item => item.id !== e.pointerId), pointer];
    e.currentTarget.setPointerCapture(e.pointerId);

    if (activePointersRef.current.length === 2) {
      const [first, second] = activePointersRef.current;
      pinchStartRef.current = {
        dist: Math.hypot(second.x - first.x, second.y - first.y),
        zoom,
      };
      dragStartRef.current = null;
      setIsPinching(true);
    } else if (zoom > 1.05) {
      dragStartRef.current = { clientX: e.clientX, clientY: e.clientY, panX: pan.x, panY: pan.y };
    }
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    activePointersRef.current = activePointersRef.current.map(pointer =>
      pointer.id === e.pointerId ? { ...pointer, x: e.clientX, y: e.clientY } : pointer
    );

    if (activePointersRef.current.length >= 2 && pinchStartRef.current) {
      const [first, second] = activePointersRef.current;
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const nextZoom = Math.min(Math.max(1, pinchStartRef.current.zoom * distance / pinchStartRef.current.dist), 3);
      setZoom(nextZoom);
      if (nextZoom <= 1.02) setPan({ x: 0, y: 0 });
    } else if (dragStartRef.current && zoom > 1.05) {
      const dx = e.clientX - dragStartRef.current.clientX;
      const dy = e.clientY - dragStartRef.current.clientY;
      const maxPan = Math.max(canvasSize.width, canvasSize.height) * (zoom - 1) / 2;
      setPan({
        x: Math.min(Math.max(-maxPan, dragStartRef.current.panX + dx), maxPan),
        y: Math.min(Math.max(-maxPan, dragStartRef.current.panY + dy), maxPan),
      });
    }
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    activePointersRef.current = activePointersRef.current.filter(pointer => pointer.id !== e.pointerId);
    if (activePointersRef.current.length < 2) {
      pinchStartRef.current = null;
      setIsPinching(false);
    }
    dragStartRef.current = null;
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.35, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.35, 1);
      if (next <= 1.05) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <section
      aria-label="Plano de mesas del restaurante"
      className="w-full h-full min-h-[460px] sm:min-h-[500px] md:min-h-[580px] relative flex flex-col justify-center items-center select-none"
    >
      {/* Floor Selector (Only visible if > 1 floor) */}
      {layout.floors.length > 1 && (
        <div role="group" aria-label="Seleccionar piso" className="absolute top-3 left-3 sm:top-4 sm:left-4 z-40 bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-sm border border-gray-100 flex flex-col gap-1">
          {layout.floors.map(floor => (
            <button
              key={floor.id}
              onClick={() => {
                setSelectedFloorId(floor.id);
                setZoom(1);
                setPan({ x: 0, y: 0 });
                dispatch(initializeDraft({ restaurantId: restaurantId!, floorId: floor.id }));
              }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                activeFloorId === floor.id
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-brand-primary'
              }`}
            >
              {floor.name}
            </button>
          ))}
        </div>
      )}

      {/* Floating Zoom Controls */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-full shadow-md border border-gray-200">
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          aria-label="Acercar plano"
          className="p-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-30 rounded-full transition-colors active:scale-95"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          aria-label="Alejar plano"
          className="p-1.5 text-gray-700 hover:bg-gray-100 disabled:opacity-30 rounded-full transition-colors active:scale-95"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        {zoom > 1.05 && (
          <button
            type="button"
            onClick={handleResetZoom}
            aria-label="Restablecer vista completa"
            className="p-1.5 text-brand-primary hover:bg-brand-secondary rounded-full transition-colors active:scale-95"
            title="Restablecer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
        <span className="text-[11px] font-medium text-gray-500 px-1.5 min-w-[36px] text-center select-none font-sans">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      {/* Mobile Hint */}
      <div className="sm:hidden absolute bottom-3 left-3 z-30 pointer-events-none text-[10px] text-gray-500 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-200 shadow-xs">
        {zoom > 1.05 ? 'Arrastra para mover' : 'Pellizca o usa +/- para zoom'}
      </div>

      {/* Map Viewport Area */}
      <div
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full flex-1 relative overflow-hidden bg-white/50 rounded-2xl border border-gray-100 shadow-inner flex items-center justify-center touch-none cursor-grab active:cursor-grabbing"
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-50 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(#E5E5E5 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>

        {/* Scaled & Panned Floor Canvas with guaranteed 4:3 restaurant aspect ratio */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFloorId}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-[800px] aspect-[4/3] relative origin-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isPinching ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            {/* Áreas configuradas por el administrador */}
            {activeFloor.areas?.map((area) => (
              <div
                key={area.id}
                className="pointer-events-none absolute z-0 rounded-xl border border-dashed border-stone-300/80 p-2 sm:p-3 font-serif text-[10px] sm:text-xs font-medium text-stone-400"
                style={{
                  left: `${area.position.x}%`,
                  top: `${area.position.y}%`,
                  width: `${area.size.width}%`,
                  height: `${area.size.height}%`,
                  backgroundColor: area.color || '#f5f5f4',
                }}
              >
                {area.name}
              </div>
            ))}

            {/* Mesas */}
            <div className="absolute inset-0 z-10">
              {activeFloor.tables.map(table => (
                <Table key={table.id} table={table} restaurantId={restaurantId!} floorId={activeFloor.id} tableScale={tableScale} />
              ))}
            </div>

            {/* Visual zones based on area name (Optional decorative elements) */}
            {activeFloor.tables.some(t => t.area === 'Balcón') && (
              <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-8 sm:right-8 h-16 sm:h-28 bg-blue-50/40 border-2 border-blue-100/50 rounded-xl pointer-events-none z-0 flex items-end justify-center pb-2 text-blue-300 font-serif text-xs sm:text-sm">
                Zona de Balcón
              </div>
            )}

            {/* Floor Label */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 font-serif uppercase tracking-widest text-[10px] sm:text-xs pointer-events-none z-0 bg-white/80 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-sm border border-gray-100">
              {activeFloor.name}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
