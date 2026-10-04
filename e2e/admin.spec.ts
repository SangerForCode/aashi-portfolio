import { expect, test } from "@playwright/test";

const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

test.describe("Admin login", () => {
  test("renders the sign-in form with labelled fields", async ({ page }) => {
    await page.goto("/admin/login");

    await expect(
      page.getByRole("heading", { name: "Admin sign in" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign in" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /portfolio/i })).toBeVisible();
  });

  test("email and password inputs are required", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByLabel("Email")).toHaveAttribute("required", "");
    await expect(page.getByLabel("Password")).toHaveAttribute("required", "");
  });

  test("login page is excluded from search indexing", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
});

test.describe("Admin access control", () => {
  test.beforeEach(() => {
    test.skip(
      !hasSupabase,
      "Supabase env not configured; middleware is a no-op in this mode.",
    );
  });

  for (const path of ["/admin", "/admin/content", "/admin/poems"]) {
    test(`unauthenticated ${path} redirects to login`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/admin\/login/);
      await expect(page).toHaveURL(/next=/);
    });
  }

  test("invalid credentials show an error and stay on login", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill("nobody@example.com");
    await page.getByLabel("Password").fill("definitely-wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(
      page.getByText("Unable to sign in with those credentials."),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
