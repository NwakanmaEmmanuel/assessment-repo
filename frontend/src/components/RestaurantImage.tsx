import { useState } from 'react';

interface RestaurantImageProps {
  src: string;
  alt: string;
}

const FALLBACK_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='#FDE6D2'/><g fill='none' stroke='#E8641B' stroke-width='10' stroke-linecap='round'><path d='M130 170h140a70 70 0 0 1-140 0z'/><path d='M165 140c0-18 18-18 18-36M200 140c0-18 18-18 18-36M235 140c0-18 18-18 18-36' stroke-width='8'/></g></svg>`,
  );

/** Image with a branded fallback for empty or broken URLs (no layout shift: the frame has a fixed aspect ratio). */
export function RestaurantImage({ src, alt }: RestaurantImageProps) {
  const [failed, setFailed] = useState(false);
  const usable = src.trim() !== '' && !failed;
  return (
    <img
      className="card-img"
      src={usable ? src : FALLBACK_SVG}
      alt={usable ? alt : `${alt} (photo unavailable)`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
