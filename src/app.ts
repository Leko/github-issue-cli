import chalk from "chalk"
import { flags } from "./flags"

flags
  .fail((message, error) => {
    if (message) {
      console.error(chalk.red(message))
    } else {
      console.error(chalk.red(error.stack))
    }
    process.exit(1)
  })
  .parse()
