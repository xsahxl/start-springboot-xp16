const { command } = require("execa");
const path = require("path");

function onFinish(cp) {
  return new Promise((resolve, reject) => {
    const stdout = [];
    const stderr = [];
    cp.stdout.on("data", (chunk) => {
      console.info(chunk.toString());
      stdout.push(chunk);
    });

    cp.stderr.on("data", (chunk) => {
      console.info(chunk.toString());
      stderr.push(chunk);
    });

    cp.on("exit", (code) => {
      code === 0
        ? resolve({})
        : reject(new Error(Buffer.concat(stderr).toString()));
    });
  });
}

(async () => {
  const cp = command("mvn package -DskipTests", {
    cwd: path.resolve(__dirname, "./code"),
    shell: true,
  });
  await onFinish(cp);
})();
