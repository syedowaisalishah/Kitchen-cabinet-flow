import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 2,
  timeout: 45000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
    trace: "retain-on-failure",
    launchOptions: {
      executablePath: process.env.CHROME_PATH || "/opt/google/chrome/chrome",
      args: ["--no-sandbox"],
    },
  },
  webServer: {
    command: "python3 -m http.server 4173 --bind 127.0.0.1 --directory out",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 15000,
    stdout: "ignore",
    stderr: "ignore",
  },
});
