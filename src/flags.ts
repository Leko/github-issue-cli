import yargs from "yargs"
import doctorCommand from "./commands/doctor"
import listCommand from "./commands/list"

export const flags = yargs
  .scriptName("ghi")
  .options({
    config: {
      type: "string",
      description: "Path to .ghirc file",
    },
  })
  .command(doctorCommand)
  .command(listCommand)
  .help()
