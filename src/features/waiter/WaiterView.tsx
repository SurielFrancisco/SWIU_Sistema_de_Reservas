import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  DoorOpen,
  Info,
  Layers,
  Utensils,
  Users,
  XCircle,
} from 'lucide-react';
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
  available: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  reserved: 'border-blue-300 bg-blue-50 text-blue-800',
  occupied: 'border-amber-300 bg-amber-50 text-amber-800',
  'out-of-service': 'border-red-300 bg-red-50 text-red-700',
};

const tableShape: Record<TableInfo['shape'], string> = {
  'square-2': 'h-14 w-14 rounded-xl',
  'square-4': 'h-16 w-16 rounded-xl',
  'round-4': 'h-16 w-16 rounded-full',
  'rect-6': 'h-14 w-24 rounded-xl',
  'rect-8': 'h-14 w-28 rounded-xl',
  'large-group': 'h-20 w-28 rounded-2xl',
};

export default function WaiterView() {
  const { restaurantId } = useParams();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const restaurant = useAppSelector((state) =>
    state.admin.restaurants.find((item) => item.id === restaurantId),
  );

  const [floorId, setFloorId] = useState('');
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);

  const floor =
    restaurant?.layout.floors.find((item) => item.id === floorId) ||
    restaurant?.layout.floors[0];

  // Mantener actualizado el objeto de mesa seleccionada cuando cambie el store
  const currentSelectedTable = floor?.tables.find((t) => t.id === selectedTable?.id) || null;

  const counts = useMemo(
    () => ({
      available: floor?.tables.filter((t) => t.status === 'available').length || 0,
      occupied: floor?.tables.filter((t) => t.status === 'occupied').length || 0,
      reserved: floor?.tables.filter((t) => t.status === 'reserved').length || 0,
      outOfService: floor?.tables.filter((t) => t.status === 'out-of-service').length || 0,
    }),
    [floor],
  );

  if (!restaurant || !floor) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-brand-secondary p-6 text-center text-gray-500">
        <p className="text-base font-medium">Restaurante no disponible para la vista de mesero.</p>
        <Link
          to="/admin"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-medium text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a administración
        </Link>
      </main>
    );
  }

  const changeStatus = (status: TableStatus) => {
    if (!currentSelectedTable) return;
    dispatch(
      setTableStatus({
        restaurantId: restaurant.id,
        floorId: floor.id,
        tableId: currentSelectedTable.id,
        status,
      }),
    );
  };

  // Reglas de negocio para el rol de mesero:
  // - Solo puede cambiar de 'occupied' a 'available' (liberar mesa)
  // - O poner/quitar 'out-of-service'
  const canReleaseTable = currentSelectedTable?.status === 'occupied';
  const isOutOfService = currentSelectedTable?.status === 'out-of-service';
  const isReserved = currentSelectedTable?.status === 'reserved';
  const isAvailable = currentSelectedTable?.status === 'available';

  return (
    <div className="min-h-screen bg-brand-secondary text-brand-primary">
      {/* Cabecera superior */}
      <header className="border-b border-border bg-white px-5 py-4 md:px-8">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
              aria-label="Volver a administración"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                  Consola de Mesero
                </span>
                <span className="text-xs text-gray-400">· Vista Administrador</span>
              </div>
              <h1 className="font-serif text-2xl font-bold">{restaurant.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-gray-400">Sesión activa</p>
              <p className="text-sm font-medium text-gray-700">{auth.userName || 'Administrador'}</p>
            </div>
            <Link
              to={`/recepcion/${restaurant.id}`}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 sm:text-sm"
            >
              Ir a recepción
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="mx-auto max-w-[1600px] p-5 md:p-8">
        {/* Métricas rápidas de piso */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Disponibles
              </span>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="mt-2 font-serif text-3xl font-medium text-emerald-700">{counts.available}</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-amber-600">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Ocupadas
              </span>
              <Utensils className="h-4 w-4" />
            </div>
            <p className="mt-2 font-serif text-3xl font-medium text-amber-700">{counts.occupied}</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-blue-600">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Reservadas
              </span>
              <Clock className="h-4 w-4" />
            </div>
            <p className="mt-2 font-serif text-3xl font-medium text-blue-700">{counts.reserved}</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-red-600">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Fuera de serv.
              </span>
              <XCircle className="h-4 w-4" />
            </div>
            <p className="mt-2 font-serif text-3xl font-medium text-red-700">{counts.outOfService}</p>
          </div>
        </div>

        {/* Layout en dos columnas: plano de mesas y panel de acciones */}
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          {/* Plano de mesas interactivo */}
          <section className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl font-medium">Plano del salón</h2>
                <p className="text-xs text-gray-500">
                  Toca una mesa para gestionarla según las facultades de mesero.
                </p>
              </div>

              {/* Selector de piso si existe más de uno */}
              {restaurant.layout.floors.length > 1 && (
                <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 p-1">
                  <Layers className="ml-1.5 h-3.5 w-3.5 text-gray-400" />
                  {restaurant.layout.floors.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setFloorId(item.id);
                        setSelectedTable(null);
                      }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        floor.id === item.id
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'text-gray-600 hover:text-brand-primary'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lienzo visual del plano */}
            <div
              className="relative h-[560px] overflow-hidden rounded-xl border border-gray-200 bg-stone-50"
              style={{
                backgroundImage: 'radial-gradient(#d6d3d1 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              {/* Áreas del piso */}
              {floor.areas?.map((area) => (
                <div
                  key={area.id}
                  className="pointer-events-none absolute rounded-xl border border-dashed border-stone-300 p-3 font-serif text-xs font-medium text-stone-500"
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
              {floor.tables.map((table) => {
                const isSelected = currentSelectedTable?.id === table.id;
                return (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center border-2 text-xs font-semibold shadow-sm transition-all hover:scale-105 ${
                      tableShape[table.shape]
                    } ${statusStyle[table.status]} ${
                      isSelected ? 'ring-4 ring-brand-primary/20 scale-105' : ''
                    }`}
                    style={{ left: `${table.position.x}%`, top: `${table.position.y}%` }}
                  >
                    <span>{table.label}</span>
                    <span className="mt-0.5 text-[10px] font-normal opacity-75">
                      <Users className="mr-0.5 inline h-3 w-3" />
                      {table.capacity}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Leyenda de estados */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
              {(['available', 'reserved', 'occupied', 'out-of-service'] as TableStatus[]).map(
                (status) => (
                  <span key={status} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full border ${statusStyle[status]}`} />
                    {statusLabel[status]}
                  </span>
                ),
              )}
            </div>
          </section>

          {/* Panel lateral con las acciones de mesero */}
          <aside className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-medium">Control de mesa</h2>

            {currentSelectedTable ? (
              <div className="mt-5 space-y-5">
                {/* Tarjeta de estado de la mesa seleccionada */}
                <div className={`rounded-xl border p-4 ${statusStyle[currentSelectedTable.status]}`}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider opacity-70">
                    Mesa seleccionada
                  </p>
                  <div className="mt-1 flex items-end justify-between">
                    <span className="font-serif text-3xl font-bold">{currentSelectedTable.label}</span>
                    <span className="text-sm">Capacidad: {currentSelectedTable.capacity} pers.</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold">
                    Estado: {statusLabel[currentSelectedTable.status]}
                  </p>
                </div>

                {/* Acciones permitidas para el mesero */}
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Acciones de mesero permitidas
                  </p>

                  <div className="space-y-2.5">
                    {/* Acción 1: Cambiar de ocupado a disponible (Liberar mesa) */}
                    <button
                      type="button"
                      disabled={!canReleaseTable}
                      onClick={() => changeStatus('available')}
                      className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm font-medium transition-all ${
                        canReleaseTable
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 cursor-pointer shadow-sm'
                          : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <div>
                          <span className="block font-semibold">Liberar mesa (Disponible)</span>
                          <span className="text-xs font-normal text-gray-500">
                            Pasa la mesa de Ocupada a Disponible al terminar el servicio.
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Acción 2: Poner fuera de servicio */}
                    {!isOutOfService ? (
                      <button
                        type="button"
                        onClick={() => changeStatus('out-of-service')}
                        className="flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-50/50 p-3.5 text-left text-sm font-medium text-red-700 transition-all hover:bg-red-50 hover:border-red-300 shadow-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <div>
                            <span className="block font-semibold">Marcar fuera de servicio</span>
                            <span className="text-xs font-normal text-red-600/80">
                              Por limpieza profunda, avería o mantenimiento.
                            </span>
                          </div>
                        </div>
                      </button>
                    ) : (
                      /* Si ya está fuera de servicio, permitir restablecerla a disponible */
                      <button
                        type="button"
                        onClick={() => changeStatus('available')}
                        className="flex w-full items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-left text-sm font-medium text-emerald-800 transition-all hover:bg-emerald-100 shadow-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <div>
                            <span className="block font-semibold">Restablecer a disponible</span>
                            <span className="text-xs font-normal text-emerald-700/80">
                              Vuelve a habilitar la mesa para comensales.
                            </span>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Explicación contextual de restricciones */}
                {isReserved && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 text-xs leading-relaxed text-blue-800">
                    <Info className="mr-1.5 inline h-4 w-4 text-blue-600" />
                    Esta mesa tiene una reserva asignada. La asignación y recepción de clientes reservados
                    corresponde a la <strong>consola de recepción</strong>.
                  </div>
                )}

                {isAvailable && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">
                    <Info className="mr-1.5 inline h-3.5 w-3.5 text-gray-400" />
                    La mesa ya se encuentra libre y disponible para clientes o asignación de reservas.
                  </div>
                )}

                {/* Aviso de política del rol */}
                <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 text-xs leading-relaxed text-amber-800">
                  <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-amber-600" />
                  <strong>Alcance de mesero:</strong> no permite mover mesas, crear reservas ni alterar
                  diseño del plano. Únicamente liberación tras consumo o bloqueo por avería.
                </div>
              </div>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center text-gray-400">
                <DoorOpen className="h-10 w-10 text-gray-300" />
                <p className="mt-3 text-sm font-medium text-gray-600">Ninguna mesa seleccionada</p>
                <p className="mt-1 max-w-[220px] text-xs text-gray-400">
                  Haz clic sobre una mesa del plano para gestionar su disponibilidad operativa.
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

