module.exports = app => {
  app.on("pull_request.opened", async context => {
    const message = `Hello @${context.payload.pull_request.user.login} :wave: 

I'm your friendly neighborhood bot and would like to say thank you for
submitting a pull request to Hyperion!

To help you and other users test your changes faster,
see [GitHub Actions](https://github.com/${context.payload.repository.full_name}/actions) for finished workflow artifacts.

Best regards,
Hyperion-Project`;
    return context.github.issues.createComment(
      context.issue({ body: message })
    );
  });
};