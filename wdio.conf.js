const debug = !!process.env.DEBUG;
const execArgv = debug ? ['--inspect'] : [];
const stepTimout = debug ? 24 * 60 * 60 * 1000 : 6000;
const capabilities = debug
    ? [{ browserName: 'chrome', maxInstances: 1 }]
    : [
          {
              browserName: 'chrome',
          },
          {
              browserName: 'firefox',
          },
      ];

const maxInstances = debug ? 1 : 10;

exports.config = {
    runner: 'local',
    path: '/wd/hub',
    port: 4444,
    specs: ['./src/features/**/*.feature'],
    exclude: [
    ],
    maxInstances: maxInstances,
    capabilities: capabilities,
    logLevel: 'silent',
    execArgv: execArgv,
    services: ['selenium-standalone'], // Make sure Java JDK is installed
    framework: 'cucumber',
    reporters: [
        'spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: false,
                useCucumberStepReporter: true,
            },
        ],
    ],
    cucumberOpts: {
        backtrace: false, // <boolean> show full backtrace for errors
        dryRun: false, // <boolean> invoke formatters without executing steps
        failFast: false, // <boolean> abort the run on first failure
        format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
        colors: true, // <boolean> disable colors in formatter output
        snippets: true, // <boolean> hide step definition snippets for pending steps
        source: true, // <boolean> hide source uris
        profile: [], // <string[]> (name) specify the profile to use
        strict: false, // <boolean> fail if there are any undefined or pending steps
        tagExpression: '', // <string> (expression) only execute the features or scenarios with tags matching the expression
        timeout: stepTimout, // <number> timeout for step definitions
        ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings
        requireModule: [
            // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
            'tsconfig-paths/register',
            () => {
                require('ts-node').register({ files: true });
            },
        ],
        require: ['./src/stepDefinitions/*.steps.ts'], // <string[]> (file/dir) require files before executing features
    },
    before: function(capabilities, specs) {
        require('ts-node').register({ files: true });
    },
    afterStep: function(uri, feature, { error }) {
        if (error !== undefined) {
            browser.takeScreenshot();
        }
    },
};
