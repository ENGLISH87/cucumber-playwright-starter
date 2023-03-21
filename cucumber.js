const fs = require('fs');
const path = require('path');
const resultsDir = path.join(__dirname, 'e2e/results');

/**
 * check if e2e/results dir exists, if not create
 */
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

/**
 * Cucumber.js Config
 * Cucumber profiles for different browser / devices
 */

// Node parameters set via command line or CI
const common = {
  format: [
    `json:./e2e/results/cucumber-report.json`,
    '@cucumber/pretty-formatter',
    'html:./e2e/results/cucumber-report.html',
  ],
  requireModule: ['ts-node/register'],
  require: [path.join(__dirname, 'e2e/**/*.ts')],
  paths: [path.join(__dirname, 'e2e/features/')],
  publishQuiet: true,
  timeout: 30000,
  worldParameters: {
    headless: false,
    appUrl: process.env.APP_URL || 'http://localhost:4200',
    mockApiUrl: process.env.APP_URL || 'http://apimock:3000',
  },
};

const local = {
  ...common,
};

const ci = {
  ...common,
  parallel: 5, // run in parallel in pipeline to speed up test execution
  worldParameters: {
    ...common.worldParameters,
    headless: true,
  },
};

const debug = {
  ...common,
  mode: 'generate', // cucumber option for generating reference screenshots
  paths: [], // set to empty as path defined in launch.json feature debug
};

module.exports = {
  default: local,
  debug: debug,
  ci: ci,
};
