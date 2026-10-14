import { test, expect } from "@playwright/test";

test("readable text, a recognisable assistant and optional details keep the flow simple", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Show next kitchen inspiration" })
    .click();
  await expect(page.locator(".hero-image > img")).toHaveAttribute(
    "src",
    "/images/kitchen-dark.jpg",
  );
  await page
    .getByRole("button", { name: "Show next kitchen inspiration" })
    .click();
  await expect(page.locator(".hero-image > img")).toHaveAttribute(
    "src",
    "/images/kitchen-hero.jpg",
  );
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator(".chat-launch-copy")).toBeVisible();
    const metrics = await page.locator(".hero-copy > p").evaluate((element) => {
      const style = getComputedStyle(element);
      const rgb = (value: string) =>
        (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const luminance = (colour: number[]) =>
        colour
          .map((v) => {
            const s = v / 255;
            return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
          })
          .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
      let parent: Element | null = element;
      let background = "rgb(255, 255, 255)";
      while (parent) {
        const value = getComputedStyle(parent).backgroundColor;
        if (value !== "rgba(0, 0, 0, 0)" && value !== "transparent") {
          background = value;
          break;
        }
        parent = parent.parentElement;
      }
      const foregroundL = luminance(rgb(style.color)),
        backgroundL = luminance(rgb(background));
      return {
        size: parseFloat(style.fontSize),
        contrast:
          (Math.max(foregroundL, backgroundL) + 0.05) /
          (Math.min(foregroundL, backgroundL) + 0.05),
      };
    });
    expect(metrics.size).toBeGreaterThanOrEqual(16);
    expect(metrics.contrast).toBeGreaterThanOrEqual(4.5);
  }
  await page.locator(".chat-launch").click();
  const assistant = page.getByRole("dialog", {
    name: "Your kitchen assistant",
  });
  await expect(
    assistant.getByRole("heading", { name: "Meet Kiki." }),
  ).toBeVisible();
  await expect(assistant.locator(".assistant-avatar").first()).toBeVisible();
  await expect(
    assistant.getByRole("textbox", { name: "Message the kitchen assistant" }),
  ).toBeVisible();
  await assistant.getByRole("button", { name: "Close dialog" }).click();
  await page.goto("/kitchen-enquiry");
  await page
    .getByRole("button", { name: "New custom kitchen", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Island kitchen", exact: true })
    .click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Approximate length")).toBeHidden();
  await page.getByRole("button", { name: "Not sure yet", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText(/STEP 3 OF 5/)).toBeVisible();
});
