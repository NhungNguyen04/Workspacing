// components/TextEditor.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import styles from "./styles.module.css"; // Import your custom styles

interface TextEditorProps {
  id: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ id }) => {
  const [quill, setQuill] = useState<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Load document content on mount
  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await fetch(`/api/getDocument?id=${id}`);
        const data = await response.json();
        if (quill && data.content) quill.setContents(data.content);
      } catch (error) {
        console.error("Failed to load document:", error);
      }
    };

    loadDocument();
  }, [id, quill]);

  // Initialize Quill editor
  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    setQuill(q);
  }, []);

  // Save document content periodically
  useEffect(() => {
    if (!quill) return;

    const saveDocument = async () => {
      try {
        const content = quill.getContents();
        await fetch("/api/saveDocument", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id, content }),
        });
      } catch (error) {
        console.error("Failed to save document:", error);
      }
    };

    const interval = setInterval(saveDocument, 2000); // Save every 2 seconds
    return () => clearInterval(interval);
  }, [id, quill]);

  return <div className={styles.container}> {/* Apply custom container styling */}
  <div ref={wrapperRef} className={styles.editor} /> {/* Apply custom editor styling */}
</div>
};

export default TextEditor;

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];
