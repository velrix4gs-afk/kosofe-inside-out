"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRef, useEffect } from "react";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false }) as any;

const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    [{ align: [] }],
    ["clean"],
];

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    const quillRef = useRef<any>(null);

    // Custom Paste Handler: Converts Gmail HTML to clean Quill Delta
    const handlePaste = (event: any) => {
        event.preventDefault();
        const html = event.clipboardData.getData("text/html");
        const text = event.clipboardData.getData("text/plain");

        if (quillRef.current) {
            if (html) {
                const delta = quillRef.current.clipboard.convert({ html });
                quillRef.current.setContents(delta, "silent");
            } else {
                quillRef.current.insertText(quillRef.current.getLength() - 1, text);
            }
        }
    };

    useEffect(() => {
        const editor = quillRef.current;
        if (editor) {
            editor.root.removeEventListener("paste", handlePaste);
            editor.root.addEventListener("paste", handlePaste);
        }
    }, []);

    return (
        <div className="bg-white border rounded overflow-hidden w-full">
            <QuillEditor
                onRef={(instance: any) => {
                    quillRef.current = instance;
                }}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={{
                    toolbar: toolbarOptions,
                    clipboard: {
                        matchVisual: false, // We handle paste ourselves
                    },
                }}
                className="h-64 md:h-80 w-full"
            />
        </div>
    );
}