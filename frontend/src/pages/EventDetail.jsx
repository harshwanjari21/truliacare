import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/EventDetail.module.css';

const EventDetail = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Navigation functions
  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { item: movie, type: 'movie' } });
  };

  const handleEventClick = (event) => {
    navigate(`/event/${event.id}`, { state: { item: event, type: 'event' } });
  };

  // Featured carousel data
  const featuredSlides = [
    {
      id: 1,
      title: 'LET THE',
      subtitle: 'Festivities',
      titleEnd: 'BEGIN! ✨',
      description: '150+ Theme Parks, Rides, and Activities!',
      offers: ['20% Bank Offers', 'Booking Fee'],
      badges: ['HDFC', 'SCB', 'YES BANK'],
      image: '/api/placeholder/600/400',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 2,
      title: 'DISCOVER',
      subtitle: 'Amazing',
      titleEnd: 'EVENTS! 🎪',
      description: '200+ Live Shows, Concerts, and Experiences!',
      offers: ['15% Cashback', 'No Booking Fee'],
      badges: ['AXIS', 'ICICI', 'SBI'],
      image: '/api/placeholder/600/400',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 3,
      title: 'EXPLORE',
      subtitle: 'Thrilling',
      titleEnd: 'ADVENTURES! 🎢',
      description: '100+ Adventure Sports and Activities!',
      offers: ['25% Off', 'Free Cancellation'],
      badges: ['KOTAK', 'BOB', 'PNB'],
      image: '/api/placeholder/600/400',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      id: 4,
      title: 'ENJOY',
      subtitle: 'Premium',
      titleEnd: 'SHOWS! 🎭',
      description: '50+ Premium Theatre and Drama Shows!',
      offers: ['Buy 1 Get 1', 'VIP Access'],
      badges: ['AMEX', 'CITI', 'INDUS'],
      image: '/api/placeholder/600/400',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    }
  ];

  // Movie data for Movies in Nagpur section
  const moviesInNagpur = [
    {
      id: 1,
      title: 'Chhichhore',
      genre: 'Comedy/Drama',
      rating: 8.8,
      votes: '250K Votes',
      image: '/chhichhore.jpg',
      language: 'Hindi'
    },
    {
      id: 2,
      title: 'Dil Bechara',
      genre: 'Romance/Drama', 
      rating: 9.0,
      votes: '500K+ Votes',
      image: '/dil bechara.jpg',
      language: 'Hindi'
    },
    {
      id: 3,
      title: 'Dunki',
      genre: 'Comedy/Drama',
      rating: 8.5,
      votes: '180K Votes', 
      image: '/Dunki 2023 poster.jpeg',
      language: 'Hindi'
    },
    {
      id: 4,
      title: 'Jab We Met', 
      genre: 'Romance/Comedy',
      rating: 8.9,
      votes: '300K+ Votes',
      image: '/jab we met (2007).jpeg',
      language: 'Hindi'
    },
    {
      id: 5,
      title: 'Kabir Singh',
      genre: 'Romance/Drama',
      rating: 7.8,
      votes: '400K Votes',
      image: '/kabir singh.jpeg',
      language: 'Hindi'
    },
  ]

  // Stream content data
  const streamContent = [
    {
      id: 1,
      title: 'A ride you cannot miss!',
      subtitle: 'This Halloween',
      description: 'Experience/Halloween',
      badge: 'STREAMING',
      image: '/api/placeholder/300/200'
    }
  ];

  // Events data
  const premieres = [
    {
      id: 1,
      title: 'Music Concert Night',
      language: 'Live Performance',
      badge: 'EVENT',
      image: '/Black and Pink Collage Music Concert  Poster.jpeg'
    },
    {
      id: 2,
      title: 'Rock Concert',
      language: 'Live Music',
      badge: 'EVENT',
      image: '/Black Grunge Free Concert Poster.jpeg'
    },
    {
      id: 3,
      title: 'Live Music Fest',
      language: 'Musical Event',
      badge: 'EVENT',
      image: '/Live Music Flyer.jpeg'
    },
    {
      id: 4,
      title: 'Mika Singh Live',
      language: 'Bollywood Night',
      badge: 'EVENT',
      image: '/Mika Singh Event Poster _ Bold Typography & High-Impact Artist Branding.jpeg'
    },
    {
      id: 5,
      title: 'Church Social Event',
      language: 'Community Event',
      badge: 'EVENT',
      image: '/Social Media #11 - Church - Pedro Alves.jpeg'
    },
    {
      id: 6,
      title: 'Music Graphics Event',
      language: 'Visual Arts',
      badge: 'EVENT',
      image: '/🔥 Eye-Catching Music Posters & Graphics for Events _ HV Production.jpeg'
    },
    {
      id: 7,
      title: 'Animal Documentary',
      language: 'Educational',
      badge: 'EVENT',
      image: '/Animal.jpeg'
    },
    {
      id: 8,
      title: 'Taare Zameen Par',
      language: 'Film Screening',
      badge: 'EVENT',
      image: '/Taare Zameen par.jpeg'
    }
  ];

  const scrollCarousel = (direction, containerRef, itemWidth = 220) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -itemWidth * 2 : itemWidth * 2;
      containerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev + 1;
      return next >= featuredSlides.length ? 0 : next;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const previous = prev - 1;
      return previous < 0 ? featuredSlides.length - 1 : previous;
    });
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const moviesRef = useRef(null);
  const eventsRef = useRef(null);
  const premieresRef = useRef(null);

  return (
    <div className={styles.eventDetail}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoText}><span className={styles.logoHeart}>Ticketo♥</span></span>
          </div>
          <div className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Search for Movies, Events, Plays, Sports and Activities" 
              className={styles.searchInput}
            />
          </div>
          <div className={styles.headerRight}>
            <span>Nagpur</span>
            <div className={styles.userSection}>
              <span>Hi, Aditya B.</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Carousel */}
      <section className={styles.featuredCarousel}>
        <div className={styles.carouselWrapper}>
          <div 
            className={styles.carouselSlides} 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {featuredSlides.map((slide, index) => (
              <div 
                key={slide.id} 
                className={styles.featuredSlide}
                style={{ background: slide.background }}
              >
                <div className={styles.slideContent}>
                  <h1 className={styles.slideTitle}>
                    🎊 {slide.title} <br />
                    <span className={styles.slideSubtitle}>{slide.subtitle}</span> <br />
                    {slide.titleEnd}
                  </h1>
                  <p className={styles.slideDescription}>{slide.description}</p>
                  <div className={styles.slideOffers}>
                    {slide.offers.map((offer, idx) => (
                      <span key={idx} className={styles.offerText}>{offer}</span>
                    ))}
                  </div>
                  <div className={styles.slideBadges}>
                    {slide.badges.map((badge, idx) => (
                      <span key={idx} className={styles.badge}>🏦 {badge}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.slideImage}>
                  <img src={slide.image} alt={`Slide ${index + 1}`} />
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button 
            className={styles.carouselNav + ' ' + styles.carouselNavLeft} 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prevSlide();
            }}
          >
            ‹
          </button>
          <button 
            className={styles.carouselNav + ' ' + styles.carouselNavRight} 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextSlide();
            }}
          >
            ›
          </button>
          
          {/* Dots Indicator */}
          <div className={styles.carouselDots}>
            {featuredSlides.map((_, index) => (
              <button
                key={index}
                className={`${styles.carouselDot} ${index === currentSlide ? styles.carouselDotActive : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stream Section */}
      <section className={styles.streamSection}>
        <div className={styles.streamCard}>
          <div className={styles.streamImage}>
            <img src="/api/placeholder/400/250" alt="Halloween Experience" />
          </div>
          <div className={styles.streamContent}>
            <span className={styles.streamBadge}>STREAMING</span>
            <h2>A ride you cannot miss!</h2>
            <p>This Halloween</p>
            <span className={styles.streamCategory}>Experience/Halloween</span>
          </div>
        </div>
      </section>

      {/* Movies in Nagpur - Grid Layout */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Movies in Nagpur</h2>
          <div className={styles.filterTabs}>
            <span className={styles.activeTab}>Coming Soon</span>
          </div>
        </div>
        <div className={styles.moviesGrid}>
          {moviesInNagpur.map(movie => (
            <div 
              key={movie.id} 
              className={styles.movieGridCard}
              onClick={() => handleMovieClick(movie)}
            >
              <div className={styles.movieGridImage}>
                <img src={movie.image} alt={movie.title} />
                <div className={styles.movieRating}>
                  ⭐ {movie.rating}/10 {movie.votes}
                </div>
              </div>
              <div className={styles.movieGridInfo}>
                <h3 className={styles.movieGridTitle}>{movie.title}</h3>
                <p className={styles.movieGridGenre}>{movie.genre}</p>
                <p className={styles.movieGridLanguage}>{movie.language}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.eventsHeader}>
            <div className={styles.eventsIcon}>
              <span className={styles.playIcon}>▶</span>
              <div>
                <h2 className={styles.eventsTitle}>EVENTS</h2>
                <p className={styles.eventsSubtitle}>Discover amazing events happening around you</p>
              </div>
            </div>
          </div>
          <a href="#" className={styles.seeAll}>See All ›</a>
        </div>
        <div className={styles.carouselContainer}>
          <button 
            className={styles.carouselButton + ' ' + styles.carouselButtonLeft}
            onClick={() => scrollCarousel('left', premieresRef)}
          >
            ‹
          </button>
          <div className={styles.carousel} ref={premieresRef}>
            {premieres.map(premiere => (
              <div 
                key={premiere.id} 
                className={styles.eventCard}
                onClick={() => handleEventClick(premiere)}
              >
                <div className={styles.eventImage}>
                  <img src={premiere.image} alt={premiere.title} />
                  <span className={styles.eventBadge}>{premiere.badge}</span>
                </div>
                <div className={styles.eventInfo}>
                  <h3 className={styles.eventTitle}>{premiere.title}</h3>
                  <p className={styles.eventLanguage}>{premiere.language}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            className={styles.carouselButton + ' ' + styles.carouselButtonRight}
            onClick={() => scrollCarousel('right', premieresRef)}
          >
            ›
          </button>
        </div>
      </section>
    </div>
  );
};

export default EventDetail;