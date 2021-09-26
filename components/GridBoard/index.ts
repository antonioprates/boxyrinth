export {
  default as ControlSquare,
  controlBoard,
  controls,
  movements,
} from './ControlSquare'
export { default as GridBoard } from './GridBoard'
export { matrix, position, size } from './interfaces'
export {
  getWidth,
  getHeight,
  getSize,
  transpose,
  mirrorH,
  mirrorV,
  getShape,
  sumPositions,
  setShape,
  setAnimShape,
  getPosition,
  copyBoard,
  expand,
  trim,
  shiftU,
  shiftL,
  getAllOf,
  transitionRight,
} from './utils'
export { default as MazeSquare, blocks } from './MazeSquare'
export { default as EditPad } from './EditPad'
