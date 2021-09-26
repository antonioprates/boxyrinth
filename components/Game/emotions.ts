const chooseFrom = (options: Array<string>): string => {
  if (options.length < 1) return ''
  const someOption = Math.floor(Math.random() * options.length)
  return options[someOption === options.length ? someOption - 1 : someOption]
}

export const emotions = {
  neutral: () => chooseFrom(['😐', '😑']),
  confused: () => chooseFrom(['😕', '😖', '🤔', '🙄']),
  effort: () => '😬',
  happy: () => chooseFrom(['😏', '😆', '😜', '😅']),
  dead: '☠️', // should not be a method as we can test against it
}
