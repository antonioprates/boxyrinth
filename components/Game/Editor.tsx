/******************************************************************************
 * Editor                                                                     *
 * implementation of a level editor                                           *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

import React, { Component } from 'react'
import { View, Text, Clipboard } from 'react-native'
// import Clipboard from '@react-native-community/clipboard'
import {
  GridBoard,
  MazeSquare,
  blocks,
  getAllOf,
  getPosition,
  getSize,
  transpose,
  getShape,
  setShape,
  position,
  expand,
  trim,
  matrix,
  mirrorH,
  mirrorV,
  shiftU,
  shiftL,
  EditPad,
} from '../GridBoard'
import { SoundFx, fx } from '../Sound'
import { Colors } from '../Theme/Colors'
import Button from './Button'
import { expandSize } from './levels'
import { Timer } from '../Timer'

const setToClipboard = (str: string): void => Clipboard.setString(str)

const fetchClipboard = async (
  loadResult: (str: string) => void
): Promise<void> => {
  const str: string = await Clipboard.getString()
  loadResult(str)
}

interface props {
  soundFx: SoundFx
  timer: Timer
  testBoard: (board: matrix) => (event: any) => void
  board?: matrix // for loading from last edit or a paused state
}

interface state {
  board: matrix
  selection: Array<position>
  message: string
}

const styles = {
  grid: { backgroundColor: Colors.darkGreen },
  warning: { color: Colors.pink, fontWeight: 'bold' as 'bold' },
  text: { color: Colors.green, fontWeight: 'bold' as 'bold' },
}

const emptyLevel: matrix = [[]]

const defaultMessage: string = '⊞ maze editor'

class Editor extends Component<props, state> {
  state = {
    board: this.props.board || expand(emptyLevel, expandSize),
    selection: [],
    message: defaultMessage,
  }

  messageTimeout = null

  clearMessageTimeout = (): void => {
    this.messageTimeout && clearTimeout(this.messageTimeout)
    this.messageTimeout = null
  }

  componentWillUnmount = () => this.clearMessageTimeout()

  setMessage = (message: string): void => {
    this.clearMessageTimeout()
    this.setState({ message })
    if (message !== defaultMessage)
      this.messageTimeout = setTimeout(
        () => this.setMessage(defaultMessage),
        4000
      )
  }

  prettyPrint = (board: matrix): void => {
    let output: string = 'maze: [\n'
    for (let y: number = 0; y < board.length; y++) {
      output += ' ['
      for (let x: number = 0; x < board[y].length; x++)
        output += 'b.' + blocks[getShape(board)({ x, y })] + ', '
      output = output.substr(0, output.length - 2) // remove the last comma and space
      output += '],\n'
    }
    output += ']'
    console.log(output)
  }

  logAndTest = (event: any): void => {
    this.prettyPrint(trim(this.state.board))
    this.props.timer.setTime(-1)
    this.props.testBoard(this.state.board)(event)
  }

  hasSelection = (): boolean => {
    if (!this.state.selection.length) {
      this.setMessage('no blocks selected')
      return false
    }
    return true
  }

  isSelectionUnique = (): boolean => {
    if (this.state.selection.length > 1) {
      this.setMessage('too many blocks selected')
      return false
    }
    return this.hasSelection()
  }

  toShape = (shape: number): boolean => {
    if (!this.hasSelection()) return false

    const { board, selection } = this.state
    selection.forEach((position) => setShape(board)(position, shape))
    this.setState({ board, selection: [] })
    return true
  }

  toPlayer = (asSpot: boolean = false): boolean => {
    if (!this.isSelectionUnique()) return false
    const { board, selection } = this.state
    const prevPlayer = getPosition(board)(blocks.plr)
    if (prevPlayer)
      setShape(board)(
        prevPlayer,
        getShape(board)(prevPlayer) === blocks.spl ? blocks.spt : blocks.flr
      )
    this.toShape(
      getShape(board)(selection[0]) === blocks.spt || asSpot
        ? blocks.spl
        : blocks.plr
    )
    return true
  }

  toPortal = (): boolean => {
    if (!this.isSelectionUnique()) return false
    const { board } = this.state
    const prevPortal =
      getPosition(board)(blocks.cpt) || getPosition(board)(blocks.opt)
    if (prevPortal) setShape(board)(prevPortal, blocks.emp)
    this.toShape(blocks.cpt)
    return true
  }

  applyFn = (fn: (board: matrix) => matrix): boolean => {
    this.setState({ board: fn(this.state.board), selection: [] })
    return true
  }

  applyFnWithWarning = (fn: (board: matrix) => matrix): boolean => {
    this.setMessage('use with caution: might delete one line')
    this.applyFn(fn)
    return true
  }

  center = (board: matrix): matrix => expand(trim(board), expandSize)

  transpose = (): boolean => {
    const board = expand(trim(transpose(this.state.board)), expandSize)
    if (!board) {
      this.setMessage('maze to wide to transpose')
      return false
    }
    this.setState({ board, selection: [] })
    return true
  }

  fx = (success: boolean): void => {
    success
      ? this.props.soundFx.play(fx.button)
      : this.props.soundFx.play(fx.stuck)
  }

  validate = (): boolean => {
    const { board } = this.state

    if (!(getPosition(board)(blocks.flr) || getPosition(board)(blocks.spt))) {
      this.setMessage('level has no floor!?')
      return false
    }

    if (!(getPosition(board)(blocks.box) || getPosition(board)(blocks.sbx))) {
      this.setMessage('level has no boxes!?')
      return false
    }

    if (
      getAllOf(board)(blocks.box).length <
      getAllOf(board)(blocks.spt).length + getAllOf(board)(blocks.spl).length
    ) {
      this.setMessage('level has more spots than boxes!?')
      return false
    }

    if (!(getPosition(board)(blocks.cpt) || getPosition(board)(blocks.opt))) {
      this.setMessage('level has no portal!?')
      return false
    }

    if (!(getPosition(board)(blocks.plr) || getPosition(board)(blocks.spl))) {
      this.setMessage('level has no player!?')
      return false
    }

    this.setMessage('✌︎ this might work')
    return true
  }

  copyMaze = (): boolean => {
    const { board } = this.state
    setToClipboard(JSON.stringify({ maze: board }))
    return true
  }

  loadMaze = (): void => {
    fetchClipboard(this.loadMazeResult)
    this.setMessage('maze copied to clipboard')
  }

  loadMazeResult = (str: string): void => {
    try {
      const { maze } = JSON.parse(str)
      if (
        Array.isArray(maze) &&
        maze.length &&
        maze.length <= expandSize.height &&
        maze[0].length &&
        maze[0].length <= expandSize.width
      ) {
        let isValid: boolean = true
        const blocksMax: number = Object.keys(blocks).length
        for (let y = 0; y < maze.length; y++)
          for (let x = 0; x < maze[0].length; x++)
            if (
              !(
                typeof maze[y][x] === 'number' &&
                maze[y][x] >= 0 &&
                maze[y][x] < blocksMax
              )
            )
              isValid = false

        if (isValid) {
          this.setMessage('maze loaded successfully')
          this.setState({ board: maze })
          return this.fx(true)
        } else {
          this.setMessage('maze on clipboard is invalid')
        }
      } else this.setMessage('maze on clipboard is invalid')
    } catch (error) {
      this.setMessage('could not load maze from clipboard')
      console.log('could not load maze from clipboard', error)
    }
    return this.fx(false)
  }

  actions = [
    { label: '☐ floor', action: (_: any) => this.fx(this.toShape(blocks.flr)) },
    { label: '◼︎ box', action: (_: any) => this.fx(this.toShape(blocks.box)) },
    { label: '★ alien', action: (_: any) => this.fx(this.toShape(blocks.aln)) },
    { label: '⚉ player', action: (_: any) => this.fx(this.toPlayer()) },

    { label: '⚀ spot', action: (_: any) => this.fx(this.toShape(blocks.spt)) },
    { label: '⧈ +box', action: (_: any) => this.fx(this.toShape(blocks.sbx)) },
    {
      label: '⧆ +alien',
      action: (_: any) => this.fx(this.toShape(blocks.sal)),
    },
    { label: '⧇ +player', action: (_: any) => this.fx(this.toPlayer(true)) },

    { label: '⦾ hole', action: (_: any) => this.fx(this.toShape(blocks.hol)) },
    { label: '⦽ portal', action: (_: any) => this.fx(this.toPortal()) },
    { label: '× clear', action: (_: any) => this.fx(this.toShape(blocks.emp)) },
    { label: '✓ validate', action: (_: any) => this.fx(this.validate()) },

    { label: '⬌ mirrorH', action: (_: any) => this.fx(this.applyFn(mirrorH)) },
    { label: '⬍ mirrorV', action: (_: any) => this.fx(this.applyFn(mirrorV)) },
    {
      label: '⊹ centerX',
      action: (_: any) => this.fx(this.applyFn(this.center)),
    },
    { label: '⤤ transpX', action: (_: any) => this.fx(this.transpose()) },

    {
      label: '⇠ shiftLf',
      action: (_: any) => this.fx(this.applyFnWithWarning(shiftL)),
    },
    {
      label: '⇡ shiftUp',
      action: (_: any) => this.fx(this.applyFnWithWarning(shiftU)),
    },
    { label: '⊼ copyC', action: (_: any) => this.fx(this.copyMaze()) },
    { label: '⊻ loadC', action: (_: any) => this.loadMaze() },
  ]

  editPad: matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19, 20],
  ]

  getEditAction = (p: position) => this.actions[getShape(this.editPad)(p) - 1]

  getEmotion = () => '😶' // emotionless

  isEditing = (pos: position): boolean =>
    !!this.state.selection.find((p) => p.x === pos.x && p.y === pos.y)

  setPosToEdit = (pos: position): void => {
    const { selection } = this.state
    this.setState({
      selection: this.isEditing(pos)
        ? selection.filter((p) => !(p.x === pos.x && p.y === pos.y))
        : [pos, ...selection],
    })
  }

  render = () => {
    const { soundFx } = this.props
    const { board, message } = this.state

    return (
      <>
        <Text style={message !== defaultMessage ? styles.warning : styles.text}>
          {message}
        </Text>

        <View style={styles.grid}>
          <GridBoard
            boardSize={getSize(board)}
            blockType={MazeSquare}
            blockProps={{
              getShape: getShape(board),
              getEmotion: this.getEmotion,
              isEditing: this.isEditing,
              edit: this.setPosToEdit,
            }}
          />
        </View>

        <GridBoard
          boardSize={getSize(this.editPad)}
          blockType={EditPad}
          blockProps={{ getAction: this.getEditAction }}
        />

        <Text>{''}</Text>

        <Button
          label="➥ test maze"
          action={this.logAndTest}
          soundFx={soundFx}
        />
      </>
    )
  }
}

export default Editor
