import { motion } from "framer-motion";
import { useState } from "react";
import type { ImageMeta } from "@/lib/constants/images";
import { SPRINGS } from "@/lib/constants/animation";

/**
 * ImageThumbnail - A clickable image thumbnail with hover effects
 *
 * Features:
 * - Lazy loading
 * - Loading state with skeleton
 * - Hover zoom effect
 * - Theme-aware styling
 */

export interface ImageThumbnailProps {
  image: ImageMeta;
  onClick?: (image: ImageMeta) => void;
  /** Height in pixels (default: 200) */
  height?: number;
  /** Show image caption (default: true) */
  showCaption?: boolean;
  className?: string;
}

export function ImageThumbnail({
  image,
  onClick,
  height = 200,
  showCaption = true,
  className,
}: ImageThumbnailProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <motion.figure
      className={`group flex flex-col overflow-hidden rounded-xl cursor-pointer bg-card/30 ${className ?? ""}`}
      onClick={() => onClick?.(image)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", ...SPRINGS.snappy }}
    >
      {/* Image container */}
      <div className="relative overflow-hidden" style={{ height }}>
        {/* Loading skeleton */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 bg-card/50 animate-pulse" />
        )}

        {/* Error state */}
        {hasError && (
          <div className="absolute inset-0 bg-card/50 flex items-center justify-center">
            <span className="text-tiny text-foreground/50">Erreur de chargement</span>
          </div>
        )}

        {/* Image */}
        <motion.img
          src={image.path}
          alt={image.name}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Focus ring for accessibility */}
        <div className="absolute inset-0 rounded-t-xl ring-2 ring-primary/0 group-focus-visible:ring-primary/50 transition-all" />
      </div>

      {/* Caption - below the image */}
      {showCaption && (
        <figcaption className="px-3 py-2 bg-card/50">
          <p className="text-body font-medium truncate text-foreground">{image.name}</p>
          {image.description && (
            <p className="text-tiny text-foreground/60 truncate mt-0.5">
              {image.description}
            </p>
          )}
        </figcaption>
      )}
    </motion.figure>
  );
}

export default ImageThumbnail;
