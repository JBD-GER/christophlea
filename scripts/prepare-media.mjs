import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceRoot = path.resolve("media");
const publicRoot = path.resolve("public/media");

const images = [
  ["IMG_7584.JPG", "hero/hero-couple.webp", 2800, 86],
  ["IMG_7420.JPG", "transition/castle-background.webp", 2200, 86],
  ["IMG_7454.JPG", "transition/bride-reveal.webp", 2400, 86],
  ["IMG_7308 2.JPG", "gallery/01-schloss.webp", 2200, 84],
  ["IMG_7325 2.JPG", "gallery/02-trausaal.webp", 2200, 85],
  ["IMG_7320.JPG", "gallery/03-ankunft.webp", 2000, 85],
  ["IMG_7185.JPG", "gallery/04-aufregung.webp", 2000, 85],
  ["IMG_7186.JPG", "gallery/05-erster-kuss.webp", 2200, 86],
  ["IMG_7264.JPG", "gallery/06-regen.webp", 2200, 84],
  ["IMG_7326.JPG", "gallery/07-ja-wort.webp", 2200, 86],
  ["IMG_7362.JPG", "gallery/08-kuss.webp", 2000, 86],
  ["IMG_7386.JPG", "gallery/09-unterschrift-lea.webp", 2200, 85],
  ["IMG_7399.JPG", "gallery/10-unterschrift-christoph.webp", 2200, 85],
  ["IMG_7418.JPG", "gallery/11-applaus.webp", 2200, 85],
  ["IMG_7425 3.JPG", "gallery/12-ring.webp", 2200, 86],
  ["IMG_7432.JPG", "gallery/13-endlich-wir.webp", 2000, 86],
  ["IMG_7449.JPG", "gallery/14-spalier.webp", 2200, 85],
  ["IMG_7454.JPG", "gallery/15-freude.webp", 2400, 86],
  ["IMG_7473.JPG", "gallery/16-sommerregen.webp", 2000, 85],
  ["IMG_7500.JPG", "gallery/17-paar-beim-empfang.webp", 2200, 86],
  ["IMG_7492.JPG", "gallery/18-umarmung.webp", 2000, 85],
  ["IMG_7504.JPG", "gallery/19-sekt.webp", 2200, 85],
  ["IMG_7534 3.JPG", "gallery/20-festsaal.webp", 2000, 87],
  ["IMG_7549.JPG", "gallery/21-schlossgarten.webp", 2200, 86],
  ["IMG_7584.JPG", "gallery/22-schlosstor.webp", 2400, 87],
  ["IMG_7598.JPG", "gallery/23-ganz-nah.webp", 2200, 87],
  ["IMG_7645.JPG", "gallery/24-brautstrauss.webp", 2000, 86],
  ["enhanced/eva-enhanced-v2.png", "witnesses/eva.webp", 1023, 96],
  ["enhanced/benjamin-enhanced-v2.png", "witnesses/benjamin.webp", 1023, 96],
  ["IMG_7534 3.JPG", "final/final-couple.webp", 2400, 88],
];

for (const [source, destination, width, quality] of images) {
  const output = path.join(publicRoot, destination);
  const isWitnessPortrait = destination.startsWith("witnesses/");
  await mkdir(path.dirname(output), { recursive: true });
  await sharp(path.join(sourceRoot, source))
    .rotate()
    .resize({ width, withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
    .webp({ quality, effort: isWitnessPortrait ? 6 : 5, smartSubsample: true })
    .toFile(output);
}

const featuredSources = new Set(
  images
    .filter(([, destination]) => destination.startsWith("gallery/"))
    .map(([source]) => source),
);

const sourcePhotos = (await readdir(sourceRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && /\.jpe?g$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort((left, right) => photoSortKey(left) - photoSortKey(right) || left.localeCompare(right, "de", { numeric: true }));

const uniqueSourcePhotos = [];
const seenHashes = new Set();
for (const source of sourcePhotos) {
  const file = await readFile(path.join(sourceRoot, source));
  const hash = createHash("sha256").update(file).digest("hex");
  if (seenHashes.has(hash)) continue;
  seenHashes.add(hash);
  uniqueSourcePhotos.push(source);
}

const archivePhotos = uniqueSourcePhotos.filter((source) => !featuredSources.has(source));
const archiveDirectory = path.join(publicRoot, "archive");
await rm(archiveDirectory, { recursive: true, force: true });
await mkdir(archiveDirectory, { recursive: true });
const generatedGallery = [];

for (const [index, source] of archivePhotos.entries()) {
  const chapter = chapterFor(source);
  if (chapter === null) continue;

  const sequence = index + featuredSources.size + 1;
  const slug = slugify(path.parse(source).name);
  const fileName = `${String(sequence).padStart(3, "0")}-${slug}.webp`;
  const output = path.join(archiveDirectory, fileName);
  const info = await sharp(path.join(sourceRoot, source))
    .rotate()
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 80, effort: 4, smartSubsample: true })
    .toFile(output);
  generatedGallery.push({
    id: `archive-${String(sequence).padStart(3, "0")}-${slug}`,
    src: `/media/archive/${fileName}`,
    alt: altFor(chapter, sequence),
    width: info.width,
    height: info.height,
    chapter,
    layout: layoutFor(info.width, info.height, index),
  });
}

const archiveChapterOrder = new Map([
  ["", 0],
  ["Unser Ja-Wort", 1],
  ["Das Versprechen", 2],
  ["Freude vor dem Schloss", 3],
  ["Endlich wir", 4],
  ["Unsere Familien und Freunde", 5],
]);
generatedGallery.sort((left, right) =>
  (archiveChapterOrder.get(left.chapter) ?? 99) - (archiveChapterOrder.get(right.chapter) ?? 99),
);

const generatedModule = `import type { GalleryImage } from "./wedding";\n\n` +
  `// Generated by scripts/prepare-media.mjs from every non-featured JPG/JPEG in media/.\n` +
  `export const allGalleryImages = ${JSON.stringify(generatedGallery, null, 2)} as const satisfies readonly GalleryImage[];\n`;
await writeFile(path.resolve("src/content/gallery.generated.ts"), generatedModule, "utf8");

await mkdir(path.join(publicRoot, "social"), { recursive: true });
await sharp(path.join(sourceRoot, "IMG_7584.JPG"))
  .rotate()
  .resize(1200, 630, { fit: "cover", position: "center" })
  .jpeg({ quality: 88, progressive: true })
  .toFile(path.join(publicRoot, "social/og-lea-christoph.jpg"));

await mkdir(path.join(publicRoot, "audio"), { recursive: true });
await copyFile(
  path.join(sourceRoot, "Give-Me-Everything-Cover-by-Archer-Marsh-Bridgerton-Season-3-Netflix-Series.mp3"),
  path.join(publicRoot, "audio/unser-lied.mp3"),
);

console.log(`${featuredSources.size + generatedGallery.length} photos are represented in the gallery (${featuredSources.size} featured + ${generatedGallery.length} archive).`);
console.log(`${archivePhotos.length - generatedGallery.length} archive photos from removed chapters were omitted.`);
console.log(`${sourcePhotos.length - uniqueSourcePhotos.length} exact duplicate exports were detected and omitted.`);
console.log(`${images.length} section assets and the audio file are ready in public/media.`);

function sourceNumber(fileName) {
  const match = fileName.match(/IMG_(\d+)/i);
  return match ? Number(match[1]) : 9000;
}

function photoSortKey(fileName) {
  const number = sourceNumber(fileName);
  return number < 7000 ? number + 8000 : number;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function chapterFor(fileName) {
  const number = sourceNumber(fileName);
  if (number >= 7168 && number <= 7311) return "";
  if (number >= 7317 && number <= 7374) return "Unser Ja-Wort";
  if (number >= 7375 && number <= 7446) return "Das Versprechen";
  if (number >= 7449 && number <= 7523) return "Freude vor dem Schloss";
  if (number >= 7534 && number <= 7645) return "Endlich wir";
  if (number >= 7647 && number <= 7766) return "Unsere Familien und Freunde";
  return null;
}

function templatesFor(chapter) {
  const altTemplates = {
  "": [
    "Ein stiller Moment vor der Trauung im Schloss Bückeburg",
    "Lea, Christoph und ihre Gäste vor Beginn der Trauung",
    "Ankunft und Vorfreude am Morgen der Hochzeit",
  ],
  "Unser Ja-Wort": [
    "Lea und Christoph während ihrer standesamtlichen Trauung",
    "Ein Moment im historischen Trauzimmer von Schloss Bückeburg",
    "Familie und Freunde begleiten Lea und Christoph bei ihrem Ja-Wort",
  ],
  "Das Versprechen": [
    "Ein emotionaler Augenblick während der Trauung von Lea und Christoph",
    "Lea und Christoph nach ihrem Ja-Wort im Trauzimmer",
    "Ein festgehaltener Moment voller Freude im Schloss",
  ],
  "Freude vor dem Schloss": [
    "Lea und Christoph feiern vor dem Schloss mit ihren Gästen",
    "Glückwünsche, Umarmungen und Lachen nach der Trauung",
    "Familie und Freunde teilen die Freude des Brautpaares",
  ],
  "Endlich wir": [
    "Lea und Christoph bei ihren Hochzeitsportraits im Schloss Bückeburg",
    "Ein inniger Moment von Lea und Christoph nach der Trauung",
    "Das Brautpaar vor der historischen Kulisse des Schlosses",
  ],
  "Unsere Familien und Freunde": [
    "Lea und Christoph gemeinsam mit Familie und Freunden",
    "Ein Gruppenportrait mit Menschen, die den Hochzeitstag begleitet haben",
    "Familie, Freunde und das Brautpaar im Schlossgarten",
  ],
  };

  return altTemplates[chapter];
}

function altFor(chapter, sequence) {
  const templates = templatesFor(chapter);
  return `${templates[sequence % templates.length]} – Aufnahme ${String(sequence).padStart(3, "0")}`;
}

function layoutFor(width, height, index) {
  const ratio = width / height;
  if (index % 19 === 0) return "full";
  if (ratio < 0.82) return "portrait";
  if (index % 9 === 0) return "quiet";
  if (index % 4 === 0) return "wide";
  return "standard";
}
