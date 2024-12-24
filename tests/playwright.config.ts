import { defineConfig, devices } from "@playwright/test";
import { test_config } from "./shared/test.config";

export default defineConfig({
  outputDir: "./test-results",
  testDir: ".",
  fullyParallel: true,
  retries: 0,
  workers: test_config.workers,
  reporter: [
    ["list"],
    [
      "allure-playwright",
      {
        detail: false,
        outputFolder: "./my-allure-results",
        suiteTitle: true,
      },
    ],
  ],
  use: {
    trace: "on",
    screenshot: "on",
    video: "off",
    testIdAttribute: "data-qa-ref",
    ignoreHTTPSErrors: true,
    baseURL: process.env.CLIENT_UI_URL,
    navigationTimeout: 90 * 1000,
    actionTimeout: 60 * 1000,
  },
  expect: {
    timeout: 30 * 1000,
  },
  projects: [
    // for debug
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        headless: false,
        viewport: { width: 1920, height: 1020 },
        channel: "chrome",
        launchOptions: {
          args: ["--disable-web-security"],
        },
      },
      testMatch: "**/*.@(test).ts",
    },
  ],
});