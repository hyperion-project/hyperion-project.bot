const sleep = require("system-sleep");
const getConfig = require("probot-config");

const CONFIG_NAME = "pr_comment.yml";

const replaceTemplateVariables = async function(context, message) {
  let output = message;
  output = output.replace(
    '$AUTHOR',
    context.payload.pull_request.user.login
  );
  output = output.replace(
    '$REPO_FULL_NAME',
    context.payload.repository.full_name
  );
  output = output.replace('$RUN_ID', await getRunID(context));

  return output;
};

const getRunID = async function(context) {
  // wait 10 seconds before we request the workflows from GitHub
  sleep(10000);

  const workflow_runs = (await context.github.request({
    baseUrl: "https://api.github.com",
    url: `/repos/${context.payload.repository.full_name}/actions/runs`,
    method: "GET",
    headers: { accept: "application/vnd.github.v3+json" }
  })).data.workflow_runs;

  return workflow_runs[0].id;
};

module.exports = async function pr_comment(context) {
  const config = (await getConfig(context, CONFIG_NAME)) || {};
  if (!config.PullRequest) {
    return;
  }

  const action = context.payload.action;
  if (action === "opened") {
    if (!config.PullRequest.opened) {
      return;
    }

    return context.github.issues.createComment(
      context.issue({
        body: await replaceTemplateVariables(context, config.PullRequest.opened)
      })
    );
  } else if (action === "synchronize") {
    if (!config.PullRequest.synchronize) {
      return;
    }

    return context.github.issues.createComment(
      context.issue({
        body: await replaceTemplateVariables(context, config.PullRequest.synchronize)
      })
    );
  }

  return;
};
