import { test, expect } from '@playwright/test';

test.describe('Eurowindowdoor Chatbot UI Tests', () => {
  test('should load the homepage and render the chatbot interface', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');

    // Check if the page title is correct (basic smoke test)
    await expect(page).toHaveTitle(/Eurowindow/i);

    // Look for the chat input box (using a generic placeholder or accessible name, 
    // we may need to adjust this locator based on the exact UI implementation)
    const chatInput = page.getByPlaceholder(/nhắn tin|nhập|hỏi|chat/i).first();
    
    // Wait for the input to be visible
    await expect(chatInput).toBeVisible({ timeout: 10000 });

    // Type a simple general question to trigger the 'general' intent
    await chatInput.fill('Xin chào, đây là một bài test tự động từ Playwright.');
    
    // Press enter or click the send button
    await chatInput.press('Enter');

    // Look for a response bubble from the assistant
    // Usually these have specific roles or classes. We'll wait for a generic 'assistant' indicator.
    // Assuming the response appears within 10 seconds.
    const assistantResponse = page.locator('text=Xin chào|Chào|Eurowindow').last();
    await expect(assistantResponse).toBeVisible({ timeout: 15000 });
  });
});
