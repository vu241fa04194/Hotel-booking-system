import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Hotels from './views/Hotels';
import HotelDetails from './views/HotelDetails';
import Booking from './views/Booking';
import BookingHistory from './views/BookingHistory';
import NotFound from './views/NotFound';

// Stylesheets
import './css/style.css';
import './css/layout.css';
import './css/hotel.css';
import './css/booking.css';

/**
 * App Component
 * Central router and layout orchestrator.
 */
function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/bookings" element={<BookingHistory />} />
          <Route path="/history" element={<BookingHistory />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Hotel Booking System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
