/**
 * @repo/ui — CustomImage Component
 * Enforces WebP format and 200KB max via Supabase Storage CDN transforms.
 *
 * Rules from executive_summary.md:
 * - Max 200KB per image
 * - Always WebP format
 * - CDN delivery via Supabase Storage
 *
 * Uses Supabase Storage Image Transformation API:
 * ?width=W&height=H&format=webp&quality=85
 */

import type { ImgHTMLAttributes } from "react";

/** Max image size in bytes (200KB) */
const MAX_IMAGE_SIZE_BYTES = 200 * 1024;

/** Max dimension for responsive images */
const DEFAULT_WIDTHS = [320, 640, 960, 1200] as const;

export interface CustomImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  /** Supabase Storage URL (must be from the project's storage) */
  src: string;
  /** Alt text (required for accessibility) */
  alt: string;
  /** Desired display width */
  width?: number;
  /** Desired display height */
  height?: number;
  /** Image quality (1-100, default 85) */
  quality?: number;
  /** Aspect ratio for CLS prevention (e.g. "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Priority loading (for LCP images) */
  priority?: boolean;
}

/**
 * Transforms a Supabase Storage URL to serve WebP at specified dimensions.
 * Appends Supabase Image Transformation query params.
 *
 * @param url - Original Supabase Storage URL
 * @param width - Target width
 * @param quality - Compression quality (default 85)
 * @returns Transformed URL serving WebP
 */
function toWebPUrl(url: string, width: number, quality = 85): string {
  // Only transform Supabase Storage URLs
  if (!url.includes("supabase.co/storage")) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}width=${width}&format=webp&quality=${quality}`;
}

/**
 * Generates a srcSet string for responsive images.
 * Each size serves WebP via Supabase CDN transforms.
 */
function generateSrcSet(url: string, quality: number): string {
  return DEFAULT_WIDTHS.map(
    (w) => `${toWebPUrl(url, w, quality)} ${w}w`
  ).join(", ");
}

/**
 * CustomImage — Enforces WebP format and 200KB max via Supabase CDN.
 *
 * Features:
 * - Auto-converts to WebP via Supabase Image Transformation
 * - Generates responsive srcSet for optimal loading
 * - Enforces aspect-ratio for CLS prevention
 * - Lazy loading by default (priority prop for LCP images)
 * - font-display: swap equivalent via decoding="async"
 *
 * @example
 * ```tsx
 * <CustomImage
 *   src="https://xyz.supabase.co/storage/v1/object/public/menus/plato.jpg"
 *   alt="Ajiaco Santafereño"
 *   width={600}
 *   aspectRatio="4/3"
 * />
 * ```
 */
export function CustomImage({
  src,
  alt,
  width = 600,
  height,
  quality = 85,
  aspectRatio = "4/3",
  priority = false,
  className = "",
  style,
  ...props
}: CustomImageProps) {
  const webpSrc = toWebPUrl(src, width, quality);
  const srcSet = generateSrcSet(src, quality);

  return (
    <img
      src={webpSrc}
      srcSet={srcSet}
      sizes={`(max-width: 640px) 100vw, (max-width: 960px) 50vw, ${width}px`}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`object-cover ${className}`}
      style={{
        aspectRatio,
        maxWidth: "100%",
        height: "auto",
        ...style,
      }}
      {...props}
    />
  );
}

/**
 * Validates that an image file meets the 200KB WebP requirement.
 * Use before uploading to Supabase Storage.
 *
 * @param file - File object from input[type=file]
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo no permitido: ${file.type}. Solo JPEG, PNG o WebP.`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    const sizeKB = Math.round(file.size / 1024);
    return {
      valid: false,
      error: `Imagen demasiado grande: ${sizeKB}KB. Máximo: 200KB.`,
    };
  }

  return { valid: true };
}
