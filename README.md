## Usage

See [action.yml](./action.yml)

```yaml
steps:
  - uses: msutkowski/action-pr-title@v1
    with:
      regex: '([a-z])+\/([a-z])+' # Regex the title should match.
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
          hint: >
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

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to reference the stable and latest V1 action
