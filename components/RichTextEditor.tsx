"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false }) as any;

// Added "video" to the toolbar options
const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "video", "blockquote", "code-block"],
    [{ align: [] }],
    ["clean"],
];

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    return (
        <div className="bg-white border rounded overflow-hidden w-full">
            <QuillEditor
                theme="snow"
                value={value}
                onChange={(content: string) => onChange(content)}
                modules={{
                    toolbar: toolbarOptions,
                    clipboard: {
                        matchVisual: false, // Prevents PC paste crash
                    },
                }}
                className="h-64 md:h-80 w-full"
            />
        </div>
    );
}