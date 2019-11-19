# `ghi` - github-issue-cli

github-issue-cli(`ghi`) is CLI application to search for your good first issue.  
This tool looks for issues that no one is working on.

This tool is under development so if you use it, please be careful.

## Getting started

At first, please install `github-issue-cli` globally

```
npm i -g github-issue-cli
```

Next, You need to run a `login` subcommand to use ghi.
(After installing github-issue-cli, you can use `ghi` command.)

```
ghi login
```

The token you entered will be stored in `~/.ghirc`.

## Basic usage

List issues with `good first issue` label that no one is working on microsoft/TypeScript.

```
ghi list microsoft/TypeScript
```

## Advanced topics

### Saved queries

Do you want to search for issues other than `good first issue`? This can be achieved by using saved queries. Currently, to add or change a saved query, edit the `~/.ghirc` directly.

`.ghirc` is a JSON file. When you execute the login command, it has the following keys.

```json
{
  "token": "xxx",
  "login": "yyy"
}
```

To register a custom query, add a `queries` field like this:

```diff
 {
   "token": "xxx",
   "login": "yyy"
+  "queries": {
+    "*/*": {
+      "for all repository": "label:Bug"
+    },
+    "Leko/*": {
+      "for specified owner/org repositories": "no:assignee -label:bug"
+    },
+    "microsoft/TypeScript": {
+      "for specified repository": "label:\"good first issue\" label:\"help wanted\" -label:\"In Discussion\" label:\"Experience Enhancement\""
+    }
+  }
 }
```

Specify the repository name directly under the `queries` field. You can also specify wildcards using an asterisk.  
When executing the `list` command, if there are multiple queries that match the repository specified in its argument, select which query to execute.

## Contribution

1. Fork this repository
1. Write your code
1. Run tests
1. Create pull request to master branch

## Development

```
git clone git@github.com:Leko/github-issue-cli.git
cd github-issue-cli
npm i

npx ts-node -T src/app.ts
```

## License

This package under [MIT](https://opensource.org/licenses/MIT) license.
