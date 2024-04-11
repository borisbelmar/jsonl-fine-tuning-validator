import { OnMount } from '@monaco-editor/react'

const editorWillMount: OnMount = (_editor, monaco) => {
  if (!monaco.languages.getLanguages().some(({ id }) => id === 'jsonl')) {
    monaco.languages.register({ id: 'jsonl' })
    monaco.languages.setMonarchTokensProvider('jsonl', {
      // Since JSONL is essentially JSON objects on separate lines, we won't mark anything as invalid by default
      // defaultToken: 'invalid',
    
      keywords: [
        'true', 'false', 'null'
      ],
    
      // No specific typeKeywords needed as JSON doesn't have explicit type definitions like in the provided language config
      typeKeywords: [],
    
      // Operators are not used in JSON, but we include common symbols that might appear
      symbols:  /[{}[\],:]/,
    
      // JSON strings use backslash for escaping
      escapes: /\\(?:["\\/bfnrt]|u[0-9A-Fa-f]{4})/,
    
      tokenizer: {
        root: [
          // Parse strings in JSON
          [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-terminated string
          [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],
    
          // No need for class names, annotations, or complex identifiers in JSON
          // Numbers, including floats and hex
          [/\b-?(0[xX][0-9a-fA-F]+|[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?)\b/, 'number'],
    
          // Punctuation and structural characters
          [/[{}[\]]/, '@brackets'],
          [/[,:]/, 'delimiter'],
    
          // Booleans and null
          [/\b(?:true|false|null)\b/, 'keyword'],
    
          // Whitespace and comments are not standard in JSON but might appear in JSONL for readability
          [/[ \t\r\n]+/, 'white'],
          // Technically, JSON does not support comments, but they might be included in a JSONL file for clarity or notes
          [/\/\/.*$/, 'comment'],
        ],
    
        string: [
          [/[^\\"]+/,  'string'],
          [/@escapes/, 'string.escape'],
          [/\\./,      'string.escape.invalid'],
          [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
        ],
      },
    })
    monaco.languages.setLanguageConfiguration('jsonl', {
      comments: {
        lineComment: '//',
        blockComment: ['/*', '*/'],
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '"', close: '"', notIn: ['string'] },
      ],
      surroundingPairs: [
        { open: '"', close: '"' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
      ],
    })
  }
}

export default editorWillMount
