import { test, expect } from "@playwright/test";
import type { DemoData } from "../src/lib/models";

test("pitch shortcut converts a new enquiry once and gives clear project stages", async ({
  page,
}) => {
  const key = "osc-independent-concept-v1";
  await page.goto("/dashboard/leads/?id=lead-demo-2");
  await expect(
    page.getByRole("button", { name: "Convert to demo project" }),
  ).toBeEnabled();
  await expect(page.locator(".lead-extra-details")).not.toHaveAttribute(
    "open",
    "",
  );
  await page.getByRole("button", { name: "Convert to demo project" }).click();
  await expect(
    page.getByRole("heading", { name: "Parramatta kitchen" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try Production stage" }).click();
  await expect(page.locator(".project-overview-card h2")).toHaveText(
    "Manufacturing",
  );
  await page.getByRole("button", { name: "Try Installation stage" }).click();
  await page.reload();
  await expect(page.locator(".project-overview-card h2")).toHaveText(
    "Installation scheduled",
  );
  await page.getByRole("link", { name: "View connected lead" }).click();
  await expect(
    page.getByRole("link", { name: "View connected project" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Convert to demo project" }),
  ).toHaveCount(0);
  const state = (await page.evaluate(
    (k) => JSON.parse(localStorage.getItem(k)!),
    key,
  )) as DemoData;
  expect(state.projects.filter((p) => p.leadId === "lead-demo-2")).toHaveLength(
    1,
  );
  expect(state.leads.find((l) => l.id === "lead-demo-2")?.stage).toBe(
    "Qualified",
  );
});
