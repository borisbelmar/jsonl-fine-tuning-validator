import { Editor, type OnMount } from "@monaco-editor/react";
import { editor, Range } from 'monaco-editor'
import editorWillMount from "./utils/editorWillMount";
import { useEffect, useRef } from "react";

interface JsonLinesEditorProps {
  value?: string
  onChange?: (value: string) => void
  errorLines?: number[]
}

export default function JsonLinesEditor({ value, onChange, errorLines }: JsonLinesEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor>()

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor
    editorWillMount(editor, monaco)
  }

  useEffect(() => {
    if (!editorRef.current || !errorLines) return

    const decorations = errorLines.map(line => ({
      range: new Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        className: 'bg-red-500 opacity-5',
        glyphMarginClassName: 'bg-red-500 ml-3'
      },
    }))

    const model = editorRef.current.getModel()
    const decs = model?.deltaDecorations([], decorations)
    return () => {
      model?.deltaDecorations(decs ?? [], [])
    }
  }, [errorLines])

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      language="jsonl"
      value={value}
      onChange={value => onChange?.(value ?? '')}
      options={{
        inlineSuggest: { enabled: true },
        fontSize: 12,
        formatOnType: true,
        autoClosingBrackets: 'always',
        minimap: { scale: 10, enabled: false },
        tabSize: 2,
        glyphMargin: true
      }}
      onMount={handleMount}
    />
  )
}