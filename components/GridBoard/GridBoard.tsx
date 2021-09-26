/******************************************************************************
 * GridBoard                                                                  *
 * returns a grid of blocks with added props                                  *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

import React, { Component } from 'react'
import { View } from 'react-native'
import { size } from './interfaces'

interface props {
  boardSize: size
  blockType: Function
  blockProps?: Object // might be required by blockType
}

class GridBoard extends Component<props> {
  getIterable = (dimension: number) => Array.from(Array(dimension))

  buildBlock = (x: number, y: number) => {
    const Block = this.props.blockType
    return <Block key={'block' + x} pos={{ x, y }} {...this.props.blockProps} />
  }

  buildRows = (y: number) => (
    <View key={'row' + y} style={{ flexDirection: 'row' }}>
      {this.getIterable(this.props.boardSize.width).map((_, x) =>
        this.buildBlock(x, y)
      )}
    </View>
  )

  render = () => (
    <View style={{ flexDirection: 'column' }}>
      {this.getIterable(this.props.boardSize.height).map((_, y) =>
        this.buildRows(y)
      )}
    </View>
  )
}

export default GridBoard
