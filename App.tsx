/******************************************************************************
 * boxyrinth                                                                  *
 * a sokoban revamped board game in an alien sci-fi universe                  *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2023                      *
 *****************************************************************************/

import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Menu, SoundFx, Music, music, Timer } from './components'
import { Colors } from './components/Theme/Colors'

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 150,
    height: 40,
  },
})

const soundFx = new SoundFx()
const soundtrack = new Music()
const timer = new Timer()

setTimeout(() => soundtrack.play(music.track1), 3000)

export default function App() {
  return (
    <View style={styles.app}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />

      <Menu soundFx={soundFx} soundtrack={soundtrack} timer={timer} />
    </View>
  )
}
