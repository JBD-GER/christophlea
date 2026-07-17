"use client";

import Image from "next/image";
import { Fragment, type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { wedding, type GalleryImage } from "@/content/wedding";
import { SectionHeading } from "./SectionHeading";

const images: readonly GalleryImage[] = wedding.gallery.images;
const indexedImages = images.map((image, index) => ({ image, index }));
const featuredImages = indexedImages.filter(({ image }) => !image.id.startsWith("archive-"));
const editorialImages = featuredImages.filter(({ image }) => image.layout !== "film");
const filmImages = featuredImages.filter(({ image }) => image.layout === "film");
const archiveImages = indexedImages.filter(({ image }) => image.id.startsWith("archive-"));

export function WeddingGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [archiveExpanded, setArchiveExpanded] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const swipeStartRef = useRef<number | null>(null);
  const isOpen = selectedIndex !== null;

  const close = useCallback(() => setSelectedIndex(null), []);
  const previous = useCallback(() => setSelectedIndex((current) => current === null ? null : (current - 1 + images.length) % images.length), []);
  const next = useCallback(() => setSelectedIndex((current) => current === null ? null : (current + 1) % images.length), []);

  const open = (index: number, trigger: HTMLElement) => {
    restoreFocusRef.current = trigger;
    setSelectedIndex(index);
  };

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("lightbox-open");
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])",
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKeyDown);
      restoreFocusRef.current?.focus();
    };
  }, [close, isOpen, next, previous]);

  return (
    <section className="gallery-section" id="galerie" aria-labelledby="gallery-title">
      <div className="gallery-intro page-shell">
        <SectionHeading eyebrow={wedding.gallery.eyebrow} title={wedding.gallery.title} id="gallery-title" />
        <p className="gallery-intro__lead">{wedding.gallery.intro}</p>
        <p className="gallery-intro__body">{wedding.gallery.body}</p>
        <p
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.65rem",
            margin: "2rem auto 0",
            padding: "0.55rem 0.2rem",
            borderBlock: "1px solid rgb(175 147 98 / 45%)",
            color: "var(--color-muted)",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <strong
            style={{
              color: "var(--color-burgundy)",
              fontFamily: "var(--font-display)",
              fontSize: "1.65rem",
              fontWeight: 500,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            {images.length}
          </strong>
          einzigartige Aufnahmen
        </p>
      </div>

      <EditorialGallery items={editorialImages} onOpen={open} />

      <blockquote className="gallery-quote page-shell">
        <span aria-hidden="true">“</span>
        <p>Für einen Augenblick stand die Zeit still. Die Bilder haben ihn für uns bewahrt.</p>
      </blockquote>

      <div className="filmstrip-wrap">
        <div className="filmstrip-heading page-shell">
          <span>Kapitel VI</span>
          <h3>Für immer festgehalten</h3>
          <p>Fünf kleine Ausschnitte. Ein großes Gefühl.</p>
        </div>
        <div className="filmstrip" aria-label="Horizontaler fotografischer Filmstreifen">
          {filmImages.map(({ image, index }) => (
            <GalleryButton image={image} index={index} onOpen={open} key={`${image.id}-${index}`} />
          ))}
        </div>
      </div>

      <div className={`gallery-archive ${archiveExpanded ? "gallery-archive--expanded" : ""}`}>
        <div className="gallery-archive__intro page-shell">
          <span>Das vollständige Fotoarchiv</span>
          <h3>Jeder Augenblick gehört dazu.</h3>
          <p>Von den großen Momenten bis zu den kleinen Gesten: Hier findet ihr jede weitere Aufnahme dieses Tages.</p>
          <button
            type="button"
            aria-expanded={archiveExpanded}
            aria-controls="vollstaendiges-fotoarchiv"
            onClick={() => setArchiveExpanded((expanded) => !expanded)}
          >
            {archiveExpanded ? "Fotoarchiv schließen" : "Vollständiges Fotoarchiv öffnen"}
            <i aria-hidden="true" />
          </button>
        </div>
        <div id="vollstaendiges-fotoarchiv" hidden={!archiveExpanded}>
          {archiveExpanded && <EditorialGallery items={archiveImages} onOpen={open} archive />}
        </div>
      </div>

      {selectedIndex !== null && (
        <div
          className="lightbox"
          role="presentation"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            className="lightbox__dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Bild ${selectedIndex + 1} von ${images.length}`}
            onPointerDown={(event) => {
              if (event.pointerType === "touch") swipeStartRef.current = event.clientX;
            }}
            onPointerUp={(event) => {
              if (event.pointerType !== "touch" || swipeStartRef.current === null) return;
              const distance = event.clientX - swipeStartRef.current;
              swipeStartRef.current = null;
              if (Math.abs(distance) < 48) return;
              if (distance > 0) previous(); else next();
            }}
          >
            <button className="lightbox__close" ref={closeButtonRef} type="button" onClick={close} aria-label="Lightbox schließen">
              <CloseIcon />
            </button>
            <button className="lightbox__nav lightbox__nav--previous" type="button" onClick={previous} aria-label="Vorheriges Bild">
              <ArrowIcon />
            </button>
            <figure className="lightbox__figure">
              <div className="lightbox__image-wrap">
                <Image
                  key={images[selectedIndex].src}
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt}
                  fill
                  sizes="(max-width: 780px) 100vw, 90vw"
                  quality={92}
                  priority
                  style={{ objectFit: "contain" }}
                />
              </div>
              <figcaption>
                <span>{String(selectedIndex + 1).padStart(2, "0")} / {images.length}</span>
                <p>{images[selectedIndex].caption ?? images[selectedIndex].chapter}</p>
              </figcaption>
            </figure>
            <button className="lightbox__nav lightbox__nav--next" type="button" onClick={next} aria-label="Nächstes Bild">
              <ArrowIcon />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

type IndexedGalleryImage = {
  image: GalleryImage;
  index: number;
};

type EditorialGalleryProps = {
  items: readonly IndexedGalleryImage[];
  onOpen: (index: number, trigger: HTMLElement) => void;
  archive?: boolean;
};

function EditorialGallery({ items, onOpen, archive = false }: EditorialGalleryProps) {
  return (
    <div className={`editorial-gallery page-shell${archive ? " gallery-archive__grid" : ""}`}>
      {items.map(({ image, index }, editorialIndex) => {
        const showChapter = image.chapter !== items[editorialIndex - 1]?.image.chapter;
        return (
          <Fragment key={`${image.id}-${index}`}>
            {showChapter && (
              <div className="gallery-chapter">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{image.chapter}</h3>
              </div>
            )}
            <GalleryButton image={image} index={index} onOpen={onOpen} />
          </Fragment>
        );
      })}
    </div>
  );
}

type GalleryButtonProps = {
  image: GalleryImage;
  index: number;
  onOpen: (index: number, trigger: HTMLElement) => void;
};

function GalleryButton({ image, index, onOpen }: GalleryButtonProps) {
  const sizes = image.layout === "full" || image.layout === "wide"
    ? "(max-width: 780px) 100vw, 92vw"
    : "(max-width: 780px) 100vw, 48vw";

  return (
    <figure
      className={`gallery-card gallery-card--${image.layout}`}
      style={{ "--image-ratio": `${image.width} / ${image.height}` } as CSSProperties}
    >
      <button type="button" onClick={(event) => onOpen(index, event.currentTarget)} aria-label={`${image.alt} – in Großansicht öffnen`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          quality={86}
          style={{ objectPosition: image.focalPoint }}
        />
        <span className="gallery-card__index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <span className="gallery-card__expand" aria-hidden="true"><i /><i /></span>
      </button>
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>;
}
