import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders a single h1 and the document title", async ({ page }) => {
    await expect(page).toHaveTitle(/Aashi Sharma/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toContainText("clinical empathy");
  });

  test("shows the hero badge, intro and primary CTAs", async ({ page }) => {
    await expect(
      page.getByText("Amity University", { exact: false }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "View Term Paper Details" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Clinical Skill Alignment" }),
    ).toBeVisible();
  });

  test("renders every major landmark section", async ({ page }) => {
    for (const id of ["top", "about", "research", "matcher", "contact"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("nav links jump to their in-page sections", async ({ page }) => {
    const researchLink = page
      .locator("nav")
      .getByRole("link", { name: "My Research" });

    test.skip(
      !(await researchLink.isVisible()),
      "Desktop-only nav links are hidden at this viewport.",
    );

    await researchLink.click();
    await expect(page).toHaveURL(/#research$/);
    await expect(page.locator("#research")).toBeInViewport();

    await page
      .locator("nav")
      .getByRole("link", { name: "Contact" })
      .first()
      .click();
    await expect(page).toHaveURL(/#contact$/);
  });

  test("hero CTA anchors scroll to research and matcher", async ({ page }) => {
    await page.getByRole("link", { name: "View Term Paper Details" }).click();
    await expect(page).toHaveURL(/#research$/);
    await expect(page.locator("#research")).toBeInViewport();

    await page.getByRole("link", { name: "Clinical Skill Alignment" }).click();
    await expect(page).toHaveURL(/#matcher$/);
  });

  test("contact section exposes working email and LinkedIn links", async ({
    page,
  }) => {
    const contact = page.locator("#contact");
    await expect(
      contact.getByRole("link", { name: "Email" }),
    ).toHaveAttribute("href", /^mailto:/);
    await expect(
      contact.getByRole("link", { name: "LinkedIn" }),
    ).toHaveAttribute("href", /linkedin\.com/);
  });

  test("includes Person structured data", async ({ page }) => {
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .textContent();
    expect(jsonLd).toBeTruthy();
    const parsed = JSON.parse(jsonLd as string);
    expect(parsed["@type"]).toBe("Person");
    expect(parsed.name).toBe("Aashi Sharma");
  });

  test("is free of horizontal overflow", async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow).toBe(false);
  });
});
