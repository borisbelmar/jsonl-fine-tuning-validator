export default function checkBrackets (line: string) {
  const trimmed = line.trim()
  if (!trimmed) return
  if (trimmed[0] !== '{' || trimmed[trimmed.length - 1] !== '}') {
    return 'Must start and end with curly braces'
  }
}