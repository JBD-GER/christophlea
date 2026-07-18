import { writeFile } from "node:fs/promises";

const debuggerPort = process.env.CHROME_DEBUG_PORT ?? "9222";
const baseUrl = process.env.PAGE_URL ?? "http://127.0.0.1:3000/";

const response = await fetch(`http://127.0.0.1:${debuggerPort}/json/new?${encodeURIComponent(baseUrl)}`, { method: "PUT" });
if (!response.ok) throw new Error(`Could not create Chrome page: ${response.status}`);
const target = await response.json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let messageId = 0;

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id) return;
  const request = pending.get(message.id);
  if (!request) return;
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});

function send(method, params = {}) {
  const id = ++messageId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function settlePage() {
  await wait(1200);
  await send("Runtime.evaluate", {
    expression: `document.documentElement.style.scrollBehavior = "auto"`,
  });
  await send("Runtime.evaluate", {
    expression: `(async () => {
      const image = document.querySelector('.hero__image');
      if (!image) return false;
      if (!image.complete) {
        await new Promise((resolve) => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
          setTimeout(resolve, 5000);
        });
      }
      if (!image.complete || !image.naturalWidth) return false;
      await Promise.race([
        image.decode().catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
      return image.naturalWidth > 0;
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
  screenWidth: 390,
  screenHeight: 844,
});
await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await send("Page.navigate", { url: baseUrl });
await settlePage();

const layoutMetrics = await send("Runtime.evaluate", {
  expression: `({ viewportWidth: innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth })`,
  returnByValue: true,
});
console.log("Mobile layout metrics:", layoutMetrics.result.value);

async function capture(name) {
  const result = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  await writeFile(`/private/tmp/${name}.png`, Buffer.from(result.data, "base64"));
}

await capture("wedding-mobile-cdp");

const gatePosition = await send("Runtime.evaluate", {
  expression: `(() => {
    const section = document.querySelector('#schlosstor');
    const distance = section.offsetHeight - innerHeight;
    scrollTo(0, section.offsetTop + distance * 0.47);
    return { sectionTop: section.offsetTop, distance, target: section.offsetTop + distance * 0.47 };
  })()`,
  returnByValue: true,
});
await wait(500);
const gateScroll = await send("Runtime.evaluate", { expression: `scrollY`, returnByValue: true });
console.log("Mobile gate position:", { ...gatePosition.result.value, scrollY: gateScroll.result.value });
await capture("wedding-gate-mobile");

await send("Runtime.evaluate", {
  expression: `document.querySelector('#galerie').scrollIntoView({ block: 'start', behavior: 'instant' })`,
});
await wait(500);
await capture("wedding-gallery-mobile");

await send("Runtime.evaluate", {
  expression: `document.querySelector('img[alt="Lea und Christoph gehen nach dem Ringtausch gemeinsam durch das Trauzimmer"]')?.closest('figure')?.scrollIntoView({ block: 'center', behavior: 'instant' })`,
});
await wait(500);
await capture("wedding-endlich-wir-mobile");

await send("Runtime.evaluate", {
  expression: `document.querySelector('img[alt="Lea und Christoph lächeln beim Empfang gemeinsam in die Kamera"]')?.closest('figure')?.scrollIntoView({ block: 'center', behavior: 'instant' })`,
});
await wait(500);
await capture("wedding-lachen-mobile");

await send("Runtime.evaluate", {
  expression: `document.querySelector('.gallery-archive').scrollIntoView({ block: 'start', behavior: 'instant' })`,
});
await wait(400);
await capture("wedding-archive-mobile");

const archiveBefore = await send("Runtime.evaluate", {
  expression: `({ images: document.images.length, figures: document.querySelectorAll('figure').length, expanded: document.querySelector('.gallery-archive button').getAttribute('aria-expanded') })`,
  returnByValue: true,
});
await send("Runtime.evaluate", { expression: `document.querySelector('.gallery-archive button').click()` });
await wait(500);
const archiveAfter = await send("Runtime.evaluate", {
  expression: `({ images: document.images.length, figures: document.querySelectorAll('figure').length, expanded: document.querySelector('.gallery-archive button').getAttribute('aria-expanded') })`,
  returnByValue: true,
});
await capture("wedding-archive-expanded-mobile");

await send("Runtime.evaluate", {
  expression: `([...document.querySelectorAll('.gallery-archive__grid .gallery-chapter h3')].find((heading) => heading.textContent === 'Unsere Familien und Freunde'))?.scrollIntoView({ block: 'start', behavior: 'instant' })`,
});
await wait(400);
await capture("wedding-archive-family-mobile");

await send("Runtime.evaluate", { expression: `document.querySelector('.gallery-archive button').click()` });
await wait(300);
console.log("Progressive archive metrics:", { before: archiveBefore.result.value, after: archiveAfter.result.value });

await send("Runtime.evaluate", {
  expression: `document.querySelector('.witness-card--1 .witness-card__image').scrollIntoView({ block: 'center', behavior: 'instant' })`,
});
await wait(400);
await capture("wedding-eva-mobile");

await send("Runtime.evaluate", {
  expression: `document.querySelector('.witness-card--2 .witness-card__image').scrollIntoView({ block: 'center', behavior: 'instant' })`,
});
await wait(400);
await capture("wedding-benny-mobile");

await send("Runtime.evaluate", {
  expression: `document.querySelector('.audio-player__start')?.click()`,
});
await wait(400);

await send("Runtime.evaluate", {
  expression: `document.querySelector('#danke').scrollIntoView({ block: 'start', behavior: 'instant' })`,
});
await wait(1500);
await capture("wedding-guests-mobile");

await send("Runtime.evaluate", {
  expression: `(() => {
    const section = document.querySelector('#unser-fuer-immer');
    scrollTo({ top: section.offsetTop + section.offsetHeight - innerHeight, behavior: 'instant' });
  })()`,
});
await wait(1500);
await capture("wedding-final-mobile");

const mobileFinalMetrics = await send("Runtime.evaluate", {
  expression: `(() => {
    const finalDate = document.querySelector('.final-message time').getBoundingClientRect();
    const player = document.querySelector('.audio-player').getBoundingClientRect();
    const pausePath = document.querySelector('.audio-player__play path');
    return {
      finalDate: { top: finalDate.top, bottom: finalDate.bottom },
      player: { top: player.top, bottom: player.bottom },
      overlaps: !(finalDate.right < player.left || finalDate.left > player.right || finalDate.bottom < player.top || finalDate.top > player.bottom),
      playLabel: document.querySelector('.audio-player__play')?.getAttribute('aria-label'),
      iconFill: pausePath ? getComputedStyle(pausePath).fill : null,
    };
  })()`,
  returnByValue: true,
});
console.log("Mobile final/audio metrics:", mobileFinalMetrics.result.value);

await send("Runtime.evaluate", {
  expression: `document.querySelector('.final-message__copy .monogram').scrollIntoView({ block: 'center', behavior: 'instant' })`,
});
await wait(400);
await capture("wedding-final-monogram-mobile");

await send("Runtime.evaluate", {
  expression: `document.querySelector('.site-footer').scrollIntoView({ block: 'end', behavior: 'instant' })`,
});
await wait(400);
await capture("wedding-footer-mobile");

console.log("Switching audit to desktop viewport.");
await send("Emulation.setTouchEmulationEnabled", { enabled: false });
await send("Emulation.clearDeviceMetricsOverride");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
  screenWidth: 1440,
  screenHeight: 1000,
});
console.log("Desktop viewport configured.");
await send("Page.navigate", { url: baseUrl });
console.log("Desktop navigation requested.");
await settlePage();
console.log("Desktop page settled.");

const desktopLayoutMetrics = await send("Runtime.evaluate", {
  expression: `({ viewportWidth: innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth })`,
  returnByValue: true,
});
console.log("Desktop layout metrics:", desktopLayoutMetrics.result.value);
await capture("wedding-desktop-cdp");

await send("Runtime.evaluate", {
  expression: `document.querySelector('#danke').scrollIntoView({ block: 'start', behavior: 'instant' })`,
});
await wait(1500);
await capture("wedding-guests-desktop");

await send("Runtime.evaluate", {
  expression: `document.querySelector('#unser-fuer-immer').scrollIntoView({ block: 'start', behavior: 'instant' })`,
});
await wait(2000);
const desktopFinalImage = await send("Runtime.evaluate", {
  expression: `(() => {
    const image = document.querySelector('.final-message__image');
    return { complete: image.complete, naturalWidth: image.naturalWidth, currentSrc: image.currentSrc, loading: image.loading };
  })()`,
  returnByValue: true,
});
console.log("Desktop final image:", desktopFinalImage.result.value);
await capture("wedding-final-desktop");

await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
await send("Emulation.setDeviceMetricsOverride", {
  width: 320,
  height: 568,
  deviceScaleFactor: 1,
  mobile: true,
  screenWidth: 320,
  screenHeight: 568,
});
await send("Page.navigate", { url: baseUrl });
await settlePage();
const smallMobileMetrics = await send("Runtime.evaluate", {
  expression: `(() => {
    const content = document.querySelector('.hero__content').getBoundingClientRect();
    const player = document.querySelector('.audio-player').getBoundingClientRect();
    return {
      viewportWidth: innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      content: { top: content.top, right: content.right, bottom: content.bottom, left: content.left },
      player: { top: player.top, right: player.right, bottom: player.bottom, left: player.left },
      overlaps: !(content.right < player.left || content.left > player.right || content.bottom < player.top || content.top > player.bottom),
    };
  })()`,
  returnByValue: true,
});
console.log("Small mobile metrics:", smallMobileMetrics.result.value);
await capture("wedding-mobile-small");

await send("Emulation.setDeviceMetricsOverride", {
  width: 844,
  height: 390,
  deviceScaleFactor: 1,
  mobile: true,
  screenWidth: 844,
  screenHeight: 390,
});
await send("Page.navigate", { url: baseUrl });
await settlePage();
const landscapeMetrics = await send("Runtime.evaluate", {
  expression: `({ viewportWidth: innerWidth, viewportHeight: innerHeight, documentWidth: document.documentElement.scrollWidth, heroHeight: document.querySelector('.hero').getBoundingClientRect().height })`,
  returnByValue: true,
});
console.log("Mobile landscape metrics:", landscapeMetrics.result.value);
await capture("wedding-mobile-landscape");

socket.close();
console.log("Responsive screenshots written to /private/tmp.");
