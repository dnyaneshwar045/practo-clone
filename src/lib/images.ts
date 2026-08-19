const UNSPLASH = "https://images.unsplash.com";

/** Builds a size- and format-optimised Unsplash URL for one of the curated photos. */
export const photo = (id: string, width: number, height?: number) =>
  `${UNSPLASH}/${id}?auto=format&fit=crop&q=70&w=${width}${height ? `&h=${height}` : ""}`;

export const IMAGES = {
  heroConsultation: "photo-1631217868264-e5b90bb7e133",
  videoConsultation: "photo-1633113215883-a43e36bc6178",
  hospitalWard: "photo-1758654859923-339c0f2f925e",
  abstractBlue: "photo-1781707382609-d04871926fc5",
};

/** Deterministic stock portrait for doctors that have not uploaded a photo. */
const PORTRAITS = [
  "photo-1659353888906-adb3e0041693",
  "photo-1612349317150-e413f6a5b16d",
  "photo-1673865641073-4479f93a7776",
  "photo-1678940805950-73f2127f9d4e",
  "photo-1623854767648-e7bb8009f0db",
  "photo-1612531385446-f7e6d131e1d0",
];

export const doctorPhoto = (doctorId: string, photoUrl: string | null, size = 160) => {
  if (photoUrl) return photoUrl;
  const index = [...doctorId].reduce((sum, char) => sum + char.charCodeAt(0), 0) % PORTRAITS.length;
  return photo(PORTRAITS[index], size, size);
};

const CATEGORY_COVERS: Record<string, string> = {
  Nutrition: "photo-1512621776951-a57141f2eefd",
  "Heart Health": "photo-1552674605-db6ffd4facb5",
  Fitness: "photo-1552674605-db6ffd4facb5",
  Skin: "photo-1581182800629-7d90925ad072",
  Dermatology: "photo-1581182800629-7d90925ad072",
  "Mental Health": "photo-1506126613408-eca07ce68773",
  "Child Care": "photo-1632053002928-1919605ee6f7",
  Pediatrics: "photo-1632053002928-1919605ee6f7",
  Sleep: "photo-1531353826977-0941b4779a1c",
};

/** Cover art for an article, falling back to a per-category stock photo. */
export const articleCover = (
  article: { category: string; coverUrl?: string | null },
  width = 640,
  height = 400
) =>
  article.coverUrl ??
  photo(CATEGORY_COVERS[article.category] ?? IMAGES.heroConsultation, width, height);
