export default function checkLineSyntax (line: string) {
  try {
    if (!line.trim()) return
    JSON.parse(line)
  } catch {
    return 'Invalid Syntax'
  }
}