import { IWorldOptions, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, chromium, Page, PlaywrightTestConfig } from '@playwright/test';
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
  playwrightConf: PlaywrightTestConfig;

  constructor(opts: IWorldOptions) {
    super(opts);

    this.playwrightConf = {
      use: {
        screenshot: 'only-on-failure',
        headless: this.parameters.headless,
      },
      timeout: 10000,
      snapshotDir: './e2e/results/screenshots',
    };
  }

  /**
   * init: setup browser, context and new page and any page objects
   * this is called from a cucumber Before hook to ensure everything
   * is setup before each set of tests
   */
  async init() {
    const { timeout, use } = this.playwrightConf;
    this.browser = await chromium.launch({ headless: use?.headless, timeout });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    this.homePage = new HomePage(this);

    await this.page.goto(this.parameters.appUrl);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * destroy: close page, browser context and browser.
   * This is usually called from a cucumber After hook
   */
  async destroy() {
    await this.page.close();
    await this.context.close();
    await this.browser.close();
  }
}

setWorldConstructor(TestWorld);
setDefaultTimeout(30000);
