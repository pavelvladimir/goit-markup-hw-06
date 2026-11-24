const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

async function expectPlainLogo(link) {
  await expect(link).toHaveAttribute("href", "./index.html");
  expect(await link.evaluate((a) => Array.from(a.childNodes, (node) => [node.nodeType, node.nodeValue]))).toEqual([
    [3, "WebStudio"],
  ]);
}

test("HW01.1 · the home page is a complete HTML document without author styles or scripts", async ({ page }) => {
  expect(await page.evaluate(() => document.doctype?.name)).toBe("html");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("meta[charset]")).toHaveAttribute("charset", /^utf-8$/i);
  await expect(page).toHaveTitle("WebStudio");
  await expect(page.locator("body > header#header + main + footer#footer")).toHaveCount(1);
  await expect(page.locator("style, [style], [class], link[rel~=stylesheet], script")).toHaveCount(0);
  expect(await page.evaluate(() => document.styleSheets.length)).toBe(0);
});

test("HW01.2 · the header has a plain logo, three working section links and contact details", async ({ page }) => {
  const header = page.locator("header#header");
  await expectPlainLogo(header.locator(":scope > a"));
  await expect(header.locator(":scope > nav")).toHaveCount(1);
  await expect(header.locator("button, svg")).toHaveCount(0);
  const links = header.locator("nav > ul > li > a");
  await expect(links).toHaveText(["Features", "Team", "Portfolio"]);
  for (const id of ["features", "team", "portfolio"]) {
    const target = page.locator("main > section#" + id);
    await header.locator('nav a[href="#' + id + '"]').click();
    await expect(page).toHaveURL(new RegExp("#" + id + "$"));
    await expect(target).toBeInViewport();
  }
  const contacts = header.locator(":scope > address a");
  await expect(contacts).toHaveText(["info@devstudio.com", "+11 (000) 111-11-11"]);
  await expect(contacts.first()).toHaveAttribute("href", "mailto:info@devstudio.com");
  await expect(contacts.last()).toHaveAttribute("href", "tel:+110001111111");
});

test("HW01.3 · hero, features and team appear in order under main", async ({ page }) => {
  await expect(
    page.locator("body > header#header + main > section#hero:first-child + section#features + section#team"),
  ).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#hero h1")).toHaveText("Effective Solutions for Your Business");
  await expect(page.locator("#hero").getByRole("button", { name: "Order Service", exact: true })).toHaveAttribute(
    "type",
    "button",
  );
});

test("HW01.4 · features have a visible heading and four plain heading–paragraph pairs", async ({ page }) => {
  const features = page.locator("#features");
  await expect(features).not.toHaveAttribute("tabindex");
  const heading = features.getByRole("heading", { level: 2, name: "Our Features", exact: true });
  await expect(heading).toBeVisible();
  const list = features.locator(":scope > h2 + ul");
  const cards = list.locator(":scope > li");
  expect(await cards.evaluateAll((items) => items.map((li) => Array.from(li.children, (el) => el.tagName)))).toEqual(
    Array(4).fill(["H3", "P"]),
  );
  await expect(cards.locator("h3")).toHaveText(["Strategy", "Punctuality", "Diligence", "Technologies"]);
  await expect(cards.locator("p")).toHaveText([
    "Our goal is to identify the business problem to walk away with the perfect and creative solution.",
    "Bring the key message to the brand's audience for the best price within the shortest possible time.",
    "Research and confirm brands with the strongest digital growth opportunities and minimize risk.",
    "Design practice focused on digital experiences. We bring forth a deep passion for problem-solving.",
  ]);
});

test("HW01.5 · each team portrait loads and its alternative text is exactly the member's name", async ({ page }) => {
  await expect(page.locator("#team > h2")).toHaveText("Our Team");
  const cards = page.locator("#team > ul > li");
  const names = ["Mark Guerrero", "Tom Ford", "Camila Garcia", "Daniel Wilson"];
  await expect(cards.locator("h3")).toHaveText(names);
  await expect(cards.locator("p")).toHaveText(["Product Designer", "Frontend Developer", "Marketing", "UI Designer"]);
  for (const [i, name] of names.entries()) {
    const card = cards.nth(i);
    await expect(card.locator(":scope > img:first-child + h3 + p:last-child")).toHaveCount(1);
    const portrait = card.locator("img");
    await expect(portrait).toHaveAttribute("alt", name);
    await expect(portrait).toHaveAttribute("src", "./images/team-" + (i + 1) + ".jpg");
    await expect(portrait).toHaveAttribute("width", "264");
    await expect(portrait).toHaveAttribute("height", "260");
    expect(await portrait.evaluate((img) => [img.naturalWidth, img.naturalHeight])).toEqual([264, 260]);
  }
});

test("HW01.6 · footer has the plain home link and the required description", async ({ page }) => {
  await expectPlainLogo(page.locator("footer#footer > a"));
  await expect(page.locator("footer#footer > p")).toHaveText(
    "Increase the flow of customers and sales for your business with digital marketing & growth solutions.",
  );
});
