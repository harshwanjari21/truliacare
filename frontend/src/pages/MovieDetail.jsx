import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/MovieDetail.module.css';

const MovieDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item, type } = location.state || {};

  const [selectedFormat, setSelectedFormat] = useState('2D');
  const [selectedLanguage, setSelectedLanguage] = useState(item?.language || 'Hindi');

  if (!item) {
    return <div>Movie not found</div>;
  }

  const handleBookTickets = () => {
    navigate(`/booking/${item.id}`, { state: { item, type } });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out ${item.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className={styles.movieDetail}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            ← Back
          </button>
          <div className={styles.logo}>
            <span className={styles.logoText}>book<span className={styles.logoHeart}>♥</span>show</span>
          </div>
          <button onClick={handleShare} className={styles.shareButton}>
            🔗 Share
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <img src={item.image} alt={item.title} />
          <div className={styles.heroOverlay}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.moviePoster}>
            <img src={item.image} alt={item.title} />
            <div className={styles.cinemaTag}>
              {type === 'movie' ? 'In cinemas' : 'Live Event'}
            </div>
            {type === 'movie' && (
              <button className={styles.trailerButton}>
                ▶ Trailers (2)
              </button>
            )}
          </div>
          
          <div className={styles.movieInfo}>
            <h1 className={styles.movieTitle}>{item.title}</h1>
            
            <div className={styles.rating}>
              <span className={styles.ratingIcon}>⭐</span>
              <span className={styles.ratingValue}>{item.rating}/10</span>
              <span className={styles.ratingCount}>({item.votes})</span>
              <button className={styles.rateButton}>Rate now</button>
            </div>
            
            <div className={styles.movieMeta}>
              <span>2h 22m</span>
              <span>•</span>
              <span>{item.genre}</span>
              <span>•</span>
              <span>A</span>
              <span>•</span>
              <span>21 Nov, 2025</span>
            </div>
            
            <div className={styles.formatLanguage}>
              <div className={styles.formatButtons}>
                <button 
                  className={`${styles.formatBtn} ${selectedFormat === '2D' ? styles.active : ''}`}
                  onClick={() => setSelectedFormat('2D')}
                >
                  2D
                </button>
                <button 
                  className={`${styles.formatBtn} ${selectedFormat === '3D' ? styles.active : ''}`}
                  onClick={() => setSelectedFormat('3D')}
                >
                  3D
                </button>
              </div>
              <div className={styles.languageButtons}>
                <button 
                  className={`${styles.langBtn} ${selectedLanguage === 'Hindi' ? styles.active : ''}`}
                  onClick={() => setSelectedLanguage('Hindi')}
                >
                  Hindi
                </button>
                <button 
                  className={`${styles.langBtn} ${selectedLanguage === 'English' ? styles.active : ''}`}
                  onClick={() => setSelectedLanguage('English')}
                >
                  English
                </button>
              </div>
            </div>
            
            <button className={styles.bookButton} onClick={handleBookTickets}>
              {type === 'movie' ? 'Book tickets' : 'Register for Event'}
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className={styles.aboutSection}>
        <h2>About the {type}</h2>
        <p className={styles.aboutText}>
          {type === 'movie' 
            ? "Three frustrated husbands seek freedom from their dull marriages. A wild idea promises escape and excitement. But what follows is anything but expected."
            : "Join us for an amazing event experience. Don't miss this incredible opportunity to be part of something special. Limited seats available!"
          }
        </p>
      </div>
    </div>
  );
};

export default MovieDetail;