"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import Modal from "@/components/Modal";

export default function ImagePreview({ src, alt, width, height, sizes, imgStyle, title }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="image-preview-trigger"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Zoom in: ${alt}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} style={imgStyle} />
        <span className="image-preview-zoom" aria-hidden="true">
          <Search size={16} />
        </span>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={title || alt}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="90vw"
          style={{ width: "100%", height: "auto", borderRadius: "var(--radius)" }}
        />
      </Modal>
    </>
  );
}
