const Engine = require("@serverless-cd/engine").default;
const core = require("@serverless-cd/core");
const path = require("path");
const { Writable } = require("stream");
const { getLogger } = require("./logger.js");

const { fs } = core;
const logFile = path.join(__dirname, "logs", "deploy.log");

fs.ensureFileSync(logFile);

const stream = new Writable({
  write(chunk, encoding, callback) {
    fs.writeFile(logFile, chunk, { encoding, flag: "a" }, callback);
  },
});
const logger = getLogger("123", { stream });

const engine = new Engine({
  cwd: __dirname,
  steps: [
    {
      run: "s deploy --use-local -y",
    },
  ],
  logConfig: {
    customLogger: logger,
  },
});

engine.start();
