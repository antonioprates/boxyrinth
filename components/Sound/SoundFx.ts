/******************************************************************************
 * SoundFx                                                                    *
 * implements the sound effects collection with expo-av                       *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

import { Audio } from 'expo-av'

// exported name of each sound
export enum fx {
  button,
  die,
  droplet,
  portal,
  push,
  spot,
  step,
  stuck,
  timer,
  wall,
  warp,
}

// internal namespace to load the sounds
const sounds = {}

// paths to the actual mp3 files for each sound name
const mp3Files = {
  [fx[fx.button]]: require('../../assets/sound/button.mp3'),
  [fx[fx.die]]: require('../../assets/sound/die.mp3'),
  [fx[fx.droplet]]: require('../../assets/sound/droplet.mp3'),
  [fx[fx.portal]]: require('../../assets/sound/portal.mp3'),
  [fx[fx.push]]: require('../../assets/sound/push.mp3'),
  [fx[fx.spot]]: require('../../assets/sound/spot.mp3'),
  [fx[fx.step]]: require('../../assets/sound/step.mp3'),
  [fx[fx.stuck]]: require('../../assets/sound/stuck.mp3'),
  [fx[fx.timer]]: require('../../assets/sound/timer.mp3'),
  [fx[fx.wall]]: require('../../assets/sound/wall.mp3'),
  [fx[fx.warp]]: require('../../assets/sound/warp.mp3'),
}

// free replacements (no proprietary assets)
// const mp3Files = {
//   [fx[fx.button]]: require('../../assets/silence.mp3'),
//   [fx[fx.die]]: require('../../assets/silence.mp3'),
//   [fx[fx.droplet]]: require('../../assets/silence.mp3'),
//   [fx[fx.portal]]: require('../../assets/silence.mp3'),
//   [fx[fx.push]]: require('../../assets/silence.mp3'),
//   [fx[fx.spot]]: require('../../assets/silence.mp3'),
//   [fx[fx.step]]: require('../../assets/silence.mp3'),
//   [fx[fx.stuck]]: require('../../assets/silence.mp3'),
//   [fx[fx.timer]]: require('../../assets/silence.mp3'),
//   [fx[fx.wall]]: require('../../assets/silence.mp3'),
//   [fx[fx.warp]]: require('../../assets/silence.mp3'),
// }

const loadMp3 = async (sound: string) => {
  try {
    sounds[sound] = new Audio.Sound()
    await sounds[sound].loadAsync(mp3Files[sound])
  } catch (error) {
    console.error('SoundFx: could not load', error)
  }
}

const setVolume = async (soundObject: Audio.Sound, volume: number) => {
  try {
    await soundObject.setVolumeAsync(volume)
  } catch (error) {
    console.error('SoundFx: could not set volume', error)
  }
}

const play = async (soundObject: Audio.Sound) => {
  const tolerance = { toleranceMillisAfter: 50, toleranceMillisBefore: 50 }
  try {
    // workaround: have to call it twice to fix a bug on android
    // await soundObject.playFromPositionAsync(0, tolerance);
    await soundObject.playFromPositionAsync(0, tolerance)
  } catch (error) {
    console.error('SoundFx: could not play', error)
  }
}

class SoundFx {
  constructor() {
    for (const sound in mp3Files) loadMp3(sound)
  }

  private volume = 1 // initially 100%

  getVolume = () => this.volume * 100

  setVolume = (percentile: number) => {
    const volume = percentile / 100
    if (volume >= 0 && volume <= 1) {
      for (const sound in sounds) setVolume(sounds[sound], volume)
      this.volume = volume
    } else console.warn('SoundFx: impossible volume')
  }

  play = (sound: number) => play(sounds[fx[sound]])
}

export default SoundFx
