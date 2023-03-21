/* Generates the cucumber report with optional settings */
const path = require("path");
const fs = require("fs");
const stripAnsi = require("strip-ansi");

let buildURL = 'localhost';
if (process.env.BUILD_ID) {
  // customise for your CI location
  buildURL = `https://console.cloud.google.com/cloud-build/builds/${process.env.BUILD_ID}`;
}

// attach any custom data - e.g build id's or environments
let customData = {
  title: 'Environment Info',
  data: [
    {label: 'Project', value: 'E2E Tests'},
    {label: 'Build', value: buildURL}
  ]
};

const reportDir = `results/${process.env.BUILD_ID || ''}`;
console.log(`Generating report: ${reportDir}`);

// hack to strip ansi color codes from console output in test report
try {
  const jsonPath = path.join(__dirname, '..', reportDir, 'cucumber_report.json');
  const data = fs.readFileSync(jsonPath, 'utf8');
  const report = JSON.parse(data.toString(), (k, v) => stripAnsi(v));
  fs.writeFileSync(`${jsonPath}`, JSON.stringify(report));
} catch (error) {
  console.error("Error parsing report json");
}

report.generate('Cucumber Test Results', reportDir, {customData: customData});

