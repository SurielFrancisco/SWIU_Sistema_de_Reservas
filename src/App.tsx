import { Routes, Route } from 'react-router-dom';
import HomeView from './features/home/HomeView';
import BookingView from './features/booking/BookingView';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/restaurant/:id" element={<BookingView />} />
      </Routes>
    </div>
  );
}

export default App;
