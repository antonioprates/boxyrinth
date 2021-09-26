/******************************************************************************
 * Button                                                                     *
 * implementation of a simple custom button                                   *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

import React, { Component } from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { Colors } from '../Theme/Colors'
import { SoundFx, fx } from '../Sound'

interface props {
  action: (event: any) => void
  label: string
  disabled?: boolean
  soundFx: SoundFx
}

interface state {}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 2,
    backgroundColor: Colors.black,
  },

  button: {
    alignItems: 'center',
    backgroundColor: Colors.darkBlue,
    padding: 10,
    width: 176,
  },

  buttonDisabled: {
    alignItems: 'center',
    backgroundColor: Colors.dark,
    padding: 10,
    width: 176,
  },

  buttonLabel: {
    color: Colors.orange,
    fontWeight: 'bold',
  },

  buttonDisabledLabel: {
    color: Colors.darkGreen,
  },
})

class Button extends Component<props, state> {
  handleAction = (event: any) => {
    const { action, soundFx, disabled } = this.props
    if (disabled) {
    } else {
      soundFx.play(fx.button)
      action(event)
    }
  }

  render = () => {
    const { label, disabled } = this.props

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={disabled ? styles.buttonDisabled : styles.button}
          onPress={this.handleAction}
        >
          <Text
            style={disabled ? styles.buttonDisabledLabel : styles.buttonLabel}
          >
            {` ${label} `}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Button
