import { lazy, Suspense } from 'react';
import { Link, Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { signOut } from './features/auth/store/authSlice';

const HomeView = lazy(() => import('./features/home/HomeView'));
const BookingView = lazy(() => import('./features/booking/BookingView'));
const LoginView = lazy(() => import('./features/auth/LoginView'));
const RegisterView = lazy(() => import('./features/auth/RegisterView'));
const AdminLoginView = lazy(() => import('./features/auth/AdminLoginView'));
const AdminRegisterView = lazy(() => import('./features/auth/AdminRegisterView'));
const AdminView = lazy(() => import('./features/admin/AdminView'));
const ReceptionView = lazy(() => import('./features/reception/ReceptionView'));
const WaiterView = lazy(() => import('./features/waiter/WaiterView'));

function AdminRoute() {
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (!auth.isAuthenticated) return <Navigate to="/login/admin" replace state={{ returnTo: location.pathname }} />;
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
  if (!auth.isAuthenticated || auth.role !== 'admin') return <Navigate to="/login/admin" replace />;
  return <HomeView preview />;
}

function ReceptionRoute() {
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (!auth.isAuthenticated) return <Navigate to="/login" replace state={{ returnTo: location.pathname }} />;
  if (auth.role !== 'admin' && auth.role !== 'receptionist') return <Navigate to="/" replace />;
  return <ReceptionView />;
}

function WaiterRoute() {
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();
  if (!auth.isAuthenticated) return <Navigate to="/login/admin" replace state={{ returnTo: location.pathname }} />;
  if (auth.role !== 'admin') return <Navigate to="/" replace />;
  return <WaiterView />;
}

function AdminTools() {
  const auth = useAppSelector((state) => state.auth);
  const restaurants = useAppSelector((state) => state.admin.restaurants.filter((restaurant) => restaurant.ownerEmail === auth.email));
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  if (!auth.isAuthenticated || auth.role !== 'admin' || location.pathname !== '/admin') return null;
  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-wrap items-center justify-end gap-2">
      {restaurants[0] && (
        <>
          <Link
            to={`/mesero/${restaurants[0].id}`}
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-amber-800 shadow-lg ring-1 ring-amber-200 transition-transform hover:-translate-y-0.5 hover:bg-amber-50"
          >
            Vista de mesero
          </Link>
          <Link
            to={`/recepcion/${restaurants[0].id}`}
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-brand-primary shadow-lg ring-1 ring-gray-200 transition-transform hover:-translate-y-0.5"
          >
            Abrir recepción
          </Link>
        </>
      )}
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
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-brand-secondary text-sm text-gray-500">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/login/admin" element={<AdminLoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/register/admin" element={<AdminRegisterView />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/admin/vista-cliente" element={<AdminPreviewRoute />} />
          <Route path="/recepcion/:restaurantId" element={<ReceptionRoute />} />
          <Route path="/mesero/:restaurantId" element={<WaiterRoute />} />
          <Route path="/restaurant/:id" element={<BookingView />} />
        </Routes>
      </Suspense>
      <AdminTools />
    </div>
  );
}

export default App;
