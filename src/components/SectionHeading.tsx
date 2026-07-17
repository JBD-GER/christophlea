type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  id?: string;
  align?: "left" | "center";
  inverse?: boolean;
};

export function SectionHeading({ eyebrow, title, id, align = "center", inverse = false }: SectionHeadingProps) {
  return (
    <header className={`section-heading section-heading--${align} ${inverse ? "section-heading--inverse" : ""}`}>
      <span className="section-heading__eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      <span className="section-heading__rule" aria-hidden="true" />
    </header>
  );
}
