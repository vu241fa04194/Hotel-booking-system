# Hotel Booking System

A clean, modular, and beginner-friendly Hotel Booking application built with **React**, **Vite**, **React Router**, **Axios**, and **JSON Server**.

---

## 🛠️ Technology Stack

- **React 18**: Component-based UI library
- **Vite**: Fast frontend build tool and dev server
- **JavaScript (ES6+)**: Core programming language
- **React Router (v6)**: Declarative client-side routing
- **Axios**: Promise-based HTTP client
- **JSON Server**: Full fake REST API backend
- **Pure CSS**: Structured styling without utility bloat or inline styles
- **Git & GitHub**: Version control and code collaboration

---

## 📁 Project Structure

```text
hotel-booking-system/
│
├── public/
│   └── assets/
│       └── favicon.svg
│
├── src/
│   ├── views/                  # Page-level route views
│   │   ├── Home.jsx            # Hotel catalog with search & filters
│   │   ├── HotelDetails.jsx    # Hotel overview & room listings
│   │   ├── Booking.jsx         # Booking form view
│   │   ├── BookingHistory.jsx  # Past reservations & cancellation
│   │   └── NotFound.jsx        # 404 fallback page
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Header navigation bar
│   │   ├── HotelCard.jsx       # Individual hotel card
│   │   ├── SearchBar.jsx       # Search input component
│   │   ├── Filter.jsx          # Location and sorting filter
│   │   ├── RoomCard.jsx        # Room details and booking trigger
│   │   └── BookingForm.jsx     # Reservation input form
│   │
│   ├── services/               # Centralized API layer (Axios)
│   │   ├── apiConfig.js        # Axios instance & interceptors
│   │   ├── hotelService.js     # Hotel-related HTTP requests
│   │   ├── roomService.js      # Room-related HTTP requests
│   │   └── bookingService.js   # Booking-related HTTP requests
│   │
│   ├── exception/              # Custom error handling
│   │   ├── apiException.js     # API error wrapper & error handler
│   │   └── validationException.js # Input validation errors
│   │
│   ├── css/                    # Modular CSS stylesheets
│   │   ├── style.css           # Global reset & CSS variables
│   │   ├── layout.css          # Navigation, container & footer
│   │   ├── hotel.css           # Hotel & room card styles
│   │   └── booking.css         # Form & booking table styles
│   │
│   ├── App.jsx                 # Route definitions & app wrapper
│   └── main.jsx                # React root & BrowserRouter mount
│
├── db.json                     # JSON Server mock database
├── package.json                # Project dependencies and scripts
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
├── index.html                  # HTML entry point for Vite
└── vite.config.js              # Vite configuration
```

---

## 🚀 Getting Started

### 1. Install Dependencies
Run the following command in the project root:
```bash
npm install
```

### 2. Start the Backend (JSON Server)
In a terminal, run JSON Server on port 5000:
```bash
npm run server
```
This serves REST API endpoints:
- `GET /hotels` - List all hotels
- `GET /hotels/:id` - Get specific hotel
- `GET /rooms?hotelId=:id` - List rooms for a hotel
- `GET /bookings` - List all bookings
- `POST /bookings` - Create a booking
- `DELETE /bookings/:id` - Cancel a booking

### 3. Start the Frontend (Vite)
In a second terminal, launch the React development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏛️ Architecture & Viva Highlights

1. **Separation of Concerns**:
   - **UI Layer (`src/components`, `src/views`)**: Focuses exclusively on rendering and local state. No direct Axios calls exist inside components.
   - **Service Layer (`src/services`)**: Encapsulates all network communication via a single Axios instance (`apiConfig.js`).
   - **Error Handling (`src/exception`)**: Converts raw network errors into structured, user-friendly `ApiException` instances.
   - **Styling (`src/css`)**: Pure CSS stylesheets cleanly separated by domain, without inline `style=""` props.

2. **Routing Flow (`React Router v6`)**:
   - `BrowserRouter` wraps the entire app in `main.jsx`.
   - `Routes` and `Route` are defined in `App.jsx`.
   - Dynamic parameters (e.g., `/hotel/:id`) are read via `useParams()`.
   - Query parameters (e.g., `/booking?hotelId=1&roomId=101`) are accessed via `useSearchParams()`.
