"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRef, useEffect } from "react";

// Dynamically import Quill to avoid SSR issues
const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "blockquote", "code-block"],
    [{ align: [] }],
    ["clean"],
];

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    const quillRef = useRef<any>(null);

    // FORCE HTML RENDERING ON MOUNT
    useEffect(() => {
        if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            // If the value is HTML, we safely paste it into the editor
            if (value && value.trim() !== "") {
                quill.clipboard.dangerouslyPasteHTML(value);
            }
        }
    }, []);

    return (
        <div className="bg-white border rounded">
            <QuillEditor
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={{
                    toolbar: toolbarOptions,
                    clipboard: {
                        matchVisual: false, // This prevents raw HTML from getting corrupted by Quill's visual matching
                    },
                }}
                className="h-64 md:h-80"
            />
        </div>
    );
}