import { company } from "@/lib/constants";

export default function CallButton() {
  return (
    <a
      href={`tel:${company.phoneTel}`}
      aria-label="Call QHC"
      className="fixed right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white shadow-soft transition hover:scale-105 hover:bg-secondary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      style={{ bottom: "5.75rem" }}
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 5a2 2 0 012-2h3.3a1 1 0 01.95.68l1.2 3.5a1 1 0 01-.3 1.1L8.9 10.3a11 11 0 005 5l1.9-1.3a1 1 0 011.1-.1l3.5 1.2a1 1 0 01.7.95V19a2 2 0 01-2 2h-.5C9.6 21 3 14.4 3 6.5V6a1 1 0 010-1z"
        />
      </svg>
    </a>
  );
}
