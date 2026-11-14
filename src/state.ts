export interface UserState {
  isLoggedIn: boolean;
  username: string;
  location: string;
  points: number;
  activeTab: "wishlist" | "match" | "shop" | "community";
  wishlist: string[];
  unusedInventory: { title: string; platform: string; pointsValue: number }[];
  donatedGames: string[];
}

export const FAKE_LOCATIONS = [
  "Neo-Tokyo, Sector 7",
  "Night City, CA",
  "New Alexandria, Reach",
  "Midgar, Sector 5",
  "Rapture, Atlantic",
  "Starlight Valley, OR"
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
  donatedGames: ["Hollow Knight"]
};