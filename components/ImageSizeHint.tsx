type ImageSizeHintProps = {
  size: string;
  note?: string;
};

/** Shown next to admin image uploads so designers get exact export sizes. */
export default function ImageSizeHint({ size, note }: ImageSizeHintProps) {
  return (
    <p className="mb-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs leading-relaxed text-slate-700">
      <span className="font-semibold text-primary">Designer size:</span>{" "}
      <span className="font-mono font-semibold text-slate-900">{size}</span>
      {note ? <span className="text-slate-500"> — {note}</span> : null}
    </p>
  );
}
