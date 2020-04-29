import { isMatch } from "micromatch"
import { Config } from "../Config"

const defaultQueries = {
  "good first issue": 'label:"good first issue"',
}

export function getSavedQueries(
  config: Pick<Config, "queries">,
  repo: { owner: string; name: string }
): { name: string; query: string }[] {
  const { owner, name } = repo
  const queries = Object.entries(config.queries || {})
    .filter(([repo]) => isMatch(`${owner}/${name}`, repo))
    .concat([["*/*", defaultQueries]])
    .reduce(
      (acc, [_, queries]) =>
        acc.concat(
          Object.entries(queries).map(([name, query]) => ({ name, query }))
        ),
      [] as { name: string; query: string }[]
    )
  return queries
}
