// components/publications/PublicationCard.js
import React, { useState } from "react";
import axios from 'axios';
import { useTranslation } from "next-i18next";

const StarRating = ({ rating, onRate, disabled }) => {
  const [hovered, setHovered] = useState(null);
  // If hovering, always show full stars up to hovered
  const displayValue = hovered !== null ? hovered : rating;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let icon = "fa-star";
    let color = i <= Math.floor(displayValue) ? "#2bb3a3" : "#c3c3c3";
    // Show half star if not hovering and this is the fractional part
    if (hovered === null && i === Math.ceil(displayValue) && displayValue % 1 !== 0) {
      icon = "fa-star-half-alt";
      color = "#2bb3a3";
    }
    stars.push(
      <i
        key={i}
        className={`fa ${icon}`}
        style={{ fontSize: 32, color, cursor: disabled ? "default" : "pointer", marginRight: 2, transition: 'color 0.15s' }}
        onClick={() => !disabled && onRate(i)}
        onMouseEnter={() => !disabled && setHovered(i)}
        onMouseLeave={() => !disabled && setHovered(null)}
        data-testid={`star-${i}`}
      ></i>
    );
  }
  return <span>{stars}</span>;
};

const PublicationCard = ({sessionId, title, imageSrc, pdfUrl, id,avg_rating }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t } = useTranslation("common");
  // --- Rating modal state ---
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [localAvgRating, setLocalAvgRating] = useState(Number(avg_rating) || 0);
  const [localUserRating, setLocalUserRating] = useState(null); // user's last rating
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    // console.log(`Bookmark clicked for ID: ${id}`);
  };

  const handleRatingClick = () => {
    setShowRatingModal(true);
  };

  const handleImageClick = async () => {
    // console.log(`Image clicked for ID: ${id}`);
    try {
      await axios.put(`${baseUrl}V1/publications/views/${id}`);
      // console.log(`View recorded for ID: ${id}`);
    } catch (error) {
      console.error(`Failed to record view for ID: ${id}`, error);
    }
  };

  // --- Handle rating submission ---
  const handleRate = async (rating) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${baseUrl}V1/publication/rate`, {
        publication_id: id,
        session_id:sessionId,
        rating,
      });
      // Assume response contains new average rating
      if (res.data && typeof res.data.data.rating === 'number') {
        setLocalAvgRating(res.data.data.rating);
      }
      setLocalUserRating(Number(rating));
    } catch (error) {
      // Optionally show error
    }
    setIsSubmitting(false);
  };

  const closeModal = () => setShowRatingModal(false);

  return (
    <div className="card col-md-4">
      <div className="card-content">
        <div className="item" style={{ marginTop: "30px" }}>
          <div id={`NCSIPUB_${id}`} className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <div className="handouts-section">
                  <a href="#" style={{ cursor: "default" }}>
                    <div className="_title">
                      <h5 style={{ color: "white" }}>{title}</h5>
                    </div>
                  </a>
                  <div className="hoverimage img-section">
                    <a
                      href="#"
                      className="handleBookmark"
                      onClick={handleBookmarkClick}
                      data-bookmark-id={id}
                    >
                      <i
                        style={{ display: "none" }}
                        className="far fa-bookmark"
                        aria-hidden="true"
                      ></i>
                    </a>
                    <a target="_blank" rel="noopener noreferrer" href={pdfUrl}>
                      <img
                        className="img-responsive attachment_ID"
                        id={`attachment_${id}`}
                        src={imageSrc}
                        alt={title}
                        onClick={handleImageClick}
                      />
                    </a>
                    <i
                      className="fa fa-star"
                      style={{
                        fontSize: "18px",
                        color: "#c3c3c3",
                        float: "right",
                        marginTop: "-19px",
                        marginRight: "-18px",
                        cursor: "pointer",
                        position: "relative",
                        zIndex: 10,
                      }}
                      onClick={handleRatingClick}
                    ></i>
                  </div>
                </div>
              </div>
              {/* Flip-card-back (optional) */}
            </div>
          </div>
        </div>
      </div>
      {/* Rating Modal */}
      {showRatingModal && (
        <div className="modal" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: 10,
            maxWidth: 340,
            width: '90%',
            padding: 24,
            boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
            position: 'relative',
            margin: 0
          }}>
            <button onClick={closeModal} style={{ position: 'absolute', right: 12, top: 8, border: 'none', background: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
            <div style={{ textAlign: 'center', marginBottom: 12, fontWeight: 600, fontSize: 22 }}>
              {t('Rate_this_Item')}
            </div>
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <StarRating rating={localUserRating} onRate={handleRate} disabled={isSubmitting} />
            </div>
            <div style={{ textAlign: 'center', color: '#555', fontSize: 16 }}>
              {t('Current_Rating')}: {localAvgRating.toFixed(2)}
            </div>
            {isSubmitting && <div style={{ textAlign: 'center', color: '#2bb3a3', marginTop: 8 }}>Submitting...</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationCard;
