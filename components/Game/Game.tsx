/******************************************************************************
 * Game                                                                       *
 * implementation of a sokoban game engine using GridBoard and Sound          *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

import React, { Component } from 'react'
import { View, Text } from 'react-native'
import {
  GridBoard,
  MazeSquare,
  movements,
  blocks,
  controlBoard,
  ControlSquare,
  getAllOf,
  getPosition,
  getSize,
  getShape,
  sumPositions,
  setShape,
  setAnimShape,
  position,
  expand,
  matrix,
  transitionRight,
} from '../GridBoard'
import { SoundFx, fx, Music } from '../Sound'
import { Colors, applyTheme } from '../Theme/Colors'
import { emotions } from './emotions'
import Button from './Button'
import { Level, expandSize } from './levels'
import Timer from '../Timer/Timer'

interface AlienMovement {
  alien: position
  movement: position
}

interface props {
  soundFx: SoundFx
  soundtrack: Music
  timer: Timer
  level: Level
  pause: (board: matrix) => (event: any) => void
  board?: matrix // for loading a paused state
  difficulty: number
  nextLevel: () => boolean
}

interface state {
  freeze: boolean
  board: matrix
  emotion: string
  time?: number
  maxTime?: number
  hasMoved: boolean
  alienMovements: Array<AlienMovement>
  levelId: string
  message: string
}

const styles = {
  grid: { backgroundColor: Colors.dark },

  warning: {
    color: Colors.pink,
    fontWeight: 'bold' as 'bold',
  },

  text: {
    color: Colors.green,
    fontWeight: 'bold' as 'bold',
  },
}

class Game extends Component<props, state> {
  state = {
    freeze: false,
    board: this.props.board || expand(this.props.level.maze, expandSize),
    levelId: this.props.level.name,
    emotion: emotions.neutral(),
    time: this.props.timer.getTime(),
    maxTime: this.props.timer.getTime(),
    hasMoved: false,
    alienMovements: [],
    message: this.props.level.message,
  }

  mounted: boolean = false

  die = () => {
    this.props.timer.stop()
    this.props.soundFx.play(fx.die)
    this.setState({ freeze: true, emotion: emotions.dead, time: null })
  }

  updateTime = () => {
    if (this.mounted) {
      const time = this.props.timer.getTime()
      if (time) {
        this.setState({ time })

        const { difficulty } = this.props
        if (time % (difficulty + 1) === 0) this.moveAliens()

        if (time === 4) this.props.soundFx.play(fx.timer)

        if (time === this.state.maxTime - 5)
          this.setState({ message: undefined })

        const { hasMoved } = this.state
        if (hasMoved)
          this.couldFinishGame(getAllOf(this.state.board)(blocks.box))
            ? this.setState({ hasMoved: false })
            : this.die()
      } else this.die()
    }
  }

  componentDidMount = () => {
    this.mounted = true
    this.props.timer.attach(this.updateTime)
  }

  componentWillUnmount = () => {
    this.mounted = false
    this.props.timer.detach(this.updateTime)
  }

  // boxes collide with
  cannotMoveBoxOver = (
    shape?: number,
    considerBoxes: boolean = true,
    considerAliens: boolean = true
  ) =>
    !shape ||
    shape === blocks.emp ||
    shape === blocks.cpt ||
    (considerBoxes && (shape === blocks.box || shape === blocks.sbx)) ||
    (considerAliens && (shape === blocks.aln || shape === blocks.sal))

  // if player doesn't have a chance to finish game: die!
  couldFinishGame = (boxes: Array<position>) => {
    if (!this.props.timer.getTime()) return false

    const { board } = this.state
    if (!getPosition(board)(blocks.box)) return true

    let canMoveAtLeastOneBox = false
    for (const i in boxes) {
      const boxPosition = boxes[i]

      const cannotMove = (movement: position) =>
        this.cannotMoveBoxOver(
          getShape(board)(sumPositions(boxPosition, movement)),
          false,
          false
        )
      if (
        (cannotMove(movements.left) || cannotMove(movements.right)) &&
        (cannotMove(movements.up) || cannotMove(movements.down))
      )
        return false // there is one unmovable box, stuck on the walls

      const canMove = (movement: position) =>
        !this.cannotMoveBoxOver(
          getShape(board)(sumPositions(boxPosition, movement)),
          true,
          false
        )
      if (
        (canMove(movements.left) && canMove(movements.right)) ||
        (canMove(movements.up) && canMove(movements.down))
      )
        canMoveAtLeastOneBox = true // yes the is still something you can do...
    }
    return canMoveAtLeastOneBox // ...or all boxes are blocked by other boxes
  }

  reset = () => {
    this.props.timer.reset()
    this.setState({ emotion: emotions.neutral(), alienMovements: [] })
    if (this.props.level.name === this.state.levelId)
      this.setState({
        board: expand(this.props.level.maze, expandSize),
        freeze: false,
      })
    else {
      const { board } = this.state
      const levelId = this.props.level.name
      const message = this.props.level.message
      const maxTime = this.props.timer.getTime()
      transitionRight(
        setShape(board)(getPosition(board)(blocks.apt), blocks.flr), // remove player
        expand(this.props.level.maze, expandSize),
        (newBoard: matrix) => this.setState({ board: newBoard }),
        () => this.setState({ freeze: false, levelId, maxTime, message })
      )
    }
  }

  moveAliens = (): void => {
    const { board } = this.state
    const aliens = getAllOf(board)(blocks.aln).concat(
      getAllOf(board)(blocks.sal)
    )
    aliens.forEach((alien) => this.moveAlien(alien))
  }

  setAlienMovement = (
    alien: position,
    newPosition: position,
    movement: position
  ): void => {
    const { alienMovements } = this.state
    const index = alienMovements.findIndex(
      (am) => am.alien.x === alien.x && am.alien.y === alien.y
    )
    alienMovements.splice(index, 1, { alien: newPosition, movement })
    this.setState({ alienMovements })
  }

  getAlienMovement = (alien: position): position => {
    const { alienMovements } = this.state
    const alienMovement = alienMovements.find(
      (am) => am.alien.x === alien.x && am.alien.y === alien.y
    )
    return alienMovement ? alienMovement.movement : null
  }

  moveAlien = (alien: position): void => {
    const { board } = this.state
    let options = [
      movements.up,
      movements.down,
      movements.left,
      movements.right,
    ]
    let randomMovement: position
    let newPosition: position
    let couldMoveToShape: number
    let previousMovement = this.getAlienMovement(alien)
    while (randomMovement === undefined && options.length) {
      const movementOption =
        previousMovement ??
        options.splice(Math.floor(Math.random() * options.length), 1)[0]
      newPosition = sumPositions(alien, movementOption)
      couldMoveToShape = getShape(board)(newPosition)
      if (
        couldMoveToShape === blocks.flr ||
        couldMoveToShape === blocks.plr ||
        couldMoveToShape === blocks.spt
      ) {
        randomMovement = movementOption
        break
      }
      previousMovement = null
    }
    if (randomMovement) {
      if (couldMoveToShape === blocks.plr) return this.die()
      else {
        setShape(board)(
          alien,
          getShape(board)(alien) === blocks.sal ? blocks.spt : blocks.flr
        )
        setShape(board)(
          newPosition,
          getShape(board)(newPosition) === blocks.spt ? blocks.sal : blocks.aln
        )
        this.setAlienMovement(alien, newPosition, randomMovement)
      }
      this.setState({ board })
    }
  }

  // main game rules are implemented here!
  movePlayer = (movement: position) => {
    if (this.state.freeze) return

    // init
    const { soundFx } = this.props
    const { board } = this.state
    const { cannotMoveBoxOver } = this
    const playerPosition =
      getPosition(board)(blocks.plr) || getPosition(board)(blocks.spl)
    const setEmotion = (emotion: string) => this.setState({ emotion })
    const boxes = getAllOf(board)(blocks.box)

    // check if game could complete
    if (
      getAllOf(board)(blocks.spt)
        .concat(getAllOf(board)(blocks.spl))
        .concat(getAllOf(board)(blocks.sal)).length > boxes.length
    )
      return this.die()
    else setEmotion(emotions.neutral())

    ////////////////////////////////////////////////////////////////////////////////
    // moveBox: local function with logic to move a box using movePlayer context
    function moveBox(box: position, movement: position): boolean {
      // check box new possible position and current shape of it on the board
      const pos = sumPositions(box, movement)
      const shape = getShape(board)(pos)

      // if new position is invalid, empty, portal, or box, cannot move box
      if (cannotMoveBoxOver(shape)) {
        soundFx.play(fx.stuck)
        setEmotion(emotions.confused())
        return false
      }

      // if is an exit, just remove the box and akk true
      if (shape === blocks.hol || shape === blocks.aho) {
        setShape(board)(box, blocks.flr)
        setAnimShape(board)(pos, blocks.aho, blocks.hol, 250) // animate
        soundFx.play(fx.droplet)
        setEmotion(emotions.happy())
        return true
      }

      // else push box to new position:
      const pushOverSpot = shape === blocks.spt
      setShape(board)(box, blocks.flr)
      setShape(board)(pos, pushOverSpot ? blocks.sbx : blocks.box)
      setEmotion(pushOverSpot ? emotions.happy() : emotions.effort())
      soundFx.play(pushOverSpot ? fx.spot : fx.push)
      return true // moved the box!
    } // end of moveBox declaration ////////////////////////////////////////////////

    // check player new possible position and current shape of it on the board
    const pos = sumPositions(playerPosition, movement)
    const shape = getShape(board)(pos)

    // if new position is invalid, empty etc. do nothing
    if (
      !shape ||
      shape === blocks.emp ||
      shape === blocks.hol ||
      shape === blocks.cpt
    ) {
      soundFx.play(fx.wall)
      setEmotion(emotions.confused())
      return
    }

    // if new position is ground or is a box that can be moved, than move player
    const move =
      shape === blocks.flr || (shape === blocks.box && moveBox(pos, movement))

    // if new position is a spot with overlapping box, if can move box, than move over spot
    // if new position is a empty spot, than move over spot (overlap condition)
    const moveOverSpot =
      shape === blocks.sbx ? moveBox(pos, movement) : shape === blocks.spt

    // if it is an open portal, enter the portal and complete the level!
    const enterPortal = shape === blocks.opt

    // if any of both above conditions, move and update game state
    if (move || moveOverSpot || enterPortal) {
      ;(shape === blocks.flr || shape === blocks.spt) && soundFx.play(fx.step)
      const wasOverSpot = getShape(board)(playerPosition) === blocks.spl
      setShape(board)(playerPosition, wasOverSpot ? blocks.spt : blocks.flr)
      setShape(board)(
        pos,
        enterPortal ? blocks.apt : moveOverSpot ? blocks.spl : blocks.plr
      )

      if (
        // no more boxes out...
        !getPosition(board)(blocks.box) &&
        // and all spots on board filled...
        !getPosition(board)(blocks.spt) &&
        !getPosition(board)(blocks.spl) &&
        !getPosition(board)(blocks.sal)
      ) {
        // then, if portal is still closed...
        if (getPosition(board)(blocks.cpt)) {
          // open portal!
          soundFx.play(fx.portal)
          setShape(board)(getPosition(board)(blocks.cpt), blocks.opt)
        } else if (getPosition(board)(blocks.apt)) {
          // if player walks over portal, go to next level
          soundFx.play(fx.warp)
          this.setState({ freeze: true })
          if (
            this.props.level.stage === 'custom'
              ? this.props.pause(null)(null)
              : this.props.nextLevel()
          )
            setTimeout(this.reset, 1000)
        }
      }
      // if we have opened the portal, but now there are boxes/spots again...
      else if (getPosition(board)(blocks.opt)) {
        // close the portal back
        setShape(board)(getPosition(board)(blocks.opt), blocks.cpt)
      }
    }
    this.setState({ board, hasMoved: true })
  }

  getEmotion = () => this.state.emotion

  render = () => {
    const { soundFx, pause, level } = this.props
    const { board, time, emotion, freeze, message } = this.state
    const theme = level.stage
    const themed = applyTheme({ bg: { backgroundColor: Colors.dark } }, theme)

    return (
      <>
        <Text
          style={
            (time && time < 5 && time > 0) || message
              ? styles.warning
              : styles.text
          }
        >
          {time && emotion !== emotions.dead
            ? message || level.name + (time > 0 ? ' ⧗' + String(time) : '')
            : 'game over'}
        </Text>

        <View style={themed['bg']}>
          <GridBoard
            key={level.stage + 'maze'}
            boardSize={getSize(board)}
            blockType={MazeSquare}
            blockProps={{
              getShape: getShape(board),
              getEmotion: this.getEmotion,
              theme,
            }}
          />
        </View>

        <GridBoard
          key={level.stage + 'control'}
          boardSize={getSize(controlBoard)}
          blockType={ControlSquare}
          blockProps={{
            getControl: getShape(controlBoard),
            movePlayer: this.movePlayer,
          }}
        />

        <Text>{''}</Text>

        {emotion === emotions.dead ? (
          <Button
            label="⟲ restart level"
            action={this.reset}
            soundFx={soundFx}
          />
        ) : freeze ? (
          <Button label={level.name} action={(_) => {}} soundFx={soundFx} />
        ) : (
          <Button label="✪ main menu" action={pause(board)} soundFx={soundFx} />
        )}
      </>
    )
  }
}

export default Game
