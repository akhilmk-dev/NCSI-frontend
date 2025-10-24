import React from "react";
import { useTranslation } from "next-i18next";

const GuidesAndClassificationCard = ({ title, imageSrc, link }) => {
  const { t } = useTranslation("common");

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
                    <i
                      className="fa fa-book"
                      style={{
                        fontSize: "18px",
                        color: "#c3c3c3",
                        float: "right",
                        marginTop: "-19px",
                        marginRight: "-18px",
                        position: "relative",
                        zIndex: 10,
                      }}
                    ></i>
                  </div>
                </div>
              </div>
              {/* Flip-card-back (optional future use) */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidesAndClassificationCard;
