import { test, expect } from "@playwright/test";

test.describe("Auth Pages", () => {
  test("login page should render correctly", async ({ page }) => {
    await page.goto("/login");

    // Brand elements
    await expect(page.locator("h1")).toContainText("Aurify");
    await expect(
      page.getByRole("heading", { name: "Welcome back" }),
    ).toBeVisible();

    // Form fields
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    // Submit button
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();

    // OAuth buttons
    await expect(page.getByText("Google")).toBeVisible();
    await expect(page.getByText("GitHub")).toBeVisible();
    await expect(page.getByText("Microsoft")).toBeVisible();

    // Links
    await expect(page.getByText("Forgot password?")).toBeVisible();
    await expect(page.getByText("Sign up")).toBeVisible();
  });

  test("login page should validate required fields", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("register page should render correctly", async ({ page }) => {
    await page.goto("/register");

    await expect(
      page.getByRole("heading", { name: "Create your account" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();

    // OAuth buttons
    await expect(page.getByText("Google")).toBeVisible();
    await expect(page.getByText("GitHub")).toBeVisible();
    await expect(page.getByText("Microsoft")).toBeVisible();

    // Link back to login
    await expect(page.getByText("Sign in")).toBeVisible();
  });

  test("register page should validate email", async ({ page }) => {
    await page.goto("/register");

    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Email is required")).toBeVisible();
  });

  test("forgot password page should render correctly", async ({ page }) => {
    await page.goto("/forgot-password");

    await expect(
      page.getByRole("heading", { name: "Reset your password" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send Code" })).toBeVisible();
  });

  test("should navigate from login to register", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("Sign up").click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("should navigate from login to forgot password", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("Forgot password?").click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("should navigate from register to login", async ({ page }) => {
    await page.goto("/register");
    await page.getByText("Sign in").click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("verify-otp page should redirect without state", async ({ page }) => {
    await page.goto("/verify-otp");
    await expect(page).toHaveURL(/\/login/);
  });

  test("complete-profile page should redirect without state", async ({
    page,
  }) => {
    await page.goto("/complete-profile");
    await expect(page).toHaveURL(/\/register/);
  });

  test("set-password page should redirect without state", async ({ page }) => {
    await page.goto("/set-password");
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("should be responsive on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "Welcome back" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });
});
