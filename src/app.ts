import chalk from "chalk"
import updateNotifier from "update-notifier"
import pkg from "./package.json"
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

updateNotifier({ pkg }).notify()
