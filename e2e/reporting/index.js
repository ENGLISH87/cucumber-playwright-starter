const reporter = require('cucumber-html-reporter');
const path = require('path');
const fs = require('fs');
const pjson = require('../../package.json');
const { exec } = require('child_process');

(async () => {
  const npmVersion = await getNpmVersion();
  const driver = 'node_modules/@playwright/test';

  if (!fs.existsSync(path.join(__dirname, '..', 'results'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'results'));
  }

  var opts = {
    theme: 'bootstrap',
    jsonFile: path.join(__dirname, '..', 'results/cucumber-report.json'),
    output: path.join(__dirname, '..', 'results/report.html'),
    reportSuiteAsScenario: true,
    scenarioTimestamp: true,
    launchReport: false,
    metadata: {
      'App version': pjson.version || '0.0.0',
      'Test environment': 'dev',
      Platform: process.env.Platform,
      Node: process.version,
      NPM: npmVersion,
      Executed: process.env.CI ? 'Remote' : 'Local',
    },
  };

  reporter.generate(opts);
})();

function getNpmVersion() {
  return new Promise((resolve, reject) => {
    exec('npm -v', (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      } else {
        resolve(stdout.trim());
      }
    });
  });
}
