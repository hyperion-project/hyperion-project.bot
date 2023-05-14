module.exports = async function trigger(context) {
  const { github, log } = context;
  const { issue, comment } = context.payload;
  const { pull_request, state } = issue;
  const { user } = comment;
  log("Handle comments");

  if (user.type !== "User") {
    log("Comment not from User");
    return;
  }

  const permissions = await github.repos.reviewUserPermissionLevel(
    context.repo({
      username: user.login,
    })
  );

  const level = permissions.data.permission;
  if (level !== "admin" && level !== "write") {
    log("No permission");
    return;
  }

  if (!comment.body.includes("@Hyperion-Bot build APT")) {
    log("Not a valid command");
    return;
  }

  const hashtag_match = comment.body.match(/(?<!#)#\S+/g);
  const hashtag = hashtag_match ? hashtag_match.replace("#", "") : "";
  log(`Hastag (${hashtag})`);

  /*  const action = context.payload.action;
  const body = context.payload.issue.body;
  if (action === "opened" && !body.includes("<!-- Please don't delete this template or we'll close your issue -->")) {
    if (!config.Issues.opened) {
      return;
    }

    await context.github.issues.update(
      context.issue({
        state: 'closed'
    }))
    
    return context.github.issues.createComment(
      context.issue({
       body: await replaceTemplateVariables(context, config.Issues.opened)
      })
    );

  }

*/
  return;
};
