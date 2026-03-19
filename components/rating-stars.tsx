import { cn } from "@/lib/utils";

export function RatingStars({ rating, className = "", size = "md" }: { rating: number; className?: string; size?: "sm" | "md" | "lg" }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const starSize = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Rating ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < fullStars;
        const half = index === fullStars && hasHalfStar;

        return (
          <span key={index} className={cn("leading-none", starSize, filled || half ? "text-amber-400" : "text-slate-300")}>
            {half ? "⯪" : "★"}
          </span>
        );
      })}
    </div>
  );
}
