import * as core from '@actions/core';
import * as github from '@actions/github';
import type { Context } from '@actions/github/lib/context';

function hasPullRequestPayload(context: Context): context is Context & {
  payload: {
    pull_request: NonNullable<Context['payload']['pull_request']>;
  };
} {
  return 'pull_request' in context.payload;
}

async function run(): Promise<void> {
  try {
    const authToken = core.getInput('github_token', { required: true });
    const eventName = github.context.eventName;
    core.info(`Event name: ${eventName}`);

    if (!hasPullRequestPayload(github.context)) {
      core.setFailed(
        `Invalid event: ${eventName}, or missing pull_request property on the context.payload`,
      );
      return;
    }

    const owner = github.context.payload.pull_request.base.user.login;
    const repo = github.context.payload.pull_request.base.repo.name;

    const octokit = github.getOctokit(authToken);
    // Ensure we have the latest PR data
    const { data: pullRequest } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: github.context.payload.pull_request.number,
    });

    const title = pullRequest.title;

    core.info(`Current Pull Request title: "${title}"`);

    const regex = RegExp(core.getInput('regex'));
    const hint = core.getInput('hint');

    if (!regex.test(title)) {
      core.setFailed(
        `
Pull Request title "${title}" failed to match rule: ${regex}

 ${hint ?? ''}
      `,
      );
      return;
    }

    // Check max length
    const maxLen = parseInt(core.getInput('max_length'));
    if (maxLen > 0 && title.length > maxLen) {
      core.setFailed(
        `Pull Request title "${title}" is greater than max length specified - ${maxLen}`,
      );
      return;
    }
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

run();
