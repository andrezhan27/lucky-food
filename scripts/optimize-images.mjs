import { readdir, stat, rename, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Keep full-resolution originals out of public/ and the deployment bundle.
const source = path.resolve("assets/originals");
const output = path.resolve("public/images");
await mkdir(output, { recursive: true });
let before = 0;
let after = 0;
let count = 0;
for (const name of (await readdir(source)).sort()) {
  if (!/\.(png|jpe?g)$/i.test(name)) continue;
  const input = path.join(source, name);
  const destination = path.join(
    output,
    name.replace(/\.(png|jpe?g)$/i, ".webp"),
  );
  const temporary = `${destination}.tmp.webp`;
  const image = sharp(input).rotate();
  if (name === "logo.png") {
    await image.webp({ lossless: true, effort: 6 }).toFile(temporary);
  } else {
    await image
      .resize({
        width: 1920,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 84, effort: 6 })
      .toFile(temporary);
  }
  await rename(temporary, destination);
  before += (await stat(input)).size;
  after += (await stat(destination)).size;
  count++;
}
console.log(
  JSON.stringify(
    {
      images: count,
      originalBytes: before,
      webpBytes: after,
      reductionPercent: Number(((1 - after / before) * 100).toFixed(1)),
    },
    null,
    2,
  ),
);
