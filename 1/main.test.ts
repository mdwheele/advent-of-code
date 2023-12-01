import { readFileSync } from 'node:fs'
import { replace, sum } from 'lodash'

const samplePart1 = readFileSync('1/sample-part1.txt').toString()
const samplePart2 = readFileSync('1/sample-part2.txt').toString()
const input = readFileSync('1/input.txt').toString()

function getCalibrationValue(text: string): number {
  const digits = text.split('').filter(char => Number(char))

  return Number(`${digits[0]}${digits[digits.length - 1]}`)
}

function replaceSpelledNumbers(text: string): string {
  const replacements: { [index: string]: string } = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8', 
    'nine': '9'
  }

  return [...text.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g)]
    .map(match => match[1])
    .map(text => replacements[text] || text)
    .join('')
}

describe('Day 1: Trebuchet?!', () => {
  describe('Calibration Values', () => {
    test('numbers on ends', () => {
      expect(getCalibrationValue('1abc2')).toBe(12)
    })

    test('numbers towards middle', () => {
      expect(getCalibrationValue('pqr3stu8vwx')).toBe(38)
    })

    test('evenly distributed', () => {
      expect(getCalibrationValue('a1b2c3d4e5f')).toBe(15)
    })

    test('single number', () => {
      expect(getCalibrationValue('treb7uchet')).toBe(77)
    })

    test('multiple digits side-by-side', () => {
      expect(getCalibrationValue('shrzvdcghblt21')).toBe(21)
    })
  })

  describe('Part 1', () => {
    test('sample input', () => {
      const lines = samplePart1.split("\n")
    
      const solution = sum(lines.map(line => getCalibrationValue(line)))
      
      expect(solution).toBe(142)
    })
  
    test('actual input', () => {
      const lines = input.split("\n")
    
      const solution = sum(lines.map(line => getCalibrationValue(line)))
      
      expect(solution).toBe(55538)
    })
  })

  describe('Text Number Replacement', () => {
    test.each([
      ['two1nine', '219', 29],
      ['eightwothree', '823', 83],
      ['abcone2threexyz', '123', 13],
      ['xtwone3four', '2134', 24],
      ['4nineeightseven2', '49872', 42],
      ['zoneight234', '18234', 14],
      ['7pqrstsixteen', '76', 76],
    ])('%s becomes %s with calibration value of %s', (text, expected, calibration) => {
      const replaced = replaceSpelledNumbers(text)
      
      expect(replaced).toBe(expected)
      expect(getCalibrationValue(replaced)).toBe(calibration)
    })
  })

  describe('Part 2', () => {
    test('sample input', () => {
      const lines = samplePart2.split("\n")
    
      const solution = sum(lines.map(line => getCalibrationValue(replaceSpelledNumbers(line))))
      
      expect(solution).toBe(281)
    })

    test('actual input', () => {
      const lines = input.split("\n")
    
      const solution = sum(lines.map(line => getCalibrationValue(replaceSpelledNumbers(line))))
      
      expect(solution).toBe(54875)
    })
  })
})