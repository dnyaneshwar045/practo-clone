import Image from "next/image";
import { doctorPhoto } from "@/lib/images";

/**
 * Doctor headshot. Doctor-supplied URLs can point anywhere, so those are rendered
 * unoptimised while the curated stock fallbacks go through the Next image pipeline.
 */
export function Avatar({
  doctorId,
  photoUrl,
  name,
  size = 64,
  className = "",
}: {
  doctorId: string;
  photoUrl: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  const src = doctorPhoto(doctorId, photoUrl, size * 2);

  return (
    <Image
      src={src}
      alt={`Dr. ${name}`}
      width={size}
      height={size}
      unoptimized={Boolean(photoUrl)}
      className={`shrink-0 rounded-2xl object-cover ring-2 ring-white ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
