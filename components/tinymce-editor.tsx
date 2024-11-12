import { Editor } from '@tinymce/tinymce-react'
import { useRef, useEffect } from 'react'

interface TinyMCEEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function TinyMCEEditor({ value, onChange }: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorChange = (content: any) => {
    onChange(content)
  }

  const placeCursorAtEnd = () => {
    if (editorRef.current) {
      const editor = editorRef.current
      editor.focus()
      setTimeout(() => {
        // Safely check if selection and getBody are available
        if (editor.selection && editor.getBody()) {
          editor.selection.select(editor.getBody(), true)
          editor.selection.collapse(false)
        }
      }, 0) // Set a short delay
    }
  }

  useEffect(() => {
    // Ensure cursor is at the end when content changes or editor loads
    if (editorRef.current) {
      placeCursorAtEnd()
    }
  }, [value])

  return (
    <Editor
      apiKey='wo5yr5cvm21r10czqjpc8cx0jazms2ld0qx1eexiit6tvx2l'
      onInit={(evt, editor) => {
        editorRef.current = editor
        // Use a delay on init to make sure editor is fully ready
        editor.on('init', placeCursorAtEnd)
      }}
      onFocus={placeCursorAtEnd}
      initialValue={value}
      onEditorChange={handleEditorChange}
      init={{
        plugins: [
          'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
          'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'autocorrect', 'typography', 'inlinecss', 'markdown',
          'importword', 'exportword', 'exportpdf'
        ],
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | checklist numlist bullist indent outdent | link image media table | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          { value: 'First.Name', title: 'First Name' },
          { value: 'Email', title: 'Email' },
        ],
        ai_request: (request: any, respondWith:any) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
        exportpdf_converter_options: { 'format': 'Letter', 'margin_top': '1in', 'margin_right': '1in', 'margin_bottom': '1in', 'margin_left': '1in' },
        exportword_converter_options: { 'document': { 'size': 'Letter' } },
        importword_converter_options: { 'formatting': { 'styles': 'inline', 'resets': 'inline', 'defaults': 'inline' } },
        content_style: `
          body {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 14px;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            min-height: 800px; /* Minimum height of the content */
            padding: 20px; /* Padding within the content */
            margin: auto; /* Center the content if smaller than max width */
            box-sizing: border-box; /* Include padding in height calculation */
          }
        `,
        min_height: 800, // Set the editor’s total height
        max_width: 1440,  // Set the editor’s total width
        setup: (editor) => {
          // Listen for keydown events and override Delete key behavior
          editor.on('keydown', (e) => {
            if (e.key === 'Delete') {
              e.preventDefault() // Prevent the default Delete action
              editor.execCommand('mceDelete') // Execute Backspace-like behavior
            }
          })
        },
      }}
    />
  )
}
