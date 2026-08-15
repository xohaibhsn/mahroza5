import { company } from "@/lib/constants";

export default function WhatsAppButton() {
  return (
    <a
      href={company.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:scale-105 hover:bg-[#1ebe57] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.7 15l-1.1 4 4.1-1.1A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.7 12.4l.3.5-.4.3a8 8 0 0 1-11.5-1.4l-.4-.5.1-.6.7-2.5-.5-.4A8 8 0 0 1 12 4zm4.3 9.6c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1l-.7.9c-.1.1-.3.2-.5.1-.2-.1-.9-.3-1.7-1.1-.6-.6-1.1-1.3-1.2-1.5-.1-.2 0-.4.1-.5l.4-.5c.1-.1.1-.3.1-.4 0-.1 0-.3-.1-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4 2.3.9 2.3.6 2.7.6.4 0 1.3-.5 1.5-1 .2-.5.2-.9.1-1-.1-.1-.2-.1-.4-.2z" />
      </svg>
    </a>
  );
}
