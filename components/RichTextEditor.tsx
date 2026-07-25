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

    // Force the editor to interpret the HTML correctly without crashing
    useEffect(() => {
        if (quillRef.current && value && value.trim() !== "") {
            quillRef.current.clipboard.dangerouslyPasteHTML(value);
        }
    }, []);

    return (
        <div className="bg-white border rounded overflow-hidden w-full">
            <QuillEditor
                ref={quillRef}
                theme="snow"
                // Do NOT pass 'value' as a prop to avoid the paste conflict loop
                // We use dangerouslyPasteHTML in the effect to safely load it
                onChange={(content: string) => onChange(content)}
                modules={{
                    toolbar: toolbarOptions,
                    clipboard: {
                        matchVisual: false, // Crucial fix for PC copy/paste crashes
                    },
                }}
                className="h-64 md:h-80 w-full"
            />
        </div>
    );
}