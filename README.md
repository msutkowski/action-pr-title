## Usage

```yaml
steps:
  - uses: msutkowski/action-pr-title@v1
    with:
      regex: '([a-z])+\/([a-z])+' # Regex to test the PR title against
      max_length: 20 # Max length of the title
      hint: 'PR titles should match a format like: fix: [ABC-1234] some description' # A hint for the desired format
      github_token: ${{ github.token }} # Default: ${{ github.token }}
```

### Note:

Ensure to add `types` to the Pull requests webhook event as by default workflows are triggered only
for `opened`, `synchronize`, or `reopened` pull request events. Read more about
it [here](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request).

```yaml
name: PR title check

on:
  pull_request:
    types: [opened, edited, synchronize, reopened]

jobs:
  check_title:
    runs-on: ubuntu-latest
    steps:
      - name: Enforce PR naming convention
        uses: msutkowski/action-pr-title@v1
        with:
          regex: '^(fix|feat|chore|(fix|feat|chore)\(\w.*\)):\s(\[\w{1,8}-\d{1,8}\]|.*).*'
          hint: |
            You can pass the following formats:

            fix: [OR-123] some title of the PR
            fix(scope): [OR-123] some title of the PR
            feat: [OR-1234] some title of the PR
            chore: update some action
```

## Code in Main

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

...

````

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:

```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
````

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
