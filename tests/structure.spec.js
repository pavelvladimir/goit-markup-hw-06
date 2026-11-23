const fs = require("node:fs");
const { test, expect } = require("./support");

test("M1.1 M1.2 · semantic structure, headings and links", async ({ page }) => {
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  expect(await page.evaluate(() => document.characterSet)).toBe("UTF-8");
  expect(
    await page.locator("body > header, body > main, body > footer").evaluateAll((nodes) => nodes.map((n) => n.tagName)),
  ).toEqual(["HEADER", "MAIN", "FOOTER"]);
  await expect(page.locator("header#header nav")).toHaveCount(1);
  await expect(page.locator("nav")).toHaveCount(1);
  await expect(page.locator("nav .logo, nav address")).toHaveCount(0);
  await expect(page.locator("header address")).toHaveCount(1);
  await expect(page.locator("#footer")).toHaveCount(1);
  await expect(page.locator(".logo")).toHaveCount(2);
  for (const logo of await page.locator(".logo").all()) {
    await expect(logo).toHaveAttribute("href", "./index.html");
    await expect(logo.locator("span")).toHaveText("Web");
  }
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Effective Solutions for Your Business");
  await expect(page.locator("main section")).toHaveCount(4);
  expect(await page.locator("main section").evaluateAll((nodes) => nodes.map((n) => n.id))).toEqual([
    "hero",
    "features",
    "team",
    "portfolio",
  ]);
  await expect(page.locator("main h2")).toHaveText(["Our Features", "Our Team", "Our Portfolio"]);
  for (const name of ["Features", "Team", "Portfolio"]) {
    const link = page.getByRole("navigation").getByRole("link", { name });
    await link.click();
    await expect(page).toHaveURL(new RegExp("#" + name.toLowerCase() + "$"));
    await expect(link).toHaveAttribute("aria-current", "location");
  }
  await expect(page.locator("header address a")).toHaveText(["info@devstudio.com", "+11 (000) 111-11-11"]);
  await expect(page.locator("header address a").first()).toHaveAttribute("href", "mailto:info@devstudio.com");
  await expect(page.locator("header address a").last()).toHaveAttribute("href", "tel:+110001111111");
  await expect(page.getByRole("button", { name: "Order Service" })).toHaveAttribute("type", "button");
});

test("M1.2 M2.3 · all feature, team and portfolio cards match the content", async ({ page }) => {
  await expect(page.locator("#features ul > li h3")).toHaveText([
    "Strategy",
    "Punctuality",
    "Diligence",
    "Technologies",
  ]);
  await expect(page.locator("#team ul.team-list > li h3")).toHaveText([
    "Mark Guerrero",
    "Tom Ford",
    "Camila Garcia",
    "Daniel Wilson",
  ]);
  await expect(page.locator(".team-caption > p")).toHaveText([
    "Product Designer",
    "Frontend Developer",
    "Marketing",
    "UI Designer",
  ]);
  await expect(page.locator("#portfolio ul > li h3")).toHaveText([
    "Banking App",
    "Cashless Payment",
    "Meditation App",
    "Taxi Service",
    "Screen Illustrations",
    "Online Courses",
  ]);
  await expect(page.locator(".project-caption > p")).toHaveText([
    "App",
    "Marketing",
    "App",
    "Marketing",
    "Design",
    "Marketing",
  ]);
  const images = await page.locator("main img").evaluateAll((nodes) =>
    nodes.map((n) => ({
      alt: n.alt,
      src: n.getAttribute("src"),
      width: n.width,
      loaded: n.complete && n.naturalWidth > 0,
    })),
  );
  expect(images).toHaveLength(10);
  for (const image of images) {
    expect(image.src).toMatch(/^\.\/images\/[a-z]+-[1-6]\.jpg$/);
    expect(image.alt).toMatch(/^[A-Za-z][A-Za-z -]{8,}$/);
    expect(image.width).toBeGreaterThan(0);
    expect(image.loaded).toBe(true);
  }
});

test("M2.1 M2.2 M4.3 · project structure, CSS imports and conventions", async ({ page }) => {
  await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(1);
  await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute("href", "./css/main.css");
  await expect(page.locator("style, [style]")).toHaveCount(0);
  const order = ["common", "header", "hero", "features", "team", "portfolio", "footer", "modal", "mobile-menu"];
  const main = fs.readFileSync("css/main.css", "utf8");
  expect(main.trim().split(/\r?\n/)).toEqual(order.map((name) => '@import "./' + name + '.css";'));
  const styles = order.map((name) => fs.readFileSync("css/" + name + ".css", "utf8")).join("\n");
  expect(styles).not.toMatch(/!important|transition[^;{]*:\s*all\b|line-height:\s*[\d.]+px/);
  expect(styles).not.toMatch(/#[\w-]+\s*\{/);
  expect(styles).toMatch(/--motion:\s*250ms cubic-bezier\(0\.4, 0, 0\.2, 1\)/);
  for (const [, value] of styles.matchAll(/transition:\s*([^;]+);/g)) {
    for (const property of value.split(",")) expect(property.trim()).toMatch(/^[a-z-]+\s+var\(--motion\)$/);
  }
  expect(styles).toContain("./vendor/modern-normalize.min.css");
  expect(fs.readFileSync("css/vendor/modern-normalize.min.css", "utf8")).toContain("modern-normalize v3.0.1");
  const fontUrls = styles.match(/https:\/\/fonts\.googleapis\.com[^"]+/g);
  expect(fontUrls).toHaveLength(1);
  expect(fontUrls[0]).toMatch(/family=Raleway.*family=Roboto/);
  expect(fs.existsSync(".prettierrc")).toBe(true);
  const classes = await page.locator("[class]").evaluateAll((nodes) => nodes.flatMap((n) => Array.from(n.classList)));
  for (const name of classes) expect(name).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
  for (const folder of ["css", "images", "js", "fonts"]) {
    for (const file of fs.readdirSync(folder, { recursive: true })) expect(file).toMatch(/^[a-zA-Z0-9./-]+$/);
  }
  await expect(page.locator("body")).toHaveCSS("font-family", /Roboto.*sans-serif/);
  await expect(page.locator("body")).toHaveCSS("color", "rgb(67, 68, 85)");
  await expect(page.locator(".logo").first()).toHaveCSS("font-family", /Raleway/);
  await expect(page.locator("h1")).toHaveCSS("font-size", "56px");
  await expect(page.locator(".section-title").first()).toHaveCSS("font-size", "36px");
  await expect(page.locator(".card-title").first()).toHaveCSS("font-weight", "500");
  await expect(page.locator(".primary-button").first()).toHaveCSS("cursor", "pointer");
});

test("M3.1 M3.2 · desktop geometry, padding, flexbox and hidden heading", async ({ page }) => {
  for (const parent of ["header", "#hero", "#features", "#team", "#portfolio", "footer"]) {
    const container = page.locator(parent + " > .container");
    await expect(container).toHaveCSS("width", "1158px");
    await expect(container).toHaveCSS("padding-left", "15px");
  }
  for (const id of ["features", "team", "portfolio"]) {
    const section = page.locator("#" + id);
    await expect(section).toHaveClass(/\bsection\b/);
    await expect(section).toHaveCSS("margin-top", "0px");
    await expect(section).toHaveCSS("margin-bottom", "0px");
    await expect(section).toHaveCSS("padding-top", "120px");
    await expect(section).toHaveCSS("padding-bottom", "120px");
    await expect(section.locator(".container > ul")).toHaveCSS("display", "flex");
  }
  await expect(page.locator("header")).toHaveCSS("border-bottom-width", "1px");
  await expect(page.locator(".nav-link").first()).toHaveCSS("padding-top", "24px");
  await expect(page.locator(".header-content")).toHaveCSS("height", "72px");
  await expect(page.locator("#hero")).toHaveCSS("height", "600px");
  const heading = page.getByRole("heading", { name: "Our Features" });
  await expect(heading).toHaveCSS("width", "1px");
  await expect(heading).toHaveCSS("clip-path", "inset(100%)");
  await expect(page.locator(".project-caption").first()).toHaveCSS("border-top-width", "0px");
  await expect(page.locator(".project-caption").first()).toHaveCSS("border-bottom-width", "1px");
});

test("M4.1 · all SVG uses resolve to nonempty sprite symbols", async ({ page }) => {
  const icons = await page
    .locator("svg")
    .evaluateAll((nodes) =>
      nodes.map((svg) => [
        svg.getAttribute("width"),
        svg.getAttribute("height"),
        svg.getAttribute("fill"),
        svg.querySelector("use")?.getAttribute("href"),
      ]),
    );
  const symbols = await page.evaluate(async () => {
    const xml = new DOMParser().parseFromString(await (await fetch("./images/icons.svg")).text(), "image/svg+xml");
    return Array.from(xml.querySelectorAll("symbol"))
      .filter((s) => s.hasAttribute("viewBox") && s.querySelector("path"))
      .map((s) => s.id);
  });
  const used = new Set();
  for (const [width, height, fill, href] of icons) {
    expect(+width).toBeGreaterThan(0);
    expect(+height).toBeGreaterThan(0);
    expect(fill).toBe("currentColor");
    expect(href).toMatch(/^\.\/images\/icons\.svg#/);
    used.add(href.split("#")[1]);
  }
  expect([...used].sort()).toEqual(symbols.sort());
  await expect(page.locator(".feature-icon svg")).toHaveCount(4);
  await expect(page.locator(".team-card .social-link")).toHaveCount(16);
  await expect(page.locator("footer .social-link")).toHaveCount(4);
});
