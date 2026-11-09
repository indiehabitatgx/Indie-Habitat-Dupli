/** Venue content — quoted from the original venue pages on indiehabitat.com. */
export type VenueContent = {
  slug: string;
  name: string;
  hashtag: string;
  kicker: string;
  summary: string;
  body: string[];
  image: string;
  imageAlt: string;
  floorPlan?: string;
  facts: { label: string; value: string }[];
  specs: { title: string; items: string[] }[];
  video?: { id: string; title: string; poster: string };
  bookingPurposes: string[];
};

const avEquipment = [
  {
    title: "Audio",
    items: [
      "PA system: 2 speakers + 1 sub-woofer + 32-channel digital mixer",
      "Corded vocal mics, lapel mics, headset mics",
      "Line outs for laptops and DJ console",
      "Live music (singer-songwriter & bands) performances",
      "Recording for all of the above (stereo & multi-track)",
    ],
  },
  {
    title: "Video",
    items: [
      "2 × Canon 80D (18–135 lens)",
      "1 × Canon 80D (18–55 lens)",
      "Additional equipment available on call",
      "In-house videographers & editors available",
    ],
  },
];

const purposes = ["Comedy", "Concert", "Podcast Recording", "Conference", "Celebration/Party"];

export const venues: VenueContent[] = [
  {
    slug: "the-habitat",
    name: "The Habitat",
    hashtag: "#thehabitat",
    kicker: "The main room",
    summary: "An intimate 55–70 seater for music, standup comedy, poetry and alternate events.",
    body: [
      "A space for stand-up comedy, improv comedy, storytelling, intimate music gigs, performance poetry, movie screenings, live sports screenings, open mics and smaller conferences.",
      "The Habitat is known for its live gig recording services. A super cozy space with state of the art audio and video recording. Several stand-up comedy specials, comedy gigs and poetry videos are recorded live at The Habitat.",
    ],
    image: "/images/venue/the-habitat-stage.webp",
    imageAlt: "The Habitat stage: a mic stand and bar stool in front of the circled-H logo on a slatted timber wall, rows of wooden chairs in front",
    floorPlan: "/images/venue/floor-plan-the-habitat.webp",
    facts: [
      { label: "Seating", value: "55 with tables · 75 without" },
      { label: "Mixer", value: "Behringer X32" },
      { label: "Projector", value: "Sony 2900 lumens, 8 × 8 ft screen" },
    ],
    specs: [
      {
        title: "Equipment",
        items: [
          "Behringer X32 channel mixer",
          "In-house P.A. sound system",
          "House lights",
          "Sony 2900 lumens projector with 8 ft × 8 ft screen",
        ],
      },
      ...avEquipment,
    ],
    video: {
      id: "Nuy-v8M6ong",
      title: "ABDC Show 02 — The Habitat fill-up timelapse",
      poster: "/images/backgrounds/video-abdc-timelapse.webp",
    },
    bookingPurposes: purposes,
  },
  {
    slug: "above-the-habitat",
    name: "Above The Habitat",
    hashtag: "#abovethehabitat",
    kicker: "The big room upstairs",
    summary: "A 150–250 capacity venue for gigs, Comedy Specials and for Recordings.",
    body: [
      "Rap gigs, metal gigs, alternative music, poetry, improv, stand up comedy, theatre, short film screenings and many other kinds of gigs take place at Above The Habitat. Equipped with state of the art lighting and sound gear, the venue is the perfect place to hold a gig of any kind.",
      "This space is known for its recording services — live tapings here include Son Of Abish, Amazon Prime Video stand-up specials, Aisi Taisi Democracy, other stand-up comedy acts, and shoots for advertisements of several commercial brands.",
    ],
    image: "/images/venue/above-the-habitat-stage.webp",
    imageAlt: "Above The Habitat: a wide low stage against an exposed brick wall with the circled-H logo, rows of dark chairs in the foreground",
    floorPlan: "/images/venue/floor-plan-above-the-habitat.webp",
    facts: [
      { label: "Capacity", value: "160 seated (theatre) · 250 standing" },
      { label: "Stage", value: "27 × 12 ft, 18 in high" },
      { label: "Room", value: "60 × 32 ft incl. stage & bar" },
    ],
    specs: [
      {
        title: "Stage lighting",
        items: [
          "4 × warm white 54 PAR LEDs facing stage",
          "3 × RGB 54 PAR LEDs from stage backdrop",
          "1 × DMX 512 light controller",
        ],
      },
      {
        title: "Front of house PA",
        items: [
          "2 tops in front of the stage — 2 × QSC K12.2",
          "2 tops as rear fills — 2 × QSC K12",
          "6000 W total on tops",
          "4 sub-woofers (4000 W)",
        ],
      },
      ...avEquipment,
      { title: "Also", items: ["Adjacent smoking zone"] },
    ],
    video: {
      id: "JgSaV2NDqHI",
      title: "prabhdeep (video by Mongrel Design)",
      poster: "/images/backgrounds/video-prabhdeep.webp",
    },
    bookingPurposes: purposes,
  },
  {
    slug: "jam-room",
    name: "The Jam Room",
    hashtag: "#recordingstudio",
    kicker: "Podcasts, rehearsals, scratch recordings",
    summary: "Ideal for recording podcasts and also doubles up as a Jam Room.",
    body: [
      "Ideal for recording podcasts and also doubles up as a Jam Room to record scratches of your music. Fully air-conditioned and sound proofed, the jam room is the place most Habitat employees go for some peace and quiet too.",
      "We are stocked with TS and XLR cables and corded mics. Please carry your own instruments — we do not store cymbals and hats, please carry your own.",
    ],
    image: "/images/venue/jam-room.webp",
    imageAlt: "The Jam Room: a silver drum kit and mic stands in a room lined with navy acoustic panels",
    facts: [
      { label: "Room", value: "Air-conditioned & soundproofed" },
      { label: "Kit", value: "Mapex Mars Series, 5-piece" },
      { label: "Jam slots", value: "11:30 am – 4:30 pm, Mon–Thu" },
    ],
    specs: [
      {
        title: "Drum kit",
        items: [
          "Mapex Mars Series drum kit (5 piece)",
          "Kick / bass drum, snare",
          "Rack toms — 10″ and 12″; floor tom — 16″",
          "Hi-hat stand, 2 × cymbal stands",
          "Cymbals & hats not stored — bring your own",
        ],
      },
      { title: "Services", items: ["Drum tracking", "Vocal tracking", "Instrument tracking"] },
      {
        title: "Booking details",
        items: [
          "Jam room availability: 11:30 am to 4:30 pm, Monday to Thursday",
          "Available 24 hours in 3 slots: 9 to 4, 5 to 12 and overnight",
          "Space is used for all of our events",
          "Cafe available for private bookings only up to 5 pm",
        ],
      },
    ],
    video: {
      id: "MP9vWWP186w",
      title: "Jam Room @ The Habitat",
      poster: "/images/backgrounds/video-jam-room.webp",
    },
    bookingPurposes: ["Podcast Recording", "Concert", "Comedy", "Conference", "Celebration/Party"],
  },
];

export function getVenue(slug: string) {
  return venues.find((v) => v.slug === slug);
}
