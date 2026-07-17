# Lea & Christoph – Hochzeits-Erinnerungen

Eine responsive Next.js-Single-Page für die standesamtliche Hochzeit am 18. Juli 2025 im Schloss Bückeburg.

## Entwicklung

```bash
npm install
npm run dev
```

Qualitätsprüfungen:

```bash
npm run typecheck
npm run lint
npm run build
```

## Inhalte und Medien

Alle persönlichen Texte, Zeitangaben, Bildpfade, Alt-Texte, Metadaten und Audioeinstellungen liegen zentral in:

`src/content/wedding.ts`

Die Website liefert ausschließlich lokale Medien aus `public/media` aus:

- `public/media/hero/` – Hero-Motiv
- `public/media/transition/` – Hintergrund und Reveal der Torsequenz
- `public/media/gallery/` – redaktionelle Galerie
- `public/media/witnesses/` – Bilder für Eva und Benjamin
- `public/media/guests/` – Familien- und Freunde-Collage
- `public/media/final/` – Abschlussmotiv
- `public/media/audio/` – Musikdatei
- `public/media/social/` – Open-Graph-Vorschaubild

Die hochauflösenden Originale in `media/` bleiben unverändert. `node scripts/prepare-media.mjs` erzeugt aus der kuratierten Auswahl weboptimierte WebP-Dateien und kopiert die MP3 in die öffentliche Struktur. Die Auswahl wird direkt im Skript gepflegt.

Zum manuellen Austauschen eines Motivs kann eine Datei unter demselben öffentlichen Pfad ersetzt werden. Bei einem neuen Dateinamen oder Seitenverhältnis werden zusätzlich `src`, `width`, `height`, `alt` und bei Bedarf `focalPoint` in `src/content/wedding.ts` angepasst.

Für absolute Social-Media-URLs kann beim Deployment `NEXT_PUBLIC_SITE_URL` auf die endgültige Domain gesetzt werden.
