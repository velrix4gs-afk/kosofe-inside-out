"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRef } from "react";

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

    return (
        <div className="bg-white border rounded">
            <QuillEditor
                key={value} // 🔥 CRITICAL: Forces a fresh mount when the story finishes loading
                ref={quillRef}
                theme="snow"
                value={value} // Now uses native controlled logic
                onChange={(content: string) => onChange(content)}
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