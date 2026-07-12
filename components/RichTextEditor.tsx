"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRef, useEffect } from "react";

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

    // Mount the editor and paste the HTML safely
    useEffect(() => {
        if (quillRef.current) {
            // quillRef.current is now the Quill instance directly
            if (value && value.trim() !== "") {
                quillRef.current.clipboard.dangerouslyPasteHTML(value);
            }
        }
    }, []);

    return (
        <div className="bg-white border rounded">
            <QuillEditor
                // FIX: Use 'onRef' instead of 'ref' and save the instance directly
                onRef={(instance) => { quillRef.current = instance; }}
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