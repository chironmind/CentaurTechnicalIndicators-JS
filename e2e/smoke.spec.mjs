import { test, expect } from "@playwright/test";

const EXPECTED_RSI = 49.25373134328325;

test("web target via index.web.js wrapper computes RSI", async ({ page }) => {
  page.on("pageerror", (err) =>
    test.info().annotations.push({ type: "pageerror", description: err.message }),
  );
  await page.goto("/e2e/fixtures/wrapper.html");
  await page.waitForFunction(() => window.__result !== undefined, null, {
    timeout: 30_000,
  });
  const result = await page.evaluate(() => window.__result);
  expect(result.ok, `wrapper fixture errored: ${result.error}`).toBe(true);
  expect(result.rsi).toBeCloseTo(EXPECTED_RSI, 9);
});

test("web target via flat ESM CDN-style import computes RSI", async ({
  page,
}) => {
  page.on("pageerror", (err) =>
    test.info().annotations.push({ type: "pageerror", description: err.message }),
  );
  await page.goto("/e2e/fixtures/cdn.html");
  await page.waitForFunction(() => window.__result !== undefined, null, {
    timeout: 30_000,
  });
  const result = await page.evaluate(() => window.__result);
  expect(result.ok, `cdn fixture errored: ${result.error}`).toBe(true);
  expect(result.rsi).toBeCloseTo(EXPECTED_RSI, 9);
});
