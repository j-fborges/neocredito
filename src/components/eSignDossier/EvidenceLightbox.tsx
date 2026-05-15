import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface EvidenceLightboxProps {
  images: { src: string; alt: string; label: string }[];
}

export default function EvidenceLightbox({ images }: EvidenceLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((img) => ({ src: img.src, alt: img.alt }));

  return (
    <>
      <div className="grid grid-cols-2 gap-6">
        {images.map((img, i) => (
          <div key={img.src} className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className="rounded border border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-blue-dark"
              aria-label={`Ampliar ${img.label}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                width={150}
                height={200}
                className="object-cover w-[150px] h-[200px]"
                loading="lazy"
              />
            </button>
            <span className="text-sm text-gray-600 mt-1">{img.label}</span>
          </div>
        ))}
      </div>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={slides}
          plugins={[Zoom]}
          zoom={{ maxZoomPixelRatio: 4, scrollToZoom: true }}
          carousel={{ finite: true }}
          controller={{ closeOnBackdropClick: true }}
          on={{ view: ({ index: newIndex }) => setIndex(newIndex) }}
          styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.85)" } }}
        />
      )}
    </>
  );
}
