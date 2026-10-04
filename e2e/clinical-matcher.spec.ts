import { expect, test } from "@playwright/test";

test.describe("Clinical skill alignment matcher", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#matcher");
  });

  test("defaults to the first duty and marks it selected", async ({ page }) => {
    const matcher = page.locator("#matcher");
    const first = matcher.getByRole("button", {
      name: "Clinical Screening & Intakes",
    });
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await expect(
      matcher.getByRole("heading", {
        name: "Client Screenings & Clinical Intakes",
      }),
    ).toBeVisible();
  });

  test("switches the detail panel when another duty is selected", async ({
    page,
  }) => {
    const matcher = page.locator("#matcher");
    const target = matcher.getByRole("button", {
      name: "Psychometric Assessments",
    });

    await target.click();

    await expect(target).toHaveAttribute("aria-pressed", "true");
    await expect(
      matcher.getByRole("heading", {
        name: "Psychometric Assessment & Administration",
      }),
    ).toBeVisible();
    await expect(
      matcher.getByRole("button", { name: "Clinical Screening & Intakes" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  test("exposes the alignment panel as a live region", async ({ page }) => {
    await expect(
      page.locator("#matcher [aria-live='polite']"),
    ).toBeAttached();
  });

  test("renders every seeded duty as a selectable option", async ({
    page,
  }) => {
    const matcher = page.locator("#matcher");
    const duties = [
      "Clinical Screening & Intakes",
      "Treatment Strategies & Planning",
      "Psychometric Assessments",
      "Workshop & Module Design",
      "Outreach, Writing & Media",
    ];
    for (const duty of duties) {
      await expect(matcher.getByRole("button", { name: duty })).toBeVisible();
    }
  });
});
