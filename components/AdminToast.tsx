type AdminToastProps = {
  ok: boolean;
  text: string;
  onClose?: () => void;
};

/** Fixed top banner so save success/failure is always visible */
export default function AdminToast({ ok, text, onClose }: AdminToastProps) {
  if (!text) return null;

  return (
    <div
      className={`fixed right-4 top-4 z-[80] max-w-md rounded-xl px-4 py-3 text-sm shadow-lg sm:right-6 sm:top-6 ${
        ok
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border border-red-200 bg-red-50 text-red-800"
      }`}
      role="status"
    >
      <div className="flex items-start gap-3">
        <p className="flex-1 font-medium">{text}</p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-xs font-semibold uppercase tracking-wide opacity-70 hover:opacity-100"
          >
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
