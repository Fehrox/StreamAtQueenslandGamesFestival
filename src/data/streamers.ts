import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export interface StreamerProfile {
  id: string;
  name: string;
  image?: string;
  fallbackImage?: string;
  profileImage?: string;
  styledImage?: string;
  nintendoImage?: string;
  profileUrl?: string;
  status: "open" | "invited" | "confirmed" | "featured";
  twitchHandle?: string;
}

type StreamerAssets = Pick<StreamerProfile, "image" | "profileUrl" | "twitchHandle">;
type ResolvedStreamerAssets = Pick<
  StreamerProfile,
  | "fallbackImage"
  | "image"
  | "nintendoImage"
  | "profileImage"
  | "profileUrl"
  | "styledImage"
  | "twitchHandle"
>;

const names = [
  "Fasffy",
  "Pestily",
  "Oasis",
  "Overstrand",
  "Lisa",
  "Tolga",
  "Louna",
  "Randy",
  "PandaTV",
  "Ash",
  "Eonzn",
  "Luke",
  "Berticuss",
  "Elf_Energy",
  "Kwoli",
  "eltk",
  "dollysox",
  "Elysa",
  "Sharkie",
  "jurdman",
  "Danzie",
  "Jxsn",
  "Loserfruit",
  "BloodyDrongo",
  "mee_shell",
  "Kiki",
  "Nic",
  "Megaa",
  "Nalopia",
  "GYmedia",
  "Kaztelle",
  "Krystll",
  "Wolfie",
  "Adam",
  "Townie",
  "Winter",
  "Lazarbeam",
  "hexsteph",
  "Bubbell",
  "Bazza",
  "Brodie",
  "Jess",
  "ProfoundRice",
  "Rhilever",
  "Jacque",
  "xara",
  "Marcus",
  "Bajo",
  "ZiggyDLive",
  "Pyoar",
  "Jaice",
  "Cray",
  "Aliythia",
  "MCMDesigns",
  "Back Pocket",
  "Sanjioker",
  "Lexi",
  "Arii",
  "Carla",
  "Boa",
  "TRASH",
  "TruinTV",
  "Amber",
  "MakoFukasame",
  "LordHappyCats",
  "Nick",
  "Cardboard_Cowboy",
  "x5_PiG",
  "Naysy",
  "Gooobzy",
  "t10nat",
  "Swagger",
  "OPEN SLOT 1",
  "OPEN SLOT 2",
  "OPEN SLOT 3",
  "OPEN SLOT 4",
  "OPEN SLOT 5",
  "OPEN SLOT 6",
  "OPEN SLOT 7",
  "OPEN SLOT 8",
  "OPEN SLOT 9",
  "OPEN SLOT 10",
  "OPEN SLOT 11",
  "OPEN SLOT 12",
  "OPEN SLOT 13",
  "OPEN SLOT 14",
  "OPEN SLOT 15",
  "OPEN SLOT 16",
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
  Tolga: {
    image: "/streamers/tolga.png",
    profileUrl: "https://www.twitch.tv/tolga",
    twitchHandle: "tolga",
  },
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
  Kwoli: {
    image: "/streamers/kwoli.png",
    profileUrl: "https://www.twitch.tv/kwoli",
    twitchHandle: "kwoli",
  },
  MakoFukasame: {
    image: "/streamers/makofukasame.png",
    profileUrl: "https://www.twitch.tv/MakoFukasame",
    twitchHandle: "makofukasame",
  },
  Bubbell: {
    image: "/streamers/bubbell.png",
    profileUrl: "https://www.twitch.tv/Bubbell",
    twitchHandle: "bubbell",
  },
  Megaa: {
    image: "/streamers/megaa.png",
    profileUrl: "https://www.twitch.tv/Megaa",
    twitchHandle: "megaa",
  },
  Carla: {
    image: "/streamers/carla.png",
    profileUrl: "https://www.twitch.tv/Carla",
    twitchHandle: "carla",
  },
  PandaTV: {
    image: "/streamers/pandatv.png",
    profileUrl: "https://www.twitch.tv/PandaTV",
    twitchHandle: "pandatv",
  },
  x5_PiG: {
    image: "/streamers/x5_pig.png",
    profileUrl: "https://www.twitch.tv/x5_pig",
    twitchHandle: "x5_pig",
  },
  Rhilever: {
    image: "/streamers/rhilever.png",
    profileUrl: "https://www.twitch.tv/Rhilever",
    twitchHandle: "rhilever",
  },
  Loserfruit: {
    image: "/streamers/loserfruit.png",
    profileUrl: "https://www.twitch.tv/Loserfruit",
    twitchHandle: "loserfruit",
  },
  ProfoundRice: {
    image: "/streamers/profoundrice.png",
    profileUrl: "https://www.twitch.tv/profoundrice",
    twitchHandle: "profoundrice",
  },
  Gooobzy: {
    image: "/streamers/gooobzy.png",
    profileUrl: "https://www.twitch.tv/gooobzy",
    twitchHandle: "gooobzy",
  },
  TRASH: {
    image: "/streamers/trash.png",
    profileUrl: "https://www.twitch.tv/trash",
    twitchHandle: "trash",
  },
};

const getImageVariant = (
  image: string,
  imageDirectory: "streamers-nintendo" | "streamers-styled",
) => {
  const fileName = image.split("/").pop();
  const stem = fileName?.replace(/\.[^.]+$/, "");

  if (!stem) {
    return undefined;
  }

  const imageVariant = `/${imageDirectory}/${stem}.png`;
  const imageVariantPath = fileURLToPath(
    new URL(`../../public${imageVariant}`, import.meta.url),
  );

  return existsSync(imageVariantPath) ? imageVariant : undefined;
};

const resolveStreamerAssets = (
  assets: StreamerAssets | undefined,
): ResolvedStreamerAssets => {
  if (!assets?.image) {
    return assets ?? {};
  }

  const styledImage = getImageVariant(assets.image, "streamers-styled");
  const nintendoImage = getImageVariant(assets.image, "streamers-nintendo");

  return {
    ...assets,
    profileImage: assets.image,
    styledImage,
    nintendoImage,
    fallbackImage: assets.image,
    image: nintendoImage || styledImage || assets.image,
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

const featuredNames = new Set(["Naysy"]);
const confirmedNames = new Set(["Adam", "Fasffy", "Danzie"]);

export const streamers: StreamerProfile[] = names.map((name, index) => ({
  id: `slot-${String(index + 1).padStart(2, "0")}`,
  name,
  status:
    featuredNames.has(name)
      ? "featured"
      : confirmedNames.has(name)
        ? "confirmed"
        : "open",
  ...resolveStreamerAssets(streamerAssets[name]),
}));

