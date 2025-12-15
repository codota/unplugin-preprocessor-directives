/* eslint-disable no-console */
// Example showing the preserveLineNumbers option

// Configure the plugin with preserveLineNumbers: true
// PreprocessorDirectives({ preserveLineNumbers: true })

function calculate() {
  const a = 10
  const b = 20
  // #if DEBUG
  console.log('Debug: a =', a)
  console.log('Debug: b =', b)
  // #endif
  const result = a + b

  // #if VERBOSE
  console.log('Verbose logging enabled')
  console.log('Calculation details...')
  // #elif PRODUCTION
  // Optimized for production
  // #else
  console.log('Default mode')
  // #endif

  return result
}

// With preserveLineNumbers: false (default)
// If DEBUG and VERBOSE are not defined, the output would be:
//   function calculate() { const a = 10; const b = 20; const result = a + b; console.log('Default mode'); return result; }
// Line numbers would not match the original source

// With preserveLineNumbers: true
// If DEBUG and VERBOSE are not defined, removed lines are replaced with empty lines
// Line numbers in stack traces and debugger will match the original source
// This makes debugging much easier!

const value = calculate()
console.log('Result:', value)
