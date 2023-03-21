import { After, AfterStep, Before, BeforeAll, ITestCaseHookParameter } from '@cucumber/cucumber';
import { TestWorld } from './world';
import { rmdirSync } from 'fs';

/**
 * before all tests - delete existing results folder
 */
BeforeAll(() => {
  rmdirSync('e2e/results', { recursive: true });
});

/**
 * before each scenario - setup browser and context and new page
 */
Before(async function (this: TestWorld) {
  await this.init();
});

/**
 * after each step, check if scenario failed - if so take a screenshot
 * save file and attach to the report
 */
AfterStep(async function (this: TestWorld, scenario: ITestCaseHookParameter) {
  if ((scenario.result?.status as any) === 'FAILED') {
    // take screenshots if switched on for errors
    if (this.playwrightConf.use?.screenshot !== 'off') {
      const filename =
        scenario.gherkinDocument.feature?.name.replaceAll(' ', '_') +
        '_' +
        scenario.pickle.name.replaceAll(' ', '_') +
        '.png';

      const buffer = await this.page.screenshot({
        path: `${this.playwrightConf.snapshotDir}/${filename}`,
      });
      this.attach(buffer, 'image/png');
    }
  }
});

/**
 * after scenario - clear existing browser page and context
 */
After(async function (this: TestWorld) {
  await this.destroy();
});
