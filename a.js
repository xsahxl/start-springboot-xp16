const { command } = require("execa");
const path = require("path");

command("mvn package -DskipTests", {
  cwd: path.resolve(__dirname, "./code"),
  shell: true,
  stdio: "inherit",
});
