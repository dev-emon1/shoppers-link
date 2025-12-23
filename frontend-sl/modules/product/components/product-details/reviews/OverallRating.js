// modules/product/components/product-details/reviews/OverallRating.jsx
import { FaStar } from "react-icons/fa";

export default function OverallRating({ average, total, distribution }) {
  const roundedAvg = Number(average).toFixed(1);
  const percentage = (roundedAvg / 5) * 100;

  // 2π × 68 ≈ 426.7 → 427
  const circumference = 427;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-bgSurface border border-border p-4 lg:p-6 shadow-sm">
      {/* Heading */}
      <h3 className="text-xl font-semibold text-textPrimary mb-6 text-center md:text-left">
        Overall Ratings
      </h3>

      {/* 50% - 50% Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-center">
        {/* Left: Big Circular Rating */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 md:w-44 md:h-44 lg:w-48 lg:h-48">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="68"
                stroke="currentColor"
                strokeWidth="15"
                fill="none"
                className="text-gray-200"
              />

              {/* Progress Circle */}
              <circle
                cx="50%"
                cy="50%"
                r="68"
                stroke="currentColor"
                strokeWidth="15"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-main drop-shadow-md transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl lg:text-5xl font-bold text-textPrimary">
                {roundedAvg}
              </span>
              <span className="text-sm text-textLight mt-1">out of 5</span>
            </div>
          </div>

          {/* Stars + Review Count */}
          <div className="flex items-center gap-2 mt-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <FaStar
                  key={i}
                  size={20}
                  className={
                    i <= Math.round(roundedAvg)
                      ? "text-yellow"
                      : "text-textLight"
                  }
                />
              ))}
            </div>
            <span className="text-textSecondary font-medium text-lg">
              ({total})
            </span>
          </div>
        </div>

        {/* Right: Rating Bars */}
        <div className="space-y-4">
          {distribution.map(({ star, percent }) => (
            <div key={star} className="flex items-center gap-4">
              <span className="text-sm font-medium text-textSecondary w-5 text-left">
                {star}
              </span>

              <div className="flex-1 h-3.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-main rounded-full transition-all duration-800 ease-out shadow-sm"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <span className="text-sm font-medium text-textSecondary w-12 text-right">
                {percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
