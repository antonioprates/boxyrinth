/******************************************************************************
 * SimpleSquare (should be named AdvancedSquare)                              *
 * renders a square of size 16 x 16 px for GridBoard of level blocks          *
 * Author: Antonio Prates [hello@aprates.dev], 2019-2021                      *
 *****************************************************************************/

import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Blink } from '../Blink'
import { position } from './interfaces'
import { Colors, applyTheme } from '../Theme/Colors'
import { movements } from './ControlSquare'
import { sumPositions } from './utils'

// using short names of same size for matrix coding convenience
export enum blocks {
  emp, // empty
  flr, // floor
  box, // box
  plr, // player
  aln, // alien
  spt, // spot to place box
  sbx, // spot with box on top (overlapped)
  spl, // spot with player on top (overlapped)
  sal, // spot with alien on top (overlapped)
  hol, // hole (an exit for boxes)
  aho, // active hole (active exit)
  cpt, // closed portal
  opt, // portal
  apt, // active portal
}

interface props {
  pos: position
  getShape: (p: position) => number
  getEmotion: () => string
  isEditing?: (pos: position) => boolean
  edit?: (editPos: position) => void
  theme: string
}

const baseStyles = {
  flr: {
    width: 18,
    height: 18,
    margin: 0.5,
    backgroundColor: Colors.darkBlue,
  },

  plr: {
    width: 16,
    height: 16,
    margin: 1.5,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    backgroundColor: Colors.darkBlue,
  },

  plrSymbol: {
    fontSize: 11,
  },

  plrSymbolBig: {
    fontSize: 11.1,
  },

  backLight: {
    width: 18,
    height: 18,
    margin: 0.5,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    backgroundColor: Colors.darkGreen,
  },

  spot: {
    width: 16,
    height: 16,
    margin: 1.5,
    borderRadius: 2,
    //opacity: 0.4,
    borderWidth: 1,
    borderStyle: 'dashed' as 'dashed',
    borderColor: Colors.green,
    backgroundColor: Colors.darkBlue,
  },

  spt: {
    width: 18,
    height: 18,
    margin: 0.5,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    backgroundColor: Colors.darkBlue,
  },

  sptSymbol: {
    color: Colors.lime,
    opacity: 0.6,
  },

  sbx: {
    width: 16,
    height: 16,
    margin: 1.5,
    backgroundColor: Colors.lightBlue,
  },

  hol: {
    width: 18,
    height: 18,
    margin: 0.5,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    backgroundColor: Colors.darkBlue, // medium red gray
  },

  emp: {
    width: 19,
    height: 19,
    backgroundColor: Colors.black,
  },

  editEmp: {
    width: 18,
    height: 18,
    margin: 0.5,
    backgroundColor: Colors.black,
  },

  editSelected: {
    width: 18,
    height: 18,
    margin: 0.5,
    backgroundColor: Colors.orange,
  },

  box: {
    width: 16,
    height: 16,
    margin: 1.5,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: Colors.yellow,
    backgroundColor: Colors.orange,
  },

  boxDone: {
    width: 16,
    height: 16,
    margin: 1.5,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: Colors.lime,
    backgroundColor: Colors.blue,
  },

  boxGone: {
    width: 11,
    height: 11,
    margin: 4,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    borderRadius: 1.5,
    opacity: 0.9,
    borderWidth: 0.5,
    borderColor: Colors.yellow,
    backgroundColor: Colors.orange,
  },

  boxSymbol: {
    opacity: 0.5,
    fontSize: 10,
  },
}

class MazeSquare extends Component<props> {
  addShades = (style: Object) => {
    const { getShape, pos, theme } = this.props

    const left = getShape(sumPositions(pos, movements.right))
    const right = getShape(sumPositions(pos, movements.left))
    const top = getShape(sumPositions(pos, movements.down))
    const bottom = getShape(sumPositions(pos, movements.up))

    let shadedStye = style

    if (!!left && left !== blocks.emp && left !== blocks.cpt)
      shadedStye = {
        ...shadedStye,
        borderRightColor: Colors.blue,
        borderRightWidth: 1,
      }

    if (!!right && right !== blocks.emp && right !== blocks.cpt)
      shadedStye = {
        ...shadedStye,
        borderLeftColor: Colors.blue,
        borderLeftWidth: 1,
      }

    if (!!top && top !== blocks.emp && top !== blocks.cpt)
      shadedStye = {
        ...shadedStye,
        borderBottomColor: Colors.blue,
        borderBottomWidth: 1,
      }

    if (!!bottom && bottom !== blocks.emp && bottom !== blocks.cpt)
      shadedStye = {
        ...shadedStye,
        borderTopColor: Colors.blue,
        borderTopWidth: 1,
      }

    const themed = applyTheme({ shadedStye }, theme)
    return themed['shadedStye']
  }

  getShapes = (styles) => ({
    simple: ({ shape }) => <View style={styles[blocks[shape]]} />,

    styled: ({ style }) => <View style={style} />,

    shaded: ({ style }) => <View style={this.addShades(style)} />,

    player: () => (
      <View style={styles.plr}>
        <Text style={styles.plrSymbol}>{this.props.getEmotion()}</Text>
      </View>
    ),

    playerBreathing: () => (
      <View style={styles.plr}>
        <Text style={styles.plrSymbolBig}>{this.props.getEmotion()}</Text>
      </View>
    ),

    playerSpot: () => (
      <View style={styles.spt}>
        <View style={styles.spot}>
          <Text style={styles.plrSymbol}>{this.props.getEmotion()}</Text>
        </View>
      </View>
    ),

    playerBreathingSpot: () => (
      <View style={styles.spt}>
        <View style={styles.spot}>
          <Text style={styles.plrSymbolBig}>{this.props.getEmotion()}</Text>
        </View>
      </View>
    ),

    playerEnteringPortal: () => (
      <View style={styles.backLight}>
        <Text style={styles.plrSymbolBig}>😎</Text>
      </View>
    ),

    box: () => (
      <View style={styles.plr}>
        <View style={styles.box} />
      </View>
    ),

    boxGone: () => (
      <View style={styles.hol}>
        <View style={styles.boxGone} />
      </View>
    ),

    boxDone: () => (
      <View style={styles.backLight}>
        <View style={styles.boxDone}>
          <Text style={styles.boxSymbol}>⚡️</Text>
        </View>
      </View>
    ),

    spot: () => (
      <View style={styles.spt}>
        <View style={styles.spot} />
      </View>
    ),

    hole: () => (
      <View style={styles.hol}>
        <Text>🕳</Text>
      </View>
    ),

    openPortal: () => (
      <View style={styles.spt}>
        <Blink
          interval={100}
          over={null}
          base={<Text style={styles.sptSymbol}>🌀</Text>}
          repeat={2}
        />
      </View>
    ),

    alien: () => (
      <View style={styles.plr}>
        <Text style={styles.plrSymbol}>👾</Text>
      </View>
    ),

    alienBig: () => (
      <View style={styles.plr}>
        <Text style={styles.plrSymbolBig}>👾</Text>
      </View>
    ),

    alienSpot: () => (
      <View style={styles.plr}>
        <View style={styles.spot}>
          <Text style={styles.plrSymbol}>👾</Text>
        </View>
      </View>
    ),

    alienBigSpot: () => (
      <View style={styles.plr}>
        <View style={styles.spot}>
          <Text style={styles.plrSymbolBig}>👾</Text>
        </View>
      </View>
    ),
  })

  renderBlock = (Shape, styles) => {
    const { pos, edit } = this.props
    const block = this.props.getShape(pos)

    switch (block) {
      case blocks.plr: // player
        return (
          <Blink
            interval={300}
            over={<Shape.playerBreathing />}
            base={<Shape.player />}
            repeat={-1}
          />
        )

      case blocks.spl: // spot with player on top (overlapped)
        return (
          <Blink
            interval={300}
            over={<Shape.playerBreathingSpot />}
            base={<Shape.playerSpot />}
            repeat={-1}
          />
        )

      case blocks.sbx: // spot with box on top (overlapped)
        return (
          <Blink
            interval={100}
            over={<Shape.spot />}
            base={<Shape.boxDone />}
            repeat={2}
          />
        )

      case blocks.box: // movable box
        return <Shape.box />

      case blocks.spt:
        return <Shape.spot />

      case blocks.hol: // a way out for boxes
        return <Shape.hole />

      case blocks.aho: // active exit
        return (
          <Blink
            interval={200}
            over={<Shape.boxGone />}
            base={<Shape.hole />}
          />
        )

      case blocks.opt: // open portal
        return <Shape.openPortal />

      case blocks.apt: // active portal
        return (
          <Blink
            interval={200}
            over={<Shape.playerEnteringPortal />}
            base={<Shape.openPortal />}
            repeat={4}
          />
        )

      case blocks.emp:
        return <Shape.shaded style={edit ? styles.editEmp : styles.emp} />

      case blocks.cpt: // closed portal
        return edit ? <Shape.openPortal /> : <Shape.shaded style={styles.emp} />

      case blocks.flr:
        return <Shape.simple shape={block} />

      case blocks.aln:
        return (
          <Blink
            interval={500}
            over={<Shape.alien />}
            base={<Shape.alienBig />}
            repeat={-1}
          />
        )

      case blocks.sal:
        return (
          <Blink
            interval={500}
            over={<Shape.alienSpot />}
            base={<Shape.alienBigSpot />}
          />
        )

      default:
        console.warn('MazeSquare: unexpected shape ' + blocks[block])
        return null
    }
  }

  state = {
    styles: baseStyles,
    Shape: this.getShapes(baseStyles),
  }

  componentDidMount = () => {
    const styles = applyTheme(baseStyles, this.props.theme)
    const Shape = this.getShapes(styles)
    this.setState({ styles, Shape })
  }

  render = () => {
    const { edit, isEditing, pos } = this.props
    const selectedForEdition = isEditing && isEditing(pos)
    const { styles, Shape } = this.state

    return edit ? (
      <TouchableOpacity onPress={(event: any) => edit(pos)}>
        {selectedForEdition ? (
          <Blink
            interval={200}
            over={this.renderBlock(Shape, styles)}
            base={<Shape.styled style={styles.editSelected} />}
          />
        ) : (
          this.renderBlock(Shape, styles)
        )}
      </TouchableOpacity>
    ) : (
      this.renderBlock(Shape, styles)
    )
  }
}

export default MazeSquare
