# SDReservas - Sistema de Reservas de Restaurantes

SDReservas es una aplicación web moderna e interactiva enfocada en la gestión de reservaciones para restaurantes. Ofrece una experiencia visual enriquecida tanto para los clientes que buscan reservar una mesa, como para los recepcionistas que gestionan el aforo de sus locales.

## Características Principales

* **Planos de Mesas Dinámicos e Interactivos:** Los restaurantes cuentan con distribuciones arquitectónicas reales (simuladas) que cambian según el local seleccionado. Las mesas son clickeables y su estado (Disponible, Ocupada, Seleccionada) se actualiza visualmente.
* **Soporte Multinivel (Pisos y Zonas):** Algunos restaurantes como "La Terraza del Mar" cuentan con más de un piso (ej. Planta Baja y Rooftop/Balcón). El sistema incluye un selector que anima la transición entre las diferentes configuraciones del plano.
* **Diseño Premium (Editorial & Glassmorphism):** La UI abandona el diseño corporativo básico para adoptar una estética moderna con bordes suavizados, transparencias (glassmorphism), y tipografías Serif elegantes.
* **Diseño 100% Responsivo:** Adaptable perfectamente a Desktop, Tablet y Teléfonos móviles. En pantallas pequeñas, el plano de mesas permite el *scroll* panorámico (como al elegir asientos en el cine), la navegación se convierte en un *Header* compacto y las listas de reservaciones se acomodan inteligentemente en *Slide-Overs*.
* **Gestión de Reservaciones Completa:** Flujo de trabajo de punta a punta gestionado en memoria con Redux Toolkit. Permite seleccionar fecha, hora, personas, elegir mesa y cancelar reservaciones en el historial.
* **Simulador de Roles:** Permite alternar la perspectiva de la interfaz entre "Cliente" y "Recepcionista".

## Tecnologías Utilizadas

Este proyecto fue construido utilizando los estándares y herramientas más modernas del ecosistema Frontend:

* **React 18** (Vite)
* **TypeScript** para un código seguro y escalable.
* **Tailwind CSS** para los estilos rápidos, responsivos y de alto nivel visual.
* **Framer Motion** para las micro-interacciones, animaciones de mapas y transiciones de los Slide-Overs.
* **Redux Toolkit (RTK)** para la administración global del estado de las reservas.
* **React Router DOM** para la navegación entre la pantalla principal y los restaurantes.
* **Lucide React** para la iconografía minimalista.

## Instalación y Uso Local

Para levantar el proyecto en tu entorno local, asegúrate de tener [Node.js](https://nodejs.org/) instalado y utiliza `pnpm` (o `npm`/`yarn`):

```bash
# 1. Clona el repositorio
git clone https://github.com/SurielFrancisco/SWIU_Sistema_de_Reservas.git

# 2. Entra al directorio
cd SistemaDeReservas

# 3. Instala las dependencias
pnpm install

# 4. Inicia el servidor de desarrollo
pnpm run dev
```

Una vez que el servidor inicie, abre `http://localhost:5173` en tu navegador.

## Navegación de la Aplicación

- **`/` (HomeView):** Pantalla principal. Muestra el buscador, tarjetas visuales de los restaurantes premium disponibles, acceso al panel lateral de "Mis Reservas" y el perfil de usuario.
- **`/restaurant/:id` (BookingView):** Pantalla de reservación específica. Incluye el mapa interactivo de mesas (`TableMapContainer`), el selector de pisos y el formulario para confirmar la reservación (`BookingSidebar`).

