import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "next-i18next";

const StarRating = ({ rating, onRate, disabled }) => {
  const [hovered, setHovered] = useState(null);
  const displayValue = hovered !== null ? hovered : rating;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    let icon = "fa-star";
    let color = i <= Math.floor(displayValue) ? "#2bb3a3" : "#c3c3c3";
    if (hovered === null && i === Math.ceil(displayValue) && displayValue % 1 !== 0) {
      icon = "fa-star-half-alt";
      color = "#2bb3a3";
    }
    stars.push(
      <i
        key={i}
        className={`fa ${icon}`}
        style={{
          fontSize: 28,
          color,
          cursor: disabled ? "default" : "pointer",
          marginRight: 3,
          transition: "color 0.15s",
        }}
        onClick={() => !disabled && onRate(i)}
        onMouseEnter={() => !disabled && setHovered(i)}
        onMouseLeave={() => !disabled && setHovered(null)}
      ></i>
    );
  }
  return <span>{stars}</span>;
};

const GuidesAndClassificationCard = ({ title, imageSrc, link, id }) => {
  const { t } = useTranslation("common");
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [localAvgRating, setLocalAvgRating] = useState(0);
  const [localUserRating, setLocalUserRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Handle Rating Submission
  const handleRate = async (rating) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${baseUrl}V1/guides/rate`, {
        guide_id: id,
        rating,
      });
      if (res.data && typeof res.data.data.rating === "number") {
        setLocalAvgRating(res.data.data.rating);
      }
      setLocalUserRating(Number(rating));
    } catch (error) {
      console.error("Rating failed:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div
      className="card w-100"
      style={{
        height: "300px",
        marginBottom: "20px",
        border: "none",
        background: "transparent",
      }}
    >
      <div className="card-content">
        <div className="item" style={{ marginTop: "30px" }}>
          <div className="flip-card">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <div className="handouts-section">
                  <a href="#" style={{ cursor: "default" }}>
                    <div className="_title">
                      <h5
                        style={{
                          color: "white",
                          textAlign: "center",
                          fontSize: "16px",
                          minHeight: "45px",
                        }}
                      >
                        {title}
                      </h5>
                    </div>
                  </a>

                  <div className="hoverimage img-section">
                    <a target="_blank" rel="noopener noreferrer" href={link}>
                      <img
                        className="img-responsive attachment_ID"
                        src={imageSrc}
                        alt={title}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    </a>

                    {/* ⭐ Rating Icon */}
                    <i
                      className="fa fa-star"
                      style={{
                        fontSize: "18px",
                        color: "#c3c3c3",
                        float: "right",
                        marginTop: "-19px",
                        marginRight: "-18px",
                        position: "relative",
                        zIndex: 10,
                        cursor: "pointer",
                      }}
                      onClick={() => setShowRatingModal(true)}
                    ></i>
                  </div>
                </div>
              </div>
              {/* Flip-card-back (optional future use) */}
            </div>
          </div>
        </div>
      </div>

      {/* ⭐ Rating Modal */}
      {showRatingModal && (
        <div
          className="modal"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.3)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 10,
              maxWidth: 340,
              width: "90%",
              padding: 24,
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
              position: "relative",
              margin: 0,
            }}
          >
            <button
              onClick={() => setShowRatingModal(false)}
              style={{
                position: "absolute",
                right: 12,
                top: 8,
                border: "none",
                background: "none",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              &times;
            </button>
            <div
              style={{
                textAlign: "center",
                marginBottom: 12,
                fontWeight: 600,
                fontSize: 20,
              }}
            >
              {t("Rate_this_Item")}
            </div>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <StarRating
                rating={localUserRating || 0}
                onRate={handleRate}
                disabled={isSubmitting}
              />
            </div>
            <div style={{ textAlign: "center", color: "#555", fontSize: 14 }}>
              {t("Current_Rating")}: {localAvgRating.toFixed(2)}
            </div>
            {isSubmitting && (
              <div
                style={{
                  textAlign: "center",
                  color: "#2bb3a3",
                  marginTop: 8,
                  fontSize: 13,
                }}
              >
                {t("Submitting")}...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidesAndClassificationCard;
