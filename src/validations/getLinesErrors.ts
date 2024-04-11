import checkBrackets from "./checkBrackets"
import checkConversation from "./checkConversation"
import checkLineSyntax from "./checkLineSyntax"

interface LineErrors {
  [line: number]: string
}

const validations = [
  checkLineSyntax,
  checkBrackets,
  checkConversation
]

export default function getLinesErrors (jsonl: string) {
  const lines = jsonl.split('\n')
  const errors: LineErrors = {}
  lines.forEach((line, index) => {
    const lineNumber = index + 1
    for (const validation of validations) {
      const error = validation(line)
      if (error) {
        errors[lineNumber] = error
        break
      }
    }
    
  })
  return errors
}