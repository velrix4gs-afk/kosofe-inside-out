"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRef, useState } from "react";

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
    const editorRef = useRef<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Mark the component as mounted to prevent React error #185
    const handleChange = (content: string) => {
        if (isMounted) {
            onChange(content);
        }
    };

    return (
        <div className="bg-white border rounded overflow-hidden w-full">
            <QuillEditor
                onRef={(instance: any) => {
                    editorRef.current = instance;
                    setIsMounted(true);
                }}
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={{
                    toolbar: toolbarOptions,
                    clipboard: {
                        matchVisual: false,
                    },
                }}
                className="h-64 md:h-80 w-full"
            />
        </div>
    );
}