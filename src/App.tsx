import { useEffect, useMemo, useState } from "react"
import JsonLinesEditor from "./components/JsonLinesEditor"
import getLinesErrors from "./validations/getLinesErrors"
import clsx from "clsx"

interface LineErrors {
  [line: number]: string
}

function App() {
  const [value, setValue] = useState<string>('')
  const [errors, setErrors] = useState<LineErrors>({})

  const errorLines = useMemo(() => Object.keys(errors).map(Number), [errors])

  const onChange = (value: string) => {
    setValue(value)
  }

  useEffect(() => {
    if (!value) {
      setErrors({})
      return
    }
    const timeout = setTimeout(() => {
      setErrors(getLinesErrors(value))
    }, 1000)
    return () => clearTimeout(timeout)
  }, [value])

  return (
    <main className="py-16 px-8 flex flex-col h-screen">
      <div className="flex-0">
        <h1 className="text-4xl font-bold mb-4 text-teal-500">
          JSONL Checker for OpenAI Fine Tuning
        </h1>
        <div className="mb-8">
          <h2 className="mb-2">Instructions</h2>
          <p className="text-neutral-500 text-sm">
            This tool will help you validate JSONL files for OpenAI fine-tuning. Paste your JSONL data into the editor below. Each line should be a valid JSON object. The editor will highlight any lines that contain invalid JSON.
          </p>
        </div>
        <div className={clsx(
          'text-white p-4 mb-4 rounded md h-36 overflow-hidden',
          errorLines.length > 0 && 'bg-red-950/10 border border-red-950',
          errorLines.length === 0 && 'bg-green-950/10 border border-green-950'
        )}>
          <h2 className="font-bold mb-1 text-sm">{errorLines.length > 0 ? 'Your file has errors 😰' : 'All is OK 🥳'}</h2>
          <ul className="overflow-y-scroll h-full pb-8">
            {errorLines?.map(line => (
              <li key={line} className="mb-05 text-xs">
                Line {line}: {errors[line]}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex-1 h-full">
        <JsonLinesEditor errorLines={errorLines} value={value} onChange={onChange} />
      </div>
      <footer className="flex-0">
        <p className="text-neutral-500 text-sm text-center mt-4">
          Made with ❤️ by <a href="https://dobleb.cl" className="text-teal-500">DobleB</a>
        </p>
      </footer>
    </main>
  )
}

export default App
