import { useState } from "react";
import { Star } from "lucide-react";

/**
 * Reusable star rating component.
 * - Display mode: shows read-only stars
 * - Interactive mode: clickable stars for input
 */
const StarRating = ({
  value = 0,
  onChange,
  size = 20,
  interactive = false,
  showLabel = false,
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  const labels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= displayValue;
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(star)}
              onMouseEnter={() => interactive && setHoverValue(star)}
              onMouseLeave={() => interactive && setHoverValue(0)}
              className={
                interactive
                  ? "transition-transform hover:scale-110 cursor-pointer"
                  : "cursor-default"
              }
            >
              <Star
                size={size}
                className={
                  filled
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-surface-300"
                }
              />
            </button>
          );
        })}
      </div>
      {showLabel && displayValue > 0 && (
        <span className="text-sm font-medium text-surface-700">
          {labels[displayValue]}
        </span>
      )}
    </div>
  );
};

export default StarRating;