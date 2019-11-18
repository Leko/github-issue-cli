import { CommandModule } from "yargs"
import { resolve } from "../Config"

export default {
  command: "list <repo>",
  describe: "List issues for specified repository",
  builder: yargs =>
    yargs.positional("repo", {
      describe: "owner and repository name (e.g. microsoft/TypeScript)",
    }),
  async handler(argv) {
    // @ts-ignore
    const configPath: string = argv.config
    const config = resolve(configPath)
    console.log(config)
    console.log(`list`, argv)
  },
} as CommandModule
