export interface StreamerProfile {
  id: string;
  name: string;
  image?: string;
  status: "open" | "invited" | "confirmed" | "featured";
  twitchHandle?: string;
}

const names = [
  "PLAYER ONE",
  "RAID READY",
  "LEVEL UP",
  "STREAM LAB",
  "BOSS FIGHT",
  "PIXEL CREW",
  "LOOT DROP",
  "ARCADE ACE",
  "CHAT HYPE",
  "LAN LORD",
  "CRIT HIT",
  "CO-OP CAM",
  "SPEED RUN",
  "FINAL STOCK",
  "QUEUE POP",
  "HIGH SCORE",
  "BRIS BRAWL",
  "SUNSHINE",
  "BATTLE BUS",
  "QUEST LOG",
  "XP BOOST",
  "GG ONLY",
  "MANA BAR",
  "COMBO LAB",
  "POWER PLAY",
  "CHECKPOINT",
  "SIDE QUEST",
  "GLITCH MIX",
  "GAME FACE",
  "HYPE TRAIN",
  "LAN PARTY",
  "NEXT MATCH",
  "BUFF STACK",
  "CRYSTAL",
  "MECHA MODE",
  "COIN RUN",
  "RARE SPAWN",
  "PATCH NOTE",
  "TILT PROOF",
  "SAVE SLOT",
  "CAM READY",
  "DASH DANCE",
  "CHAT MOD",
  "RESPAWN",
  "CLUTCH UP",
  "LOBBY LIVE",
  "MVP CAM",
  "QGF GUEST",
  "STREAMER",
  "CREATOR",
  "SHOUTCAST",
  "MAIN STAGE",
  "SIDE STAGE",
  "INDIE ZONE",
  "COSPLAY",
  "TABLETOP",
  "RETRO RUN",
  "ESPORTS",
  "DEV ROOM",
  "AFTER PARTY",
  "BRACKET",
  "FREE PLAY",
  "VIP SLOT",
  "CPU SLOT",
  "SIGN UP",
  "JOIN IN",
  "HYPE CAM",
  "FIRST LOOK",
  "CREATOR XP",
  "BETA TEST",
  "INPUT LAG",
  "FRAME DATA",
  "STAGE PICK",
  "GAME DEV",
  "INDIE LAB",
  "PRESS START",
  "LIVE NOW",
  "READY UP",
  "TEAM CHAT",
  "EVENT CAM",
  "HARD READ",
  "NO JOHNS",
  "RING OUT",
  "SPOTLIGHT",
  "RAID BOSS",
  "GOOD GAME",
  "WILD CARD",
  "OPEN SLOT",
];

const featuredIndex = 40;

export const streamers: StreamerProfile[] = names.map((name, index) => ({
  id: `slot-${String(index + 1).padStart(2, "0")}`,
  name,
  status:
    index === featuredIndex
      ? "featured"
      : index % 11 === 0
        ? "confirmed"
        : index % 7 === 0
          ? "invited"
          : "open",
  twitchHandle: undefined,
}));

export const featuredStreamer = streamers[featuredIndex];
