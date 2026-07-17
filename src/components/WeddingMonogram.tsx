type WeddingMonogramProps = {
  className?: string;
  compact?: boolean;
};

export function WeddingMonogram({ className = "", compact = false }: WeddingMonogramProps) {
  return (
    <span className={`monogram ${compact ? "monogram--compact" : ""} ${className}`} aria-hidden="true">
      <span>L</span>
      <i />
      <span>C</span>
    </span>
  );
}
