import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/BookingPage.module.css';
import SeatSelection from '../components/SeatSelection';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item, type, eventData } = location.state || {};
  
  // Use item if it exists, otherwise fall back to eventData, or create a default
  const currentItem = item || eventData || {
    id: 1,
    title: 'Avengers: Endgame',
    image: '/images/movie1.jpg',
    rating: 4.5,
    votes: '1.2K',
    genre: 'Action, Drama',
    duration: '2h 30m',
    releaseDate: '2025-11-29',
    language: 'Hindi'
  };

  const [selectedDate, setSelectedDate] = useState('29');
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [selectedFormat, setSelectedFormat] = useState('2D');
  const [priceRange, setPriceRange] = useState('all');
  const [specialFormats, setSpecialFormats] = useState('all');
  const [preferredTime, setPreferredTime] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Seat selection popup state
  const [isSeatSelectionOpen, setIsSeatSelectionOpen] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Sample data for dates
  const dates = [
    { day: 'SAT', date: '29', month: 'NOV', isSelected: true },
    { day: 'SUN', date: '30', month: 'NOV', isSelected: false },
    { day: 'MON', date: '01', month: 'DEC', isSelected: false },
    { day: 'WED', date: '03', month: 'DEC', isSelected: false },
    { day: 'THU', date: '04', month: 'DEC', isSelected: false },
    { day: 'FRI', date: '05', month: 'DEC', isSelected: false },
    { day: 'SAT', date: '06', month: 'DEC', isSelected: false },
  ];

  // Sample theater data
  const theaters = [
    {
      id: 1,
      name: 'Cinepolis: VR Mall, Nagpur',
      location: 'VR Mall, Nagpur',
      facilities: ['mticket', 'food'],
      showtimes: [
        { time: '11:25 PM', format: 'DOLBY 7.1', status: 'available', price: 180, cancellable: false }
      ]
    },
    {
      id: 2,
      name: 'INOX: Jaswant Tuli Mall, Kamptee Road',
      location: 'Jaswant Tuli Mall, Kamptee Road',
      facilities: ['mticket', 'food'],
      showtimes: [
        { time: '02:30 PM', format: 'DOLBY ATMOS', status: 'available', price: 200, cancellable: true }
      ]
    },
    {
      id: 3,
      name: 'Skylight (Sangam) Cinema: Nagpur',
      location: 'Sangam Cinema, Nagpur',
      facilities: ['mticket', 'food'],
      showtimes: [
        { time: '08:00 PM', format: '2D', status: 'available', price: 150, cancellable: true }
      ]
    },
    {
      id: 4,
      name: 'AM Cinema Iconic: Javanti Nagar VIP',
      location: 'Javanti Nagar VIP',
      facilities: ['mticket'],
      showtimes: [
        { time: '06:30 PM', format: '2D', status: 'available', price: 120, cancellable: true }
      ]
    }
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleBookShow = (theater, showtime) => {
    setSelectedTheater(theater);
    setSelectedShowtime(showtime);
    setIsSeatSelectionOpen(true);
  };

  const handleCloseSeatSelection = () => {
    setIsSeatSelectionOpen(false);
    setSelectedTheater(null);
    setSelectedShowtime(null);
  };

  const handleProceedPayment = (bookingData) => {
    // Close the seat selection popup
    handleCloseSeatSelection();
    
    // Store booking in localStorage (in real app, this would be sent to backend)
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    bookings.push({
      ...bookingData,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('userBookings', JSON.stringify(bookings));
    
    // You could navigate to a booking confirmation page here
    // navigate('/booking-confirmation', { state: { bookingData } });
    
    // For now, we'll just show success and optionally redirect to home
    setTimeout(() => {
      const goHome = confirm('Booking successful! Would you like to go back to the home page?');
      if (goHome) {
        navigate('/');
      }
    }, 1000);
  };

  // Remove the item not found check since we have a fallback
  return (
    <div className={styles.bookingPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            ← Back
          </button>
          <div className={styles.logo}>
            <span className={styles.logoText}>book<span className={styles.logoHeart}>♥</span>show</span>
          </div>
          <div className={styles.headerRight}>
            <span>Nagpur</span>
            <div className={styles.userSection}>
              <span>Hi, Aditya B.</span>
            </div>
          </div>
        </div>
        <nav className={styles.navigation}>
          <a href="#" className={styles.navItem}>Movies</a>
          <a href="#" className={styles.navItem}>Stream</a>
          <a href="#" className={styles.navItem}>Events</a>
          <a href="#" className={styles.navItem}>Plays</a>
          <a href="#" className={styles.navItem}>Sports</a>
          <a href="#" className={styles.navItem}>Activities</a>
          <div className={styles.navRight}>
            <a href="#" className={styles.navItem}>ListYourShow</a>
            <a href="#" className={styles.navItem}>Corporates</a>
            <a href="#" className={styles.navItem}>Offers</a>
            <a href="#" className={styles.navItem}>Gift Cards</a>
          </div>
        </nav>
      </header>

      {/* Movie/Event Banner */}
      <div className={styles.movieBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.moviePoster}>
            <img 
              src={currentItem.image || '/images/movie1.jpg'} 
              alt={currentItem.title}
              className={styles.posterImage}
            />
          </div>
          <div className={styles.movieDetails}>
            <div className={styles.movieHeader}>
              <h1 className={styles.movieTitle}>{currentItem.title}</h1>
              <div className={styles.movieRating}>
                <span className={styles.ratingIcon}>⭐</span>
                <span className={styles.ratingValue}>{currentItem.rating || '8.5'}/10</span>
                <span className={styles.voteCount}>({currentItem.votes || '2.1K'} Votes)</span>
              </div>
            </div>
            <div className={styles.movieMeta}>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>🎬</span>
                {currentItem.genre || 'Action, Adventure, Drama'}
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>⏰</span>
                {currentItem.duration || '2h 30m'}
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>🗣️</span>
                {currentItem.language || 'Hindi'}
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>📅</span>
                {currentItem.releaseDate ? new Date(currentItem.releaseDate).toLocaleDateString() : '29 Nov 2025'}
              </span>
            </div>
            <div className={styles.bookingInfo}>
              <div className={styles.bookingBadge}>
                <span className={styles.badgeIcon}>🎫</span>
                <span>Booking tickets for Today, 29 Nov 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className={styles.dateSelection}>
        {dates.map((date) => (
          <div 
            key={date.date}
            className={`${styles.dateCard} ${selectedDate === date.date ? styles.selected : ''}`}
            onClick={() => handleDateSelect(date.date)}
          >
            <div className={styles.day}>{date.day}</div>
            <div className={styles.date}>{date.date}</div>
            <div className={styles.month}>{date.month}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.leftFilters}>
          <select 
            className={styles.filterSelect}
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="Hindi">Hindi - 2D</option>
            <option value="English">English - 2D</option>
          </select>
          
          <select 
            className={styles.filterSelect}
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all">Price Range</option>
            <option value="0-150">₹0 - ₹150</option>
            <option value="150-250">₹150 - ₹250</option>
            <option value="250+">₹250+</option>
          </select>

          <select 
            className={styles.filterSelect}
            value={specialFormats}
            onChange={(e) => setSpecialFormats(e.target.value)}
          >
            <option value="all">Special Formats</option>
            <option value="dolby">Dolby Atmos</option>
            <option value="imax">IMAX</option>
            <option value="4dx">4DX</option>
          </select>

          <select 
            className={styles.filterSelect}
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
          >
            <option value="all">Preferred Time</option>
            <option value="morning">Morning (6AM - 12PM)</option>
            <option value="afternoon">Afternoon (12PM - 6PM)</option>
            <option value="evening">Evening (6PM - 12AM)</option>
          </select>
        </div>

        <div className={styles.rightFilters}>
          <select 
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="price">Price: Low to High</option>
            <option value="time">Show Time</option>
            <option value="distance">Distance</option>
          </select>
          <button className={styles.searchButton}>🔍</button>
        </div>
      </div>

      {/* Info Banner */}
      <div className={styles.infoBanner}>
        <span className={styles.infoIcon}>📱</span>
        indicates subtitle language, if subtitles are available 
        <span className={styles.gotItLink}>Got it</span>
      </div>

      {/* Availability Legend */}
      <div className={styles.availabilityLegend}>
        <span className={styles.available}>🟢 AVAILABLE</span>
        <span className={styles.fastFilling}>🟠 FAST FILLING</span>
      </div>

      {/* Theater Listings */}
      <div className={styles.theaterListings}>
        {theaters.map((theater) => (
          <div key={theater.id} className={styles.theaterCard}>
            <div className={styles.theaterInfo}>
              <div className={styles.theaterName}>
                <span className={styles.theaterLogo}>🎬</span>
                {theater.name}
                <button className={styles.heartButton}>♡</button>
              </div>
              <div className={styles.theaterLocation}>{theater.location}</div>
              <div className={styles.facilities}>
                {theater.facilities.map((facility) => (
                  <span key={facility} className={styles.facilityIcon}>
                    {facility === 'mticket' ? '📱' : '🍿'}
                  </span>
                ))}
              </div>
            </div>
            
            <div className={styles.showtimes}>
              {theater.showtimes.map((showtime, index) => (
                <div key={index} className={styles.showtimeSlot}>
                  <button 
                    className={styles.timeButton}
                    onClick={() => handleBookShow(theater, showtime)}
                  >
                    <div className={styles.time}>{showtime.time}</div>
                    <div className={styles.format}>{showtime.format}</div>
                  </button>
                  <div className={styles.showtimeInfo}>
                    <div className={styles.cancellation}>
                      {showtime.cancellable ? 'Cancellation available' : 'Non-cancellable'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Seat Selection Popup */}
      <SeatSelection
        isOpen={isSeatSelectionOpen}
        onClose={handleCloseSeatSelection}
        theater={selectedTheater}
        showtime={selectedShowtime}
        onProceedPayment={handleProceedPayment}
      />
    </div>
  );
};

export default BookingPage;