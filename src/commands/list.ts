import fs from "fs"
import path from "path"
import { CommandModule } from "yargs"
import inquirer from "inquirer"
import IntlRelativeTimeFormat from "@formatjs/intl-relativetimeformat"
import "@formatjs/intl-relativetimeformat/polyfill-locales"
import { emojify } from "node-emoji"
import chalk from "chalk"
import * as chromatism from "chromatism"
import { resolve } from "../Config"
import { getClient } from "../utils/graphql"
import { showSpinnerWhileProcessing } from "../utils/showSpinnerWhileProcessing"
import { getSavedQueries } from "../utils/getSavedQueries"

const issuesQuery = fs.readFileSync(
  path.join(__dirname, "..", "queries", "issues.graphql"),
  "utf8"
)

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
    const savedQueries = getSavedQueries(config, { owner, name })

    let query = savedQueries[0]
    if (savedQueries.length > 1) {
      const { queryIndex } = await inquirer.prompt([
        {
          name: "queryIndex",
          type: "rawlist",
          message: `Multiple queries detected. Which one to use?`,
          choices: savedQueries.map(({ name, query }, i) => ({
            name: `${name} (${query})`,
            value: i,
          })),
        },
      ])
      query = savedQueries[queryIndex]
    }

    const q = `is:open repo:${owner}/${name} ${query.query}`
    const {
      search,
    }: any = await showSpinnerWhileProcessing(
      `Fetching issues ${owner}/${name} issues`,
      async () => graphql(issuesQuery, { q })
    )
    const issues = search.edges.map(({ node }: any) => node)
    const noAssociatedIssues = issues
      .filter((issue: any) => {
        const timelineItems = issue.timelineItems.edges
          .filter(Boolean)
          .map(({ node }: any) => node)
        const willBeClosedEvents = timelineItems.filter(
          ({ willCloseTarget }: any) => willCloseTarget
        )

        return willBeClosedEvents.length === 0
      })
      .sort(
        (a: any, b: any) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      )

    const now = Date.now()
    const formatter = new IntlRelativeTimeFormat("en-US", { numeric: "auto" })
    noAssociatedIssues.forEach(
      ({ number, title, url, updatedAt, comments, labels }: any) => {
        const relative = formatter.format(
          Math.round(
            (new Date(updatedAt).getTime() - now) / 1000 / 60 / 60 / 24
          ),
          "day"
        )
        const numComments = comments.totalCount
        const labelsStr = labels.nodes
          .map(({ name, color }: any) =>
            chalk.bgHex(color).hex(chromatism.contrastRatio(`#${color}`).hex)(
              name
            )
          )
          .join(", ")

        console.log(`\n#${number} ${chalk.bold(title)}`)
        console.log(emojify(`  :link: ${url}`))
        console.log(emojify(`  :label: ${labelsStr}`))
        console.log(
          emojify(
            `  :left_speech_bubble: ${numComments}, :timer_clock: ${relative}`
          )
        )
      }
    )
  },
} as CommandModule
