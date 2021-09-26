/******************************************************************************
 * ControlSquare                                                              *
 * renders control "buttons" using GridBoard base                             *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

import React, { Component } from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import { position, matrix } from './interfaces'
import { Colors } from '../Theme/Colors'
import { Timer } from '../Timer'

export enum controls {
  up,
  down,
  left,
  right,
  none,
}

export const movements = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export const controlBoard: matrix = [
  [controls.none, controls.up, controls.none],
  [controls.left, controls.down, controls.right],
]

interface props {
  pos: position
  getControl: (p: position) => number
  movePlayer: (direction: position) => void
}

const styles = {
  control: {
    width: 56,
    height: 56,
    margin: 2,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    backgroundColor: Colors.darkBlue,
  },

  symbol: {
    fontSize: 40,
    fontWeight: 'bold' as 'bold',
    color: Colors.orange,
  },

  none: {
    width: 56,
    height: 56,
    margin: 2,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    backgroundColor: Colors.black,
  },
}

class ControlSquare extends Component<props> {
  symbols = {
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
  }

  timer = new Timer()

  componentDidMount = () => {
    this.timer.setTickRate(4)
    this.timer.attach(this.use)
  }

  componentWillUnmount = () => {
    this.timer.detachAll()
    this.timer.stop()
  }

  use = () => {
    const movement = movements[controls[this.props.getControl(this.props.pos)]]
    if (movement) this.props.movePlayer(movement)
  }

  render = () => {
    const control = this.props.getControl(this.props.pos)
    const style = control === controls.none ? 'none' : 'control'

    return (
      <TouchableHighlight
        onPressIn={this.timer.start}
        onPressOut={this.timer.stop}
        underlayColor={Colors.black}
      >
        <View style={styles[style]}>
          <Text style={styles.symbol}>{this.symbols[controls[control]]}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

export default ControlSquare
