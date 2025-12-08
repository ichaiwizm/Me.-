import { motion } from "framer-motion";
import type { ImageMeta } from "@/lib/constants/images";
import { ImageThumbnail } from "./ImageThumbnail";
import { STAGGER, EASINGS } from "@/lib/constants/animation";

/**
 * ImageGallery - A responsive grid gallery of images
 *
 * Features:
 * - Responsive grid layout (2-4 columns)
 * - Staggered animation on load
 * - Click handler for lightbox integration
 * - Optional captions
 */

export interface ImageGalleryProps {
  images: ImageMeta[];
  /** Number of columns (default: 3) */
  columns?: 2 | 3 | 4;
  /** Gap size (default: "md") */
  gap?: "sm" | "md" | "lg";
  /** Thumbnail height in pixels (default: 200) */
  thumbnailHeight?: number;
  /** Called when an image is clicked */
  onImageClick?: (image: ImageMeta, index: number) => void;
  /** Show captions under images (default: true) */
  showCaptions?: boolean;
  className?: string;
}

const gapSizes = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
};

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.normal,
      ease: EASINGS.standard,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: EASINGS.standard,
    },
  },
};

export function ImageGallery({
  images,
  columns = 3,
  gap = "md",
  thumbnailHeight = 200,
  onImageClick,
  showCaptions = true,
  className,
}: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-foreground/50">
        <p className="text-body">Aucune image disponible</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`grid ${columnClasses[columns]} ${gapSizes[gap]} ${className ?? ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {images.map((image, index) => (
        <motion.div key={image.id} variants={itemVariants}>
          <ImageThumbnail
            image={image}
            height={thumbnailHeight}
            showCaption={showCaptions}
            onClick={() => onImageClick?.(image, index)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ImageGallery;
