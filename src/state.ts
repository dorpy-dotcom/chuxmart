export interface CommunityMember {
  id: string;
  username: string;
  avatar: string;
  location: string;
  bio: string;
  wishlist: string[];
  donatedGames: string[];
}

export interface UserState {
  isLoggedIn: boolean;
  username: string;
  location: string;
  points: number;
  activeTab: "wishlist" | "match" | "shop" | "community";
  wishlist: string[];
  unusedInventory: { title: string; platform: string; pointsValue: number }[];
  donatedGames: string[];
  ownedShopGames: string[];
  lastMessage: string;
}

export const FAKE_LOCATIONS = [
  "Neo-Tokyo, Sector 7",
  "Night City, CA",
  "New Alexandria, Reach",
  "Midgar, Sector 5",
  "Rapture, Atlantic",
  "Starlight Valley, OR"
];

export const communityMembers: CommunityMember[] = [
  {
    id: "u1",
    username: "NovaRunner",
    avatar: "N",
    location: "Night City, CA",
    bio: "Student gamer on a budget! Huge fan of cozy sims and puzzle classics.",
    wishlist: ["Stardew Valley", "Terraria", "Hades"],
    donatedGames: ["Celeste", "Undertale"]
  },
  {
    id: "u2",
    username: "GlitchSamurai",
    avatar: "G",
    location: "Neo-Tokyo, Sector 7",
    bio: "Collecting co-op and puzzle games to play with my younger brother.",
    wishlist: ["Portal 2", "It Takes Two", "Left 4 Dead 2"],
    donatedGames: ["Among Us", "Half-Life 2", "Limbo"]
  },
  {
    id: "u3",
    username: "AerithBloom",
    avatar: "A",
    location: "Midgar, Sector 5",
    bio: "RPG lover saving up for a new GPU. Always happy to pass on finished titles!",
    wishlist: ["Elden Ring", "Stardew Valley", "Hollow Knight"],
    donatedGames: ["Final Fantasy VII", "Chrono Trigger"]
  },
  {
    id: "u4",
    username: "Spartan312",
    avatar: "S",
    location: "New Alexandria, Reach",
    bio: "Sci-fi and indie enthusiast. Passing old Steam keys forward.",
    wishlist: ["Portal 2", "Factorio", "Subnautica"],
    donatedGames: ["Halo: Reach", "FTL: Faster Than Light", "Doom (2016)"]
  },
  {
    id: "u5",
    username: "BioshockDiver",
    avatar: "B",
    location: "Rapture, Atlantic",
    bio: "Atmospheric single-player fan looking for indie gems.",
    wishlist: ["Celeste", "Disco Elysium", "Outer Wilds"],
    donatedGames: ["BioShock Remastered"]
  }
];

export const state: UserState = {
  isLoggedIn: false,
  username: "",
  location: FAKE_LOCATIONS[0],
  points: 250,
  activeTab: "wishlist",
  wishlist: ["Elden Ring", "Cyberpunk 2077"],
  unusedInventory: [
    { title: "Stardew Valley", platform: "Steam", pointsValue: 150 },
    { title: "Portal 2", platform: "Steam", pointsValue: 100 }
  ],
  donatedGames: ["Hollow Knight"],
  ownedShopGames: [],
  lastMessage: ""
};