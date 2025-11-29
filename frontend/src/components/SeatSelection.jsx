import React, { useState } from 'react';
import styles from '../styles/SeatSelection.module.css';
import BookingConfirmation from './BookingConfirmation';

const SeatSelection = ({ isOpen, onClose, theater, showtime, onProceedPayment }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketCounts, setTicketCounts] = useState({
    adult: 1,
    child: 0,
    senior: 0
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Sample seat layout (15 rows x 20 seats per row)
  const [seatLayout] = useState(() => {
    const layout = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
    const seatsPerRow = 20;

    // Predefined occupied seats to keep them consistent
    const occupiedSeats = [
      'A1', 'A4', 'A5', 'A18', 'A20',
      'B2', 'B4', 'B6', 'B9', 'B13', 'B14', 'B18',
      'C7', 'C8', 'C16',
      'D2', 'D4', 'D13', 'D18', 'D20',
      'E2', 'E4', 'E5', 'E19',
      'F2', 'F9', 'F10', 'F18',
      'G5', 'G8', 'G17', 'G20',
      'H7', 'H10', 'H11', 'H15', 'H18', 'H19',
      'I6', 'I12',
      'J6', 'J15', 'J18', 'J20',
      'K1', 'K4', 'K8', 'K9', 'K10', 'K12', 'K14', 'K15', 'K18',
      'L7', 'L8', 'L13', 'L17',
      'M1', 'M7', 'M8',
      'N2', 'N3', 'N5', 'N6', 'N7', 'N8', 'N9', 'N13', 'N14', 'N16', 'N19', 'N20',
      'O3', 'O5', 'O6', 'O7', 'O9', 'O13', 'O14', 'O16'
    ];

    // Initialize seat layout
    for (let i = 0; i < rows.length; i++) {
      const row = [];
      for (let j = 1; j <= seatsPerRow; j++) {
        const seatNumber = `${rows[i]}${j}`;
        const isOccupied = occupiedSeats.includes(seatNumber);
        const isAvailable = !isOccupied;
        
        row.push({
          id: seatNumber,
          row: rows[i],
          number: j,
          isAvailable,
          isSelected: false,
          price: showtime?.price || 180
        });
      }
      layout.push(row);
    }
    
    return layout;
  });

  const handleSeatClick = (seatId) => {
    const seat = seatLayout.flat().find(s => s.id === seatId);
    if (!seat.isAvailable) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        // Deselecting a seat
        return prev.filter(id => id !== seatId);
      } else {
        // Selecting a seat - check if we haven't exceeded the ticket count
        if (prev.length >= totalTickets) {
          alert(`You can only select ${totalTickets} seat(s). Please deselect a seat first or increase your ticket count.`);
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  const handleTicketCountChange = (type, change) => {
    setTicketCounts(prev => {
      const newCount = Math.max(0, prev[type] + change);
      const newTicketCounts = {
        ...prev,
        [type]: newCount
      };
      
      const newTotalTickets = newTicketCounts.adult + newTicketCounts.child + newTicketCounts.senior;
      
      // If reducing tickets and we have too many seats selected, remove excess seats
      if (newTotalTickets < selectedSeats.length) {
        const seatsToRemove = selectedSeats.length - newTotalTickets;
        setSelectedSeats(prevSeats => prevSeats.slice(0, -seatsToRemove));
      }
      
      return newTicketCounts;
    });
  };

  const totalTickets = ticketCounts.adult + ticketCounts.child + ticketCounts.senior;
  const basePrice = showtime?.price || 180;
  const childPrice = Math.floor(basePrice * 0.7); // 30% discount for children
  const seniorPrice = Math.floor(basePrice * 0.8); // 20% discount for seniors
  
  const subtotal = (ticketCounts.adult * basePrice) + 
                   (ticketCounts.child * childPrice) + 
                   (ticketCounts.senior * seniorPrice);
  
  const convenienceFee = Math.floor(subtotal * 0.05); // 5% convenience fee
  const taxes = Math.floor(subtotal * 0.18); // 18% GST
  const totalAmount = subtotal + convenienceFee + taxes;

  const handleProceedPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    if (selectedSeats.length !== totalTickets) {
      alert(`Please select exactly ${totalTickets} seat(s) to match your ticket count.\nCurrently selected: ${selectedSeats.length} seat(s)`);
      return;
    }
    
    const newBookingData = {
      theater: theater.name,
      movieTitle: 'Selected Movie', // You can pass this from props
      showtime: showtime.time,
      date: 'Today, 29 Nov 2025',
      selectedSeats,
      ticketCounts,
      totalAmount,
      subtotal,
      convenienceFee,
      taxes,
      bookingId: `BMS${Date.now()}`, // Generate unique booking ID
      status: 'confirmed'
    };
    
    setBookingData(newBookingData);
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setBookingData(null);
    onProceedPayment(bookingData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{theater?.name}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.showtimeInfo}>
          <span className={styles.time}>{showtime?.time}</span>
          <span className={styles.format}>{showtime?.format}</span>
          <span className={styles.date}>Today, 29 Nov 2025</span>
        </div>

        <div className={styles.content}>
          <div className={styles.leftPanel}>
            {/* Ticket Selection */}
            <div className={styles.ticketSelection}>
              <h3>Select Tickets</h3>
              
              <div className={styles.ticketType}>
                <div className={styles.ticketInfo}>
                  <span className={styles.ticketLabel}>Adult</span>
                  <span className={styles.ticketPrice}>₹{basePrice}</span>
                </div>
                <div className={styles.ticketCounter}>
                  <button 
                    onClick={() => handleTicketCountChange('adult', -1)}
                    className={styles.counterBtn}
                  >
                    -
                  </button>
                  <span className={styles.count}>{ticketCounts.adult}</span>
                  <button 
                    onClick={() => handleTicketCountChange('adult', 1)}
                    className={styles.counterBtn}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.ticketType}>
                <div className={styles.ticketInfo}>
                  <span className={styles.ticketLabel}>Child (3-12 yrs)</span>
                  <span className={styles.ticketPrice}>₹{childPrice}</span>
                </div>
                <div className={styles.ticketCounter}>
                  <button 
                    onClick={() => handleTicketCountChange('child', -1)}
                    className={styles.counterBtn}
                  >
                    -
                  </button>
                  <span className={styles.count}>{ticketCounts.child}</span>
                  <button 
                    onClick={() => handleTicketCountChange('child', 1)}
                    className={styles.counterBtn}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.ticketType}>
                <div className={styles.ticketInfo}>
                  <span className={styles.ticketLabel}>Senior (60+ yrs)</span>
                  <span className={styles.ticketPrice}>₹{seniorPrice}</span>
                </div>
                <div className={styles.ticketCounter}>
                  <button 
                    onClick={() => handleTicketCountChange('senior', -1)}
                    className={styles.counterBtn}
                  >
                    -
                  </button>
                  <span className={styles.count}>{ticketCounts.senior}</span>
                  <button 
                    onClick={() => handleTicketCountChange('senior', 1)}
                    className={styles.counterBtn}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className={styles.totalTickets}>
                Total: {totalTickets} ticket(s)
              </div>
            </div>

            {/* Seat Map */}
            <div className={styles.seatMap}>
              <h3>Select Seats</h3>
              
              <div className={styles.screen}>
                <div className={styles.screenLabel}>SCREEN</div>
              </div>
              
              <div className={styles.seatGrid}>
                {seatLayout.map((row, rowIndex) => (
                  <div key={rowIndex} className={styles.seatRow}>
                    <span className={styles.rowLabel}>{row[0].row}</span>
                    <div className={styles.seats}>
                      {row.map((seat) => (
                        <button
                          key={seat.id}
                          className={`${styles.seat} ${
                            !seat.isAvailable 
                              ? styles.occupied 
                              : selectedSeats.includes(seat.id)
                              ? styles.selected
                              : styles.available
                          }`}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={!seat.isAvailable}
                          title={seat.isAvailable ? `Seat ${seat.id} - ₹${seat.price}` : 'Occupied'}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                    <span className={styles.rowLabel}>{row[0].row}</span>
                  </div>
                ))}
              </div>
              
              <div className={styles.seatLegend}>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendSeat} ${styles.available}`}></span>
                  <span>Available</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendSeat} ${styles.selected}`}></span>
                  <span>Selected</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={`${styles.legendSeat} ${styles.occupied}`}></span>
                  <span>Occupied</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.bookingSummary}>
              <h3>Booking Summary</h3>
              
              <div className={styles.selectedSeatsInfo}>
                <h4>Selected Seats ({selectedSeats.length})</h4>
                {totalTickets > 0 && (
                  <div className={`${styles.seatRequirement} ${
                    selectedSeats.length === totalTickets ? styles.valid : styles.invalid
                  }`}>
                    {selectedSeats.length === totalTickets 
                      ? `✅ Perfect! ${selectedSeats.length} seat(s) selected for ${totalTickets} ticket(s)`
                      : selectedSeats.length < totalTickets
                      ? `📍 Select ${totalTickets - selectedSeats.length} more seat(s) (${selectedSeats.length}/${totalTickets} selected)`
                      : `⚠️ Too many seats! Please deselect ${selectedSeats.length - totalTickets} seat(s)`
                    }
                  </div>
                )}
                <div className={styles.seatsList}>
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map(seatId => (
                      <span key={seatId} className={styles.selectedSeat}>
                        {seatId}
                      </span>
                    ))
                  ) : (
                    <span className={styles.noSeats}>No seats selected</span>
                  )}
                </div>
              </div>

              <div className={styles.priceBreakdown}>
                <div className={styles.priceRow}>
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Convenience Fee</span>
                  <span>₹{convenienceFee}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Taxes & Fees</span>
                  <span>₹{taxes}</span>
                </div>
                <div className={`${styles.priceRow} ${styles.total}`}>
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button 
                className={styles.proceedButton}
                onClick={handleProceedPayment}
                disabled={selectedSeats.length === 0 || selectedSeats.length !== totalTickets}
              >
                {selectedSeats.length === 0 
                  ? 'Select Seats to Proceed'
                  : selectedSeats.length < totalTickets
                  ? `Select ${totalTickets - selectedSeats.length} More Seat(s)`
                  : selectedSeats.length > totalTickets
                  ? `Deselect ${selectedSeats.length - totalTickets} Seat(s)`
                  : 'Book Tickets'
                }
              </button>

              <div className={styles.cancellationPolicy}>
                <p className={styles.policyText}>
                  {showtime?.cancellable 
                    ? "✅ Cancellation available up to 20 minutes before show time"
                    : "❌ Non-cancellable"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Confirmation Popup */}
        <BookingConfirmation
          isOpen={showConfirmation}
          onClose={handleConfirmationClose}
          bookingData={bookingData}
        />
      </div>
    </div>
  );
};

export default SeatSelection;