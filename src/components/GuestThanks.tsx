import Image from "next/image";
import type { CSSProperties } from "react";
import { wedding } from "@/content/wedding";
import { SectionHeading } from "./SectionHeading";

export function GuestThanks() {
  const collageImages = wedding.guests.images.slice(0, 3);
  const galleryImages = wedding.guests.images.slice(3);

  return (
    <section className="guest-thanks" id="danke" aria-labelledby="guest-title">
      <div className="guest-thanks__glow" aria-hidden="true" />
      <div className="page-shell guest-thanks__inner">
        <div className="guest-collage" aria-label="Erinnerungen mit Familie und Freunden">
          {collageImages.map((image, index) => (
            <div className={`guest-collage__image guest-collage__image--${index + 1}`} key={image.src}>
              <Image src={image.src} alt={image.alt} fill sizes="(max-width: 780px) 78vw, 32vw" quality={85} />
            </div>
          ))}
          <span className="guest-collage__stamp" aria-hidden="true">L & C<br />18·07·25</span>
        </div>

        <div className="guest-thanks__copy">
          <SectionHeading eyebrow={wedding.guests.eyebrow} title={wedding.guests.title} id="guest-title" align="left" inverse />
          <div className="guest-thanks__text">
            {wedding.guests.paragraphs.map((paragraph, index) => (
              <p className={index === 0 ? "guest-thanks__lead" : ""} key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <blockquote>{wedding.guests.highlight}</blockquote>
        </div>
      </div>

      <div className="page-shell guest-gallery" aria-labelledby="guest-gallery-title">
        <div className="guest-gallery__intro">
          <span>Mit euch</span>
          <h3 id="guest-gallery-title">{wedding.guests.galleryTitle}</h3>
          <p>Erinnerungen an all die Menschen, die diesen Tag mit uns getragen haben.</p>
        </div>

        <div className="guest-gallery__grid">
          {galleryImages.map((image, index) => {
            const orientation = image.height > image.width ? "portrait" : "landscape";
            const featured = index === 3 || index === 8 ? " guest-gallery__item--featured" : "";

            return (
              <figure
                className={`guest-gallery__item guest-gallery__item--${orientation}${featured}`}
                key={image.src}
                style={{ "--guest-image-ratio": `${image.width} / ${image.height}` } as CSSProperties}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 780px) 92vw, (max-width: 1180px) 46vw, 31vw"
                  quality={84}
                />
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
