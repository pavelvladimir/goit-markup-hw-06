const fs = require("node:fs");
const { test, expect } = require("./support");

test("M6.1 M4.2 · no overflow, expected columns and overlay at every breakpoint", async ({ page }) => {
  await expect(page.locator("meta[name=viewport]")).toHaveAttribute("content", /width=device-width/);
  for (const width of [320, 375, 767, 768, 1024, 1157, 1158, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const actual = await page.evaluate(() => {
      const firstRow = (selector) => {
        const boxes = Array.from(document.querySelectorAll(selector), (el) => el.getBoundingClientRect());
        return boxes.filter((box) => box.top === boxes[0].top).length;
      };
      return {
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
        features: firstRow(".feature-card"),
        team: firstRow(".team-card"),
        projects: firstRow(".project-card"),
        teamWidths: Array.from(document.querySelectorAll(".team-card"), (el) => el.getBoundingClientRect().width),
      };
    });
    expect(actual.content, "horizontal overflow at " + width).toBe(actual.viewport);
    expect(actual.teamWidths).toEqual([264, 264, 264, 264]);
    expect(actual.features).toBe(width < 768 ? 1 : width < 1158 ? 2 : 4);
    expect(actual.team).toBe(actual.features);
    expect(actual.projects).toBe(width < 768 ? 1 : width < 1158 ? 2 : 3);
    const hero = page.locator("#hero");
    expect((await hero.boundingBox()).width).toBe(Math.min(1440, width));
    expect((await hero.boundingBox()).height).toBeCloseTo(width < 768 ? 432 : width < 1158 ? 436 : 600, 0);
    await expect(hero).toHaveCSS("background-image", /linear-gradient.*url\(/);
    await expect(page.locator(".feature-icon").first()).toHaveCSS("display", width < 1158 ? "none" : "flex");
    const project = page.locator(".project-card").first();
    await project.focus();
    await expect(project.locator(".project-overlay")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    await page.locator(".header .logo").focus();
  }
});

test("M5.1 M6.1 · service form remains reachable in a short mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await page.getByRole("button", { name: "Order Service" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Name", { exact: true })).toBeFocused();
  await expect(dialog).toHaveCSS("width", "288px");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await dialog.getByRole("button", { name: "Send" }).scrollIntoViewIfNeeded();
  await expect(dialog.getByRole("button", { name: "Send" })).toBeInViewport();
  await dialog.getByRole("button", { name: "Close form" }).click();
  await expect(page.getByRole("button", { name: "Order Service" })).toBeFocused();
});

test("M6.3 · mobile menu fills the screen, navigates and closes at tablet width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const trigger = page.getByRole("button", { name: "Open menu" }),
    menu = page.locator("#mobile-menu");
  await expect(menu).toBeHidden();
  expect(
    await menu.evaluate(
      (el) => !!(document.querySelector("footer").compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING),
    ),
  ).toBe(true);
  await expect(page.locator(".header .logo")).toHaveCSS("padding-top", /1[6-8]px/);
  await expect(page.locator(".navigation")).toBeHidden();
  await menu.evaluate((el) => el.classList.add("is-open"));
  await expect(menu).toBeVisible();
  await menu.evaluate((el) => el.classList.remove("is-open"));
  await expect(menu).toBeHidden();
  await trigger.click();
  await expect(menu).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  expect(await menu.boundingBox()).toEqual({ x: 0, y: 0, width: 320, height: 640 });
  await expect(menu.getByRole("link", { name: "Features" })).toBeVisible();
  await expect(menu.locator(".social-link")).toHaveCount(4);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await menu.getByRole("button", { name: "Close menu" }).click();
  await expect(menu).toBeHidden();
  await trigger.click();
  await menu.getByRole("link", { name: "Portfolio", exact: true }).click();
  await expect(page).toHaveURL(/#portfolio$/);
  await expect(menu).toBeHidden();
  await expect(page.locator("#portfolio")).toBeFocused();
  await trigger.click();
  await page.setViewportSize({ width: 768, height: 640 });
  await expect(menu).not.toHaveClass(/is-open/);
  await expect(trigger).toBeHidden();
  await expect(page.locator(".navigation")).toBeVisible();
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
});

test("M6.2 · all JPEG exports have the specified native pixel dimensions", async ({ page }) => {
  const expected = {};
  for (const [device, w, h] of [
    ["mobile", 320, 432],
    ["tablet", 768, 436],
    ["desktop", 1440, 600],
  ]) {
    for (const d of [1, 2]) expected["hero-" + device + (d === 2 ? "-2x" : "") + ".jpg"] = [w * d, h * d];
  }
  for (let n = 1; n <= 4; n++)
    for (const d of [1, 2]) expected["team-" + n + (d === 2 ? "-2x" : "") + ".jpg"] = [264 * d, 260 * d];
  for (let n = 1; n <= 6; n++)
    for (const [suffix, w, h] of [
      ["-mobile", 288, 280],
      ["-tablet", 356, 300],
      ["", 360, 300],
    ]) {
      for (const d of [1, 2]) expected["portfolio-" + n + suffix + (d === 2 ? "-2x" : "") + ".jpg"] = [w * d, h * d];
    }
  expect(
    fs
      .readdirSync("images")
      .filter((n) => n.endsWith(".jpg"))
      .sort(),
  ).toEqual(Object.keys(expected).sort());
  const dimensions = await page.evaluate(
    async (names) =>
      Object.fromEntries(
        await Promise.all(
          names.map(async (name) => {
            const img = new Image();
            img.src = "./images/" + name;
            await img.decode();
            return [name, [img.naturalWidth, img.naturalHeight]];
          }),
        ),
      ),
    Object.keys(expected),
  );
  expect(dimensions).toEqual(expected);
  await expect(page.locator("picture,source,main img:not([srcset])")).toHaveCount(0);
});

for (const [kind, width, projectSuffix] of [
  ["mobile", 320, "-mobile"],
  ["tablet", 768, "-tablet"],
  ["desktop", 1440, ""],
]) {
  for (const dpr of [1, 2]) {
    test.describe(kind + " at " + dpr + "x", () => {
      test.use({ viewport: { width, height: 900 }, deviceScaleFactor: dpr });
      test("M6.2 · browser selects sharp responsive assets", async ({ page }) => {
        const density = dpr === 2 ? "-2x" : "";
        const hero = page.locator("#hero");
        const background = await hero.evaluate((el) => getComputedStyle(el).backgroundImage);
        expect(background).toContain("hero-" + kind + density + ".jpg");
        const assets = await page.locator("main img").evaluateAll(async (nodes) => {
          await Promise.all(nodes.map((n) => n.decode()));
          return nodes.map((n) => new URL(n.currentSrc).pathname.split("/").pop());
        });
        for (let i = 0; i < 4; i++) expect(assets[i]).toBe("team-" + (i + 1) + density + ".jpg");
        for (let i = 0; i < 6; i++)
          expect(assets[4 + i]).toBe("portfolio-" + (i + 1) + projectSuffix + density + ".jpg");
      });
    });
  }
}
