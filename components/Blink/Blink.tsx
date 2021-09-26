/******************************************************************************
 * Blink                                                                      *
 * alternated render of 'over' and 'base' toggle from time interval           *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

import { Component } from 'react'

interface props {
  interval: Number // in milliseconds
  over: any
  base: any
  repeat?: number
}

interface state {
  isShowing: Boolean
  count: number
}

class Blink extends Component<props, state> {
  static defaultProps = {
    repeat: 0,
  }

  state = {
    isShowing: true,
    count: 0,
  }

  timer = null

  componentDidMount = () =>
    (this.timer = setInterval(
      () =>
        this.timer &&
        this.setState({
          isShowing: !this.state.isShowing,
          count: this.state.isShowing ? this.state.count + 1 : this.state.count,
        }),
      this.props.interval
    ))

  componentWillUnmount = () => {
    clearInterval(this.timer)
    this.timer = null
  }

  render = () => {
    const { repeat, base, over } = this.props
    const { isShowing, count } = this.state

    // if negative, repeat forever
    if (repeat < 0) {
    } else if (!isShowing && count > repeat) clearInterval(this.timer)

    return isShowing ? over : base
  }
}

export default Blink
