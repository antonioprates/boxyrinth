/******************************************************************************
 * Timer                                                                      *
 * implements a timer with listeners to fire time based events (on tick)      *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

type Rate = 1 | 2 | 4
type TickTime = 1000 | 500 | 250

class Timer {
  private interval = undefined

  private time: number = 0

  private initialTime: number = 0

  private listeners: Array<() => void> = []

  private tickTime: TickTime = 1000

  // ticks each second (1000ms)
  private startTicking = () =>
    (this.interval = setInterval(this.tick, this.tickTime))

  // clock ticks from max positive number until zero
  // (or value between 0 and -1, in case float value is not exact)
  // or it can also tick from -1 to negative infinity
  // (for virtually infinite timers, we are not expecting a game to run for decades)
  private updateTime = (): boolean => {
    if (this.time > -1 && this.time <= 0) {
      this.stop() // stop ticking
      return false
    }
    this.time = this.time - this.tickTime / 1000
    return true
  }

  private tick = (): void =>
    this.updateTime() && this.listeners.forEach((listener) => listener())

  // stops ticking
  stop = (): void => {
    this.interval && clearInterval(this.interval)
    this.interval = undefined
  }

  // sets the time and starts ticking
  setTime = (seconds: number): void => {
    this.stop()
    this.time = this.initialTime = Math.floor(seconds)
    this.startTicking()
  }

  // short-hand for infinite timer
  start = (): void => {
    this.setTime(-1)
    this.tick()
  }

  setTickRate = (timesPerSecond: Rate): void => {
    switch (timesPerSecond) {
      case 1:
        this.tickTime = 1000
        break
      case 2:
        this.tickTime = 500
        break
      case 4:
        this.tickTime = 250
        break
    }
  }

  // resets counter to last set time
  reset = (): void => this.setTime(this.initialTime)

  // returns the current count
  getTime = (): number => this.time

  // set a listener when tick happens
  // warning: don't use a anonymous function (unless using detachAll method)
  attach = (listener: () => void): void => {
    this.listeners.push(listener)
  }

  // remove the listener (just provide the same function)
  detach = (listener: () => void): void => {
    this.listeners = this.listeners.filter((item) => item !== listener)
  }

  detachAll = (): void => {
    this.listeners = []
  }
}

export default Timer
