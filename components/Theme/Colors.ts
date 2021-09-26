// having mighty colorful imagination

export const Colors = {
  black: 'black',
  dark: '#001b33', // even darker blue
  orange: '#bf6000', // light orange
  lightBlue: '#00ffd2',
  blue: '#006cc7',
  darkBlue: '#001e38',
  pink: '#d600ff',
  yellow: '#ddd300',
  lime: '#28fdb0',
  green: '#2a4a53',
  darkGreen: '#0d2c3d',
}

const patches = {
  red: {
    [Colors.dark]: '#330012',
    [Colors.blue]: '#c7004a',
    [Colors.darkBlue]: '#380015',
  },
  green: {
    [Colors.dark]: '#003312',
    [Colors.blue]: '#00c74a',
    [Colors.darkBlue]: '#003815',
  },
}

export const applyTheme = (styles: object, theme: string): object => {
  if (!patches[theme]) return styles

  let patchedStyles = {}

  for (let s in styles) {
    patchedStyles = { [s]: styles[s], ...patchedStyles }

    if (patchedStyles[s].color && patches[theme][patchedStyles[s].color])
      patchedStyles[s] = {
        ...patchedStyles[s],
        color: patches[theme][patchedStyles[s].color],
      }

    if (
      patchedStyles[s].backgroundColor &&
      patches[theme][patchedStyles[s].backgroundColor]
    )
      patchedStyles[s] = {
        ...patchedStyles[s],
        backgroundColor: patches[theme][patchedStyles[s].backgroundColor],
      }

    if (
      patchedStyles[s].borderRightColor &&
      patches[theme][patchedStyles[s].borderRightColor]
    )
      patchedStyles[s] = {
        ...patchedStyles[s],
        borderRightColor: patches[theme][patchedStyles[s].borderRightColor],
      }

    if (
      patchedStyles[s].borderLeftColor &&
      patches[theme][patchedStyles[s].borderLeftColor]
    )
      patchedStyles[s] = {
        ...patchedStyles[s],
        borderLeftColor: patches[theme][patchedStyles[s].borderLeftColor],
      }

    if (
      patchedStyles[s].borderBottomColor &&
      patches[theme][patchedStyles[s].borderBottomColor]
    )
      patchedStyles[s] = {
        ...patchedStyles[s],
        borderBottomColor: patches[theme][patchedStyles[s].borderBottomColor],
      }

    if (
      patchedStyles[s].borderTopColor &&
      patches[theme][patchedStyles[s].borderTopColor]
    )
      patchedStyles[s] = {
        ...patchedStyles[s],
        borderTopColor: patches[theme][patchedStyles[s].borderTopColor],
      }
  }

  return patchedStyles
}
