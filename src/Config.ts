import os from "os"
import fs from "fs"
import path from "path"
import { sync as findUp } from "find-up"

type Config = {}

const FILE_NAME = ".ghirc"
const defaultConfig = {}

export const resolve = (userConfig: string | null): Config => {
  if (userConfig && !fs.existsSync(userConfig)) {
    throw new Error(`${userConfig} does not exists`)
  }

  const configPath =
    userConfig || findUp([FILE_NAME]) || path.join(os.homedir(), FILE_NAME)

  if (!configPath) {
    return defaultConfig
  }

  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"))
  } catch (e) {
    return defaultConfig
  }
}
