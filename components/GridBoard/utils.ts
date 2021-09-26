// all crazy matrix operations, sorry for the flaky documentation

import { matrix, size, position } from '../GridBoard'

export const getWidth = (board: matrix): number => board[0].length

export const getHeight = (board: matrix): number => board.length

export const getSize = (board: matrix): size => ({
  width: getWidth(board),
  height: getHeight(board),
})

// initialize all first with zeros
const getEmptyMatrix = (size: size) => {
  const board = new Array(size.height)
  for (let y = 0; y < size.height; y++) board[y] = new Array(size.width).fill(0)
  return board
}

export const transpose = (board: matrix): matrix =>
  board[0].map((_, x) => board.map((_, y) => board[y][x]))

export const mirrorH = (board: matrix): matrix => {
  const maxX = getWidth(board) - 1
  return board.map((_, y) => board[0].map((_, x) => board[y][maxX - x]))
}

export const mirrorV = (board: matrix): matrix => {
  const maxY = getHeight(board) - 1
  return board.map((_, y) => board[0].map((_, x) => board[maxY - y][x]))
}

// check if position is out of board grid
const isPositionInvalid = (board: matrix, p: position) =>
  p.x < 0 || p.x >= getWidth(board) || p.y < 0 || p.y >= getHeight(board)

export const getShape =
  (board: matrix) =>
  (p: position): number | null =>
    isPositionInvalid(board, p) ? null : board[p.y][p.x]

export const sumPositions = (a: position, b: position) => ({
  x: a.x + b.x,
  y: a.y + b.y,
})

// returns first element of shape found or null if none found
export const getPosition =
  (board: matrix) =>
  (shape: number): position | null => {
    for (let y = 0; y < getHeight(board); y++)
      for (let x = 0; x < getWidth(board); x++)
        if (getShape(board)({ x, y }) === shape) return { x, y }
    return null
  }

// returns all elements of shape found or empty if none found
export const getAllOf =
  (board: matrix) =>
  (shape: number): Array<position> => {
    const positions: Array<position> = []
    for (let y = 0; y < getHeight(board); y++)
      for (let x = 0; x < getWidth(board); x++)
        if (getShape(board)({ x, y }) === shape) positions.push({ x, y })
    return positions
  }

export const setShape =
  (board: matrix) =>
  (p: position, shape: number): matrix => {
    board[p.y][p.x] = shape
    return board
  }

export const setAnimShape =
  (board: matrix) =>
  (p: position, shape: number, goToShape: number, delay: number): matrix => {
    setTimeout(() => setShape(board)(p, goToShape), delay)
    return setShape(board)(p, shape)
  }

export const copyBoard = (
  board: matrix,
  start: position = { x: 0, y: 0 },
  toSize: size = getSize(board)
): matrix => {
  const copy = getEmptyMatrix(toSize)
  for (let y = 0; y < getHeight(board); y++)
    for (let x = 0; x < getWidth(board); x++)
      setShape(copy)(
        { x: start.x + x, y: start.y + y },
        getShape(board)({ x, y })
      )
  return copy
}

// special type of copy that "expands" board into size (centering the original to new size)
export const expand = (board: matrix, toSize: size): matrix => {
  const originalSize = getSize(board)

  if (
    originalSize.width > toSize.width ||
    originalSize.height > toSize.height
  ) {
    console.log('expand failed: board is bigger than size to expand')
    return null
  }

  const widthOffset = Math.floor((toSize.width - originalSize.width) / 2)
  const heightOffset = Math.floor((toSize.height - originalSize.height) / 2)

  return copyBoard(board, { x: widthOffset, y: heightOffset }, toSize)
}

const isLineEmpty = (line: Array<number>): boolean =>
  !line.find((value) => !!value)

const isColumnEmpty = (board: matrix, x: number): boolean => {
  for (let y = 0; y < getHeight(board); y++) if (board[y][x]) return false
  return true
}

// special type of copy that "shrinks" board to its nonEmpty size
export const trim = (board: matrix): matrix => {
  let startTrimY: number
  let stopTrimY: number
  let startTrimX: number
  let stopTrimX: number

  // get vertical boundaries
  for (let y = 0; y < getHeight(board); y++)
    if (startTrimY === undefined && !isLineEmpty(board[y])) startTrimY = y
    else if (startTrimY !== undefined && isLineEmpty(board[y])) {
      stopTrimY = y
      break
    }
  if (startTrimY !== undefined && !stopTrimY) stopTrimY = getHeight(board)

  // get horizontal boundaries
  for (let x = 0; x < getWidth(board); x++)
    if (startTrimX === undefined && !isColumnEmpty(board, x)) startTrimX = x
    else if (startTrimX !== undefined && isColumnEmpty(board, x)) {
      stopTrimX = x
      break
    }
  if (startTrimX !== undefined && !stopTrimX) stopTrimX = getWidth(board)

  // if found boundaries, trim!
  if (stopTrimY && stopTrimX) {
    const offset = { x: startTrimX, y: startTrimY }
    const toSize = {
      width: stopTrimX - startTrimX,
      height: stopTrimY - startTrimY,
    }
    const copy = getEmptyMatrix(toSize)
    for (let y = 0; y < toSize.height; y++)
      for (let x = 0; x < toSize.width; x++)
        setShape(copy)(
          { x, y },
          getShape(board)({ x: x + offset.x, y: y + offset.y })
        )
    return copy
  }

  return copyBoard(board) // can't trim, just take a regular copy
}

export const shiftU = (board: matrix): matrix => {
  const originalSize = getSize(board)
  const shiftedBoard = []
  for (let y = 1; y < originalSize.height; y++) shiftedBoard.push(board[y]) // all lines but first
  return copyBoard(shiftedBoard, { x: 0, y: 0 }, originalSize)
}

export const shiftL = (board: matrix): matrix =>
  transpose(shiftU(transpose(board)))

export const transitionRight = (
  board1: matrix,
  board2: matrix,
  updateFn: (board: matrix) => void,
  callback: () => void,
  pos: number = 0
): void => {
  const originalSize = getSize(board1)
  if (pos === originalSize.width) return callback()
  const updatedBoard = shiftL(board1)
  for (let y = 0; y < originalSize.height; y++)
    updatedBoard[y][originalSize.width - 1] = board2[y][pos]
  setTimeout(
    () => transitionRight(updatedBoard, board2, updateFn, callback, pos + 1),
    50
  )
  return updateFn(updatedBoard)
}
