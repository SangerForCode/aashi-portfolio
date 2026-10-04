import { expect, test } from "@playwright/test";

test.describe("SEO and metadata", () => {
  test("robots.txt allows crawling but blocks admin", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain("User-Agent: *");
    expect(body).toContain("Disallow: /admin/");
    expect(body).toContain("Sitemap:");
  });

  test("sitemap.xml lists the home and poetry routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain("<urlset");
    expect(body).toMatch(/<loc>https?:\/\/.+\/<\/loc>/);
    expect(body).toMatch(/\/poetry<\/loc>/);
  });

  test("home exposes canonical and Open Graph tags", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /^https?:\/\/.+/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /Aashi Sharma/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /aashi\.jpeg/,
    );
  });

  test("favicon is declared and reachable", async ({ page, request }) => {
    await page.goto("/");
    const icon = page.locator('link[rel="icon"]');
    await expect(icon).toHaveAttribute("href", /favicon\.png/);
    const response = await request.get("/favicon.png");
    expect(response.ok()).toBeTruthy();
  });

  test("unknown routes return the 404 page", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
