"use client";
import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface LightboxProps {
    isOpen: boolean;
    imageUrl: string;
    altText: string;
    onClose: () => void;
}

export default function ImageLightbox({ isOpen, imageUrl, altText, onClose }: LightboxProps) {
    // Close lightbox on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 transition-colors z-10"
            >
                <FaTimes size={28} />
            </button>
            <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt={altText}
                    className="max-w-full max-h-full object-contain rounded shadow-2xl"
                />
            </div>
        </div>
    );
}