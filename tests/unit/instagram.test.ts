import { describe, expect, it } from "vitest";
import { formatPostAge, mapInstagramMedia, maskToken } from "@/lib/instagram";

const img = "https://scontent-bom1-1.cdninstagram.com/v/t51/abc.jpg?x=1";
const link = "https://www.instagram.com/p/ABC123/";

describe("mapInstagramMedia", () => {
  it("maps images, videos (thumbnail) and carousels", () => {
    const posts = mapInstagramMedia([
      { id: "1", media_type: "IMAGE", media_url: img, permalink: link, caption: " Hello ", timestamp: "2026-11-01T10:00:00+0000" },
      { id: "2", media_type: "VIDEO", media_url: "https://video.cdninstagram.com/v.mp4", thumbnail_url: img, permalink: link },
      { id: "3", media_type: "CAROUSEL_ALBUM", media_url: img, permalink: link },
    ]);
    expect(posts.map((p) => p.mediaType)).toEqual(["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]);
    expect(posts[0].caption).toBe("Hello");
    expect(posts[1].image).toBe(img);
  });
  it("drops unsafe or incomplete items", () => {
    const posts = mapInstagramMedia([
      { id: "a", media_type: "IMAGE", media_url: "http://scontent.cdninstagram.com/x.jpg", permalink: link }, // not https
      { id: "b", media_type: "IMAGE", media_url: "https://evil.example/x.jpg", permalink: link }, // foreign host
      { id: "c", media_type: "IMAGE", media_url: img, permalink: "javascript:alert(1)" },
      { id: "d", media_type: "IMAGE", media_url: img, permalink: "https://evil.example/p/1" },
      { id: "e", media_type: "STORY", media_url: img, permalink: link },
      { media_type: "IMAGE", media_url: img, permalink: link },
    ]);
    expect(posts).toEqual([]);
  });
  it("respects the limit", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({ id: String(i), media_type: "IMAGE", media_url: img, permalink: link }));
    expect(mapInstagramMedia(many, 8)).toHaveLength(8);
  });
});

describe("formatPostAge / maskToken", () => {
  const now = Date.parse("2026-11-09T12:00:00Z");
  it("formats relative ages", () => {
    expect(formatPostAge("2026-11-09T11:30:00Z", now)).toBe("30m ago");
    expect(formatPostAge("2026-11-09T07:00:00Z", now)).toBe("5h ago");
    expect(formatPostAge("2026-11-06T12:00:00Z", now)).toBe("3d ago");
    expect(formatPostAge("2026-10-01T12:00:00Z", now)).toMatch(/1 Oct 2026/);
    expect(formatPostAge("bad", now)).toBe("");
  });
  it("masks tokens", () => {
    expect(maskToken("IGAAabcdefghijklmnop1234")).toBe("IGAA••••••1234");
    expect(maskToken("")).toBe("");
  });
});
