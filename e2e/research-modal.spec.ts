import { expect, test } from "@playwright/test";

test.describe("Research term-paper modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#research");
  });

  test("opens as an accessible dialog with the abstract", async ({ page }) => {
    await page
      .getByRole("button", { name: "Read Term Paper Abstract" })
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(
      dialog.getByRole("heading", {
        name: "Attachment Anxiety and its Role in Codependent Behavior",
      }),
    ).toBeVisible();
    await expect(dialog.getByText("Abstract Summary:")).toBeVisible();
    await expect(dialog.getByText("Key Scientific Methodology:")).toBeVisible();
  });

  test("closes with the close icon", async ({ page }) => {
    await page
      .getByRole("button", { name: "Read Term Paper Abstract" })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page
      .getByRole("button", { name: "Close research abstract" })
      .click();
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("closes with the Escape key", async ({ page }) => {
    await page
      .getByRole("button", { name: "Read Term Paper Abstract" })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("closes when the backdrop is clicked", async ({ page }) => {
    await page
      .getByRole("button", { name: "Read Term Paper Abstract" })
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.locator("xpath=..").click({ position: { x: 8, y: 8 } });
    await expect(dialog).toBeHidden();
  });

  test("locks body scroll while open and restores it on close", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: "Read Term Paper Abstract" })
      .click();
    await expect
      .poll(() =>
        page.evaluate(() => document.body.style.overflow),
      )
      .toBe("hidden");

    await page.keyboard.press("Escape");
    await expect
      .poll(() =>
        page.evaluate(() => document.body.style.overflow),
      )
      .toBe("");
  });
});
