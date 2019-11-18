import os from "os"
import fs from "fs"
import path from "path"
import { sync as findUp } from "find-up"

export type Config = {
  queries: {
    [repo: string]: {
      [name: string]: string
    }
  }
} & (
  | {
      token: string
      login: string
    }
  | {
      token: null
      login: null
    }
)

const FILE_NAME = ".ghirc"
export const DEFAULT_PATH = path.join(os.homedir(), FILE_NAME)

const defaultConfig: Config = {
  token: null,
  login: null,
  queries: {},
}

export function resolve(userConfig: string | null): Config {
  if (userConfig && !fs.existsSync(userConfig)) {
    throw new Error(`${userConfig} does not exists`)
  }

  const configPath = userConfig || findUp([FILE_NAME]) || DEFAULT_PATH

  if (!configPath) {
    return defaultConfig
  }

  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"))
  } catch (e) {
    return defaultConfig
  }
}
