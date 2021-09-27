/******************************************************************************
 * Menu                                                                       *
 * very primitive implementation of game menus (not proud of it)              *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SoundFx, Music } from '../Sound'
import {
  levels,
  initialLevel,
  difficulty,
  initialDifficulty,
  Level,
} from './levels'
import Game from './Game'
import Editor from './Editor'
import Button from './Button'
import { Colors } from '../Theme/Colors'
import { matrix, copyBoard } from '../GridBoard'
import Timer from '../Timer/Timer'

const DEVELOPER_MODE = true

interface props {
  soundFx: SoundFx
  soundtrack: Music
  timer: Timer
}

interface state {
  level: number
  difficulty: number
  mode: string
  board?: matrix
  editedBoard?: matrix
  time?: number
  stage?: string
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  heading: {
    color: Colors.darkGreen,
    fontWeight: 'bold',
  },

  text: {
    color: Colors.orange,
  },
})

class Menu extends Component<props, state> {
  state = {
    level: initialLevel,
    difficulty: initialDifficulty,
    mode: 'menu',
    board: null,
    editedBoard: null,
    time: null,
    stage: null,
  }

  updateTime = () => this.setState({ time: this.props.timer.getTime() })

  componentDidMount = () => this.props.timer.attach(this.updateTime)

  componentWillUnmount = () => {
    this.props.timer.detach(this.updateTime)
    this.props.timer.stop()
  }

  pauseLevel =
    (board: matrix) =>
    (event: any): void =>
      this.setState({ mode: 'menu', board })

  testBoard =
    (board: matrix) =>
    (event: any): void => {
      const editedBoard = copyBoard(board)
      this.setState({ mode: 'play', board, level: -1, editedBoard })
    }

  unblockLevel = (level: number): void => {
    levels[level].blocked = false
  }

  resetLevelTimer = (level: number): void => {
    const time = levels[level].time
    const factor = this.state.difficulty + 1
    this.props.timer.setTime(time * factor)
  }

  setLevelMusic = (level: number, delay: boolean): void => {
    const { soundtrack } = this.props
    setTimeout(
      () => soundtrack.play(level % soundtrack.count()),
      delay ? 0 : 1000
    )
  }

  gotoLevel =
    (level: number) =>
    (event?: any): boolean => {
      if (level < levels.length) {
        const gameLevel: number = level < 0 ? initialLevel : level // if editor board, level === -1;
        if (gameLevel !== this.state.level)
          this.setLevelMusic(gameLevel, !!event)
        this.unblockLevel(gameLevel)
        this.resetLevelTimer(gameLevel)
        this.setState({
          mode: 'play',
          board: null,
          level: gameLevel,
          editedBoard: null,
        })
        return true
      } else {
        this.setState({ mode: 'victory', board: null, level: initialLevel })
        return false
      }
    }

  restartLevel = (event?: any): void => {
    this.gotoLevel(this.state.level)(event)
  }

  navigate = (mode: string) => (event?: any) => this.setState({ mode })

  setStage = (stage: string) => (event?: any) =>
    this.setState({ mode: 'selectLevel', stage })

  getFuzzyVolume = (volume: number): string =>
    volume ? (volume === 50 ? '⊖ moderate' : '⊕ loud') : '⊗ silent'

  getSoundVolume = () => this.getFuzzyVolume(this.props.soundFx.getVolume())

  getMusicVolume = () => this.getFuzzyVolume(this.props.soundtrack.getVolume())

  getNextVolume = (volume: number): number =>
    volume ? (volume === 100 ? 50 : 0) : 100

  toggleSound = () => {
    this.props.soundFx.setVolume(
      this.getNextVolume(this.props.soundFx.getVolume())
    )
    this.forceUpdate()
  }

  toggleMusic = () => {
    this.props.soundtrack.setVolume(
      this.getNextVolume(this.props.soundtrack.getVolume())
    )
    this.forceUpdate()
  }

  toggleDifficulty = () =>
    this.setState({
      board: null, // destroy current progress, forcing a reset
      difficulty:
        this.state.difficulty === difficulty.pieceOfCake // increase to
          ? difficulty.challenging
          : this.state.difficulty === difficulty.challenging // increase to
          ? difficulty.whenPigsFly // or else, start over with...
          : difficulty.pieceOfCake,
    })

  getDifficulty = () => {
    switch (this.state.difficulty) {
      case difficulty.whenPigsFly:
        return ':: when pigs fly'

      case difficulty.pieceOfCake:
        return '. piece of cake'

      case difficulty.challenging:
      default:
        return ': challenging'
    }
  }

  NewLine = () => <>{'\n'}</>

  Header = (props: { heading: string }) => (
    <Text style={styles.heading}>{'\n' + props.heading + '\n'}</Text>
  )

  render = () => {
    const { level, mode, board, difficulty, editedBoard, stage } = this.state
    const { NewLine, Header } = this
    const time = this.props.timer.getTime()
    const hasState: boolean = board && !!this.props.timer.getTime()
    const levelData: Level =
      level < 0
        ? {
            name: 'custom maze',
            stage: 'custom',
            message: '',
            blocked: false,
            time: -1,
            maze: editedBoard,
          }
        : levels[level]

    switch (mode) {
      case 'victory':
        this.setLevelMusic(0, true)
        return (
          <View style={styles.container}>
            <Header heading="✌︎ this feels like earth" />
            <Text style={styles.text}>
              after all, you managed to do it
              <NewLine />
              you somehow activated a teleport
              <NewLine />
              and finally escaped the alien ship
              <NewLine />
              in an instant you're back home
              <NewLine />
              you are just lying in your bed...
              <NewLine />
              was all but a nightmare I had? ☀️
              <NewLine />
            </Text>
            <Button
              key="credits"
              action={this.navigate('showCredits')}
              label="✦ credits"
              soundFx={this.props.soundFx}
            />
          </View>
        )

      case 'showCredits':
        return (
          <View style={styles.container}>
            <Header heading="✦ credits" />
            <Text style={styles.text}>
              game developed by Antonio Prates,
              <NewLine />
              including the original soundtrack 🎧
              <NewLine />
              code is open under MIT license at:
              <NewLine />
              github.com/antonioprates/boxyrinth
              <NewLine />
              © 2019-2021
              <NewLine />
              <NewLine />
              contact:
              <NewLine />
              hello@aprates
              <NewLine />
            </Text>
            <Button
              key="credits_back"
              action={this.navigate('menu')}
              label="☚ back"
              soundFx={this.props.soundFx}
            />
          </View>
        )

      case 'settings':
        return (
          <View style={styles.container}>
            <Header heading="⚈ sound options" />
            <Button
              key="soundFx"
              action={this.toggleSound}
              label={this.getSoundVolume() + ' effects'}
              soundFx={this.props.soundFx}
            />
            <Button
              key="soundtrack"
              action={this.toggleMusic}
              label={this.getMusicVolume() + ' music'}
              soundFx={this.props.soundFx}
            />
            <Header heading="⚈ difficulty" />
            <Button
              key="difficulty"
              action={this.toggleDifficulty}
              label={this.getDifficulty()}
              soundFx={this.props.soundFx}
            />
            <Text>
              <NewLine />
            </Text>
            <Button
              key="settings_back"
              action={this.navigate('menu')}
              label="☚ back"
              soundFx={this.props.soundFx}
            />
          </View>
        )

      case 'selectStage':
        const stages = {}
        levels.forEach((level) => {
          stages[level.stage] = stages[level.stage] || !level.blocked
        })
        return (
          <View style={styles.container}>
            <Header heading="☛ select stage" />
            {Object.keys(stages).map((stageName, index) => (
              <Button
                key={'stage' + (index + 1)}
                action={this.setStage(stageName)}
                label={'⨳ ' + stageName}
                disabled={DEVELOPER_MODE ? false : !stages[stageName]}
                soundFx={this.props.soundFx}
              />
            ))}
            <Button
              key="selectStage_back"
              action={this.navigate('menu')}
              label="☚ back"
              soundFx={this.props.soundFx}
            />
          </View>
        )

      case 'selectLevel':
        return (
          <View style={styles.container}>
            <Header heading="☛ select level" />
            {levels.map((level, index) =>
              level.stage === stage ? (
                <Button
                  key={'level' + (index + 1)}
                  action={this.gotoLevel(index)}
                  label={'➥ ' + level.name}
                  disabled={DEVELOPER_MODE ? false : level.blocked}
                  soundFx={this.props.soundFx}
                />
              ) : null
            )}
            <Button
              key="selectLevel_back"
              action={this.navigate('selectStage')}
              label="☚ back"
              soundFx={this.props.soundFx}
            />
          </View>
        )

      case 'play':
        return (
          <Game
            pause={this.pauseLevel}
            level={levelData}
            nextLevel={this.gotoLevel(level + 1)}
            board={board}
            difficulty={difficulty}
            {...this.props} // music and fx are global
          />
        )

      case 'edit':
        return (
          <Editor
            testBoard={this.testBoard}
            board={editedBoard ?? board}
            {...this.props}
          />
        )

      case 'menu':
      default:
        return (
          <View style={styles.container}>
            <Header heading="✪ main menu" />
            <Button
              key="start"
              action={hasState ? this.navigate('play') : this.restartLevel}
              label={
                '➥ ' +
                (hasState
                  ? time < 0
                    ? 'continue'
                    : 'continue (' + time + ')'
                  : 'play game')
              }
              soundFx={this.props.soundFx}
            />
            {hasState && (
              <Button
                key="restart"
                action={
                  level < 0 ? this.testBoard(editedBoard) : this.restartLevel
                }
                label={'⟲ restart level'}
                soundFx={this.props.soundFx}
              />
            )}
            <Button
              key="selectStage"
              action={this.navigate('selectStage')}
              label="☛ select level"
              soundFx={this.props.soundFx}
            />
            <Button
              key="settings"
              action={this.navigate('settings')}
              label="⚈ settings"
              soundFx={this.props.soundFx}
            />
            {DEVELOPER_MODE && (
              <Button
                key="editor"
                action={this.navigate('edit')}
                label="⊞ maze editor"
                soundFx={this.props.soundFx}
              />
            )}
            <Button
              key="credits"
              action={this.navigate('showCredits')}
              label="✦ credits"
              soundFx={this.props.soundFx}
            />
          </View>
        )
    }
  }
}

export default Menu
