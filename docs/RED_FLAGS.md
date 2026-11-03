# RED_FLAGS.md — SDReservas (SWIU_Sistema_de_Reservas)

> Documento para un agente de IA. Lista los problemas conocidos del sistema, con ubicación, cómo verificarlos y hacia dónde corregirlos.
> Rama analizada: `improve/reservation-architecture` (último commit visible: `fcf7d37 feat(ui): mejorar mapa responsive y consolas operativas`).
> Fecha del análisis: 2026-11-01.

## 0. Instrucciones para el agente

1. **Estado de verificación:** todo lo de este archivo sale de leer el código. `pnpm build` y `pnpm lint` pasan sin errores. **Nada se probó en un navegador.** Antes de corregir, confirma cada hallazgo leyendo el archivo indicado; los números de línea son aproximados y pueden haberse movido.
2. **Reglas del repo:** toda modificación debe registrarse en `docs/CHANGELOG.md` (fecha `YYYY-MM-DD`, tipo, área, descripción, archivos clave), tal como exige `docs/CONTEXTO_SISTEMA.md`.
3. **Validación mínima tras cada cambio:** `pnpm build && pnpm lint`.
4. **Alcance:** corrige un hallazgo por vez. No mezcles refactors con arreglos de comportamiento. No cambies estilos ni textos que no estén en el hallazgo.
5. **Decisiones que NO debes tomar sola/o:** introducir un backend, agregar librerías de pruebas o de estado, o cambiar el modelo de roles. Si un arreglo lo requiere, propón la opción y pregunta.
6. **Stack:** React 19, TypeScript, Redux Toolkit, React Router 7, Tailwind 4, Framer Motion, Vite 8, pnpm. Alias `@` → `src`. Persistencia local en `localStorage` bajo la clave `sdreservas-state`.
7. **Idioma:** textos de interfaz y documentación en español.

Severidad: **CRÍTICA** (rompe una regla de negocio o la seguridad aunque sea prototipo), **ALTA** (comportamiento incorrecto visible), **MEDIA** (deuda técnica o riesgo), **BAJA** (pulido).

---

## 1. Reglas de negocio

### RF-01 · CRÍTICA · Se puede reservar en el pasado
- **Dónde:** `src/features/reservations/store/reservationsSlice.ts` (`createInitialDraft`, hora fija `'19:00'`) y `src/features/reservations/components/BookingForm.tsx` (`completeReservation`, `handleReserve`).
- **Qué pasa:** el borrador arranca con la fecha de hoy y la hora `19:00` sin importar la hora actual. El `<select>` deshabilita horas pasadas, pero el valor inicial no se corrige y `completeReservation` no valida contra la hora actual. Pasadas las 19:00, el valor por defecto ya está en el pasado y se puede confirmar. Además `createInitialDraft` se evalúa al cargar el módulo: si la app queda abierta pasada la medianoche, la fecha queda vieja.
- **Verificar:** con la hora local después de las 19:00, abrir `/restaurant/rest-1`, elegir una mesa y confirmar sin tocar fecha ni hora.
- **Dirección:** validar fecha/hora en el momento de confirmar (no solo en la UI) y normalizar el borrador al inicializarlo (hora mínima válida del día actual). Considerar un horario de servicio por restaurante.
- **Aceptación:** intentar confirmar una reserva con inicio anterior a "ahora" falla con un mensaje claro; el borrador nunca queda en un valor deshabilitado.

### RF-02 · CRÍTICA · La capacidad de la mesa no se valida contra los comensales
- **Dónde:** `BookingForm.tsx` (select de personas 1–8), `src/features/restaurants/components/Table.tsx` (`effectiveStatus` solo considera reservas y `table.status`).
- **Qué pasa:** se puede reservar una mesa de 2 para 8 personas. `docs/CONTEXTO_SISTEMA.md` lo reconoce como pendiente.
- **Dirección:** en `Table`, deshabilitar (con motivo accesible) las mesas con `capacity < draft.guests`; en `completeReservation`, rechazar si no cumple. Decidir con el usuario si una mesa más grande que el grupo se permite (hoy sí).
- **Aceptación:** con 6 personas seleccionadas, las mesas de capacidad menor no son seleccionables y la confirmación las rechaza.

### RF-03 · ALTA · Datos de mesas inconsistentes (forma vs. capacidad)
- **Dónde:** `src/features/restaurants/data/mockRestaurants.ts`. Ejemplos: `G-01` con forma `rect-6` y capacidad 4; `C-01` con forma `round-4` y capacidad 6. En el editor admin (`AdminView.tsx`) las capacidades salen de la forma (`square-2`→2, `round-4`→4, `rect-6`→6, `large-group`→8) y no existe `square-4` ni `rect-8` en el selector, aunque sí en los tipos.
- **Qué pasa:** el nombre de la forma sugiere una capacidad distinta a la real; el admin no puede editar la capacidad de una mesa creada.
- **Dirección:** definir una fuente única forma→capacidad por defecto y permitir editar capacidad en el editor; corregir el mock.

### RF-04 · ALTA · Estado de mesa y reservas son dos fuentes de verdad desconectadas
- **Dónde:** `adminSlice.ts` (`setTableStatus`), `Table.tsx`, `ReceptionView.tsx`, `WaiterView.tsx`, `reservationsSlice.ts`.
- **Qué pasa:**
  - Ninguna reserva cambia `table.status` a `reserved`; ese estado solo existiría si alguien lo fija a mano en recepción.
  - `table.status` (`occupied`, `out-of-service`…) es global: aplica a todas las fechas y horas, no a un intervalo. Una mesa marcada "ocupada" hoy aparece ocupada para una reserva dentro de un mes.
  - Recepción solo muestra un contador de reservas próximas (`ReceptionView.tsx`, métrica "Reservas próximas"); no lista las reservas, no las liga a una mesa, no permite marcar llegada ni no-show.
  - `WaiterView.tsx` dice que la asignación de clientes reservados "corresponde a la consola de recepción", pero esa función no existe.
- **Dirección:** separar claramente *configuración* de la mesa (capacidad, forma, `out-of-service`) de *ocupación en tiempo real* (derivada de reservas + "ahora" + sentado manual). Proponer el modelo al usuario antes de implementarlo.

### RF-05 · ALTA · "Mis Reservas" muestra las reservas de todos
- **Dónde:** `src/features/reservations/components/ReservationsList.tsx` (`useAppSelector(state => state.reservations.reservations)` sin filtro). También se monta desde `HomeView.tsx` (panel lateral) y `BookingView.tsx`.
- **Qué pasa:** cualquier persona ve y puede cancelar las reservas de cualquier otra en el mismo navegador, incluso sin sesión. La tarjeta no muestra el restaurante ni el piso. `ReservationDetails` no guarda un identificador de usuario (solo `customerName`, derivado del correo).
- **Dirección:** guardar el correo/ID del usuario en la reserva, filtrar por usuario autenticado, mostrar nombre del restaurante, exigir sesión para ver/cancelar. Recepción y admin deben ver las del restaurante que operan.

### RF-06 · MEDIA · El estado `completed` nunca se usa y se muestra como "Cancelada"
- **Dónde:** `reservations/types.ts` (`ReservationStatus`), `ReservationsList.tsx` (todo lo distinto de `upcoming` se pinta "Cancelada"), `reservationsSlice.ts` (solo existe `cancelReservation`).
- **Dirección:** o eliminar `completed`, o implementar la transición (p. ej. por recepción) y mostrar la etiqueta correcta. Las reservas `upcoming` cuya hora ya pasó tampoco se expiran nunca.

### RF-07 · MEDIA · El solapamiento solo se evalúa dentro del mismo día
- **Dónde:** `src/features/reservations/selectors.ts` (`isTableReserved` compara `date ===` y minutos del día).
- **Qué pasa:** una reserva a las 23:00 con duración 180 min invade la 01:00 del día siguiente, pero no bloquea reservas de esa madrugada.
- **Dirección:** convertir a timestamps absolutos (fecha + hora) antes de comparar. Revisar también zona horaria: `lib/date.ts` usa hora local del navegador sin normalizar.

### RF-08 · MEDIA · Doble reserva solo se previene en la UI
- **Dónde:** `BookingForm.tsx` → `completeReservation` no llama a `isTableReserved` antes de `addReservation`; `reservationsSlice.addReservation` no valida.
- **Qué pasa:** si el estado cambió entre la selección y la confirmación (otra pestaña, modal de pago abierto mucho tiempo), se puede crear una reserva solapada.
- **Dirección:** validar dentro del flujo de confirmación (o en el reducer/thunk), no solo en el botón de la mesa.

### RF-09 · BAJA · Campos y controles sin función
- `draft.preferences` y `setPreferences` existen en el slice pero no hay campo en el formulario ni se guardan en la reserva.
- Buscador y botones "Buscar" / "Ver todos" de `HomeView.tsx` son decorativos (según `CONTEXTO_SISTEMA.md`).
- `PaymentModal`: flujo de anticipo simulado solo para `rest-2`; el anticipo no se valida ni se reembolsa al cancelar (`cancelReservation` no revisa `paymentStatus`). **No se revisó el archivo a fondo.**

---

## 2. Autenticación y autorización

> Es un prototipo sin backend, pero estos puntos deben estar documentados explícitamente y no presentarse como seguridad real.

### RF-10 · CRÍTICA · Cualquier correo con contraseña de 6+ caracteres entra como administrador
- **Dónde:** `src/features/auth/AdminLoginView.tsx`, `handleSubmit`: si el correo no está en `DEMO_ADMINS` y `password.length >= 6`, igualmente ejecuta `signIn({ role: 'admin' })`.
- **Dirección:** si se mantiene como demo, que sea una decisión explícita y documentada; si no, validar contra cuentas registradas (`AdminRegisterView` hoy no persiste cuentas, solo inicia sesión).

### RF-11 · CRÍTICA · Rol y sesión editables desde `localStorage`
- **Dónde:** `src/app/store.ts` (hidrata `auth` desde `localStorage` sin validar) y guardias en `src/App.tsx` (`AdminRoute`, `ReceptionRoute`, `WaiterRoute`, `AdminPreviewRoute`) que confían en `state.auth.role`.
- **Qué pasa:** editar `sdreservas-state` en DevTools da rol `admin` sin credenciales.
- **Dirección:** documentar como limitación del prototipo; para producción exige backend con sesiones/tokens. No vender estas guardias como control de acceso.

### RF-12 · ALTA · Credenciales de demo dentro del bundle
- **Dónde:** `AdminLoginView.tsx` (`DEMO_ADMINS` con contraseña `admin123`), tarjetas de demo en móvil (`demoCards`). El bloque de escritorio está comentado.
- **Dirección:** moverlas detrás de una bandera de entorno (`import.meta.env.DEV`) o retirarlas antes de cualquier despliegue público.

### RF-13 · ALTA · Un admin puede abrir recepción y mesero de restaurantes ajenos
- **Dónde:** `App.tsx` → `ReceptionRoute` / `WaiterRoute` verifican solo `role`, no que `restaurant.ownerEmail === auth.email`. `AdminView.tsx` sí filtra por `ownerEmail`, pero las rutas `/recepcion/:restaurantId` y `/mesero/:restaurantId` no.
- **Dirección:** comprobar propiedad (o asignación de personal) del restaurante en la guardia de ruta.

### RF-14 · MEDIA · El rol `receptionist` es inalcanzable
- **Dónde:** `authSlice.ts` define `'receptionist'` y `ReceptionRoute` lo admite, pero ninguna pantalla de login/registro puede asignarlo. `ReceptionRoute` además redirige a `/login` (cliente) y no a `/login/admin`.
- **Dirección:** definir cómo se crea personal (receptionist/mesero) o eliminar el rol. Nota: `WaiterRoute` solo admite `admin`; no existe rol `waiter`.

### RF-15 · MEDIA · Permisos de mesero solo existen en la UI
- **Dónde:** `WaiterView.tsx` limita los botones, pero `changeStatus` despacha `setTableStatus` con el estado que reciba; cualquier otra vía puede fijar cualquier estado. Recepción puede fijar cualquiera de los 4.
- **Dirección:** si los permisos importan, validarlos en el reducer o en una capa de acciones por rol.

### RF-16 · MEDIA · Restaurantes en borrador accesibles por URL
- **Dónde:** `BookingView.tsx` toma `managedLayout` por `id` sin comprobar `status === 'published'`; `HomeView.tsx` solo lista los publicados, pero `/restaurant/:id` abre cualquiera. Tampoco hay manejo de `id` inexistente más allá de "Plano no disponible".
- **Dirección:** bloquear o redirigir cuando el restaurante no existe o no está publicado (salvo vista previa del dueño).

### RF-17 · BAJA · Sesión sin cierre para clientes
- `signOut` existe, pero la UI de cliente no expone botón de cierre de sesión (solo `AdminTools` para admins en `/admin`). `docs/CONTEXTO_SISTEMA.md` lo lista como pendiente.

---

## 3. Persistencia y estado

### RF-18 · ALTA · Escritura completa en `localStorage` en cada dispatch
- **Dónde:** `src/app/store.ts` (`store.subscribe`).
- **Qué pasa:** serializa `auth + reservations + admin` en cada acción, incluido cada `pointermove` al arrastrar mesas/áreas en `AdminView.tsx` (`moveTable`, `updateArea`). Coste creciente con el tamaño del plano.
- **Dirección:** limitar la escritura (debounce/throttle o `listenerMiddleware`) y/o persistir solo cuando cambian las ramas relevantes.

### RF-19 · ALTA · `setItem` y lectura sin red de seguridad completa
- **Dónde:** `store.ts` → `loadPersistedState` tiene `try/catch`, pero `setItem` en `subscribe` no (cuota llena o modo privado puede lanzar excepción dentro del subscriber).
- **Dirección:** envolver la escritura en `try/catch`.

### RF-20 · ALTA · Dos pestañas se pisan los datos
- **Dónde:** `store.ts`; no existe listener del evento `storage`.
- **Qué pasa:** cada pestaña mantiene su propio estado en memoria y sobrescribe el `localStorage` completo; gana la última escritura y se pierden reservas de la otra pestaña.
- **Dirección:** escuchar `storage` y rehidratar, o documentar que solo se soporta una pestaña.

### RF-21 · MEDIA · Hidratación sin validación ni versionado
- **Dónde:** `store.ts` (`JSON.parse(...) as PersistedState`), `adminSlice.hydrateAdmin` (reemplaza el estado tal cual), `authSlice.hydrateAuth` (sí hace spread con `initialState`).
- **Qué pasa:** datos antiguos o corruptos pueden romper la app tras un cambio de esquema; no hay clave de versión ni migraciones.
- **Dirección:** añadir versión de esquema y validación mínima antes de hidratar.

### RF-22 · BAJA · El borrador no se persiste y comparte estado global
- Al recargar se pierde la selección; además el borrador es único para toda la app (`state.reservations.draft`), no por restaurante en paralelo.

---

## 4. Arquitectura y mantenibilidad

### RF-23 · ALTA · Dos orígenes para el catálogo de restaurantes
- **Dónde:** `restaurants/repository.ts` (solo datos estáticos de `mockRestaurants.ts`) vs. `adminSlice` (restaurantes del admin). Se mezclan a mano en `HomeView.tsx` (`[...RESTAURANTS_LIST, ...managedRestaurants]`) y `BookingView.tsx` (`managedLayout`), y `BookingForm`/`TableMapContainer` reciben `layout` por prop para suplir el repositorio. `getPaymentOption` solo conoce los estáticos.
- **Consecuencia:** recepción/mesero (`state.admin.restaurants`) no funcionan con `rest-1…rest-3` ("Restaurante no disponible"); los admins demo (`admin@asador.com`, etc.) arrancan con `admin.restaurants = []` y no son dueños de los restaurantes demo.
- **Dirección:** una sola capa de acceso (selectores/repositorio) que unifique catálogo estático y gestionado, y decidir si los restaurantes demo se siembran en `adminSlice`. Pregunta al usuario cuál es el modelo deseado.

### RF-24 · MEDIA · Dependencia circular entre features
- **Dónde:** `features/restaurants/components/Table.tsx` importa de `features/reservations` (slice y selectores); `features/reservations/components/BookingForm.tsx` importa de `features/restaurants/repository`. Además `admin` importa tipos de `restaurants`, y recepción/mesero importan `adminSlice`.
- **Dirección:** mover la lógica de disponibilidad a un módulo neutral (p. ej. un selector que combine mesa + reservas) y que `Table` reciba el estado por props.

### RF-25 · MEDIA · `AdminView.tsx` es ilegible
- **Dónde:** `src/features/admin/AdminView.tsx`: 41 líneas, con líneas de cientos o miles de caracteres, múltiples sentencias por línea, JSX en una sola línea. `oxlint` pasa, pero la revisión y el diff son impracticables.
- **Dirección:** formatear (Prettier u otro formateador acordado con el usuario) y separar `RestaurantForm`, `Editor`, `Canvas` en archivos propios. Hacerlo en un commit aparte, sin cambios de lógica.

### RF-26 · MEDIA · `adminSlice` mezcla catálogo, diseño de plano y operación en vivo
- Incluye `createRestaurant`/`setRestaurantStatus` (catálogo), `moveTable`/`addArea` (diseño) y `setTableStatus` (operación). Ver RF-04.

### RF-27 · MEDIA · Duplicación de UI de plano
- Recepción, mesero, admin y cliente dibujan el plano por separado, cada uno con sus propios mapas de forma (`tableShape`, `tableStyles`, `shapeClasses`) y de estado (`statusStyle`, `statusLabel`) repetidos. Cambiar una forma exige tocar 4+ sitios.
- **Dirección:** componente/constantes compartidas para forma, estado y etiquetas.

### RF-28 · BAJA · Simulador de rol obsoleto en `BookingView`
- **Dónde:** `BookingView.tsx` (`role` local `cliente|recepcionista`, texto fijo "Cliente Demo"). Ya existen roles reales; este selector solo cambia textos y confunde. Debería usar `auth.userName`.

### RF-29 · BAJA · `AdminTools` flotante por ruta
- **Dónde:** `App.tsx` → `AdminTools` se renderiza globalmente y se oculta salvo en `/admin` por `location.pathname`. Es un parche de navegación; mejor integrarlo al layout de admin.

---

## 5. Mapa interactivo y accesibilidad

### RF-30 · ALTA (por confirmar) · `setPointerCapture` puede tragarse los clics en las mesas
- **Dónde:** `src/features/restaurants/components/TableMapContainer.tsx`, `handlePointerDown` llama a `e.currentTarget.setPointerCapture(e.pointerId)` en cada pointerdown, incluso sobre un `<button>` de mesa.
- **Por qué importa:** en algunos navegadores, con captura de puntero en un ancestro el `click` se retargetea y el botón puede no recibirlo, rompiendo la selección de mesa.
- **Verificar:** probar en Chrome, Safari iOS y Chrome Android que tocar una mesa la selecciona, con y sin zoom.
- **Dirección (si se confirma):** capturar el puntero solo al iniciar un arrastre/pellizco real, no al tocar botones.

### RF-31 · MEDIA · La leyenda no coincide con el mapa
- **Dónde:** `BookingView.tsx` muestra símbolos (○ ✓ × ◷ —) en la leyenda, pero `Table.tsx` solo distingue estados por color; no renderiza esos símbolos. Dependencia del color = problema de accesibilidad (daltonismo).
- **Dirección:** renderizar el icono/símbolo en la mesa o ajustar la leyenda.

### RF-32 · MEDIA · Botones de mesa sin nombre/estado accesible
- **Dónde:** `Table.tsx` (botón con solo número y capacidad), `TableMapContainer.tsx` (selector de piso sin `aria-pressed`). No hay anuncio del estado ("ocupada", "reservada", "fuera de servicio") ni del motivo de bloqueo.
- **Dirección:** `aria-label` con etiqueta + capacidad + estado, `aria-pressed` en seleccionada y en el piso activo.

### RF-33 · MEDIA · Gestión de foco/semántica de modales incompleta
- `ReservationsList.tsx` implementa foco y Escape para el diálogo de cancelación, pero no atrapa el foco (focus trap). `LoginRequiredModal` y `PaymentModal` no se revisaron. `docs/CONTEXTO_SISTEMA.md` ya lista esto como pendiente.

### RF-34 · BAJA · Controles de mapa
- El zoom y arrastre usan límites calculados con una fórmula aproximada (`maxPan`) y el lienzo tiene una proporción fija 4:3 que puede no ajustarse a planos futuros. Los textos de ayuda solo aparecen en móvil.

---

## 6. Documentación, pruebas y proceso

### RF-35 · ALTA · No hay pruebas automatizadas
- `package.json` no tiene framework de pruebas ni script `test`. La lógica con más riesgo (`selectors.ts` solapamientos, reducers, validación de reservas, guardias de ruta) no tiene cobertura.
- **Dirección:** proponer al usuario Vitest + Testing Library; empezar por `isTableReserved` (incluyendo cruce de medianoche, RF-07) y por la validación de RF-01/RF-02. No instalar nada sin confirmación.

### RF-36 · MEDIA · Documentación desactualizada
- `docs/CONTEXTO_SISTEMA.md`: describe solo 2 slices (falta `admin`), rutas `/`, `/login`, `/restaurant/:id` (faltan `/register`, `/register/admin`, `/login/admin`, `/admin`, `/admin/vista-cliente`, `/recepcion/:restaurantId`, `/mesero/:restaurantId`), dice que el rol solo cambia textos, y la sección 11 habla de "cambios locales sin confirmar".
- `README.md`: instrucciones de instalación hacen `cd SistemaDeReservas`, pero el repositorio se llama `SWIU_Sistema_de_Reservas`; no menciona administración, recepción ni mesero.
- **Dirección:** actualizar ambos tras corregir los hallazgos relevantes, y registrar en `CHANGELOG.md`.

### RF-37 · BAJA · Dependencias externas en tiempo de ejecución
- Imágenes de Unsplash (`mockRestaurants.ts` y la imagen por defecto en `AdminView.tsx`) y fuentes de Google Fonts (`index.css`): sin red, la interfaz se degrada.

### RF-38 · BAJA · Fechas mostradas en bruto
- `ReservationsList.tsx` muestra `res.date` (`YYYY-MM-DD`) y hora 24 h tal cual, mientras el formulario usa 12 h (a.m./p.m.). Inconsistencia de formato.

---

## 7. No revisado (revisar antes de dar por cerrado el análisis)

- `src/features/reservations/components/PaymentModal.tsx` y `LoginRequiredModal.tsx`
- `src/features/auth/LoginView.tsx`, `RegisterView.tsx`, `AdminRegisterView.tsx` (validaciones y qué persisten)
- Resto de `HomeView.tsx` (a partir de la línea ~70)
- `src/index.css`, `vite.config.ts`, configuración de `tsconfig`, `.oxlintrc.json`
- Comportamiento real en navegador (móvil y escritorio), rendimiento y accesibilidad con lector de pantalla

## 8. Orden de ataque sugerido

1. RF-01, RF-02, RF-08 (reglas de reserva) con pruebas de `selectors.ts` (RF-35, tras confirmar con el usuario).
2. RF-05 (reservas por usuario) y RF-23 (catálogo unificado), porque condicionan recepción y mesero.
3. RF-04 (modelo de ocupación) previa propuesta al usuario.
4. RF-18, RF-19, RF-20, RF-21 (persistencia).
5. RF-30 (confirmar en navegador) y RF-31, RF-32 (accesibilidad).
6. RF-25 y RF-27 (formato y duplicación) en commits separados.
7. RF-36 (documentación) al final.
8. RF-10 a RF-16: decidir con el usuario si se documentan como limitaciones de prototipo o se corrigen.
