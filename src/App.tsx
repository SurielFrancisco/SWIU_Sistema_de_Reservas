import { Link, Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomeView from './features/home/HomeView';
import BookingView from './features/booking/BookingView';
import LoginView from './features/auth/LoginView';
import AdminView from './features/admin/AdminView';
import ReceptionView from './features/reception/ReceptionView';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { signOut } from './features/auth/store/authSlice';

function AdminRoute() {
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (!auth.isAuthenticated) return <Navigate to="/login" replace state={{ returnTo: location.pathname }} />;
  if (auth.role !== 'admin') return <Navigate to="/" replace />;
  return <AdminView />;
}

function HomeRoute() {
  const auth = useAppSelector((state) => state.auth);
  return auth.isAuthenticated && auth.role === 'admin'
    ? <Navigate to="/admin" replace />
    : <HomeView />;
}

function AdminPreviewRoute() {
  const auth = useAppSelector((state) => state.auth);
  if (!auth.isAuthenticated || auth.role !== 'admin') return <Navigate to="/login" replace />;
  return <HomeView preview />;
}

function ReceptionRoute() {
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (!auth.isAuthenticated) return <Navigate to="/login" replace state={{ returnTo: location.pathname }} />;
  if (auth.role !== 'admin' && auth.role !== 'receptionist') return <Navigate to="/" replace />;
  return <ReceptionView />;
}

function AdminTools() {
  const auth = useAppSelector((state) => state.auth);
  const restaurants = useAppSelector((state) => state.admin.restaurants.filter((restaurant) => restaurant.ownerEmail === auth.email));
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  if (!auth.isAuthenticated || auth.role !== 'admin' || location.pathname !== '/admin') return null;
  return (
    <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-2">
      {restaurants[0] && <Link
        to={`/recepcion/${restaurants[0].id}`}
        className="rounded-full bg-white px-5 py-3 text-sm font-medium text-brand-primary shadow-lg ring-1 ring-gray-200 transition-transform hover:-translate-y-0.5"
      >
        Abrir recepción
      </Link>}
      <Link to="/admin/vista-cliente" className="rounded-full bg-brand-primary px-5 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:-translate-y-0.5">Vista de cliente</Link>
      <button
        onClick={() => { dispatch(signOut()); navigate('/', { replace: true }); }}
        className="rounded-full bg-white px-4 py-3 text-sm font-medium text-red-600 shadow-lg ring-1 ring-red-100 transition-colors hover:bg-red-50"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/admin/vista-cliente" element={<AdminPreviewRoute />} />
        <Route path="/recepcion/:restaurantId" element={<ReceptionRoute />} />
        <Route path="/restaurant/:id" element={<BookingView />} />
      </Routes>
      <AdminTools />
    </div>
  );
}

export default App;
