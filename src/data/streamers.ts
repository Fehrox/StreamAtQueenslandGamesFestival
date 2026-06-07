import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export interface StreamerProfile {
  id: string;
  name: string;
  image?: string;
  fallbackImage?: string;
  profileUrl?: string;
  status: "open" | "invited" | "confirmed" | "featured";
  twitchHandle?: string;
}

type StreamerAssets = Pick<StreamerProfile, "image" | "profileUrl" | "twitchHandle">;
type ResolvedStreamerAssets = Pick<
  StreamerProfile,
  "fallbackImage" | "image" | "profileUrl" | "twitchHandle"
>;

const names = [
  "Naysy",
  "Cray",
  "Marcus",
  "Bazza",
  "Brodie",
  "Wolfie",
  "Lexi",
  "Ash",
  "Nic",
  "Amber",
  "Kiki",
  "Lazarbeam",
  "Swagger",
  "Nalopia",
  "Bajo",
  "Luke",
  "eltk",
  "Aliythia",
  "Boa",
  "Krystll",
  "t10nat",
  "Arii",
  "Jxsn",
  "Winter",
  "Randy",
  "Jacque",
  "Pestily",
  "Oasis",
  "Overstrand",
  "Jess",
  "Lisa",
  "Tolga",
  "Louna",
  "Adam",
  "Fasffy",
  "Danzie",
  "Nick",
  "jurdman",
  "Pyoar",
  "Townie",
  "dollysox",
  "TruinTV",
  "Sharkie",
  "hexsteph",
  "Back Pocket",
  "Eonzn",
  "Jaice",
  "Elf_Energy",
  "Elysa",
  "Berticuss",
  "Cardboard_Cowboy",
  "MCMDesigns",
  "LordHappyCats",
  "BloodyDrongo",
  "Sanjioker",
  "GYmedia",
  "Kaztelle",
  "ZiggyDLive",
  "xara",
  "mee_shell",
  "BasedCode",
  "OPEN SLOT 13",
  "OPEN SLOT 14",
  "OPEN SLOT 15",
  "OPEN SLOT 16",
  "OPEN SLOT 17",
  "OPEN SLOT 18",
  "OPEN SLOT 19",
  "OPEN SLOT 20",
  "OPEN SLOT 21",
  "OPEN SLOT 22",
  "OPEN SLOT 23",
  "OPEN SLOT 24",
  "OPEN SLOT 25",
  "OPEN SLOT 26",
  "OPEN SLOT 27",
  "OPEN SLOT 28",
  "OPEN SLOT 29",
  "OPEN SLOT 30",
  "OPEN SLOT 31",
  "OPEN SLOT 32",
  "OPEN SLOT 33",
  "OPEN SLOT 34",
  "OPEN SLOT 35",
  "OPEN SLOT 36",
  "OPEN SLOT 37",
  "OPEN SLOT 38",
  "OPEN SLOT 39",
];

const streamerAssets: Partial<Record<string, StreamerAssets>> = {
  Naysy: { image: "/streamers/naysy.png", twitchHandle: "naysy" },
  Cray: { image: "/streamers/cray.png", twitchHandle: "crayator" },
  Marcus: { image: "/streamers/marcus.png", twitchHandle: "prestigeclips" },
  Bazza: { image: "/streamers/baz.png", twitchHandle: "bazza" },
  Brodie: {
    image: "/streamers/broadie.png",
    profileUrl: "https://www.twitch.tv/brodie",
    twitchHandle: "brodie",
  },
  Wolfie: {
    image: "/streamers/wolfie.png",
    profileUrl: "https://www.twitch.tv/maskedwolf",
    twitchHandle: "maskedwolf",
  },
  Lexi: { image: "/streamers/lexi.png", twitchHandle: "lexigraham" },
  Ash: {
    image: "/streamers/ash.png",
    profileUrl: "https://www.twitch.tv/trash_ashx",
    twitchHandle: "trash_ashx",
  },
  Nic: { image: "/streamers/nic.png", twitchHandle: "nichameleon" },
  Amber: {
    image: "/streamers/amber.png",
    profileUrl: "https://www.twitch.tv/paladinamber",
    twitchHandle: "paladinamber",
  },
  Kiki: { image: "/streamers/kiki.png", twitchHandle: "kiki" },
  Lazarbeam: { image: "/streamers/lannen.png", twitchHandle: "lazarbeam" },
  Swagger: { image: "/streamers/swagger.png", twitchHandle: "swaggersouls" },
  Nalopia: {
    image: "/streamers/nal.png",
    profileUrl: "https://www.twitch.tv/nalopia",
    twitchHandle: "nalopia",
  },
  Bajo: { image: "/streamers/bajo.png", twitchHandle: "bajo" },
  Luke: { image: "/streamers/luke.png", profileUrl: "https://www.youtube.com/@lukemuscat" },
  eltk: { image: "/streamers/eltk.png", twitchHandle: "eltk" },
  Aliythia: { image: "/streamers/aliythia.png", twitchHandle: "aliythia" },
  Boa: { image: "/streamers/boa.png", twitchHandle: "boaroo" },
  Krystll: { image: "/streamers/krystll.png", twitchHandle: "krysttl" },
  t10nat: { image: "/streamers/t10nat.png", twitchHandle: "t10nat" },
  Arii: { image: "/streamers/arii.png", twitchHandle: "arii" },
  Jxsn: {
    image: "/streamers/jackson.png",
    profileUrl: "https://www.twitch.tv/jxsn",
    twitchHandle: "jxsn",
  },
  Winter: { image: "/streamers/winter.png", twitchHandle: "winter1k" },
  Randy: { image: "/streamers/randy.png", twitchHandle: "randy" },
  Jacque: { image: "/streamers/jacque.png", twitchHandle: "jacque" },
  Pestily: { image: "/streamers/paul.png", twitchHandle: "pestily" },
  Oasis: { image: "/streamers/oasis.jpeg", twitchHandle: "oasisonoverwatch" },
  Overstrand: { image: "/streamers/overstand.png", twitchHandle: "overstrand" },
  Jess: { image: "/streamers/jess.png", twitchHandle: "jesswyatt" },
  Lisa: { image: "/streamers/lisa.png", twitchHandle: "lisa" },
  Tolga: { image: "/streamers/tolga.png", profileUrl: "https://www.instagram.com/tolgattv/" },
  Louna: { image: "/streamers/louna.png", twitchHandle: "lounatuna" },
  Adam: {
    image: "/streamers/adam.png",
    profileUrl: "https://www.twitch.tv/adamcyounis",
    twitchHandle: "adamcyounis",
  },
  Fasffy: { image: "/streamers/fasffy.png", twitchHandle: "fasffy" },
  Danzie: { image: "/streamers/danzie.png", twitchHandle: "danzie_dee" },
  Nick: {
    image: "/streamers/nickbeckwith.png",
    profileUrl: "https://www.twitch.tv/nickbeckwith",
    twitchHandle: "nickbeckwith",
  },
  jurdman: {
    image: "/streamers/jurdman.png",
    profileUrl: "https://www.twitch.tv/jurdman",
    twitchHandle: "jurdman",
  },
  Pyoar: {
    image: "/streamers/pyoar.png",
    profileUrl: "https://www.twitch.tv/Pyoar",
    twitchHandle: "pyoar",
  },
  Townie: {
    image: "/streamers/townie.png",
    profileUrl: "https://www.twitch.tv/townie",
    twitchHandle: "townie",
  },
  dollysox: {
    image: "/streamers/dollysox.png",
    profileUrl: "https://www.twitch.tv/dollysox",
    twitchHandle: "dollysox",
  },
  TruinTV: {
    image: "/streamers/truintv.png",
    profileUrl: "https://www.twitch.tv/TruinTV",
    twitchHandle: "truintv",
  },
  Sharkie: {
    image: "/streamers/sharkie.png",
    profileUrl: "https://www.twitch.tv/Sharkie",
    twitchHandle: "sharkie",
  },
  hexsteph: {
    image: "/streamers/hexsteph.jpg",
    profileUrl: "https://www.twitch.tv/hexsteph",
    twitchHandle: "hexsteph",
  },
  "Back Pocket": {
    image: "/streamers/back_pocket.png",
    profileUrl: "https://www.twitch.tv/back_pocket",
    twitchHandle: "back_pocket",
  },
  Eonzn: {
    image: "/streamers/eonzn.png",
    profileUrl: "https://www.twitch.tv/Eonzn",
    twitchHandle: "eonzn",
  },
  Jaice: {
    image: "/streamers/jaice.png",
    profileUrl: "https://www.twitch.tv/Jaice",
    twitchHandle: "jaice",
  },
  Elf_Energy: {
    image: "/streamers/elf_energy.png",
    profileUrl: "https://www.twitch.tv/elf_energy",
    twitchHandle: "elf_energy",
  },
  Elysa: {
    image: "/streamers/elysa.png",
    profileUrl: "https://www.twitch.tv/elysa",
    twitchHandle: "elysa",
  },
  Berticuss: {
    image: "/streamers/berticuss.png",
    profileUrl: "https://www.twitch.tv/berticuss",
    twitchHandle: "berticuss",
  },
  Cardboard_Cowboy: {
    image: "/streamers/cardboard_cowboy.png",
    profileUrl: "https://www.twitch.tv/cardboard_cowboy",
    twitchHandle: "cardboard_cowboy",
  },
  MCMDesigns: {
    image: "/streamers/mcmdesigns.png",
    profileUrl: "https://www.twitch.tv/mcmdesigns",
    twitchHandle: "mcmdesigns",
  },
  LordHappyCats: {
    image: "/streamers/lordhappycats.png",
    profileUrl: "https://www.twitch.tv/LordHappyCats",
    twitchHandle: "lordhappycats",
  },
  BloodyDrongo: {
    image: "/streamers/bloodydrongo.png",
    profileUrl: "https://www.twitch.tv/BloodyDrongo",
    twitchHandle: "bloodydrongo",
  },
  Sanjioker: {
    image: "/streamers/sanjioker.png",
    profileUrl: "https://www.twitch.tv/sanjioker",
    twitchHandle: "sanjioker",
  },
  GYmedia: {
    image: "/streamers/gymedia.png",
    profileUrl: "https://www.twitch.tv/gymedia",
    twitchHandle: "gymedia",
  },
  Kaztelle: {
    image: "/streamers/kaztelle.png",
    profileUrl: "https://www.twitch.tv/kaztelle",
    twitchHandle: "kaztelle",
  },
  ZiggyDLive: {
    image: "/streamers/ziggydlive.jpeg",
    profileUrl: "https://www.twitch.tv/ziggydlive",
    twitchHandle: "ziggydlive",
  },
  xara: {
    image: "/streamers/xara.png",
    profileUrl: "https://www.twitch.tv/xara",
    twitchHandle: "xara",
  },
  mee_shell: {
    image: "/streamers/mee_shell.png",
    profileUrl: "https://www.twitch.tv/mee_shell",
    twitchHandle: "mee_shell",
  },
  BasedCode: {
    profileUrl: "https://www.twitch.tv/basedcode",
    twitchHandle: "basedcode",
  },
};

const getStyledImage = (image: string) => {
  const fileName = image.split("/").pop();
  const stem = fileName?.replace(/\.[^.]+$/, "");

  if (!stem) {
    return image;
  }

  const styledImage = `/streamers-styled/${stem}.png`;
  const styledImagePath = fileURLToPath(
    new URL(`../../public${styledImage}`, import.meta.url),
  );

  return existsSync(styledImagePath) ? styledImage : image;
};

const resolveStreamerAssets = (
  assets: StreamerAssets | undefined,
): ResolvedStreamerAssets => {
  if (!assets?.image) {
    return assets ?? {};
  }

  return {
    ...assets,
    fallbackImage: assets.image,
    image: getStyledImage(assets.image),
  };
};

const cleanUrlSegment = (value: string) =>
  value.trim().replace(/^@+/, "").replace(/[\\/\s]+/g, "-");

export const getStreamerUrlSlug = (value: string) =>
  cleanUrlSegment(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getStreamerUrlKey = (value: string) =>
  getStreamerUrlSlug(value).replace(/-/g, "");

export const getStreamerUrlSegments = (streamer: StreamerProfile) => {
  const values = [streamer.name, streamer.twitchHandle].filter(
    (value): value is string => Boolean(value),
  );

  return Array.from(
    new Set(
      values
        .flatMap((value) => [
          getStreamerUrlSlug(value),
          cleanUrlSegment(value).toLowerCase(),
          getStreamerUrlKey(value),
        ])
        .filter((segment) => segment && segment !== "index.html"),
    ),
  );
};

const featuredIndex = 0;
const confirmedNames = new Set(["Adam", "Fasffy", "Danzie"]);

export const streamers: StreamerProfile[] = names.map((name, index) => ({
  id: `slot-${String(index + 1).padStart(2, "0")}`,
  name,
  status:
    index === featuredIndex
      ? "featured"
      : confirmedNames.has(name)
        ? "confirmed"
        : "open",
  ...resolveStreamerAssets(streamerAssets[name]),
}));

