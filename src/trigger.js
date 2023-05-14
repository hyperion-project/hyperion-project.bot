const { Octokit } = require("@octokit/rest")
const { createAppAuth } = require("@octokit/auth-app")

module.exports = async function trigger(context) {
  const { octokit, log } = context;
  const { comment, repository } = context.payload;
  const [owner, repo] = repository.full_name.split('/');
  const { user } = comment;

  if (user.type !== "User") {
    return;
  }

  const permissions = await octokit.repos.getCollaboratorPermissionLevel(
    context.repo({
      username: user.login,
    })
  )

  const level = permissions.data.permission;
  if (level !== "admin" && level !== "write") {
    return;
  }

  if (!comment.body.includes("@Hyperion-Bot build APT")) {
    return;
  }

  const hashtag_match = comment.body.match(/(?<!@ )@ \S+/g);
  let hashtag = 'master';
  if (hashtag_match) {
    hashtag = hashtag_match.pop().replace('@ ', '');
    log('SHA: ', hashtag);
  }

  const appClient = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.APP_ID,
      privateKey: process.env.PRIVATE_KEY,
      installationId: context.payload.installation.id,
    }
  })

  const dispatchResp = await appClient.actions.createWorkflowDispatch( {
    owner,
    repo,
    workflow_id: 'apt.yml',
    ref: repository.default_branch,
    inputs: {
      head_sha: hashtag,
    },
  })

  log('dispatchResponse: ', dispatchResp);

  if (context.payload.action === "created") {
    const reactResp = await octokit.reactions.createForIssueComment({
      owner,
      repo,
      comment_id: context.payload.comment.id,
      content: 'rocket'
    });

    log('reactResponse: ', reactResp);
  }
  
  return;
};
