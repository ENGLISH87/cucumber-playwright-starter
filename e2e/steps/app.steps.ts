import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TestWorld } from 'e2e/world';

Given('I am on the homepage', async function (this: TestWorld) {
  await this.homePage.navigateTo();
  expect(await this.page.title()).toEqual('CucumberPlaywrightStarter');
});

Then('I see a banner', async function (this: TestWorld) {
  const el: boolean = await this.homePage.hasRunningText();
  expect(el).toBeTruthy();
});
