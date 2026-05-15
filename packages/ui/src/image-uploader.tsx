/**
 * @repo/ui — ImageUploader Component
 * Client-side image uploader with WebP compression and 200KB validation.
 * Uses the Canvas API to compress to WebP before upload.
 *
 * context_ui.md: §Imágenes — siempre WebP <200KB · CDN Supabase Storage
 * executive_summary.md: Subida desde celular · auto-compresión WebP · CDN inmediato
 */

"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import type { BrandTheme } from "./button";

export type UploaderRestaurant = BrandTheme | "chef";

export interface ImageUploaderProps {
  restaurant: UploaderRestaurant;
  /** Called with the compressed File ready to upload to Supabase Storage */
  onFile: (file: File, preview: string) => void;
  /** Called if compression or validation fails */
  onError?: (message: string) => void;
  /** Max file size after compression in bytes. Default: 200KB */
  maxBytes?: number;
  /** Accepted MIME types before compression */
  accept?: string;
  /** Optional label */
  label?: string;
  className?: string;
}

const MAX_BYTES = 200 * 1024; // 200KB

/* ── Brand drop zone styles ─────────────────────────────────── */
const dropZoneStyles: Record<UploaderRestaurant, string> = {
  "la-carreta":
    "border-2 border-dashed border-[rgba(196,151,42,0.3)] bg-[rgba(196,151,42,0.03)] hover:border-[rgba(196,151,42,0.6)] hover:bg-[rgba(196,151,42,0.06)] text-[#C4972A]",
  "mar-y-tierra":
    "border-2 border-dashed border-[rgba(26,188,156,0.3)] bg-[rgba(26,188,156,0.03)] hover:border-[rgba(26,188,156,0.6)] hover:bg-[rgba(26,188,156,0.06)] text-[#1ABC9C]",
  delica:
    "border border-dashed border-[rgba(141,106,50,0.25)] bg-[rgba(141,106,50,0.02)] hover:border-[rgba(141,106,50,0.5)] text-[#8D6A32]",
  chef:
    "border border-dashed border-[rgba(141,106,50,0.25)] bg-[rgba(141,106,50,0.02)] hover:border-[rgba(141,106,50,0.5)] text-[#8D6A32]",
  admin:
    "border-2 border-dashed border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] text-[#9aa0ac]",
};

const dropZoneActiveStyles: Record<UploaderRestaurant, string> = {
  "la-carreta": "border-[#C4972A] bg-[rgba(196,151,42,0.08)]",
  "mar-y-tierra": "border-[#1ABC9C] bg-[rgba(26,188,156,0.08)]",
  delica: "border-[#8D6A32] bg-[rgba(141,106,50,0.06)]",
  chef: "border-[#8D6A32] bg-[rgba(141,106,50,0.06)]",
  admin: "border-[#4f8ef7] bg-[rgba(79,142,247,0.05)]",
};

const labelStyles: Record<UploaderRestaurant, string> = {
  "la-carreta":
    "font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.06em] uppercase text-[#888] mb-[5px] block",
  "mar-y-tierra":
    "font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.06em] uppercase text-[#888] mb-[5px] block",
  delica:
    "font-['DM_Sans',sans-serif] text-[9px] font-medium tracking-[0.14em] uppercase text-[rgba(141,106,50,0.5)] mb-[5px] block",
  chef:
    "font-['DM_Sans',sans-serif] text-[9px] font-medium tracking-[0.14em] uppercase text-[rgba(141,106,50,0.5)] mb-[5px] block",
  admin:
    "font-['DM_Sans',sans-serif] text-[10px] font-semibold tracking-[0.06em] uppercase text-[#5f6672] mb-[5px] block",
};

const borderRadius: Record<UploaderRestaurant, string> = {
  "la-carreta": "rounded-[6px]",
  "mar-y-tierra": "rounded-[8px]",
  delica: "rounded-[1px]",
  chef: "rounded-[2px]",
  admin: "rounded-[6px]",
};

/**
 * Compresses an image File to WebP using the Canvas API.
 * Progressively reduces quality until the file fits within maxBytes.
 */
async function compressToWebP(file: File, maxBytes: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");
      // Cap dimensions to 1200px wide maintaining aspect ratio
      const maxDim = 1200;
      let { width, height } = img;
      if (width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      }
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));
      ctx.drawImage(img, 0, 0, width, height);

      // Try quality levels from 0.85 down to 0.4
      const qualities = [0.85, 0.75, 0.65, 0.55, 0.45, 0.4];
      let compressed: File | null = null;

      const tryQuality = (idx: number) => {
        if (idx >= qualities.length) {
          return reject(
            new Error(`No se pudo comprimir a menos de ${Math.round(maxBytes / 1024)}KB. Usa una imagen más pequeña.`)
          );
        }
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Error al procesar la imagen"));
            if (blob.size <= maxBytes || idx === qualities.length - 1) {
              compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
                type: "image/webp",
                lastModified: Date.now(),
              });
              if (compressed.size > maxBytes) {
                return reject(
                  new Error(`Imagen demasiado grande: ${Math.round(compressed.size / 1024)}KB (máx. ${Math.round(maxBytes / 1024)}KB).`)
                );
              }
              resolve(compressed);
            } else {
              tryQuality(idx + 1);
            }
          },
          "image/webp",
          qualities[idx]
        );
      };

      tryQuality(0);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo cargar la imagen"));
    };

    img.src = objectUrl;
  });
}

/** Interactive image uploader with WebP compression and brand theming */
export function ImageUploader({
  restaurant,
  onFile,
  onError,
  maxBytes = MAX_BYTES,
  accept = "image/jpeg,image/png,image/webp",
  label = "Imagen del plato",
  className = "",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [sizeInfo, setSizeInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function processFile(raw: File) {
    if (!raw.type.startsWith("image/")) {
      const msg = "Solo se aceptan imágenes (JPEG, PNG, WebP)";
      setError(msg);
      onError?.(msg);
      return;
    }

    setProcessing(true);
    setError(null);
    setSizeInfo(null);

    try {
      const compressed = await compressToWebP(raw, maxBytes);
      const url = URL.createObjectURL(compressed);
      setPreview(url);
      setSizeInfo(`${Math.round(compressed.size / 1024)}KB · WebP`);
      onFile(compressed, url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error procesando imagen";
      setError(msg);
      onError?.(msg);
    } finally {
      setProcessing(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  const dropZoneClass = [
    "relative flex flex-col items-center justify-center gap-3 p-6 cursor-pointer transition-all duration-200",
    borderRadius[restaurant],
    dropZoneStyles[restaurant],
    dragging ? dropZoneActiveStyles[restaurant] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`theme-${restaurant} ${className}`}>
      {label && (
        <label className={labelStyles[restaurant]} onClick={() => inputRef.current?.click()}>
          {label}
        </label>
      )}

      <div
        className={dropZoneClass}
        role="button"
        tabIndex={0}
        aria-label={`${label} — arrastrar o hacer clic para seleccionar`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="sr-only"
          aria-hidden="true"
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt="Vista previa"
              className={`w-full max-h-40 object-cover ${borderRadius[restaurant]}`}
            />
            {sizeInfo && (
              <span className="font-['DM_Mono',monospace] text-[11px] opacity-60">
                {sizeInfo}
              </span>
            )}
            <span className="font-['DM_Sans',sans-serif] text-[10px] opacity-50">
              Clic para cambiar
            </span>
          </>
        ) : processing ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
            <span className="font-['DM_Sans',sans-serif] text-[12px] opacity-60">
              Comprimiendo a WebP…
            </span>
          </div>
        ) : (
          <>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-center">
              <p className="font-['DM_Sans',sans-serif] text-[12px] font-medium">
                Arrastra una imagen o haz clic
              </p>
              <p className="font-['DM_Sans',sans-serif] text-[10px] opacity-50 mt-0.5">
                JPEG · PNG · WebP · máx. {Math.round(maxBytes / 1024)}KB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="font-['DM_Sans',sans-serif] text-[11px] text-red-500 mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
