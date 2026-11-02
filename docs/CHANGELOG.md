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
