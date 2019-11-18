import chalk from "chalk"
import { CommandModule } from "yargs"
import { resolve } from "../Config"
import { getClient } from "../utils/graphql"
import { showSpinnerWhileProcessing } from "../utils/showSpinnerWhileProcessing"

export default {
  command: "list <repo>",
  describe: "List issues for specified repository",
  builder: yargs =>
    yargs.positional("repo", {
      describe: "owner and repository name (e.g. microsoft/TypeScript)",
    }),
  async handler(argv) {
    const config = resolve(argv.config as string)
    const [owner, name] = (argv.repo as string).split("/")
    if (!owner || !name) {
      throw new Error("Malformed. <repo> must be formatted with `owner/name`")
    }
    const graphql = getClient(config)
    const repository = await showSpinnerWhileProcessing(
      "Fetching your information from GitHub",
      async () => {
        const { repository }: any = await graphql(
          `
            query GetIssues($owner: String!, $name: String!) {
              repository(owner: $owner, name: $name) {
                issues(
                  labels: ["good first issue", "help wanted"]
                  states: [OPEN]
                  first: 100
                ) {
                  edges {
                    node {
                      title
                      url
                      timelineItems(
                        first: 100
                        itemTypes: [REFERENCED_EVENT, CROSS_REFERENCED_EVENT]
                      ) {
                        edges {
                          node {
                            ... on CrossReferencedEvent {
                              referencedAt
                              resourcePath
                              source {
                                ... on PullRequest {
                                  number
                                  url
                                  title
                                }
                              }
                              willCloseTarget
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
          {
            owner,
            name,
          }
        )

        return {
          message: chalk.dim(`Done`),
          returnValue: repository,
        }
      }
    )
    console.log(repository)
  },
} as CommandModule
