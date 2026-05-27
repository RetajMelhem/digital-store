"use client";

import { Star } from "lucide-react";
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
    success: "شكرًا لك، تم إرسال تقييمك للمراجعة.",
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
    } catch {
      setFeedback(copy.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-premium backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="space-y-2">
        <span className="theme-chip">{locale === "ar" ? "رأيك يهمنا" : "Your feedback matters"}</span>
        <h3 className="text-2xl font-black text-foreground">{copy.title}</h3>
        <p className="text-sm leading-7 text-muted">
          {locale === "ar" ? "قيّم المنتج ثم أرسل اسمك فقط، وسيظهر التقييم بعد المراجعة." : "Choose a rating, add your name, and the review will appear after approval."}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[5, 4, 3, 2, 1].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
              rating === value ? "border-brand bg-brand text-[var(--color-text-inverse)] shadow-soft" : "border-line bg-surface text-muted hover:bg-surface-muted"
            }`}
          >
            <Star className="h-4 w-4" strokeWidth={1.9} />
            {value}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <RatingStars rating={rating} size="lg" rtl={locale === "ar"} />
      </div>

      <div className="mt-5">
        <label className="label">{copy.name}</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
      </div>

      <button className="btn-primary mt-6 h-12 w-full text-base" disabled={loading}>
        {loading ? copy.sending : copy.submit}
      </button>

      {feedback ? <p className="mt-4 text-sm leading-6 text-muted">{feedback}</p> : null}
    </form>
  );
}
