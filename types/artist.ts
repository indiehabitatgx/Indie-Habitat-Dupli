export type ArtistSocialLinks = {
  instagram?: string;
  youtube?: string;
  x?: string;
  website?: string;
};

export type ArtistCardData = {
  id: string;
  name: string;
  slug: string;
  biography: string;
  profileImage: string | null;
  socialLinks: ArtistSocialLinks;
  featured: boolean;
};
