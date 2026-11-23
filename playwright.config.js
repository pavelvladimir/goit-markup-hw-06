const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 3,
  forbidOnly: Boolean(process.env.CI),
  use: { baseURL: "http://127.0.0.1:4178", viewport: { width: 1440, height: 900 }, screenshot: "only-on-failure" },
  projects: ["chromium", "firefox", "webkit"].map((browserName) => ({ name: browserName, use: { browserName } })),
  webServer: {
    stderr: "ignore",
    command: "pnpm exec sirv . --dev --host 127.0.0.1 --port 4178",
    url: "http://127.0.0.1:4178/",
    reuseExistingServer: false,
  },
});
