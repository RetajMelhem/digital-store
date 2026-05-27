import { MessageCircle } from "lucide-react";

export function WhatsAppFloating() {
  const whatsappPhone = (process.env.WHATSAPP_PHONE || "962776323241").replace(/[^\d]/g, "");

  return (
    <a
      href={`https://wa.me/${whatsappPhone}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact support on WhatsApp"
      className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.4)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#1DA851] hover:shadow-[0_12px_40px_rgba(37,211,102,0.55)] md:inline-flex"
    >
      <MessageCircle className="h-7 w-7" strokeWidth={2} />
    </a>
  );
}
