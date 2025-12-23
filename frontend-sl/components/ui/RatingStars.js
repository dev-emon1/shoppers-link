"use client";
import React from "react";
import { Star } from "lucide-react";

const RatingStars = ({ rating = 0, size = 16 }) => {
  const filledStars = Math.floor(rating);
  const hasHalf = rating - filledStars >= 0.5;

  return (
    <div className="flex items-center gap-[2px]">
      {[...Array(5)].map((_, i) => {
        if (i < filledStars) {
          return (
            <Star key={i} size={size} className="fill-yellow text-yellow" />
          );
        } else if (i === filledStars && hasHalf) {
          return (
            <Star
              key={i}
              size={size}
              className="fill-yellow/50 text-yellow/50"
            />
          );
        } else {
          return <Star key={i} size={size} className="text-gray-300" />;
        }
      })}
      <span className="text-[12px] text-textSecondary ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default RatingStars;
