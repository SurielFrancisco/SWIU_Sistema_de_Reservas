import { RestaurantLayout } from './types';

export const RESTAURANTS_LIST = [
  {
    id: 'rest-1',
    name: 'El Asador Gourmet',
    type: 'Cortes y Parrilla',
    location: 'Centro Histórico',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'rest-2',
    name: 'Sushi Zen',
    type: 'Comida Japonesa',
    location: 'Plaza Norte',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'rest-3',
    name: 'La Terraza del Mar',
    type: 'Mariscos y Coctelería',
    location: 'Malecón',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
  }
];

export const RESTAURANT_LAYOUTS: Record<string, RestaurantLayout> = {
  'rest-1': {
    id: 'rest-1',
    floors: [
      {
        id: 'floor-1',
        name: 'Planta Baja',
        tables: [
          // Pared Izquierda (Gabinetes/Booths)
          { id: 'G-01', label: 'G-1', capacity: 4, status: 'available', shape: 'rect-6', position: { x: 12, y: 15 }, area: 'Pared Izquierda' },
          { id: 'G-02', label: 'G-2', capacity: 4, status: 'available', shape: 'rect-6', position: { x: 12, y: 35 }, area: 'Pared Izquierda' },
          { id: 'G-03', label: 'G-3', capacity: 4, status: 'available', shape: 'rect-6', position: { x: 12, y: 55 }, area: 'Pared Izquierda' },
          { id: 'G-04', label: 'G-4', capacity: 4, status: 'available', shape: 'rect-6', position: { x: 12, y: 75 }, area: 'Pared Izquierda' },
          
          // Centro del salón (Mesas redondas grandes)
          { id: 'C-01', label: 'C-1', capacity: 6, status: 'available', shape: 'round-4', position: { x: 35, y: 25 }, area: 'Centro' },
          { id: 'C-02', label: 'C-2', capacity: 6, status: 'available', shape: 'round-4', position: { x: 55, y: 25 }, area: 'Centro' },
          { id: 'C-03', label: 'C-3', capacity: 6, status: 'available', shape: 'round-4', position: { x: 35, y: 55 }, area: 'Centro' },
          { id: 'C-04', label: 'C-4', capacity: 6, status: 'available', shape: 'round-4', position: { x: 55, y: 55 }, area: 'Centro' },
          
          // Ventanal a la derecha (Mesas románticas de 2)
          { id: 'V-01', label: 'V-1', capacity: 2, status: 'available', shape: 'square-2', position: { x: 80, y: 20 }, area: 'Ventanal' },
          { id: 'V-02', label: 'V-2', capacity: 2, status: 'available', shape: 'square-2', position: { x: 80, y: 35 }, area: 'Ventanal' },
          { id: 'V-03', label: 'V-3', capacity: 2, status: 'available', shape: 'square-2', position: { x: 80, y: 50 }, area: 'Ventanal' },
          { id: 'V-04', label: 'V-4', capacity: 2, status: 'available', shape: 'square-2', position: { x: 80, y: 65 }, area: 'Ventanal' },
          { id: 'V-05', label: 'V-5', capacity: 2, status: 'available', shape: 'square-2', position: { x: 80, y: 80 }, area: 'Ventanal' },

          // Esquina VIP
          { id: 'VIP-1', label: 'VIP-1', capacity: 8, status: 'available', shape: 'large-group', position: { x: 65, y: 80 }, area: 'Privado' },
          { id: 'VIP-2', label: 'VIP-2', capacity: 8, status: 'available', shape: 'large-group', position: { x: 40, y: 80 }, area: 'Privado' },
        ]
      }
    ]
  },
  'rest-2': {
    id: 'rest-2',
    floors: [
      {
        id: 'floor-1',
        name: 'Planta Principal',
        tables: [
          // Larga Barra de Sushi (Pegada a la pared superior)
          { id: 'B-01', label: 'B-1', capacity: 2, status: 'available', shape: 'square-2', position: { x: 15, y: 15 }, area: 'Barra' },
          { id: 'B-02', label: 'B-2', capacity: 2, status: 'available', shape: 'square-2', position: { x: 25, y: 15 }, area: 'Barra' },
          { id: 'B-03', label: 'B-3', capacity: 2, status: 'available', shape: 'square-2', position: { x: 35, y: 15 }, area: 'Barra' },
          { id: 'B-04', label: 'B-4', capacity: 2, status: 'available', shape: 'square-2', position: { x: 45, y: 15 }, area: 'Barra' },
          { id: 'B-05', label: 'B-5', capacity: 2, status: 'available', shape: 'square-2', position: { x: 55, y: 15 }, area: 'Barra' },
          { id: 'B-06', label: 'B-6', capacity: 2, status: 'available', shape: 'square-2', position: { x: 65, y: 15 }, area: 'Barra' },
          { id: 'B-07', label: 'B-7', capacity: 2, status: 'available', shape: 'square-2', position: { x: 75, y: 15 }, area: 'Barra' },
          { id: 'B-08', label: 'B-8', capacity: 2, status: 'available', shape: 'square-2', position: { x: 85, y: 15 }, area: 'Barra' },
          
          // Mesas cuadradas repartidas en el salón (estilo japonés minimalista)
          { id: 'S-01', label: 'S-1', capacity: 4, status: 'available', shape: 'square-4', position: { x: 20, y: 40 }, area: 'Comedor' },
          { id: 'S-02', label: 'S-2', capacity: 4, status: 'available', shape: 'square-4', position: { x: 40, y: 40 }, area: 'Comedor' },
          { id: 'S-03', label: 'S-3', capacity: 4, status: 'available', shape: 'square-4', position: { x: 60, y: 40 }, area: 'Comedor' },
          { id: 'S-04', label: 'S-4', capacity: 4, status: 'available', shape: 'square-4', position: { x: 80, y: 40 }, area: 'Comedor' },
          
          { id: 'S-05', label: 'S-5', capacity: 4, status: 'available', shape: 'square-4', position: { x: 20, y: 65 }, area: 'Comedor' },
          { id: 'S-06', label: 'S-6', capacity: 4, status: 'available', shape: 'square-4', position: { x: 40, y: 65 }, area: 'Comedor' },
          { id: 'S-07', label: 'S-7', capacity: 4, status: 'available', shape: 'square-4', position: { x: 60, y: 65 }, area: 'Comedor' },
          { id: 'S-08', label: 'S-8', capacity: 4, status: 'available', shape: 'square-4', position: { x: 80, y: 65 }, area: 'Comedor' },

          { id: 'Z-01', label: 'Tatami 1', capacity: 6, status: 'available', shape: 'rect-6', position: { x: 30, y: 85 }, area: 'Privado' },
          { id: 'Z-02', label: 'Tatami 2', capacity: 6, status: 'available', shape: 'rect-6', position: { x: 70, y: 85 }, area: 'Privado' },
        ]
      }
    ]
  },
  'rest-3': {
    id: 'rest-3',
    floors: [
      {
        id: 'floor-1',
        name: 'Planta Baja',
        tables: [
          // Recepción y Pasillo central, mesas a los lados
          { id: 'PB-01', label: 'M1', capacity: 4, status: 'available', shape: 'round-4', position: { x: 20, y: 30 }, area: 'Izquierda' },
          { id: 'PB-02', label: 'M2', capacity: 4, status: 'available', shape: 'round-4', position: { x: 20, y: 50 }, area: 'Izquierda' },
          { id: 'PB-03', label: 'M3', capacity: 4, status: 'available', shape: 'round-4', position: { x: 20, y: 70 }, area: 'Izquierda' },
          
          { id: 'PB-04', label: 'M4', capacity: 4, status: 'available', shape: 'round-4', position: { x: 80, y: 30 }, area: 'Derecha' },
          { id: 'PB-05', label: 'M5', capacity: 4, status: 'available', shape: 'round-4', position: { x: 80, y: 50 }, area: 'Derecha' },
          { id: 'PB-06', label: 'M6', capacity: 4, status: 'available', shape: 'round-4', position: { x: 80, y: 70 }, area: 'Derecha' },
          
          // Mesas familiares grandes en el fondo
          { id: 'PB-07', label: 'F-1', capacity: 8, status: 'available', shape: 'rect-8', position: { x: 40, y: 15 }, area: 'Fondo' },
          { id: 'PB-08', label: 'F-2', capacity: 8, status: 'available', shape: 'rect-8', position: { x: 60, y: 15 }, area: 'Fondo' },
          { id: 'PB-09', label: 'F-3', capacity: 6, status: 'available', shape: 'rect-6', position: { x: 50, y: 85 }, area: 'Fondo' },
        ]
      },
      {
        id: 'floor-2',
        name: 'Rooftop (Balcón)',
        tables: [
          // Primera línea del balcón (Vistas al mar) - distribuidas en arco o línea curva si pudiéramos, pero linealmente en el borde inferior
          { id: 'R-01', label: 'B-1', capacity: 2, status: 'available', shape: 'square-2', position: { x: 15, y: 85 }, area: 'Balcón' },
          { id: 'R-02', label: 'B-2', capacity: 2, status: 'available', shape: 'square-2', position: { x: 30, y: 85 }, area: 'Balcón' },
          { id: 'R-03', label: 'B-3', capacity: 2, status: 'available', shape: 'square-2', position: { x: 45, y: 85 }, area: 'Balcón' },
          { id: 'R-04', label: 'B-4', capacity: 2, status: 'available', shape: 'square-2', position: { x: 60, y: 85 }, area: 'Balcón' },
          { id: 'R-05', label: 'B-5', capacity: 2, status: 'available', shape: 'square-2', position: { x: 75, y: 85 }, area: 'Balcón' },
          { id: 'R-06', label: 'B-6', capacity: 2, status: 'available', shape: 'square-2', position: { x: 90, y: 85 }, area: 'Balcón' },
          
          // Segunda línea, mesas redondas más informales
          { id: 'R-10', label: 'L-1', capacity: 4, status: 'available', shape: 'round-4', position: { x: 25, y: 60 }, area: 'Lounge' },
          { id: 'R-11', label: 'L-2', capacity: 4, status: 'available', shape: 'round-4', position: { x: 50, y: 60 }, area: 'Lounge' },
          { id: 'R-12', label: 'L-3', capacity: 4, status: 'available', shape: 'round-4', position: { x: 75, y: 60 }, area: 'Lounge' },
          
          // Zona de sillones / grupal en la parte trasera
          { id: 'R-20', label: 'VIP-1', capacity: 8, status: 'available', shape: 'large-group', position: { x: 35, y: 25 }, area: 'VIP' },
          { id: 'R-21', label: 'VIP-2', capacity: 8, status: 'available', shape: 'large-group', position: { x: 65, y: 25 }, area: 'VIP' },
        ]
      }
    ]
  }
};
