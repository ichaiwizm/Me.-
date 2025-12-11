import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import type { ImageMeta } from "@/lib/constants/images";
import { TRANSITIONS, EASINGS, SPRINGS } from "@/lib/constants/animation";
import { useAnalytics } from "@/lib/hooks/useAnalytics";

/**
 * Lightbox - A modal image viewer with navigation
 *
 * Features:
 * - Glassmorphism backdrop (theme-aware, not black!)
 * - Keyboard navigation (arrows, escape)
 * - Swipe gestures on mobile
 * - Zoom functionality
 * - Thumbnail strip navigation
 * - Smooth animations
 */

export interface LightboxProps {
  images: ImageMeta[];
  /** Initial image index to display */
  initialIndex?: number;
  /** Whether the lightbox is open */
  isOpen: boolean;
  /** Called when lightbox should close */
  onClose: () => void;
  /** Show thumbnail strip (default: true) */
  showThumbnails?: boolean;
  /** Enable zoom (default: true) */
  enableZoom?: boolean;
}

export function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  showThumbnails = true,
  enableZoom = true,
}: LightboxProps) {
  const { t } = useTranslation("common");
  const { trackLightbox } = useAnalytics();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [direction, setDirection] = useState(0);
  const lastNavigationMethod = useRef<'click' | 'keyboard' | 'swipe'>('click');

  const currentImage = images[currentIndex];

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          trackLightbox('close', { closeMethod: 'escape' });
          onClose();
          break;
        case "ArrowLeft":
          lastNavigationMethod.current = 'keyboard';
          goToPrevious();
          break;
        case "ArrowRight":
          lastNavigationMethod.current = 'keyboard';
          goToNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, onClose, trackLightbox]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : images.length - 1;
      const newImage = images[newIndex];
      trackLightbox('navigate', {
        imageId: newImage?.id,
        imageIndex: newIndex,
        totalImages: images.length,
        direction: 'previous',
        method: lastNavigationMethod.current
      });
      lastNavigationMethod.current = 'click'; // Reset to default
      return newIndex;
    });
    setIsZoomed(false);
  }, [images, trackLightbox]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => {
      const newIndex = prev < images.length - 1 ? prev + 1 : 0;
      const newImage = images[newIndex];
      trackLightbox('navigate', {
        imageId: newImage?.id,
        imageIndex: newIndex,
        totalImages: images.length,
        direction: 'next',
        method: lastNavigationMethod.current
      });
      lastNavigationMethod.current = 'click'; // Reset to default
      return newIndex;
    });
    setIsZoomed(false);
  }, [images, trackLightbox]);

  const toggleZoom = useCallback(() => {
    setIsZoomed((prev) => {
      const newZoomed = !prev;
      trackLightbox('zoom', {
        imageId: currentImage?.id,
        zoomAction: newZoomed ? 'in' : 'out',
        zoomMethod: 'button'
      });
      return newZoomed;
    });
  }, [currentImage?.id, trackLightbox]);

  if (!currentImage) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={TRANSITIONS.fadeIn}
        >
          {/* Backdrop - Glassmorphism, NOT black! */}
          <motion.div
            className="absolute inset-0 bg-[var(--image-bg)]/95 backdrop-blur-xl"
            onClick={() => {
              trackLightbox('close', { closeMethod: 'backdrop' });
              onClose();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Close button */}
          <motion.button
            className="absolute top-4 right-4 z-10 p-3 rounded-full glass hover:bg-foreground/10 transition-colors"
            onClick={() => {
              trackLightbox('close', { closeMethod: 'button' });
              onClose();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={t("aria.closeImage")}
          >
            <X className="w-6 h-6 text-foreground" />
          </motion.button>

          {/* Zoom button */}
          {enableZoom && (
            <motion.button
              className="absolute top-4 right-16 z-10 p-3 rounded-full glass hover:bg-foreground/10 transition-colors"
              onClick={toggleZoom}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isZoomed ? t("aria.zoomOut") : t("aria.zoomIn")}
            >
              {isZoomed ? (
                <ZoomOut className="w-6 h-6 text-foreground" />
              ) : (
                <ZoomIn className="w-6 h-6 text-foreground" />
              )}
            </motion.button>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                className="absolute left-4 z-10 p-3 rounded-full glass hover:bg-foreground/10 transition-colors"
                onClick={goToPrevious}
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={t("aria.previousImage")}
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </motion.button>
              <motion.button
                className="absolute right-4 z-10 p-3 rounded-full glass hover:bg-foreground/10 transition-colors"
                onClick={goToNext}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={t("aria.nextImage")}
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </motion.button>
            </>
          )}

          {/* Main image container */}
          <div className="relative w-full h-full flex items-center justify-center p-16">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentImage.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.3,
                  ease: EASINGS.standard,
                }}
                className="relative max-w-full max-h-full"
                drag={!isZoomed ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => {
                  if (info.offset.x > 100) {
                    lastNavigationMethod.current = 'swipe';
                    goToPrevious();
                  } else if (info.offset.x < -100) {
                    lastNavigationMethod.current = 'swipe';
                    goToNext();
                  }
                }}
              >
                <motion.img
                  src={currentImage.path}
                  alt={currentImage.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                  animate={{
                    scale: isZoomed ? 1.5 : 1,
                    cursor: isZoomed ? "zoom-out" : enableZoom ? "zoom-in" : "default",
                  }}
                  transition={{ type: "spring", ...SPRINGS.gentle }}
                  onClick={enableZoom ? toggleZoom : undefined}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Image info */}
          <motion.div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-title font-bold text-foreground mb-1">
              {currentImage.name}
            </h3>
            {currentImage.description && (
              <p className="text-body text-foreground/70">
                {currentImage.description}
              </p>
            )}
            <p className="text-tiny text-foreground/50 mt-2">
              {currentIndex + 1} / {images.length}
            </p>
          </motion.div>

          {/* Thumbnail strip */}
          {showThumbnails && images.length > 1 && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-xl glass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {images.map((image, index) => (
                <motion.button
                  key={image.id}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    trackLightbox('navigate', {
                      imageId: image.id,
                      imageIndex: index,
                      totalImages: images.length,
                      direction: 'jump',
                      method: 'click'
                    });
                    setCurrentIndex(index);
                    setIsZoomed(false);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image.path}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Lightbox;
