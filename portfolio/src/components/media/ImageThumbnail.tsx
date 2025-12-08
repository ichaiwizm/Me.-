import { motion } from "framer-motion";
import { useState } from "react";
import type { ImageMeta } from "@/lib/constants/images";
import { TRANSITIONS, SPRINGS } from "@/lib/constants/animation";

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
      className={`group relative overflow-hidden rounded-xl cursor-pointer ${className ?? ""}`}
      style={{ height }}
      onClick={() => onClick?.(image)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", ...SPRINGS.snappy }}
    >
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

      {/* Overlay gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Caption */}
      {showCaption && (
        <motion.figcaption
          className="absolute bottom-0 left-0 right-0 p-3 text-white"
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={TRANSITIONS.fadeIn}
        >
          <p className="text-body font-medium truncate">{image.name}</p>
          {image.description && (
            <p className="text-tiny text-white/70 truncate mt-0.5">
              {image.description}
            </p>
          )}
        </motion.figcaption>
      )}

      {/* Focus ring for accessibility */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-primary/0 group-focus-visible:ring-primary/50 transition-all" />
    </motion.figure>
  );
}

export default ImageThumbnail;
