import { wedding } from "@/content/wedding";
import { SectionHeading } from "./SectionHeading";

export function GuestThanks() {
  return (
    <section className="guest-thanks" id="danke" aria-labelledby="guest-title">
      <div className="guest-thanks__glow" aria-hidden="true" />
      <div className="page-shell guest-thanks__inner">
        <div className="guest-thanks__copy">
          <SectionHeading eyebrow={wedding.guests.eyebrow} title={wedding.guests.title} id="guest-title" inverse />
          <div className="guest-thanks__text">
            {wedding.guests.paragraphs.map((paragraph, index) => (
              <p className={index === 0 ? "guest-thanks__lead" : ""} key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <blockquote>{wedding.guests.highlight}</blockquote>
        </div>
      </div>
    </section>
  );
}
