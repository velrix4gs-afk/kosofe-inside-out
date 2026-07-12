"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRef, useEffect } from "react";

// Cast to 'any' to bypass the strict TypeScript ref conflict
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

    // When the editor mounts, safely render the existing HTML
    useEffect(() => {
        if (quillRef.current) {
            if (value && value.trim() !== "") {
                quillRef.current.clipboard.dangerouslyPasteHTML(value);
            }
        }
    }, []);

    return (
        <div className="bg-white border rounded">
            <QuillEditor
                ref={quillRef}  // Now works because 'any' bypasses the type check
                theme="snow"
                value={value}
                onChange={onChange}
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