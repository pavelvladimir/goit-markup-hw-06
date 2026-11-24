const { test: base, expect } = require("@playwright/test");

// Keep acceptance tests deterministic and demonstrate the bundled font fallback.
const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("https://fonts.googleapis.com/**", (route) =>
      route.fulfill({ contentType: "text/css", body: "" }),
    );
    await page.goto("/hw-06.html");
    await page.evaluate(() => document.fonts.ready.then(() => true));
    await use(page);
  },
});

module.exports = { test, expect };
