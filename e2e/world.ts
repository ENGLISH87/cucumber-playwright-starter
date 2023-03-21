import { After, Before, BeforeAll, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { defineConfig, Browser, BrowserContext, chromium, Page } from '@playwright/test';
import { HomePage } from './page_objects/homepage.po';

/** World.
 *  @class
 *  Test World is instantiated on each scenario and shares state between step definitions, this can be a reference
 *  to the browser object, page objects or any custom code - best practice is to create your page objects here
 */
export class TestWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  homePage!: HomePage;

  /**
   * @param {IWorldOptions=} opts
   */
  constructor(opts: any) {
    super(opts);
  }

  async init() {
    this.browser = await chromium.launch({ headless: this.parameters.headless });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.homePage = new HomePage(this, this.page);

    return this.page.goto(this.parameters.appUrl);
  }

  async destroy() {
    await this.page.close();
    await this.context.close();
    await this.browser.close();
  }
}

setWorldConstructor(TestWorld);
setDefaultTimeout(60000);

BeforeAll(() => {
  defineConfig({
    use: {
      screenshot: 'on',
    },
    snapshotPathTemplate: 'e2e/results/screenshots/{testFilePath}/{arg}{ext}',
  });
});

Before(async function (this: TestWorld) {
  await this.init();
});

After(async function (this: TestWorld) {
  await this.destroy();
});
