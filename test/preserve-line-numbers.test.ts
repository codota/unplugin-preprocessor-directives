import { describe, expect, it } from 'vitest'
import { Context, ifDirective } from '../src'

describe('preserveLineNumbers', () => {
  it('should preserve line numbers when option is enabled', () => {
    const context = new Context({
      directives: [ifDirective],
      preserveLineNumbers: true,
    })
    context.env.DEV = false

    const code = `line 1
// #if DEV
line 3 - should be removed but line preserved
line 4 - should be removed but line preserved
// #endif
line 6 - should remain
line 7 - should remain`

    const result = context.transform(code, 'test.js')

    // Count the lines in the result
    const resultLines = result?.split('\n') || []
    const originalLines = code.split('\n')

    // Should have the same number of lines
    expect(resultLines.length).toBe(originalLines.length)

    // Line 1 should be preserved
    expect(resultLines[0]).toBe('line 1')

    // Lines 2-4 (the #if block and content) should be empty
    expect(resultLines[1]).toBe('')
    expect(resultLines[2]).toBe('')
    expect(resultLines[3]).toBe('')
    expect(resultLines[4]).toBe('')

    // Lines 5-6 should be preserved
    expect(resultLines[5]).toBe('line 6 - should remain')
    expect(resultLines[6]).toBe('line 7 - should remain')
  })

  it('should remove lines when option is disabled', () => {
    const context = new Context({
      directives: [ifDirective],
      preserveLineNumbers: false,
    })
    context.env.DEV = false

    const code = `line 1
// #if DEV
line 3 - should be removed
line 4 - should be removed
// #endif
line 6 - should remain
line 7 - should remain`

    const result = context.transform(code, 'test.js')

    // Should have fewer lines than original
    const resultLines = result?.split('\n') || []
    const originalLines = code.split('\n')

    expect(resultLines.length).toBeLessThan(originalLines.length)

    // Should only contain the lines that weren't removed
    expect(result).toBe(`line 1
line 6 - should remain
line 7 - should remain`)
  })

  it('should preserve line numbers with nested conditions', () => {
    const context = new Context({
      directives: [ifDirective],
      preserveLineNumbers: true,
    })
    context.env.DEV = true
    context.env.TEST = false

    const code = `line 1
// #if DEV
line 3 - in DEV block
// #if TEST
line 5 - in TEST block (removed)
// #endif
line 7 - in DEV block
// #endif
line 9 - always present`

    const result = context.transform(code, 'test.js')
    const resultLines = result?.split('\n') || []
    const originalLines = code.split('\n')

    expect(resultLines.length).toBe(originalLines.length)

    expect(resultLines[0]).toBe('line 1')
    expect(resultLines[2]).toBe('line 3 - in DEV block')
    expect(resultLines[4]).toBe('') // TEST block removed but line preserved
    expect(resultLines[6]).toBe('line 7 - in DEV block')
    expect(resultLines[8]).toBe('line 9 - always present')
  })

  it('should preserve line numbers with else branches', () => {
    const context = new Context({
      directives: [ifDirective],
      preserveLineNumbers: true,
    })
    context.env.DEV = true

    const code = `line 1
// #if DEV
line 3 - in if branch
// #else
line 5 - in else branch (removed)
// #endif
line 7 - always present`

    const result = context.transform(code, 'test.js')
    const resultLines = result?.split('\n') || []
    const originalLines = code.split('\n')

    expect(resultLines.length).toBe(originalLines.length)

    expect(resultLines[0]).toBe('line 1')
    expect(resultLines[2]).toBe('line 3 - in if branch')
    expect(resultLines[4]).toBe('') // else branch removed but line preserved
    expect(resultLines[6]).toBe('line 7 - always present')
  })

  it('should default to false when option is not specified', () => {
    const context = new Context({
      directives: [ifDirective],
    })
    context.env.DEV = false

    const code = `line 1
// #if DEV
line 3 - should be removed
// #endif
line 5 - should remain`

    const result = context.transform(code, 'test.js')

    // Should remove lines by default
    const resultLines = result?.split('\n') || []
    expect(resultLines.length).toBeLessThan(code.split('\n').length)
  })
})
