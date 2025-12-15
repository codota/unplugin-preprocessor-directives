import type { Directive } from './core/types'

type FilterPattern = ReadonlyArray<string | RegExp> | string | RegExp | null

export interface Options {
  cwd: string
  directives: Directive<any, any>[]
  include: FilterPattern
  exclude: FilterPattern
  preserveLineNumbers: boolean
}

export interface UserOptions extends Partial<Options> { }
