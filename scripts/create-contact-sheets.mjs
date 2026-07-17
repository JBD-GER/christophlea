import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const mediaDirectory = path.resolve("media");
const outputDirectory = "/private/tmp/wedding-contact-sheets";
const columns = 8;
const rows = 6;
const cellWidth = 180;
const imageHeight = 210;
const labelHeight = 30;
const perSheet = columns * rows;

const files = (await readdir(mediaDirectory))
  .filter((file) => /\.jpe?g$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

await mkdir(outputDirectory, { recursive: true });

for (let offset = 0; offset < files.length; offset += perSheet) {
  const batch = files.slice(offset, offset + perSheet);
  const composites = [];

  for (const [index, file] of batch.entries()) {
    const left = (index % columns) * cellWidth;
    const top = Math.floor(index / columns) * (imageHeight + labelHeight);
    const thumbnail = await sharp(path.join(mediaDirectory, file))
      .rotate()
      .resize(cellWidth, imageHeight, { fit: "cover", position: "attention" })
      .jpeg({ quality: 76 })
      .toBuffer();
    const safeLabel = file.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
    const label = Buffer.from(`
      <svg width="${cellWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#201b1a"/>
        <text x="8" y="20" fill="#f5f0e8" font-family="Arial, sans-serif" font-size="13">${safeLabel}</text>
      </svg>
    `);

    composites.push({ input: thumbnail, left, top });
    composites.push({ input: label, left, top: top + imageHeight });
  }

  const sheetNumber = Math.floor(offset / perSheet) + 1;
  await sharp({
    create: {
      width: columns * cellWidth,
      height: rows * (imageHeight + labelHeight),
      channels: 3,
      background: "#eae0d3",
    },
  })
    .composite(composites)
    .jpeg({ quality: 84 })
    .toFile(path.join(outputDirectory, `sheet-${sheetNumber}.jpg`));
}

console.log(`${files.length} images written to ${outputDirectory}`);
