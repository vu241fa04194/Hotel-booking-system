import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import hotelService from '../services/hotelService';

/**
 * Popular Destinations Static Reference Data
 * Matches existing destinations in db.json with high-resolution imagery and descriptions.
 */
const POPULAR_DESTINATIONS = [
  {
    name: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    description: 'Pristine tropical beaches, vibrant shacks, and colonial charm.'
  },
  {
    name: 'Hyderabad',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80',
    description: 'City of Pearls featuring historic royal palaces and world-class hospitality.'
  },
  {
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    description: 'Dynamic coastal metropolis boasting seaside promenades and luxury stays.'
  },
  {
    name: 'Bangalore',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80',
    description: 'The Garden City featuring lush greenery and modern boutique hotels.'
  },
  {
    name: 'Delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
    description: 'Iconic heritage monuments, culinary feasts, and grand regency suites.'
  },
  {
    name: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80',
    description: 'The Pink City adorned with majestic palaces, havelis, and desert royalty.'
  },
  {
    name: 'Manali',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
    description: 'Snow-capped Himalayan peaks, pine forests, and cozy mountain chalets.'
  },
  {
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
    description: 'Futuristic skylines, golden dunes, and ultra-luxurious 5-star beachfront resorts.'
  }
];

/**
 * Home View
 * High-converting landing page featuring a hero search box, curated destination
 * cards, top 6 featured hotels, key value propositions, and an engaging CTA banner.
 */
const Home = () => {
  const navigate = useNavigate();

  // Search form fields
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  // Featured hotels (strictly limited to 6)
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await hotelService.getAllHotels();
        // Pick the top 6 hotels (sorted by rating descending)
        const sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setFeaturedHotels(sorted.slice(0, 6));
      } catch (err) {
        setError(err.message || 'Failed to load featured hotels.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHotels();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const query = destination.trim();
    if (query) {
      navigate(`/hotels?location=${encodeURIComponent(query)}`);
    } else {
      navigate('/hotels');
    }
  };

  const handleDestinationClick = (destName) => {
    navigate(`/hotels?location=${encodeURIComponent(destName)}`);
  };

  return (
    <div className="landing-page">
      {/* ==================================================================
          A. HERO SECTION
          ================================================================== */}
      <section className="landing-hero">
        <div className="landing-hero-overlay"></div>
        <div className="landing-hero-content">
          <span className="hero-pill">Welcome to HotelStay</span>
          <h1 className="hero-headline">Find Your Perfect Stay</h1>
          <p className="hero-tagline">Book comfortable hotels at the best destinations.</p>

          {/* Prominent Search Box */}
          <form className="hero-search-card" onSubmit={handleHeroSearch}>
            <div className="hero-field">
              <label htmlFor="hero-destination" className="hero-field-label">
                Destination
              </label>
              <input
                id="hero-destination"
                type="text"
                className="hero-field-input"
                placeholder="Where are you going? (e.g. Goa, Dubai...)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="hero-field">
              <label htmlFor="hero-checkin" className="hero-field-label">
                Check-in
              </label>
              <input
                id="hero-checkin"
                type="date"
                className="hero-field-input"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="hero-field">
              <label htmlFor="hero-checkout" className="hero-field-label">
                Check-out
              </label>
              <input
                id="hero-checkout"
                type="date"
                className="hero-field-input"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="hero-field">
              <label htmlFor="hero-guests" className="hero-field-label">
                Guests
              </label>
              <select
                id="hero-guests"
                className="hero-field-select"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4+ Guests</option>
              </select>
            </div>

            <div className="hero-field hero-btn-field">
              <button type="submit" className="btn btn-primary hero-submit-btn">
                Search Hotels
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ==================================================================
          B. POPULAR DESTINATIONS
          ================================================================== */}
      <section className="landing-section">
        <div className="section-title-wrap">
          <h2 className="landing-section-title">Popular Destinations</h2>
          <p className="landing-section-subtitle">
            Explore breathtaking getaways and bustling cityscapes loved by travellers worldwide.
          </p>
        </div>

        <div className="destinations-grid">
          {POPULAR_DESTINATIONS.map((dest) => (
            <article key={dest.name} className="destination-card">
              <div className="destination-image-wrapper">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="destination-image"
                  loading="lazy"
                />
                <span className="destination-tag">{dest.name}</span>
              </div>
              <div className="destination-body">
                <h3 className="destination-name">{dest.name}</h3>
                <p className="destination-text">{dest.description}</p>
                <button
                  type="button"
                  className="btn btn-secondary destination-btn"
                  onClick={() => handleDestinationClick(dest.name)}
                >
                  Explore Hotels
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ==================================================================
          C. FEATURED HOTELS (Strictly 6 Cards)
          ================================================================== */}
      <section className="landing-section">
        <div className="section-title-wrap">
          <h2 className="landing-section-title">Featured Hotels</h2>
          <p className="landing-section-subtitle">
            Handpicked premium accommodations with exceptional guest reviews and signature amenities.
          </p>
        </div>

        {loading && <p className="alert alert-info">Loading featured hotels...</p>}
        {error && <p className="alert alert-error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="featured-hotels-grid">
              {featuredHotels.map((hotel) => (
                <article key={hotel.id} className="featured-card">
                  <div className="featured-card-image-wrap">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="featured-card-image"
                      loading="lazy"
                    />
                    <span className="featured-card-rating">★ {hotel.rating}</span>
                  </div>
                  <div className="featured-card-body">
                    <h3 className="featured-card-title">{hotel.name}</h3>
                    <p className="featured-card-location">📍 {hotel.location}</p>
                    <div className="featured-card-footer">
                      <div>
                        <span className="featured-price">
                          ₹{hotel.price ?? hotel.pricePerNight}
                        </span>
                        <span className="featured-price-unit"> / night</span>
                      </div>
                      <Link
                        to={`/hotel/${hotel.id}`}
                        className="btn btn-primary featured-view-btn"
                      >
                        View Hotel
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="view-all-hotels-wrapper">
              <Link to="/hotels" className="btn btn-primary btn-large">
                View All Hotels →
              </Link>
            </div>
          </>
        )}
      </section>

      {/* ==================================================================
          D. WHY CHOOSE US
          ================================================================== */}
      <section className="landing-section why-choose-section">
        <div className="section-title-wrap">
          <h2 className="landing-section-title">Why Choose Us</h2>
          <p className="landing-section-subtitle">
            We provide a seamless and dependable hotel booking experience from search to stay.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3 className="feature-title">✓ Best Price</h3>
            <p className="feature-text">Find great hotels at affordable prices.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">✓ Easy Booking</h3>
            <p className="feature-text">Book your room in just a few clicks.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3 className="feature-title">✓ Many Destinations</h3>
            <p className="feature-text">Choose hotels from many cities and countries.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">✓ Secure Booking</h3>
            <p className="feature-text">Your booking information is handled safely.</p>
          </div>
        </div>
      </section>

      {/* ==================================================================
          E. CALL TO ACTION (CTA)
          ================================================================== */}
      <section className="landing-cta-banner">
        <div className="cta-content">
          <h2 className="cta-heading">Ready to find your next stay?</h2>
          <p className="cta-subheading">
            Browse our handpicked collection of luxury resorts, business suites, and tranquil getaways.
          </p>
          <Link to="/hotels" className="btn btn-primary cta-btn">
            Explore Hotels
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
