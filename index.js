module.exports = app => {
  app.on("pull_request.opened", async context => {
    const workflow_runs = (await context.github.actions.listRepoWorkflowRuns({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      author: context.payload.sender.login
    })).data.workflow_runs;

    for (const pull of context.payload.check_run.check_suite.pull_requests) {
      app.log(pull);
    }

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
    const workflow_runs = (await context.github.actions.listRepoWorkflowRuns({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      author: context.payload.sender.login
    })).data.workflow_runs;

    const message = `I have a new link to your workflow artifacts for you:
[GitHub Actions](https://github.com/${context.payload.repository.full_name}/actions/runs/${workflow_runs[0].id})`;

    return context.github.issues.createComment(
      context.issue({ body: message })
    );
  });
};