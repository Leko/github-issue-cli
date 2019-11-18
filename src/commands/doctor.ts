import { CommandModule } from "yargs"

export default {
  command: "doctor",
  describe: "Check your environment to run ghi",
  builder: yargs => yargs.default("value", "true"),
  async handler(argv) {
    console.log(`doctor`, argv.config)
  },
} as CommandModule
