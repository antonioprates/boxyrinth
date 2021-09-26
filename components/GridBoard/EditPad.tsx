/******************************************************************************
 * EditPad                                                                    *
 * renders edit "buttons" using GridBoard base                                *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

import React, { Component } from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import { position } from './interfaces'
import { Colors } from '../Theme/Colors'

export interface EditAction {
  label: string
  action: (event: any) => void
}

interface props {
  pos: position
  getAction: (p: position) => EditAction | null
}

const styles = {
  pad: {
    width: 80,
    height: 28,
    margin: 0.5,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    backgroundColor: Colors.darkBlue,
  },

  label: {
    color: Colors.orange,
  },

  none: {
    width: 80,
    height: 28,
    margin: 0.5,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    backgroundColor: Colors.black,
  },
}

class ControlSquare extends Component<props> {
  render = () => {
    const { getAction, pos } = this.props
    const editAction: EditAction = getAction(pos)

    return editAction ? (
      <TouchableHighlight
        onPressIn={editAction.action}
        underlayColor={Colors.black}
      >
        <View style={styles.pad}>
          <Text style={styles.label}>{editAction.label}</Text>
        </View>
      </TouchableHighlight>
    ) : null
  }
}

export default ControlSquare
