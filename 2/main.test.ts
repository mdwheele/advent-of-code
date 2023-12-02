import { readFileSync } from 'node:fs'
import { max, sum, sumBy } from 'lodash'

const samplePart1 = readFileSync('2/sample-part1.txt').toString()
const input = readFileSync('2/input.txt').toString()

interface Draw {
  [index: string]: number
}

type GameRecord = {
  id: number,
  revealed: Draw[]
}

function parseGameRecord(text: string) {
  let [idRaw, revealedRaw] = text.split(':')

  const id = Number(idRaw.match(/(\d+)/)![1])
  
  let revealed = revealedRaw
    .split(';')
    .map(revealed => {
      const draws = revealed.trim().split(', ')

      return draws.reduce((accum: any, draw) => {
        const [_, count, color] = draw.match(/(\d+)\s(red|green|blue)/)!

        accum[color] = Number(count)

        return accum
      }, { red: 0, green: 0, blue: 0 })
    })

  return {
    id,
    revealed
  }
}

function isPossible(record: GameRecord, red: number, green: number, blue: number) {
  return !record.revealed.some(draw => draw.red > red || draw.green > green || draw.blue > blue)
}

function fewestCubes(record: GameRecord): { red: number, green: number, blue: number } {
  const minRed = Number(max(record.revealed.map(draw => draw.red)))
  const minGreen = Number(max(record.revealed.map(draw => draw.green)))
  const minBlue = Number(max(record.revealed.map(draw => draw.blue)))

  return { red: minRed, green: minGreen, blue: minBlue }
}

function power(input: { red: number, green: number, blue: number }): number {
  return input.red * input.green * input.blue
}

describe('Day 2: Cube Conundrum', () => {
  describe('Game Parsing', () => {
    const game = parseGameRecord('Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green')

    test('sample input parsed to game record', () => {
      expect(game.id).toBe(1)
      expect(game.revealed.length).toBe(3)
      expect(game.revealed[0].blue).toBe(3)
    })
  })

  describe('Part 1', () => {
    test('sample input', () => {
      const games = samplePart1.split("\n").map(line => parseGameRecord(line))
      const possibleGames = games.filter(game => isPossible(game, 12, 13, 14))

      expect(sumBy(possibleGames, 'id')).toBe(8)
    })

    test('actual input', () => {
      const games = input.split("\n").map(line => parseGameRecord(line))
      const possibleGames = games.filter(game => isPossible(game, 12, 13, 14))

      expect(sumBy(possibleGames, 'id')).toBe(2076)
    })
  })

  describe('Fewest Cubes', () => {
    test.each([
      ['Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green', 4, 2, 6],
      ['Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue', 1, 3, 4],
      ['Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red', 20, 13, 6],
      ['Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red', 14, 3, 15],
      ['Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green', 6, 3, 2]
    ])('"%s" fewest cubes is %s red, %s blue, and %s green', (line, red, green, blue) => {
      const game = parseGameRecord(line)

      expect(fewestCubes(game)).toEqual({ red, green, blue })
    })
  })

  describe('Part 2', () => {
    test('sample input', () => {
      const games = samplePart1.split("\n").map(line => parseGameRecord(line))
      const powers = games
        .map(game => fewestCubes(game))
        .map(cubes => power(cubes))

      expect(sum(powers)).toBe(2286)
    })

    test('actual input', () => {
      const games = input.split("\n").map(line => parseGameRecord(line))
      const powers = games
        .map(game => fewestCubes(game))
        .map(cubes => power(cubes))

      expect(sum(powers)).toBe(70950)
    })
  })
})