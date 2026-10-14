import { test, expect } from "@playwright/test";
import type { DemoData } from "../src/lib/models";
const KEY = "osc-independent-concept-v1";
test("connected chat → full enquiry → lead → project → persisted workflow → reset", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.locator(".chat-launch").click();
  const chat = page.getByRole("dialog", { name: "Your kitchen assistant" });
  await chat
    .getByRole("button", { name: "What services are offered?" })
    .click();
  await expect(chat.getByText(/complete kitchen builds/)).toBeVisible();
  await chat
    .getByRole("textbox", { name: "Message the kitchen assistant" })
    .fill("I want to start a kitchen project");
  await chat.getByRole("button", { name: "Send message" }).click();
  await expect(chat.getByText(/What is your name/)).toBeVisible();
  for (const [value, reply] of [
    ["Alex Test", "What email"],
    ["alex.test@example.com", "What phone"],
    ["0400 000 000", "Which layout"],
  ]) {
    await chat
      .getByRole("textbox", { name: "Message the kitchen assistant" })
      .fill(value);
    await chat.getByRole("button", { name: "Send message" }).click();
    await expect(chat.getByText(new RegExp(reply))).toBeVisible();
  }
  await chat.getByRole("button", { name: "L-shaped", exact: true }).click();
  await expect(chat.getByText(/approximate budget/)).toBeVisible();
  await chat
    .getByRole("button", { name: "AUD 35,000–50,000", exact: true })
    .click();
  await expect(
    chat.getByText("When would you like to begin?", { exact: true }),
  ).toBeVisible();
  await chat
    .getByRole("button", { name: "Within 3 months", exact: true })
    .click();
  await expect(chat.getByText(/Your starting details are ready/)).toBeVisible();
  await chat
    .getByRole("button", { name: "Plan my kitchen", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Complete kitchen renovation",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "L-shaped", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/STEP 1 OF 5/)).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Warm minimal", exact: true }).click();
  await page.locator(".planner-extras > summary").click();
  await page.getByLabel("Approximate length").fill("4.5");
  await page.getByLabel("Approximate width").fill("3.2");
  await page.getByLabel("Deep drawers").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "AUD 35,000–50,000", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Within 3 months", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Full name")).toHaveValue("Alex Test");
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "alex.test@example.com",
  );
  await page.locator(".photo-extras > summary").click();
  await page
    .getByRole("button", { name: "Add sample inspiration photo" })
    .click();
  await page.getByLabel("Suburb / location").fill("Kellyville");
  await page.getByLabel(/I understand this is a demo/).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Submit Demo Enquiry" }).click();
  await expect(
    page.getByText("It was not sent to One Stop Cabinets."),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "View your lead in the dashboard" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Alex Test", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Convert to demo project" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Convert to demo project" }).click();
  await expect(
    page.getByRole("heading", { name: "Kellyville kitchen" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Advance to next stage" }).click();
  await expect(page.getByLabel("Project stage", { exact: true })).toHaveValue(
    "Site consultation",
  );
  await page.getByLabel("Arrange site consultation", { exact: true }).check();
  await page.locator(".project-extra-details > summary").click();
  await page
    .getByRole("textbox", { name: "New project note" })
    .fill("Demo site visit: review island clearance.");
  await page.getByRole("button", { name: "Add demonstration note" }).click();
  await page.reload();
  await page.locator(".project-extra-details > summary").click();
  await expect(page.getByLabel("Project stage", { exact: true })).toHaveValue(
    "Site consultation",
  );
  await expect(
    page.getByLabel("Arrange site consultation", { exact: true }),
  ).toBeChecked();
  await expect(
    page.getByText("Demo site visit: review island clearance.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View connected lead" }).click();
  await page.locator(".lead-extra-details > summary").click();
  await expect(page.getByLabel("Lead status", { exact: true })).toHaveValue(
    "Qualified",
  );
  await expect(page.getByText("alex.test@example.com").first()).toBeVisible();
  await page
    .getByRole("button", { name: "Interactive Demo", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reset Demo Data", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Reset Demo Data", exact: true })
    .click();
  const state = (await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    KEY,
  )) as DemoData;
  expect(state.leads).toHaveLength(8);
  expect(state.projects).toHaveLength(2);
  expect(state.draft.customer.name).toBe("");
  expect(errors).toEqual([]);
});
test("draft validates, survives navigation and refresh, and measurement units convert", async ({
  page,
}) => {
  await page.goto("/kitchen-enquiry");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator(".form-error")).toContainText(
    "Choose a project type",
  );
  await page
    .getByRole("button", { name: "New custom kitchen", exact: true })
    .click();
  await page.getByRole("button", { name: "U-shaped", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator(".planner-extras > summary").click();
  await page.getByLabel("Approximate length").fill("-2");
  await page.getByLabel("Approximate width").fill("3");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator(".form-error")).toContainText(
    "positive dimensions",
  );
  await page.getByLabel("Approximate length").fill("4");
  await page.getByLabel("Measurement unit").selectOption("millimetres");
  await expect(page.getByLabel("Approximate length")).toHaveValue("4000");
  await page.goto("/");
  await page.goto("/kitchen-enquiry");
  await page.reload();
  await page.locator(".planner-extras > summary").click();
  await expect(page.getByLabel("Approximate length")).toHaveValue("4000");
  await expect(page.getByLabel("Measurement unit")).toHaveValue("millimetres");
});
test("uploads validate MIME type and size and retain compressed local preview", async ({
  page,
}) => {
  await page.goto("/kitchen-enquiry");
  await page
    .getByRole("button", { name: "Try Sample Enquiry", exact: true })
    .click();
  await page
    .locator(".summary-group")
    .filter({ hasText: "Photos & inspiration" })
    .getByRole("button", { name: "Edit" })
    .click();
  await page.locator(".photo-extras > summary").click();
  const upload = page.getByLabel("Upload kitchen reference images");
  await upload.setInputFiles({
    name: "not-image.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from("<svg/>"),
  });
  await expect(page.locator(".form-error")).toContainText(
    "use JPG, PNG or WebP",
  );
  await upload.setInputFiles({
    name: "large.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.alloc(8 * 1024 * 1024 + 1),
  });
  await expect(page.locator(".form-error")).toContainText("8 MB or smaller");
  await upload.setInputFiles("public/images/kitchen-dark.jpg");
  await expect(
    page.getByRole("img", { name: "kitchen-dark.jpg", exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.locator(".photo-extras > summary").click();
  await expect(
    page.getByRole("img", { name: "kitchen-dark.jpg", exact: true }),
  ).toBeVisible();
  const state = (await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    KEY,
  )) as DemoData;
  expect(state.draft.references.find((r) => r.kind === "local")?.src).toMatch(
    /^data:image\/jpeg/,
  );
});
test("sample quick path, lead filters, follow-ups and project creation are connected", async ({
  page,
}) => {
  await page.goto("/demo");
  await page
    .getByRole("button", { name: "Try Sample Enquiry", exact: true })
    .click();
  await page.getByRole("button", { name: "Submit Demo Enquiry" }).click();
  await page
    .getByRole("link", { name: "View your lead in the dashboard" })
    .click();
  await page.locator(".lead-extra-details > summary").click();
  await page
    .getByRole("textbox", { name: "New follow-up task" })
    .fill("Check preferred consultation time");
  await page.getByRole("button", { name: "Add follow-up task" }).click();
  await page.getByLabel("Check preferred consultation time").check();
  await page.reload();
  await page.locator(".lead-extra-details > summary").click();
  await expect(
    page.getByLabel("Check preferred consultation time"),
  ).toBeChecked();
  await page.goto("/dashboard/leads");
  await page.getByRole("textbox", { name: "Search leads" }).fill("Alex Morgan");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByLabel("Filter lead status").selectOption("Qualified");
  await expect(page.locator("tbody tr")).toHaveCount(0);
});
test("guided tour traverses all experiences and unknown IDs recover gracefully", async ({
  page,
}) => {
  await page.goto("/demo");
  await page
    .locator(".demo-shortcuts")
    .getByRole("button", { name: "Start Guided Tour", exact: true })
    .click();
  const tour = page.getByRole("dialog", {
    name: "A kitchen journey, connected",
  });
  await expect(tour.getByText("A better first conversation")).toBeVisible();
  for (let i = 0; i < 3; i++)
    await tour.getByRole("button", { name: "Next experience" }).click();
  await expect(tour.getByText("One connected project journey")).toBeVisible();
  await tour.getByRole("button", { name: "Finish tour" }).click();
  await page.goto("/dashboard/leads?id=missing");
  await expect(
    page.getByText("This lead isn’t in this browser."),
  ).toBeVisible();
  await page.goto("/dashboard/projects?id=missing");
  await expect(
    page.getByText("This project isn’t in this browser."),
  ).toBeVisible();
});
test("malformed local storage restores samples without crashing", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate((key) => localStorage.setItem(key, "{broken"), KEY);
  await page.reload();
  await expect(page.locator(".storage-alert")).toContainText("unreadable");
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: /Less chasing/ }),
  ).toBeVisible();
});
for (const width of [375, 768, 1440])
  test(`responsive routes and dialogs at ${width}px without document overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of [
      "/",
      "/demo",
      "/kitchen-enquiry",
      "/dashboard",
      "/dashboard/leads",
      "/dashboard/leads?id=lead-demo-1",
      "/dashboard/projects",
      "/dashboard/projects?id=OSC-DEMO-101",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1").first()).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(dimensions.scroll, route).toBeLessThanOrEqual(dimensions.client);
      await page.evaluate(() =>
        Promise.all(
          document.getAnimations().map((animation) => animation.finished),
        ),
      );
      await page.screenshot({
        path: `test-results/screenshots/${width}-${route.replaceAll(/[^a-z0-9]/gi, "-")}.png`,
        fullPage: true,
      });
    }
    await page.goto("/");
    await page.locator(".chat-launch").click();
    await expect(
      page.getByRole("dialog", { name: "Your kitchen assistant" }),
    ).toBeVisible();
    const box = await page
      .getByRole("dialog", { name: "Your kitchen assistant" })
      .boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    await page.getByRole("button", { name: "Close dialog" }).click();
    expect(errors).toEqual([]);
  });
