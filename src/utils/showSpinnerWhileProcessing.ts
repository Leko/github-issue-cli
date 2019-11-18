import logUpdate from "log-update"
import elegantSpinner from "elegant-spinner"
import { emojify } from "node-emoji"

const FPS = 20

export async function showSpinnerWhileProcessing<T>(
  initialMessage: string,
  fn: () => Promise<T>
): Promise<T> {
  const frame = elegantSpinner()
  const tid = setInterval(() => {
    logUpdate(`${frame()} ${initialMessage}`)
  }, 1000 / FPS)

  return fn()
    .then(ret => {
      logUpdate(emojify(`:heavy_check_mark: ${initialMessage}`))
      return ret
    })
    .finally(() => {
      logUpdate.done()
      clearTimeout(tid)
    })
}
