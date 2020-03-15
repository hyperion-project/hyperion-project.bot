const pr_comment = require("./src/pr_comment");

module.exports = app => {
  app.on(["pull_request.opened", "pull_request.synchronize"], pr_comment);
  // TODO
  // app.on(["issue_comment.created", "issue_comment.edited"], issueComment);
}