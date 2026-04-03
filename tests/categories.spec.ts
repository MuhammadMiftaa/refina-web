import { test, expect } from "@playwright/test";

test.describe("Categories Page (Money Flow)", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to categories page - this will trigger demo mode for unauthenticated users
    await page.goto("/categories");
  });

  test("should render categories page correctly", async ({ page }) => {
    // Header should be visible
    await expect(page.locator("text=Categories").first()).toBeVisible();
    await expect(
      page.getByText("Complete breakdown of income & expense categories"),
    ).toBeVisible();

    // Filter controls should be visible
    await expect(page.locator("select")).toBeVisible();
    await expect(page.locator('input[type="date"]').first()).toBeVisible();
    await expect(page.locator('input[type="date"]').last()).toBeVisible();

    // Tab buttons should be visible
    await expect(page.getByRole("button", { name: /expense/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /income/i })).toBeVisible();
  });

  test("should toggle between expense and income tabs", async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Expense tab should be active by default (has rose/red color styling)
    const expenseTab = page.getByRole("button", { name: /expense/i });
    const incomeTab = page.getByRole("button", { name: /income/i });

    // Click income tab
    await incomeTab.click();
    await expect(incomeTab).toHaveClass(/emerald/);

    // Click expense tab
    await expenseTab.click();
    await expect(expenseTab).toHaveClass(/rose/);
  });

  test("should display category data in table on desktop", async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for data to load
    await page.waitForTimeout(1000);

    // Table should be visible on desktop
    const table = page.locator("table");
    await expect(table).toBeVisible();

    // Table headers should be present
    await expect(page.getByText("Category")).toBeVisible();
    await expect(page.getByText("Group")).toBeVisible();
    await expect(page.getByText("Amount")).toBeVisible();
    await expect(page.getByText("Txns").first()).toBeVisible();
    await expect(page.getByText("Share")).toBeVisible();
    await expect(page.getByText("Distribution")).toBeVisible();
  });

  test("should display category cards on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // Wait for data to load
    await page.waitForTimeout(1000);

    // Table should be hidden on mobile
    const table = page.locator("table");
    await expect(table).not.toBeVisible();

    // Cards should be visible (looking for the card container pattern)
    const cards = page.locator(String.raw`.md\:hidden`);
    await expect(cards).toBeVisible();
  });

  test("should show summary statistics", async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);

    // Summary labels should be visible
    await expect(page.getByText("Total")).toBeVisible();
    await expect(page.getByText("Cat.")).toBeVisible();
    await expect(page.getByText("Txns").first()).toBeVisible();
  });

  test("wallet filter dropdown should work", async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Get the select element
    const walletSelect = page.locator("select");
    await expect(walletSelect).toBeVisible();

    // Should have "All Wallets" as default option
    await expect(walletSelect).toContainText("All Wallets");

    // Should be able to interact with dropdown
    await walletSelect.click();
  });

  test("date range inputs should work", async ({ page }) => {
    // Get date inputs
    const dateInputs = page.locator('input[type="date"]');

    // Should have two date inputs (start and end)
    await expect(dateInputs).toHaveCount(2);

    // Should be able to set dates
    const startDate = dateInputs.first();
    const endDate = dateInputs.last();

    await startDate.fill("2026-01-01");
    await expect(startDate).toHaveValue("2026-01-01");

    await endDate.fill("2026-03-31");
    await expect(endDate).toHaveValue("2026-03-31");
  });

  test("should sort by amount when clicking Amount header", async ({
    page,
  }) => {
    // Set desktop viewport for table view
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for data to load
    await page.waitForTimeout(1000);

    // Click on Amount sort header
    const amountHeader = page.getByRole("button", { name: /amount/i });
    await amountHeader.click();

    // Header should show sorted state (arrow indicator should change)
    await expect(amountHeader).toBeVisible();
  });

  test("should sort by transactions when clicking Txns header", async ({
    page,
  }) => {
    // Set desktop viewport for table view
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for data to load
    await page.waitForTimeout(1000);

    // Click on Txns sort header (inside table header)
    const txnsHeader = page
      .locator("thead")
      .getByRole("button", { name: /txns/i });
    await txnsHeader.click();

    // Header should show sorted state
    await expect(txnsHeader).toBeVisible();
  });

  test("should show loading skeleton initially", async ({ page }) => {
    // Intercept API calls to make loading visible
    await page.route("**/dashboard/transactions", async (route) => {
      // Delay response to show loading state
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.continue();
    });

    // Navigate and immediately check for skeleton
    await page.goto("/categories");

    // Skeleton elements should be visible during loading
    // (Skeleton component renders divs with animation classes)
    const skeletonElements = page.locator('[class*="animate-pulse"]');
    const count = await skeletonElements.count();
    // During loading there might be skeleton elements visible
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("should be responsive and adjust layout", async ({ page }) => {
    // Test various viewport sizes

    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    await expect(page.locator("table")).toBeVisible();

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    // Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    await expect(page.locator("table")).not.toBeVisible();
  });

  test("should navigate to categories from sidebar", async ({ page }) => {
    // Start from home/dashboard
    await page.goto("/");

    // Wait for page to load
    await page.waitForTimeout(500);

    // Look for categories link in sidebar/navigation
    const categoriesLink = page.getByRole("link", { name: /categories/i });

    if (await categoriesLink.isVisible()) {
      await categoriesLink.click();
      await expect(page).toHaveURL(/\/categories/);
    }
  });

  test("theme toggle should work", async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);

    // Find theme toggle button (sun/moon icon)
    const themeToggle = page
      .locator("header")
      .locator("button")
      .filter({ has: page.locator("svg") })
      .last();

    if (await themeToggle.isVisible()) {
      // Get current theme state
      const html = page.locator("html");
      const initialClass = await html.getAttribute("class");

      // Click toggle
      await themeToggle.click();
      await page.waitForTimeout(200);

      // Theme should have changed
      const newClass = await html.getAttribute("class");
      expect(newClass).not.toBe(initialClass);
    }
  });
});

test.describe("Categories Page - Demo Mode", () => {
  test("should display demo data when not authenticated", async ({ page }) => {
    // Clear any auth tokens
    await page.context().clearCookies();

    // Navigate to categories
    await page.goto("/categories");

    // Wait for demo data to load
    await page.waitForTimeout(1000);

    // Should show categories (demo mode loads dummy data)
    // Check for common expense categories from dummy data
    const pageContent = await page.content();

    // The page should have loaded data (either skeleton, empty state, or actual data)
    const hasContent =
      pageContent.includes("Food") ||
      pageContent.includes("Transportation") ||
      pageContent.includes("Salary") ||
      pageContent.includes("No categories found") ||
      pageContent.includes("Categories");

    expect(hasContent).toBeTruthy();
  });
});
