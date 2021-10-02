import { blocks as b, matrix } from '../GridBoard'

export enum difficulty {
  whenPigsFly,
  challenging,
  pieceOfCake,
}

export interface Level {
  name: string
  stage: string
  message: string
  blocked: boolean
  time: number
  maze: matrix
}

// some configs:
export const initialLevel = 0
export const initialDifficulty = difficulty.challenging
export const expandSize = { width: 17, height: 14 } // max lvl size [ 17 : 14 ]

export const levels: Array<Level> = [
  {
    name: 'prison cell',
    stage: 'tutorial',
    message: 'you wake up on an alien starship',
    blocked: false,
    time: -1,
    // prettier-ignore
    maze: [
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.spt, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.box, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.plr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.cpt],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.box, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.spt, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
    ],
  },
  {
    name: 'prison hall',
    stage: 'tutorial',
    message: "these aliens don't seem very friendly",
    blocked: true,
    time: 10,
    // prettier-ignore
    maze: [
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp],
      [b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp],
      [b.plr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.aln, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.cpt],
      [b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp],
    ],
  },
  {
    name: 'diagonal way',
    stage: 'blue',
    message: 'maybe I better keep walking...',
    blocked: true,
    time: 20,
    // prettier-ignore
    maze: [
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.spt, b.emp, b.flr, b.flr, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.box, b.flr, b.flr, b.emp, b.emp, b.emp, b.flr, b.flr, b.emp],
      [b.plr, b.flr, b.emp, b.emp, b.emp, b.emp, b.spt, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.cpt],
      [b.emp, b.flr, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.flr, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.flr, b.flr, b.flr, b.flr, b.box, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
    ],
  },
  {
    name: 'the energy duct',
    stage: 'blue',
    message: 'batteries go in holes, too?',
    blocked: true,
    time: 30,
    // prettier-ignore
    maze: [
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.spt, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.box, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.plr, b.flr, b.flr, b.flr, b.flr, b.flr, b.box, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.cpt],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.box, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.box, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.hol, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
    ],
  },
  {
    name: 'circles',
    stage: 'blue',
    message: "let's think this through...",
    blocked: true,
    time: 45,
    // prettier-ignore
    maze: [
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.spt, b.emp, b.emp, b.emp, b.flr, b.emp, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.plr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.cpt],
      [b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.flr, b.emp, b.flr, b.flr, b.box, b.emp, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.flr, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
    ],
  },
  {
    name: 'fabrique',
    stage: 'green',
    message: 'not all is what it seems',
    blocked: true,
    time: 30,
    // prettier-ignore
    maze: [
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.plr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.box, b.flr, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.cpt],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.box, b.flr, b.emp, b.emp, b.flr, b.box, b.flr, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.spt, b.box, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.spt, b.spt, b.sbx, b.spt, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
     ],
  },
  {
    name: 'oval salon',
    stage: 'green',
    message: 'aliens! run, run, run',
    blocked: true,
    time: 30,
    // prettier-ignore
    maze: [
      [b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.flr, b.aln, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.aln, b.flr, b.flr, b.flr, b.emp, b.emp],
      [b.emp, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.flr, b.flr, b.flr, b.spt, b.emp],
      [b.emp, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.flr, b.flr, b.flr, b.box, b.emp],
      [b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.aln, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp],
      [b.plr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.box, b.spt, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.cpt],
      [b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp],
      [b.emp, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.flr, b.flr, b.flr, b.box, b.emp],
      [b.emp, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.flr, b.aln, b.flr, b.spt, b.emp],
      [b.emp, b.emp, b.flr, b.aln, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp],
     ],
  },
  {
    name: "let's dance",
    stage: 'green',
    message: 'sometimes you have bad luck',
    blocked: true,
    time: 60,
    // prettier-ignore
    maze: [
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.box, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.plr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.spt, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.cpt],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.emp, b.flr, b.aln, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
    ],
  },
  {
    name: 'narrow way',
    stage: 'red',
    message: 'I feel a bit claustrophobic',
    blocked: true,
    time: 60,
    // prettier-ignore
    maze: [
      [b.emp, b.spt, b.flr, b.flr, b.spt, b.emp, b.emp, b.flr, b.sbx, b.flr, b.sbx, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp],
      [b.plr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.box, b.flr, b.box, b.flr, b.box, b.flr, b.box, b.flr, b.cpt],
      [b.emp, b.spt, b.flr, b.flr, b.spt, b.emp, b.emp, b.flr, b.sbx, b.flr, b.flr, b.flr, b.sbx, b.flr, b.flr, b.flr, b.emp],
    ],
  },
  {
    name: 'duct me free',
    stage: 'red',
    message: 'I just hope I find my exit',
    blocked: true,
    time: 65,
    // prettier-ignore
    maze: [
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.emp, b.emp, b.spt, b.spt, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.flr, b.flr, b.emp, b.emp, b.box, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.flr, b.emp, b.flr, b.flr, b.box, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.flr, b.emp, b.box, b.emp, b.flr, b.emp, b.emp, b.emp, b.box, b.flr, b.flr, b.flr, b.flr, b.cpt],
      [b.plr, b.flr, b.flr, b.flr, b.emp, b.flr, b.emp, b.flr, b.emp, b.emp, b.emp, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.flr, b.box, b.flr, b.emp, b.flr, b.emp, b.emp, b.emp, b.box, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.box, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.hol, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
    ],
  },
  {
    name: 'piece of cake',
    stage: 'red',
    message: 'luckily no alien is nearby',
    blocked: true,
    time: -1,
    // prettier-ignore
    maze: [
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.flr, b.box, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.flr, b.flr, b.flr, b.emp, b.flr, b.flr, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.flr, b.emp, b.emp, b.emp, b.flr, b.box, b.flr, b.flr, b.flr, b.flr, b.box, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.flr, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.flr, b.flr, b.emp, b.box, b.flr, b.emp, b.emp, b.emp, b.emp],
      [b.emp, b.flr, b.flr, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.box, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp],
      [b.plr, b.flr, b.box, b.emp, b.flr, b.box, b.flr, b.flr, b.emp, b.flr, b.emp, b.emp, b.flr, b.emp, b.emp, b.flr, b.cpt],
      [b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.flr, b.emp, b.spt, b.spt, b.spt, b.emp, b.flr, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.emp, b.emp, b.emp, b.flr, b.flr, b.spt, b.spt, b.spt, b.flr, b.flr, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.flr, b.emp, b.spt, b.spt, b.spt, b.emp, b.flr, b.emp],
      [b.emp, b.flr, b.box, b.flr, b.box, b.flr, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.flr, b.emp, b.flr, b.emp],
      [b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp],
     ],
  },
  {
    name: 'control room',
    stage: 'red',
    message: 'this must be the place',
    blocked: true,
    time: 75,
    // prettier-ignore
    maze: [
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.spt, b.flr, b.flr, b.flr],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.emp, b.flr, b.emp, b.flr],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.spt, b.emp, b.box, b.flr, b.box, b.flr, b.emp, b.flr],
      [b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.emp, b.flr, b.emp, b.flr, b.flr, b.cpt, b.flr, b.flr, b.emp, b.flr],
      [b.plr, b.flr, b.flr, b.flr, b.emp, b.emp, b.emp, b.flr, b.emp, b.flr, b.box, b.flr, b.box, b.emp, b.spt, b.flr],
      [b.emp, b.emp, b.emp, b.flr, b.emp, b.emp, b.emp, b.flr, b.emp, b.flr, b.emp, b.flr, b.flr, b.flr, b.flr, b.emp],
      [b.emp, b.emp, b.emp, b.flr, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.spt, b.emp, b.emp, b.emp, b.flr, b.emp],
      [b.emp, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp, b.emp, b.flr, b.flr, b.flr, b.flr, b.flr, b.emp],
    ],
  },
]
