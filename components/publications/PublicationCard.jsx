// components/publications/PublicationCard.js
import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

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

const PublicationCard = ({ sessionId, title, imageSrc, pdfUrl, xlUrl, id, avg_rating }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { t } = useTranslation("common");
  const router = useRouter();
  const isRTL = router.locale === "ar";
  const imgBase = isRTL ? "/ar/assets/images" : "/assets/images";
  // --- Rating modal state ---
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [localAvgRating, setLocalAvgRating] = useState(Number(avg_rating) || 0);
  const [localUserRating, setLocalUserRating] = useState(null); // user's last rating
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Download overlay state ---
  const [showDownloadOverlay, setShowDownloadOverlay] = useState(false);
  const overlayRef = useRef(null);

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
      await axios.post(`${baseUrl}V1/publications/views/${id}`);
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
        session_id: sessionId,
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

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        setShowDownloadOverlay(false);
      }
    };
    if (showDownloadOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDownloadOverlay]);

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
                  <div className="hoverimage img-section" style={{ position: "relative" }}>
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

                    {/* Download icon – bare image, bottom-left */}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDownloadOverlay((prev) => !prev);
                      }}
                      style={{
                        position: "absolute",
                        bottom: "6px",
                        left: "6px",
                        zIndex: 20,
                        cursor: "pointer",
                        lineHeight: 0,
                      }}
                      title="Download"
                    >
                      <img
                        src={`${imgBase}/fa-solid_download.png`}
                        alt="Download"
                        style={{ width: "18px", height: "18px", objectFit: "contain" }}
                      />
                    </span>

                    {/* PDF / Excel overlay – shown on download icon click */}
                    {showDownloadOverlay && (
                      <div
                        ref={overlayRef}
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundColor: "rgba(160,160,160,0.82)",
                          zIndex: 15,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "16px",
                        }}
                      >
                        {/* PDF icon */}
                        {pdfUrl ? (
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download PDF"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "white",
                              borderRadius: "10px",
                              padding: "10px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              width: "62px",
                              height: "62px",
                            }}
                          >
                            <img
                              src={`${imgBase}/—Pngtree—pdf file icon png vector_7965915.png`}
                              alt="PDF"
                              style={{ width: "38px", height: "auto", objectFit: "contain" }}
                            />
                          </a>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "white",
                              borderRadius: "10px",
                              padding: "10px",
                              width: "62px",
                              height: "62px",
                              opacity: 0.45,
                              cursor: "not-allowed",
                            }}
                          >
                            <img
                              src={`${imgBase}/—Pngtree—pdf file icon png vector_7965915.png`}
                              alt="PDF"
                              style={{ width: "38px", height: "auto", objectFit: "contain" }}
                            />
                          </div>
                        )}

                        {/* Excel icon */}
                        {xlUrl ? (
                          <a
                            href={xlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download Excel"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "white",
                              borderRadius: "10px",
                              padding: "10px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              width: "62px",
                              height: "62px",
                            }}
                          >
                            <img
                              src={`${imgBase}/—Pngtree—xls file document icon_4172435.png`}
                              alt="Excel"
                              style={{ width: "38px", height: "auto", objectFit: "contain" }}
                            />
                          </a>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "white",
                              borderRadius: "10px",
                              padding: "10px",
                              width: "62px",
                              height: "62px",
                              opacity: 0.45,
                              cursor: "not-allowed",
                            }}
                          >
                            <img
                              src={`${imgBase}/—Pngtree—xls file document icon_4172435.png`}
                              alt="Excel"
                              style={{ width: "52px", height: "auto", objectFit: "contain" }}
                            />
                          </div>
                        )}
                      </div>
                    )}

{imageSrc ? (
  <a target="_blank" rel="noopener noreferrer" href={pdfUrl}>
    <img
      className="img-responsive attachment_ID"
      id={`attachment_${id}`}
      src={imageSrc}
      alt={title}
      onClick={handleImageClick}
    />
  </a>
) : (
  <div
    className="no-image flex items-center justify-center bg-[#d9d9d9]"
    style={{
      height: "160px",
      width: "100%",
      fontSize: "14px",
      color: "#555",
      textAlign: "center",
    }}
  >
    {t("no_image_available")}
  </div>
)}

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
