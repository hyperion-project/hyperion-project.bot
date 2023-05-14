const pr_comment = require("./src/pr_comment");
const issues = require("./src/issues");
const trigger = require("./src/trigger");

module.exports = (app) => {
  app.on(["pull_request.opened", "pull_request.synchronize"], pr_comment);
  app.on("issues.opened", issues);
  app.on(["issue_comment.created", "issue_comment.edited"], trigger);
};
