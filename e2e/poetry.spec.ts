import { expect, test } from "@playwright/test";

test.describe("Poetry", () => {
  test("nav Poetry button routes to the poetry index", async ({ page }) => {
    await page.goto("/");
    await page
      .locator("nav")
      .getByRole("link", { name: "Poetry" })
      .click();
    await expect(page).toHaveURL(/\/poetry$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Poetry" }),
    ).toBeVisible();
  });

  test("poetry index shows navigation and admin entry", async ({ page }) => {
    await page.goto("/poetry");
    await expect(page).toHaveTitle(/Poetry/);
    await expect(page.getByRole("link", { name: /Portfolio/ })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Admin Login" }),
    ).toBeVisible();
  });

  test("poetry index shows poems or a graceful empty state", async ({
    page,
  }) => {
    await page.goto("/poetry");

    const emptyState = page.getByText("Poetry will appear here soon.");
    const readLinks = page.getByRole("link", { name: /Read poem/ });

    const count = await readLinks.count();
    if (count === 0) {
      await expect(emptyState).toBeVisible();
    } else {
      await expect(emptyState).toHaveCount(0);
      await expect(readLinks.first()).toBeVisible();
    }
  });

  test("a poem detail page renders title, stanzas and back link", async ({
    page,
  }) => {
    await page.goto("/poetry");

    const firstRead = page.getByRole("link", { name: /Read poem/ }).first();
    if ((await firstRead.count()) === 0) {
      test.skip(true, "No published poems in this environment.");
    }

    await firstRead.click();
    await expect(page).toHaveURL(/\/poetry\/.+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /All poems/ })).toBeVisible();
    await expect(page.locator("article > div.font-serif")).toBeVisible();
  });

  test("unknown poem slug returns a 404 page", async ({ request }) => {
    const response = await request.get(
      "/poetry/definitely-not-a-real-poem-slug-12345",
    );
    expect(response.status()).toBe(404);
  });
});
