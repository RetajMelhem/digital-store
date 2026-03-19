import { cn } from "@/lib/utils";

const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

export function RatingStars({
  rating,
  className = "",
  size = "md",
  rtl = false
}: {
  rating: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  rtl?: boolean;
}) {
  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Rating ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const fill = Math.max(0, Math.min(1, rating - index));
        const gradientId = `star-${size}-${index}-${Math.round(rating * 10)}`;

        return (
          <svg key={gradientId} viewBox="0 0 24 24" className={cn(iconSize, "shrink-0")} aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1={rtl ? "100%" : "0%"} y1="0%" x2={rtl ? "0%" : "100%"} y2="0%">
                <stop offset={`${fill * 100}%`} stopColor="#fbbf24" />
                <stop offset={`${fill * 100}%`} stopColor="#cbd5e1" />
              </linearGradient>
            </defs>
            <path d={STAR_PATH} fill={`url(#${gradientId})`} />
          </svg>
        );
      })}
    </div>
  );
}
