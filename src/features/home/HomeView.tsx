import { Search, MapPin, Star, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MOCK_RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'El Asador Gourmet',
    type: 'Cortes y Parrilla',
    location: 'Centro Histórico',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'rest-2',
    name: 'Sushi Zen',
    type: 'Comida Japonesa',
    location: 'Plaza Norte',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function HomeView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-secondary pb-20">
      {/* Hero Section */}
      <div className="bg-brand-primary text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-accent to-transparent mix-blend-screen"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-heading font-extrabold tracking-tight sm:text-6xl drop-shadow-lg"
          >
            Encuentra tu mesa perfecta
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-slate-300 font-light max-w-2xl mx-auto"
          >
            Reserva en los mejores restaurantes de la ciudad al instante. Experiencias gastronómicas sin esperas.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 max-w-2xl mx-auto flex rounded-2xl shadow-2xl overflow-hidden ring-4 ring-white/10"
          >
            <div className="relative flex-grow focus-within:z-10 bg-white">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full h-full pl-12 pr-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 sm:text-lg font-medium"
                placeholder="Buscar por restaurante, tipo de comida..."
              />
            </div>
            <button className="flex-shrink-0 px-8 py-4 border border-transparent text-lg font-heading font-bold text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors focus:outline-none">
              Buscar
            </button>
          </motion.div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="flex items-center mb-8 bg-white/80 backdrop-blur-md rounded-2xl py-3 px-6 shadow-sm border border-slate-100 max-w-max mx-auto">
          <Utensils className="w-5 h-5 text-brand-accent mr-3" />
          <h2 className="text-xl font-heading font-bold text-slate-800">Selecciones Premium</h2>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {MOCK_RESTAURANTS.map((restaurant) => (
            <motion.div 
              variants={itemVariants}
              key={restaurant.id} 
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 cursor-pointer overflow-hidden border border-slate-100 group flex flex-col"
            >
              <div className="h-56 w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center shadow-sm">
                  <Star className="w-4 h-4 text-brand-accent mr-1.5 fill-brand-accent" />
                  <span className="font-bold text-slate-800 text-sm">{restaurant.rating}</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-heading font-bold text-brand-primary mb-2 group-hover:text-brand-accent transition-colors">{restaurant.name}</h3>
                <p className="text-slate-500 font-medium mb-4">{restaurant.type}</p>
                <div className="mt-auto flex items-center text-slate-400 text-sm font-medium pt-4 border-t border-slate-100">
                  <MapPin className="w-4 h-4 mr-2 text-brand-accent/70" />
                  {restaurant.location}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
