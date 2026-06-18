import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, size = 16 }) => {
  return (
    <div className="d-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => {
        if (rating >= i) return <FaStar key={i} size={size} className="star-rating" />;
        if (rating >= i - 0.5) return <FaStarHalfAlt key={i} size={size} className="star-rating" />;
        return <FaRegStar key={i} size={size} className="star-empty" />;
      })}
    </div>
  );
};

export default StarRating;
