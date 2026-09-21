import { Search, MapPin, Star, Utensils, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RESTAURANTS_LIST } from '../booking/mockData';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function HomeView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-secondary text-brand-primary selection:bg-brand-primary/10 pb-24">
      {/* Top Navigation / Logo */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 md:py-8 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 text-brand-primary cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.scrollTo(0, 0)}>
          <UtensilsCrossed className="w-8 h-8" />
          <span className="text-2xl font-serif font-bold tracking-tight">SDReservas</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-brand-primary/[0.03] rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-brand-primary/[0.02] rounded-full blur-3xl pointer-events-none"
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-600 mb-8 shadow-sm"
          >
            <Utensils className="w-4 h-4 text-brand-primary" />
            Descubre experiencias gastronómicas
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-brand-primary leading-tight"
          >
            Encuentra tu mesa <br className="hidden md:block" />
            perfecta hoy.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto"
          >
            Reserva al instante en los restaurantes más exclusivos de la ciudad. Sin llamadas, sin esperas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 max-w-2xl mx-auto relative"
          >
            <div className="flex items-center bg-white rounded-full shadow-lg shadow-gray-200/50 p-2 border border-gray-100 transition-shadow focus-within:shadow-xl focus-within:shadow-gray-200/80 focus-within:border-gray-200">
              <div className="pl-6 pr-2">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="flex-1 w-full h-12 md:h-14 bg-transparent text-brand-primary placeholder-gray-400 focus:outline-none text-base md:text-lg min-w-0"
                placeholder="Buscar restaurantes..."
              />
              <button className="px-5 md:px-8 h-12 md:h-14 rounded-full text-white bg-brand-primary hover:bg-brand-primary/90 transition-colors font-medium text-base md:text-lg flex items-center gap-2 shrink-0">
                Buscar
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recommended Section (Editorial Cards) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-10"
        >
          <h2 className="text-3xl font-serif font-medium text-brand-primary">
            Selecciones Premium
          </h2>
          <button className="text-sm font-medium text-gray-500 hover:text-brand-primary transition-colors flex items-center gap-1 group">
            Ver todos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {RESTAURANTS_LIST.map((restaurant) => (
            <motion.div
              variants={itemVariants}
              key={restaurant.id}
              onClick={() => navigate(`/restaurant/${restaurant.id}`)}
              className="group relative rounded-[2rem] overflow-hidden cursor-pointer aspect-[4/3] md:aspect-[4/4] lg:aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-500"
            >
              {/* Image Background */}
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Right Badge */}
              <div className="absolute top-6 right-6">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-full flex items-center shadow-sm">
                  <Star className="w-4 h-4 text-yellow-400 mr-1.5 fill-yellow-400" />
                  <span className="font-semibold text-sm">{restaurant.rating}</span>
                </div>
              </div>

              {/* Bottom Content Area */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end transform transition-transform duration-500">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-full text-xs font-medium uppercase tracking-wider mb-4">
                      {restaurant.type}
                    </span>
                    <h3 className="text-3xl lg:text-4xl font-serif font-medium text-white mb-2 leading-tight">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center text-white/80 text-sm font-medium">
                      <MapPin className="w-4 h-4 mr-1.5" />
                      {restaurant.location}
                    </div>
                  </div>

                  {/* Hover Arrow Indicator */}
                  <div className="w-12 h-12 rounded-full bg-white text-brand-primary flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-lg">
                    <ArrowRight className="w-5 h-5 -rotate-45" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
