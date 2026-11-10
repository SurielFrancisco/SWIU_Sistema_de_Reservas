# Changelog — SDReservas

> Registro cronológico de todos los cambios relevantes del sistema: nuevas funcionalidades, modificaciones, correcciones y decisiones de diseño.
>
> **Convención de tipos:**
> - `feat` — nueva funcionalidad
> - `fix` — corrección de error
> - `refactor` — reestructuración sin cambio de comportamiento
> - `docs` — cambios solo en documentación
> - `style` — ajustes visuales o de estilo sin lógica nueva
> - `chore` — tareas de mantenimiento (dependencias, configuración, etc.)

---

## Cómo registrar un cambio

Agrega una fila a la tabla de la versión activa (o crea una nueva sección si inicias un ciclo distinto). Completa todos los campos:

| Campo | Descripción |
|---|---|
| **Fecha** | `YYYY-MM-DD` en hora local |
| **Tipo** | Uno de los tipos listados arriba |
| **Área** | Feature o módulo afectado (`auth`, `admin`, `reservations`, `restaurants`, `booking`, `reception`, `app`, `docs`) |
| **Descripción** | Qué cambió y por qué, en una línea concisa |
| **Archivos clave** | Archivos creados o modificados más relevantes |

---

## [Sin versión] — En desarrollo

| Fecha | Tipo | Área | Descripción | Archivos clave |
|---|---|---|---|---|
| 2026-10-28 | `feat` | `auth` | Pantalla de registro de usuario nuevo (`/register`) con campos de nombre, correo y contraseña con validación, animación de error y redirección automática al inicio tras el registro | `RegisterView.tsx`, `App.tsx`, `authSlice.ts` |
| 2026-10-28 | `fix` | `auth` | Botón "Crea una cuenta" en `LoginView` convertido a `<Link to="/register">` para navegar correctamente a la nueva pantalla | `LoginView.tsx` |
| 2026-10-28 | `refactor` | `auth` | `signIn` acepta campo `userName?` opcional para preservar el nombre real ingresado en el registro, en lugar de derivarlo del correo | `authSlice.ts` |
| 2026-10-28 | `docs` | `docs` | Creación de este archivo `CHANGELOG.md` y referencia en `CONTEXTO_SISTEMA.md` | `CHANGELOG.md`, `CONTEXTO_SISTEMA.md` |
| 2026-10-28 | `feat` | `auth` | Pantalla de inicio de sesión para administradores de restaurantes (`/login/admin`) con diseño operativo, cuentas demo y acceso al panel `/admin` | `AdminLoginView.tsx`, `App.tsx`, `LoginView.tsx` |
| 2026-10-28 | `fix` | `auth` | Enlace "¿Tienes un restaurante?" en `LoginView` conectado a `/login/admin` y guardias `AdminRoute`/`AdminPreviewRoute` apuntando a `/login/admin` | `LoginView.tsx`, `App.tsx` |
| 2026-10-28 | `style` | `auth` | Eliminación de redirección automática en el logo de las pantallas de autenticación (`LoginView`, `RegisterView`, `AdminLoginView`), dejándolo como elemento estático de marca | `LoginView.tsx`, `RegisterView.tsx`, `AdminLoginView.tsx` |
| 2026-10-28 | `feat` | `auth` | Pantalla de registro para administradores de restaurantes (`/register/admin`) con validación de credenciales, feedback de error y redirección al panel de administración | `AdminRegisterView.tsx`, `App.tsx`, `AdminLoginView.tsx` |
| 2026-10-28 | `style` | `reservations` | Estilización del botón «Cancelar Reserva» con fondo sólido rojo (`bg-red-600`), texto blanco y sombra para coincidir con la apariencia del botón del modal de confirmación | `ReservationsList.tsx` |
| 2026-10-28 | `feat` | `admin` | Vista operativa de mesero (`/mesero/:restaurantId`) accesible desde el perfil de administrador, con permisos restringidos exclusivamente a liberar mesas ocupadas (`occupied` → `available`) o marcar/quitar mesas fuera de servicio (`out-of-service`) | `WaiterView.tsx`, `App.tsx`, `AdminView.tsx` |
| 2026-11-01 | `feat` | `booking` | Optimización del mapa de mesas en móvil: visualización completa del plano a primera vista (sin requerir scroll horizontal), soporte para gestos táctiles de pellizco (pinch-to-zoom) y arrastre, controles flotantes manuales (+ / - / restablecer) y escalado responsive de mesas | `TableMapContainer.tsx`, `Table.tsx`, `BookingView.tsx` |
| 2026-11-01 | `fix` | `booking` | Corrección del mapa responsive para evitar que las mesas se encimen en móvil y tableta, y reemplazo del manejo táctil por Pointer Events para hacer confiable el zoom con pellizco | `TableMapContainer.tsx`, `Table.tsx` |
| 2026-11-01 | `fix` | `booking` | Reducción específica del tamaño de las mesas en teléfonos y tabletas para conservar separación visual sin alterar la vista de escritorio | `TableMapContainer.tsx` |
| 2026-11-01 | `style` | `reception` | Unificación visual de las consolas de recepción y mesero con el lenguaje editorial del sistema: superficies blancas, paleta neutra, tipografía serif, bordes suaves y estados consistentes | `ReceptionView.tsx`, `WaiterView.tsx` |
| 2026-11-01 | `fix` | `reservations` | RF-01: se normaliza el borrador al siguiente intervalo válido de 30 minutos y se rechazan reservas cuyo inicio ya pasó al confirmar | `date.ts`, `reservationsSlice.ts`, `BookingForm.tsx` |
| 2026-11-02 | `fix` | `booking` | Se preserva la selección de mesas al excluir los botones interactivos de la captura de gestos del lienzo | `TableMapContainer.tsx` |
| 2026-11-02 | `feat` | `admin` | El panel permite editar el horario semanal y seleccionar las modalidades de reserva ofrecidas por cada restaurante, según `TIPOS_RESERVAS.md` | `AdminView.tsx`, `adminSlice.ts`, `types.ts` |
| 2026-11-02 | `feat` | `admin` | Se añade eliminación de restaurantes desde el panel con confirmación y selección automática de otro restaurante disponible | `AdminView.tsx`, `adminSlice.ts` |
| 2026-11-02 | `style` | `admin` | Se reemplaza la confirmación nativa del navegador por un modal visual coherente con el sistema para eliminar restaurantes | `AdminView.tsx` |
| 2026-11-02 | `feat` | `booking` | El formulario de reserva respeta el horario del restaurante, muestra las modalidades configuradas por el administrador y conecta las modalidades de pago con la pasarela simulada existente | `BookingForm.tsx`, `PaymentModal.tsx`, `types.ts` |
| 2026-11-02 | `feat` | `admin` | El administrador define la superficie del restaurante en m² y el número de mesas; el plano muestra la superficie configurada y limita la colocación de mesas al total indicado | `AdminView.tsx`, `adminSlice.ts`, `types.ts` |
| 2026-11-02 | `refactor` | `admin` | Se elimina la configuración y visualización de metros cuadrados; se conserva únicamente el límite de mesas del restaurante | `AdminView.tsx`, `adminSlice.ts`, `types.ts` |
| 2026-11-02 | `feat` | `auth` | El administrador puede crear cuentas de mesero o recepcionista por restaurante; los empleados usan el login común y son redirigidos a su vista operativa | `AdminView.tsx`, `adminSlice.ts`, `LoginView.tsx`, `authSlice.ts`, `App.tsx` |
| 2026-11-02 | `refactor` | `auth` | Se unifica el acceso en `/login`; las cuentas de administrador y empleados se redirigen según su rol, con alcance restringido al restaurante asignado en frontend | `LoginView.tsx`, `App.tsx` |
| 2026-11-02 | `style` | `admin` | Se reorganiza el panel en secciones desplegables de capacidad, equipo y reservas para reducir el ruido visual y mantener el plano como foco principal | `AdminView.tsx` |
| 2026-11-02 | `style` | `admin` | Se reemplazan las secciones desplegables por una navegación paginada de configuración para mostrar una sola tarea a la vez | `AdminView.tsx` |
| 2026-11-02 | `style` | `admin` | Se separan las opciones administrativas en pantallas internas independientes y se mantiene el ordenamiento de mesas como pantalla principal | `AdminView.tsx` |
| 2026-11-02 | `refactor` | `auth` | Se restauran accesos separados para clientes (`/login`) y administradores (`/login/admin`); los empleados conservan el login general | `App.tsx`, `LoginView.tsx`, `AdminLoginView.tsx`, `CONTEXTO_SISTEMA.md` |
| 2026-11-02 | `feat` | `auth` | Meseros y recepcionistas acceden exclusivamente desde `/login/admin` y solo pueden iniciar o mantener su sesión durante el horario configurado de su restaurante | `AdminLoginView.tsx`, `LoginView.tsx`, `App.tsx`, `restaurantHours.ts` |
| 2026-11-03 | `docs` | `docs` | Se crea un diagrama Mermaid de base de datos adaptado a clientes, restaurantes, empleados, planos, reservas, modalidades y pagos | `DIAGRAMA_BASE_DATOS.md` |
| 2026-11-09 | `feat` | `app` | Se inicia la integración con `sdreservas-api`: autenticación real con JWT, catálogo y planos desde API, creación y carga de reservas | `src/lib/api/`, `LoginView.tsx`, `RegisterView.tsx`, `BookingForm.tsx`, `BookingView.tsx`, `App.tsx` |
| 2026-11-09 | `fix` | `home` | El catálogo de restaurantes se carga desde un endpoint público del backend antes del inicio de sesión | `HomeView.tsx`, `restaurants.ts`, `restaurants.routes.ts` |
| 2026-11-03 | `style` | `admin` | Se eliminan los accesos flotantes «Vista de mesero» y «Abrir recepción» del panel administrativo | `App.tsx` |
| 2026-11-03 | `feat` | `reservations` | Se aplican reglas específicas por modalidad: asignación automática por capacidad y disponibilidad, selección de zona con mesa automática y selección manual únicamente cuando corresponde | `BookingForm.tsx`, `Table.tsx`, `reservationsSlice.ts`, `types.ts` |
| 2026-11-03 | `fix` | `reservations` | Se invalidan mesas que dejan de cumplir capacidad o disponibilidad y se calcula correctamente el importe de las tarifas por persona y el estado del pago | `BookingForm.tsx`, `Table.tsx`, `types.ts` |
