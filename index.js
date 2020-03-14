const sleep = require('system-sleep');

module.exports = app => {
  app.on("pull_request.opened", async context => {
    // wait 10 seconds before we request the workflows from GitHub
    sleep(10000);

    const workflow_runs = (await context.github.request({
      baseUrl: "https://api.github.com",
      url: `/repos/${context.payload.repository.full_name}/actions/runs`,
      method: "GET",
      headers: { accept: "application/vnd.github.v3+json" }
    })).data.workflow_runs;

    const message = `Hello @${context.payload.pull_request.user.login} :wave: 

I'm your friendly neighborhood bot and would like to say thank you for
submitting a pull request to Hyperion!

To help you and other users test your changes faster,
see [GitHub Actions](https://github.com/${context.payload.repository.full_name}/actions/runs/${workflow_runs[0].id}) for finished workflow artifacts.

If you make changes to your PR, i create a new link to your workflow
artifacts for each commit.

Best regards,
Hyperion-Project`;
    return context.github.issues.createComment(
      context.issue({ body: message })
    );
  });

  app.on("pull_request.synchronize", async context => {
    // wait 10 seconds before requesting the workflows from GitHub
    sleep(10000);

    const workflow_runs = (await context.github.request({
      baseUrl: "https://api.github.com",
      url: `/repos/${context.payload.repository.full_name}/actions/runs`,
      method: "GET",
      headers: { accept: "application/vnd.github.v3+json" }
    })).data.workflow_runs;

    const message = `I have a new link to your workflow artifacts for you:
[GitHub Actions](https://github.com/${context.payload.repository.full_name}/actions/runs/${workflow_runs[0].id})`;

    return context.github.issues.createComment(
      context.issue({ body: message })
    );
  });
};
