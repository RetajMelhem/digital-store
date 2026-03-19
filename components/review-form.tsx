"use client";

import { useState } from "react";
import { RatingStars } from "@/components/rating-stars";
import { Locale } from "@/lib/constants";

const messages = {
  en: {
    title: "Write a review",
    name: "Your name",
    submit: "Submit review",
    sending: "Submitting...",
    success: "Thanks! Your review was sent for approval.",
    error: "Something went wrong. Please try again."
  },
  ar: {
    title: "أضف تقييمك",
    name: "اسمك",
    submit: "إرسال التقييم",
    sending: "جارٍ الإرسال...",
    success: "شكراً لك، تم إرسال تقييمك للمراجعة.",
    error: "حدث خطأ، حاول مرة أخرى."
  }
} as const;

export function ReviewForm({ locale, productId }: { locale: Locale; productId: string }) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const copy = messages[locale];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, name })
      });

      if (!response.ok) {
        throw new Error("Failed to save review");
      }

      setName("");
      setRating(5);
      setFeedback(copy.success);
      window.location.reload();
    } catch {
      setFeedback(copy.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-5 sm:p-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground">{copy.title}</h3>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                rating === value ? "border-brand bg-brand text-[var(--color-text-inverse)]" : "border-line bg-surface text-muted hover:bg-surface-muted"
              }`}
            >
              {value}★
            </button>
          ))}
        </div>
        <RatingStars rating={rating} size="lg" />
      </div>

      <div>
        <label className="label">{copy.name}</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
      </div>

      <button className="btn-primary h-12 w-full text-base" disabled={loading}>
        {loading ? copy.sending : copy.submit}
      </button>

      {feedback ? <p className="text-sm text-muted">{feedback}</p> : null}
    </form>
  );
}
