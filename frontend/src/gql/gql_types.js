
const CARD = `
  id
  text
  prompt
  cardType
  numPrompts
  flavorText
`

const PLAYER = `
  id
  username
  score
  hand {
    ${CARD}
  }
`

export const ROOM = `
  id
  code
  numRounds
  gameType
  discard {
    ${CARD}
  }
  players {
    ${PLAYER}
  }
`