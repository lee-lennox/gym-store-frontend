import { useState } from 'react';

export function ImageWithFallback({ src, alt, className, fallback }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className || ''}`}>
        {fallback || (
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect width="64" height="48" fill="#F3F4F6" />
            <path d="M8 36L24 20L40 36H8Z" fill="#E5E7EB" />
            <circle cx="48" cy="16" r="6" fill="#E5E7EB" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
