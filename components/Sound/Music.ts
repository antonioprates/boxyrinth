/******************************************************************************
 * Music                                                                      *
 * implements the soundtrack collection with expo-av                          *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

import { Audio } from 'expo-av'

// exported name of each soundtrack
export enum music {
  track1,
  track2,
  track3,
  track4,
  track5,
  track6,
}

// internal namespace to load the soundtracks
const tracks = {}

// paths to the actual mp3 files for each soundtrack name
const mp3Files = {
  [music[music.track1]]: require('../../assets/music/track1.mp3'),
  [music[music.track2]]: require('../../assets/music/track2.mp3'),
  [music[music.track3]]: require('../../assets/music/track3.mp3'),
  [music[music.track4]]: require('../../assets/music/track4.mp3'),
  [music[music.track5]]: require('../../assets/music/track5.mp3'),
  [music[music.track6]]: require('../../assets/music/track6.mp3'),
}

// free replacements (no proprietary assets)
// const mp3Files = {
//   [music[music.track1]]: require('../../assets/silence.mp3'),
//   [music[music.track2]]: require('../../assets/silence.mp3'),
//   [music[music.track3]]: require('../../assets/silence.mp3'),
//   [music[music.track4]]: require('../../assets/silence.mp3'),
//   [music[music.track5]]: require('../../assets/silence.mp3'),
//   [music[music.track6]]: require('../../assets/silence.mp3'),
// }

const loadMp3Music = async (track: string) => {
  try {
    tracks[track] = new Audio.Sound()
    await tracks[track].loadAsync(mp3Files[track])
  } catch (error) {
    console.error('Music: could not load', error)
  }
}

const setMusicVolume = async (soundObject: Audio.Sound, volume: number) => {
  try {
    await soundObject.setVolumeAsync(volume)
  } catch (error) {
    console.error('Music: could not set volume', error)
  }
}

const playMusic = async (soundObject: Audio.Sound, volume: number) => {
  try {
    await soundObject.setIsLoopingAsync(true)
    await soundObject.setVolumeAsync(volume)
    await soundObject.playFromPositionAsync(0)
  } catch (error) {
    console.error('Music: could not play', error)
  }
  return soundObject
}

const stopMusic = async (soundObject: Audio.Sound) => {
  try {
    await soundObject.stopAsync()
  } catch (error) {
    console.error('Music: could not stop', error)
  }
}

class SoundFx {
  constructor() {
    for (const track in mp3Files) loadMp3Music(track)
  }

  private volume = 0.5 // initially 50%

  private isPlaying = null

  private timeout = null

  count = (): number => Object.keys(mp3Files).length

  getVolume = (): number => this.volume * 100

  setVolume = (percentile: number) => {
    const volume = percentile / 100
    if (volume >= 0 && volume <= 1) {
      for (const track in tracks) setMusicVolume(tracks[track], volume)
      this.volume = volume
    } else console.warn('Music: impossible volume')
  }

  play = (track: number) => {
    this.isPlaying !== null && stopMusic(tracks[music[this.isPlaying]])
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(
      () => playMusic(tracks[music[track]], this.volume),
      2000
    )
    this.isPlaying = track
  }
}

export default SoundFx
