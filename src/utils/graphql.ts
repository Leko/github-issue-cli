import { graphql } from "@octokit/graphql"
import { Config } from "../Config"

export function getClient(config: Pick<Config, "token">) {
  if (!config.token) {
    throw new Error(`Access token not found. Please try 'ghi login' before`)
  }

  return graphql.defaults({
    headers: {
      authorization: `token ${config.token}`,
    },
  })
}
