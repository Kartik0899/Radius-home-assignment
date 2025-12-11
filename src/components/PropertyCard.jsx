import { useState, useEffect } from "react";
import "./PropertyCard.css";

const PropertyCard = ({ property, onFavoriteToggle }) => {
  // Initialize favorite state from sessionStorage
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(sessionStorage.getItem("favorites") || "[]");
    return favorites.includes(property.id);
  });

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const favorites = JSON.parse(sessionStorage.getItem("favorites") || "[]");
      setIsFavorite(favorites.includes(property.id));
    });
    return () => cancelAnimationFrame(rafId);
  }, [property.id]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(sessionStorage.getItem("favorites") || "[]");
    const newFavorites = isFavorite
      ? favorites.filter((id) => id !== property.id)
      : [...favorites, property.id];
    sessionStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    if (onFavoriteToggle) {
      onFavoriteToggle(property.id, !isFavorite);
    }
  };

  return (
    <div
      className="property-card"
      role="article"
      aria-label={`Property: ${property.title}`}
    >
      <div className="property-image-container">
        <img
          src={property.image}
          alt={property.title}
          className="property-image"
          loading="lazy"
        />
        <button
          className={`favorite-button ${isFavorite ? "favorited" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={
            isFavorite
              ? `Remove ${property.title} from favorites`
              : `Add ${property.title} to favorites`
          }
          aria-pressed={isFavorite}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isFavorite ? "#ef4444" : "none"}
            stroke={isFavorite ? "#ef4444" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div className="property-info">
        <h3 className="property-title">{property.title}</h3>
        <div className="property-location">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{property.location}</span>
        </div>
        <div className="property-price">
          ${property.price.toLocaleString()}/mo
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
