export type GalleryItem = {
  id: string;
  title: string;
  alt: string;
  src: string;
  width: number;
  height: number;
  category: string;
  mediaType: "IMAGE" | "VIDEO";
  videoId: string | null;
};
