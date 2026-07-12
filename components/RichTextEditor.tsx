"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRef, useEffect } from "react";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false }) as any;

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

    // Only runs once when the editor mounts. Safely parses the HTML into formatting.
    useEffect(() => {
        if (quillRef.current && value) {
            quillRef.current.clipboard.dangerouslyPasteHTML(value);
        }
    }, []); // Empty array is crucial here!

    return (
        <div className="bg-white border rounded">
            <QuillEditor
                ref={quillRef}
                theme="snow"
                onChange={(content: string) => onChange(content)} // Triggers on every keypress
                modules={{
                    toolbar: toolbarOptions,
                    clipboard: {
                        matchVisual: false,
                    },
                }}
                className="h-64 md:h-80"
            />
        </div>
    );
}