"use client";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

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
    return (
        <div className="bg-white border rounded overflow-hidden w-full relative">
            {/* Custom Styling */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .ql-editor {
          font-family: 'Inter', sans-serif !important;
          white-space: pre-wrap !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          font-size: 16px;
        }
        .ql-toolbar.ql-snow {
          position: sticky !important;
          top: 0 !important;
          z-index: 10 !important;
          background: #ffffff !important;
          border-bottom: 1px solid #e5e7eb !important;
        }
      `}} />
            <QuillEditor
                theme="snow"
                value={value}
                onChange={onChange}
                modules={{
                    toolbar: toolbarOptions,
                    clipboard: {
                        matchVisual: true,
                    },
                }}
                className="min-h-[250px] md:min-h-[350px] h-auto w-full"
            />
        </div>
    );
}