export type ReviewSummaryInput = {
  rating: number;
}[];

export function getReviewSummary(reviews: ReviewSummaryInput) {
  if (!reviews.length) {
    return {
      totalCount: 0,
      average: 0
    };
  }

  const totalRealRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const totalCount = reviews.length;
  const average = Number((totalRealRatings / totalCount).toFixed(1));

  return {
    totalCount,
    average
  };
}

export function formatReviewCount(count: number, locale: "ar" | "en") {
  return new Intl.NumberFormat(locale).format(count);
}
