# Contexto del sistema — SDReservas

> Documento de referencia técnica y funcional del estado actual del repositorio. Actualizado a partir del código fuente, no de un backend desplegado.

## 1. Propósito

**SDReservas** es una aplicación web de demostración para descubrir restaurantes y reservar mesas desde un plano interactivo. La propuesta central es permitir que una persona seleccione fecha, hora, número de comensales, duración y una mesa específica dentro de la distribución del restaurante.

El sistema también permite:

- Iniciar sesión de forma simulada.
- Consultar y cancelar reservas creadas.
- Elegir piso en restaurantes con varios niveles.
- Simular un anticipo opcional para determinados restaurantes.
- Alternar visualmente entre los roles de cliente y recepcionista.

No existe servidor, base de datos, API ni integración de pagos real: toda la información se mantiene en el navegador.

## 2. Tecnología y ejecución

| Área | Tecnología |
| --- | --- |
| UI | React 19 + TypeScript |
| Empaquetado | Vite 8 |
| Estilos | Tailwind CSS 4, mediante `@tailwindcss/vite` |
| Estado global | Redux Toolkit + React Redux |
| Rutas | React Router DOM 7 |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Utilidades CSS | `clsx` y `tailwind-merge` |
| Linter | Oxlint |
| Gestor de paquetes previsto | pnpm |

### Comandos

```bash
pnpm install
pnpm dev       # entorno local, normalmente en http://localhost:5173
pnpm build     # comprobación TypeScript y build de producción
pnpm lint
pnpm preview
```

El alias `@` apunta a `src`, definido en `vite.config.ts` y `tsconfig.app.json`.

## 3. Arquitectura general

```text
main.tsx
  └─ Provider (Redux) + BrowserRouter
      └─ App.tsx
          ├─ /                    → HomeView
          ├─ /login               → LoginView
          └─ /restaurant/:id      → BookingView
                                      ├─ TableMapContainer → Table
                                      ├─ BookingForm
                                      │   ├─ LoginRequiredModal
                                      │   └─ PaymentModal
                                      └─ ReservationsList
```

La organización por funcionalidad es:

```text
src/
├─ app/                       # store de Redux y hooks tipados
├─ features/
│  ├─ auth/                   # inicio de sesión simulado
│  ├─ booking/                # vista que compone el flujo de reserva
│  ├─ home/                   # landing y panel lateral de reservas
│  ├─ reservations/           # tipos, estado, disponibilidad y componentes
│  └─ restaurants/            # catálogo, planos, repositorio y mapa
├─ lib/                       # fecha/hora local e IDs UUID
├─ assets/
├─ App.tsx
├─ main.tsx
└─ index.css
```

## 4. Navegación y experiencia

### Inicio: `/`

`HomeView` muestra la marca, un hero, búsqueda visual, el catálogo de restaurantes y un *slide-over* con «Mis Reservas». Cada tarjeta navega a `/restaurant/:id`. El botón de perfil lleva a `/login`.

El campo de búsqueda y los botones «Buscar» y «Ver todos» son actualmente decorativos: no filtran ni cambian de vista.

### Inicio de sesión: `/login`

`LoginView` solicita correo y contraseña en la interfaz, pero solo utiliza el correo para el estado de autenticación. No valida credenciales ni se comunica con un servicio externo. Al iniciar:

1. Se ejecuta `signIn({ email })`.
2. `userName` se deriva de la parte anterior a `@`.
3. Se redirige a la ruta de retorno guardada o a `/`.

### Reserva: `/restaurant/:id`

`BookingView` proporciona dos pestañas: **Mapa de Mesas** y **Mis Reservas**. En escritorio hay barra lateral; en móvil, cabecera y pestañas compactas. La pestaña de mapa combina:

1. Plano de mesas y selector de pisos.
2. Formulario de fecha, hora, personas y duración.
3. Selección de mesa y confirmación.

El selector «Simulador de Rol» cambia únicamente textos de la interfaz entre cliente y recepcionista. No aplica permisos, rutas ni operaciones distintas.

## 5. Catálogo y planos de restaurantes

Los datos viven en `src/features/restaurants/data/mockRestaurants.ts` y se consultan por medio de `repository.ts`.

| ID | Restaurante | Tipo | Ubicación | Pisos | Anticipo |
| --- | --- | --- | --- | --- | --- |
| `rest-1` | El Asador Gourmet | Cortes y Parrilla | Centro Histórico | Planta Baja | No |
| `rest-2` | Sushi Zen | Comida Japonesa | Plaza Norte | Planta Principal | Opcional, $200 MXN |
| `rest-3` | La Terraza del Mar | Mariscos y Coctelería | Planta Baja y Rooftop (Balcón) | 2 | No |

Cada mesa define identificador, etiqueta, capacidad, estado base, figura, posición porcentual y zona opcional. Los tipos de estado soportados son `available`, `reserved`, `occupied` y `out-of-service`; las formas son cuadradas, redondas, rectangulares y grupales.

Los planos son datos simulados estáticos. En el estado inicial todas las mesas están disponibles; su disponibilidad efectiva puede cambiar al cruzarse con las reservas almacenadas localmente.

## 6. Flujo de creación de reservas

1. Al abrir un plano, `TableMapContainer` inicializa el borrador global con el restaurante y su primer piso.
2. La persona selecciona fecha, hora (intervalos de 30 minutos), comensales de 1 a 8 y duración de 30 a 180 minutos.
3. Para la fecha de hoy, el selector deshabilita opciones anteriores a la hora local actual.
4. Cada `Table` calcula su estado efectivo. Una mesa ya reservada para un intervalo que se cruza con el solicitado aparece como ocupada y no puede elegirse.
5. «Confirmar Reserva» requiere una mesa seleccionada y una sesión iniciada. Sin sesión abre `LoginRequiredModal`.
6. En Sushi Zen se abre `PaymentModal`: se puede simular el pago de un anticipo de $200 MXN o continuar sin pagar.
7. Se crea una reserva con UUID, estado `upcoming` y los datos del borrador; se guarda en Redux y se limpia la mesa seleccionada.
8. `ReservationsList` permite consultar la reserva y cancelarla tras una confirmación explícita. Cancelar cambia su estado a `cancelled`.

### Regla de solapamiento

La disponibilidad se resuelve en `reservations/selectors.ts`. Una mesa se considera no disponible si existe una reserva `upcoming` que coincida en restaurante, piso, mesa y fecha, y cuyos intervalos se solapen:

```text
inicioSolicitado < inicioExistente + duraciónExistente
  y
inicioExistente < inicioSolicitado + duraciónSolicitada
```

Las reservas canceladas no bloquean la mesa. La capacidad de la mesa **no se contrasta aún** contra la cantidad de personas seleccionada.

## 7. Estado y persistencia

### Store Redux

El store se declara en `src/app/store.ts` y contiene dos slices:

| Slice | Estado | Acciones principales |
| --- | --- | --- |
| `auth` | `isAuthenticated`, `userName`, `email` | `signIn`, `signOut`, `hydrateAuth` |
| `reservations` | `draft`, `reservations` | `initializeDraft`, `selectTable`, `setDateTime`, `setGuests`, `setDuration`, `setPreferences`, `addReservation`, `cancelReservation`, `hydrateReservations` |

`draft` mantiene: restaurante, piso, mesa seleccionada, fecha, hora, comensales, duración y preferencias. Actualmente `preferences` se conserva en el slice, pero no tiene campo en el formulario ni se añade a `ReservationDetails`.

### Persistencia

Al cargar, el store intenta restaurar `auth` y la lista de reservas desde `localStorage`. En cada cambio de estado guarda ambos bajo la clave:

```text
sdreservas-state
```

Por tanto, los datos son locales al navegador/dispositivo, no compartidos entre usuarios, y pueden borrarse al limpiar el almacenamiento del sitio. El borrador no se persiste: se reinicia con cada recarga.

## 8. Modelo de datos

### Reserva persistida

```ts
interface ReservationDetails {
  id: string;
  restaurantId: string;
  floorId: string;
  tableId: string;
  tableLabel: string;
  date: string;               // YYYY-MM-DD
  time: string;               // HH:mm
  durationMinutes: number;
  guests: number;
  customerName: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  paymentStatus?: 'paid' | 'not-paid';
  depositAmount?: number;
}
```

`completed` existe en el tipo, pero ninguna acción actual cambia una reserva a dicho estado. En la lista, cualquier estado distinto de `upcoming` se presenta visualmente como cancelado.

## 9. Diseño y responsive

La interfaz usa una estética editorial sobria:

- Tipografías: **Inter** para texto funcional y **Playfair Display** para marca/títulos; se cargan desde Google Fonts en `index.css`.
- Paleta: primario `#171717`, fondo `#FAFAFA`, tarjetas blancas y bordes `#E5E5E5`.
- Componentes responsivos con utilidades Tailwind.
- En móvil, el plano conserva un ancho de 800 px y se desplaza horizontalmente para mantener la precisión de las mesas.
- Framer Motion anima tarjetas, pestañas, cambios de piso, modales, mapa y listas.

## 10. Límites, supuestos y trabajo pendiente

El proyecto es un prototipo de frontend. Para llevarlo a producción se necesitaría, como mínimo:

- API y base de datos para usuarios, restaurantes, mesas, reservas y pagos.
- Autenticación real, gestión de contraseñas, cierre de sesión y protección de rutas.
- Control de concurrencia en el servidor para impedir dobles reservas entre dispositivos.
- Validación de capacidad de mesa frente al número de comensales.
- Validaciones de horario comercial, zona horaria, datos personales y formato de pago.
- Integración con una pasarela de pago real; el formulario actual no captura ni transmite cobros reales.
- Búsqueda y filtros funcionales en la página principal.
- Gestión operativa real para el rol de recepcionista.
- Accesibilidad adicional: leyenda completa de todos los estados, etiquetas accesibles en controles y semántica/gestión de foco más robusta para modales.

## 11. Notas de mantenimiento

- Las fechas y horas se generan con la zona local del navegador mediante `lib/date.ts`; no hay normalización UTC.
- Los IDs de reserva se generan con `crypto.randomUUID()`.
- Las imágenes del catálogo se cargan desde Unsplash, así que dependen de conexión de red.
- Hay cambios locales sin confirmar en el repositorio y una reorganización reciente de archivos desde `features/booking` hacia `auth`, `restaurants` y `reservations`. Antes de continuar con desarrollo conviene validar el build y revisar dichos cambios como una sola migración.

## 12. Archivos clave

| Archivo | Responsabilidad |
| --- | --- |
| `src/App.tsx` | Declaración de rutas |
| `src/app/store.ts` | Store Redux y persistencia en `localStorage` |
| `src/features/home/HomeView.tsx` | Inicio, catálogo y panel de reservas |
| `src/features/auth/LoginView.tsx` | Inicio de sesión simulado |
| `src/features/booking/BookingView.tsx` | Composición de mapa, formulario y lista |
| `src/features/restaurants/data/mockRestaurants.ts` | Catálogo, planos y anticipo simulado |
| `src/features/restaurants/components/TableMapContainer.tsx` | Cambio de piso e inicialización del borrador |
| `src/features/restaurants/components/Table.tsx` | Representación, selección y bloqueo de mesas |
| `src/features/reservations/components/BookingForm.tsx` | Datos de reserva, autenticación y creación |
| `src/features/reservations/components/PaymentModal.tsx` | Flujo de anticipo simulado |
| `src/features/reservations/components/ReservationsList.tsx` | Consulta y cancelación de reservas |
| `src/features/reservations/selectors.ts` | Detección de solapamiento de horarios |
| `src/features/reservations/store/reservationsSlice.ts` | Borrador y reservas |
| `src/features/auth/store/authSlice.ts` | Sesión simulada |
| `src/index.css` | Tema global, fuentes y scrollbar |
