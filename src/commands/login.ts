import fs from "fs"
import { CommandModule } from "yargs"
import chalk from "chalk"
import emoji from "node-emoji"
import inquirer from "inquirer"
import { DEFAULT_PATH, resolve } from "../Config"
import { getClient } from "../utils/graphql"
import { showSpinnerWhileProcessing } from "../utils/showSpinnerWhileProcessing"

export default {
  command: "login",
  describe: "Check your environment to run ghi",
  builder: yargs => yargs.default("value", "true"),
  async handler(argv) {
    const config = resolve(argv.config as string)
    if (config.token && config.login) {
      const { confirm } = await inquirer.prompt([
        {
          name: "confirm",
          type: "confirm",
          message: `You're already logged in as ${config.login}. Do you want to continue?`,
        },
      ])
      if (!confirm) {
        return
      }
    }

    console.log(chalk.cyan("Welcome to ghi!"))
    console.log(
      "To get started, open the following URL to generate a GitHub token"
    )
    console.log(
      "\n  https://github.com/settings/tokens/new?scopes=public_repo\n"
    )
    const { token } = await inquirer.prompt([
      {
        name: "token",
        type: "password",
        mask: "*",
        message: "Please input your GitHub access token",
      },
    ])

    const graphql = getClient({ token })
    const viewer = await showSpinnerWhileProcessing(
      "Fetching your information from GitHub",
      async () => {
        const { viewer }: any = await graphql(
          `
            {
              viewer {
                login
              }
            }
          `
        )

        return viewer
      }
    )
    await showSpinnerWhileProcessing(
      `Saving credentials to ${chalk.dim(DEFAULT_PATH)}`,
      async () => {
        fs.writeFileSync(
          DEFAULT_PATH,
          JSON.stringify({ token, login: viewer.login })
        )
      }
    )

    console.log(`Good job ${chalk.cyan(viewer.login)}!`)
    console.log(
      `This is the end of the instruction. If you have any questions, run 'ghi --help'.`
    )
    console.log(emoji.emojify(`Enjoy :crossed_fingers:`))
  },
} as CommandModule
