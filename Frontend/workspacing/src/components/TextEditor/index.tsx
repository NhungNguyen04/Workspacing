import React, { useEffect, useRef, useState, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import styles from './styles.module.css';
import { io, Socket } from 'socket.io-client';
import { useParams } from "react-router-dom";

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
  ]


const TextEditor: React.FC = () => {
    const { id: documentId } = useParams()
    const [quill, setQuill] = useState<Quill | null>(null);
    const [socket, setSocket] = useState<Socket | undefined>(undefined);

    // set up socket connection
    useEffect(() => {
        const s = io('http://localhost:3033');
        setSocket(s);
        return () => {
            s.disconnect();
        }
    }, []);

    // define the Quill so that it doesn't change every time the page re renders
    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return
        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS },
        })
        setQuill(q)
        return () => {
            q.disable()
            q.setText("Loading...")
        }
    }, [])

    // send changes to socket when we change the text
    useEffect(() => {
        if (socket == null || quill == null) return;
        const handler =  (delta, oldDelta, source) => {
            if (source !== 'user') return;
            socket.emit("send changes", delta);
        };
        quill.on('text-change', handler);

        return () => {
            quill.off('text-change', handler);
        }
    })

    // receive the changes from other client
    useEffect(() => {
        if (socket == null || quill == null) return;
        const handler =  (delta) => {
            quill.updateContents(delta);
        };
        socket.on('received changes', handler);

        return () => {
            socket.off('received changes', handler);
        }
    })

    return (
        <div className={styles.container} ref={wrapperRef}></div>
    );
};

export default TextEditor;
