"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRef, useCallback } from "react";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false }) as any;

const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video", "blockquote", "code-block"],
    [{ align: [] }],
    ["clean"],
];

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    const quillRef = useRef<any>(null);

    // Custom paste handler to preserve formatting without crashing mobile
    const onPaste = useCallback((e: any) => {
        e.preventDefault();
        const clipboardData = e.clipboardData || (window as any).clipboardData;
        const pastedHtml = clipboardData.getData('text/html');

        if (pastedHtml && quillRef.current) {
            const delta = quillRef.current.clipboard.convert(pastedHtml);
            quillRef.current.setContents(delta, 'silent');
        } else {
            // Fallback for plain text
            const pastedText = clipboardData.getData('text/plain');
            if (pastedText && quillRef.current) {
                quillRef.current.insertText(quillRef.current.getLength() - 1, pastedText);
            }
        }
    }, []);

    const handleRef = (instance: any) => {
        quillRef.current = instance;
        if (instance) {
            // Remove existing paste listener to avoid duplicates
            instance.root.removeEventListener('paste', onPaste);
            instance.root.addEventListener('paste', onPaste);
        }
    };

    return (
        <div className="bg-white border rounded overflow-hidden w-full">
            <QuillEditor
                onRef={handleRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={{
                    toolbar: toolbarOptions,
                    clipboard: {
                        matchVisual: false, // Crucial for PC stability, but our paste handler overrides the default
                    },
                }}
                className="h-64 md:h-80 w-full"
            />
        </div>
    );
}