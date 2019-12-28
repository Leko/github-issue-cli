# `ghi` - github-issue-cli

![](https://user-images.githubusercontent.com/1424963/69118167-bfc6a580-0ad5-11ea-989d-ad7ea13631a4.gif)

github-issue-cli(`ghi`) is CLI application to search for your good first issue.  
This tool looks for issues that no one is working on.

Note: This tool is under development so if you use it, please be careful.

## Getting started

At first, please install `github-issue-cli` globally

```
npm i -g github-issue-cli
```

Next, You will need to run a `login` subcommand to use ghi.
(After installing github-issue-cli, you will be able to use `ghi` command.)

```
ghi login
```

The token you entered will be stored in `~/.ghirc`.

## Basic usage

You can list issues with `good first issue` label by using following command:

```
ghi list [org]/[repo]
```

For example, the following command will list `good first issue` in `microsoft/TypeScript` that no one is working on.

```
ghi list microsoft/TypeScript
```

## Advanced topics

### Saved queries

If you want to search for issues with label other than `good first issue`, you can use saved queries.
Currently, in order to add or change a saved query, edit the `~/.ghirc` directly.

`.ghirc` is a JSON file. When you execute the login command, it will be automatically generated with the following keys.

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

Specify the repository name directly under the `queries` field. You can also specify wildcards using an asterisk (`*`).  
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
