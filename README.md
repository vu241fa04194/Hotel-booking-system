# Hotel Booking System

A clean, modular, and beginner-friendly Hotel Booking application built with **React**, **Vite**, **React Router**, **Axios**, and **JSON Server**.

---

## 🛠️ Technology Stack

- **React 18**: Component-based UI library
- **Vite**: Fast frontend build tool and dev server
- **JavaScript (ES6+)**: Core language
- **React Router (v6)**: Declarative client-side routing
- **Axios**: Promise-based HTTP client
- **JSON Server**: Fake REST API backend
- **Pure CSS**: Domain-separated styling without inline styles
- **Git & GitHub**: Version control and collaboration

---

## 📁 Project Structure

```text
hotel-booking-system/
│
├── public/
│   └── assets/
│       └── favicon.svg                  # SVG favicon icon
│
├── src/
│   ├── views/                           # Page-level screen components
│   │   ├── Home.jsx                     # Hero banner, search, filters & explore hotels
│   │   ├── HotelDetails.jsx             # Hotel profile, amenities & available rooms
│   │   ├── Booking.jsx                  # Reservation form, live price calculation & confirmation
│   │   ├── BookingHistory.jsx           # Bookings table, cancellation & room release
│   │   └── NotFound.jsx                 # 404 fallback page
│   │
│   ├── components/                      # Reusable UI widgets
│   │   ├── Navbar.jsx                   # Sticky navigation bar (Home, Hotels, Bookings)
│   │   ├── HotelCard.jsx                # Hotel summary card with amenities & actions
│   │   ├── SearchBar.jsx                # Search input for hotel name and city
│   │   ├── Filter.jsx                   # Location, min/max price, rating, & sorting filters
│   │   ├── RoomCard.jsx                 # Room details with availability badge
│   │   └── BookingForm.jsx              # Reservation form with live calculation
│   │
│   ├── services/                        # Centralized API layer (Zero direct Axios in UI)
│   │   ├── apiConfig.js                 # Axios instance & interceptors
│   │   ├── hotelService.js              # Hotel endpoints (/hotels)
│   │   ├── roomService.js               # Room endpoints & status updates (/rooms)
│   │   └── bookingService.js            # Booking endpoints (/bookings)
│   │
│   ├── exception/                       # Custom error handling
│   │   ├── apiException.js              # Axios error normalizer & API exception
│   │   └── validationException.js       # Form & payload validation error class
│   │
│   ├── css/                             # Domain-separated stylesheets (No inline styles)
│   │   ├── style.css                    # CSS variables, buttons, alerts & empty state
│   │   ├── layout.css                   # Navbar, containers, footer & layout media queries
│   │   ├── hotel.css                    # Hero banner, hotel grid, amenities & filter styles
│   │   └── booking.css                  # Form cards, price breakdown & history table
│   │
│   ├── App.jsx                          # Route table and persistent layout shell
│   └── main.jsx                         # React root mount & BrowserRouter
│
├── db.json                              # Mock REST database for JSON Server
├── package.json                         # Dependencies and npm scripts
├── .gitignore                           # Git ignore rules
├── index.html                           # HTML template for Vite
├── vite.config.js                       # Vite dev server configuration
└── README.md                            # Project documentation
```

---

## 🌟 Key Implemented Features

1. **Homepage & Hero Search**:
   - Hero banner with quick search box for hotel name and location.
   - "Explore Hotels" section with live count and responsive hotel cards.
   - Hotel cards show photo, name, location, rating, starting price, top amenities tags, "View Details", and "Book Now".

2. **Advanced Multi-Factor Filters & Sorting**:
   - Dynamic location filter (derived automatically from available hotels).
   - Minimum and Maximum price filters.
   - Minimum rating filter (★ 4.5+, ★ 4.0+, ★ 3.5+).
   - Sorting: Price (Low to High), Price (High to Low), Rating (High to Low).
   - Clear Filters button and empty state with reset trigger.

3. **Hotel Profile & Room Inventory**:
   - Large hero image, rating, location, description, starting price, and full amenities list.
   - List of hotel rooms with room type, capacity, price per night, and availability status.
   - Rooms that are booked display a disabled "Booked" badge.

4. **Booking & Live Price Calculation**:
   - Collects Full Name, Email, Check-In, Check-Out, and Number of Guests.
   - Dynamic calculation of total nights and total price based on selected room rate.
   - Strict validation: dates must be in the future, check-out after check-in, guest count within room capacity.
   - Upon successful reservation:
     - Shows confirmation summary screen with reference ID and details.
     - **Updates room status to booked (`isAvailable: false`) in JSON Server.**
     - Direct button to navigate to booking history.

5. **Booking History & Cancellation**:
   - Displays all reservations: Booking ID, Hotel Name, Room, Guest Name, Guests Count, Check-In, Check-Out, Total Amount, and Status.
   - Cancellation with confirmation prompt:
     - **Booking status updates to `'Cancelled'`** (persisting in history with visual badge).
     - **Room status automatically restored to available (`isAvailable: true`) in JSON Server.**
   - Option to permanently remove cancelled records.

---

## 📡 API Endpoints (JSON Server)

Server runs on `http://localhost:5000`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/hotels` | List all hotels |
| `GET` | `/hotels/:id` | Get hotel details by ID |
| `GET` | `/rooms?hotelId=:id` | List rooms for a hotel |
| `GET` | `/rooms/:id` | Get room details by ID |
| `PATCH` | `/rooms/:id` | Update room availability (`isAvailable: false/true`) |
| `GET` | `/bookings` | List all bookings |
| `POST` | `/bookings` | Create new reservation |
| `PATCH` | `/bookings/:id` | Update booking status (`status: 'Cancelled'`) |
| `DELETE` | `/bookings/:id` | Delete booking record |

---

## 🚀 Running the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend (JSON Server)
In a terminal, run:
```bash
npm run server
```

### 3. Start the Frontend (Vite)
In a second terminal, run:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
