"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Load Quill dynamically to avoid Next.js server-side rendering errors
const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image", "blockquote", "code-block"],
    [{ align: [] }],
    ["clean"], // remove formatting button
];

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    return (
        <div className="bg-white border rounded">
            <QuillEditor
                theme="snow"
                value={value}
                onChange={onChange}
                modules={{ toolbar: toolbarOptions }}
                className="h-64 md:h-80" // Sets a fixed height for the writing area
            />
        </div>
    );
}