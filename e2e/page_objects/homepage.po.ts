import { Locator, Page } from '@playwright/test';
import { TestWorld } from 'e2e/world';

export class HomePage {
  constructor(private world: TestWorld, private page: Page) {}

  async navigateTo(): Promise<void> {
    await this.page.goto(`${this.world.parameters.appUrl}`);
    // await this.element(By.text, 'Reference ID').waitForVisible();
  }

  async hasRunningText(): Promise<boolean> {
    return this.page.isVisible('//span[text()="cucumber-playwright-starter app is running!"]');
  }
}
