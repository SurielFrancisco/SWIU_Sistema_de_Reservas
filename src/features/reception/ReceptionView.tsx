import { useMemo, useState } from 'react';
import { CalendarDays, CircleAlert, Coffee, DoorOpen, LayoutGrid, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setTableStatus } from '@/features/admin/store/adminSlice';
import type { TableInfo, TableStatus } from '@/features/restaurants/types';

const statusLabel: Record<TableStatus, string> = {
  available: 'Disponible',
  reserved: 'Reservada',
  occupied: 'Ocupada',
  'out-of-service': 'Fuera de servicio',
};

const statusStyle: Record<TableStatus, string> = {
  available: 'border-stone-200 bg-white text-brand-primary',
  reserved: 'border-blue-200 bg-blue-50 text-blue-800',
  occupied: 'border-stone-200 bg-stone-100 text-stone-500',
  'out-of-service': 'border-red-200 bg-red-50 text-red-700',
};

const tableShape: Record<TableInfo['shape'], string> = {
  'square-2': 'h-14 w-14 rounded-xl',
  'square-4': 'h-16 w-16 rounded-xl',
  'round-4': 'h-16 w-16 rounded-full',
  'rect-6': 'h-14 w-24 rounded-xl',
  'rect-8': 'h-14 w-28 rounded-xl',
  'large-group': 'h-20 w-28 rounded-2xl',
};

const statuses: TableStatus[] = ['available', 'reserved', 'occupied', 'out-of-service'];

export default function ReceptionView() {
  const { restaurantId } = useParams();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const restaurant = useAppSelector((state) =>
    state.admin.restaurants.find((item) => item.id === restaurantId),
  );
  const reservations = useAppSelector((state) =>
    state.reservations.reservations.filter(
      (item) => item.restaurantId === restaurantId && item.status === 'upcoming',
    ),
  );
  const [floorId, setFloorId] = useState('');
  const [selected, setSelected] = useState<TableInfo | null>(null);
  const floor =
    restaurant?.layout.floors.find((item) => item.id === floorId) ||
    restaurant?.layout.floors[0];
  const counts = useMemo(
    () => ({
      available: floor?.tables.filter((table) => table.status === 'available').length || 0,
      occupied: floor?.tables.filter((table) => table.status === 'occupied').length || 0,
      reserved: floor?.tables.filter((table) => table.status === 'reserved').length || 0,
    }),
    [floor],
  );

  if (!restaurant || !floor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-secondary p-6 text-gray-500">
        Restaurante no disponible para recepción.
      </main>
    );
  }

  const changeStatus = (status: TableStatus) => {
    if (!selected) return;
    dispatch(
      setTableStatus({
        restaurantId: restaurant.id,
        floorId: floor.id,
        tableId: selected.id,
        status,
      }),
    );
    setSelected({ ...selected, status });
  };

  return (
    <div className="min-h-screen bg-brand-secondary text-brand-primary">
      <header className="border-b border-border bg-white px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="font-serif text-xl font-medium tracking-tight">
              SDReservas
            </Link>
            <span className="hidden h-5 w-px bg-border sm:block" />
            <div className="hidden sm:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                Recepción
              </p>
              <h1 className="font-serif text-xl">{restaurant.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:inline">
              {auth.userName || 'Equipo de recepción'}
            </span>
            {auth.role === 'admin' && (
              <Link
                to="/admin"
                className="rounded-xl border border-border px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-brand-secondary"
              >
                Administración
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] p-5 md:p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            Consola operativa
          </p>
          <h2 className="mt-1 font-serif text-3xl md:text-4xl">Estado del salón</h2>
          <p className="mt-1 text-sm text-gray-500">
            Consulta la disponibilidad y actualiza el estado operativo de cada mesa.
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Metric icon={<LayoutGrid />} label="Mesas disponibles" value={counts.available} tone="text-emerald-700" />
          <Metric icon={<Coffee />} label="Mesas ocupadas" value={counts.occupied} tone="text-stone-500" />
          <Metric icon={<CalendarDays />} label="Reservas próximas" value={reservations.length} tone="text-blue-700" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <section className="rounded-[1.5rem] border border-border bg-white p-4 shadow-sm md:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl">Plano de mesas</h2>
                <p className="text-sm text-gray-500">
                  Selecciona una mesa para actualizar su estado operativo.
                </p>
              </div>
              {restaurant.layout.floors.length > 1 && (
                <div className="flex gap-1 rounded-xl border border-border bg-brand-secondary p-1">
                  {restaurant.layout.floors.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setFloorId(item.id);
                        setSelected(null);
                      }}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        floor.id === item.id
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'text-gray-500 hover:bg-white hover:text-brand-primary'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative h-[460px] overflow-hidden rounded-2xl border border-border bg-brand-secondary md:h-[560px]"
              style={{
                backgroundImage: 'radial-gradient(#e5e5e5 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              {floor.areas?.map((area) => (
                <div
                  key={area.id}
                  className="pointer-events-none absolute rounded-xl border border-dashed border-stone-300 p-3 font-serif text-xs text-stone-400"
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
              {floor.tables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => setSelected(table)}
                  className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border text-xs font-medium shadow-sm transition-all hover:scale-105 ${tableShape[table.shape]} ${statusStyle[table.status]} ${
                    selected?.id === table.id ? 'ring-2 ring-brand-primary/30 ring-offset-2' : ''
                  }`}
                  style={{ left: `${table.position.x}%`, top: `${table.position.y}%` }}
                >
                  <span>{table.label}</span>
                  <span className="mt-0.5 text-[10px] opacity-70">
                    <Users className="mr-0.5 inline h-3 w-3" />
                    {table.capacity}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
              {statuses.map((status) => (
                <span key={status} className="flex items-center gap-1.5">
                  <i className={`h-2.5 w-2.5 rounded-full border ${statusStyle[status]}`} />
                  {statusLabel[status]}
                </span>
              ))}
            </div>
          </section>

          <aside className="rounded-[1.5rem] border border-border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl">Estado de mesa</h2>
            {selected ? (
              <div className="mt-5">
                <div className={`rounded-2xl border p-4 ${statusStyle[selected.status]}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-60">Mesa</p>
                  <div className="mt-1 flex items-end justify-between">
                    <span className="font-serif text-3xl">{selected.label}</span>
                    <span className="text-sm">{selected.capacity} personas</span>
                  </div>
                  <p className="mt-2 text-sm font-medium">{statusLabel[selected.status]}</p>
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                  Cambiar estado
                </p>
                <div className="mt-2 grid gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => changeStatus(status)}
                      className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        selected.status === status
                          ? 'border-brand-primary bg-brand-primary text-white'
                          : 'border-border text-gray-600 hover:bg-brand-secondary'
                      }`}
                    >
                      {statusLabel[status]}
                    </button>
                  ))}
                </div>
                <div className="mt-6 rounded-xl bg-brand-secondary p-3 text-xs leading-relaxed text-gray-500">
                  <CircleAlert className="mr-1 inline h-3.5 w-3.5" />
                  Esta consola no permite mover, crear ni eliminar elementos del plano.
                </div>
              </div>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center text-center text-gray-500">
                <DoorOpen className="h-9 w-9 text-gray-300" />
                <p className="mt-3 text-sm">Selecciona una mesa en el plano.</p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-border bg-white p-4 shadow-sm">
      <div className={`mb-3 ${tone}`}>{icon}</div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-serif text-3xl">{value}</p>
    </div>
  );
}
