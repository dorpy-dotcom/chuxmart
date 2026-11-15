import { state, saveState, generateSteamKey } from "./state";

interface ShopGame {
  id: string;
  title: string;
  genre: string;
  steamRating: string;
  concurrentPlayers: string;
  cost: number;
  bannerUrl: string;
}

const TRENDING_STEAM_GAMES: ShopGame[] = [
  {
    id: "s1",
    title: "Elden Ring",
    genre: "Action RPG • Open World",
    steamRating: "93% Very Positive",
    concurrentPlayers: "142,800 In-Game",
    cost: 400,
    bannerUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg"
  },
  {
    id: "s2",
    title: "Cyberpunk 2077",
    genre: "Sci-Fi RPG • Night City",
    steamRating: "89% Very Positive",
    concurrentPlayers: "84,210 In-Game",
    cost: 350,
    bannerUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg"
  },
  {
    id: "s3",
    title: "Baldur's Gate 3",
    genre: "Party RPG • Story Rich",
    steamRating: "96% Overwhelmingly Positive",
    concurrentPlayers: "168,500 In-Game",
    cost: 450,
    bannerUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg"
  },
  {
    id: "s4",
    title: "Hades II",
    genre: "Action Roguelike • Indie",
    steamRating: "95% Overwhelmingly Positive",
    concurrentPlayers: "61,400 In-Game",
    cost: 250,
    bannerUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1145350/header.jpg"
  },
  {
    id: "s5",
    title: "Helldivers 2",
    genre: "Co-op Shooter • Action",
    steamRating: "86% Very Positive",
    concurrentPlayers: "95,120 In-Game",
    cost: 300,
    bannerUrl: "https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg"
  },
  {
    id: "s6",
    title: "Balatro",
    genre: "Deckbuilder • Roguelike",
    steamRating: "98% Overwhelmingly Positive",
    concurrentPlayers: "39,900 In-Game",
    cost: 150,
    bannerUrl: "https://cdn.akamai.steamstatic.com/steam/apps/2379780/header.jpg"
  }
];

let shopSearchQuery = "";

export function renderShopTab(container: HTMLElement, onUpdate: () => void) {
  const filteredGames = TRENDING_STEAM_GAMES.filter(
    (g) =>
      g.title.toLowerCase().includes(shopSearchQuery.toLowerCase()) ||
      g.genre.toLowerCase().includes(shopSearchQuery.toLowerCase())
  );

  container.innerHTML = `
    <div class="feature-card">
      <div class="shop-header-row">
        <div class="card-header">
          <span class="eyebrow"><span class="live-dot"></span> POWERED BY STEAM MARKET TRENDS</span>
          <h3>🛒 Trending Steam Point Shop (Balance: ${state.points} PTS)</h3>
          <p>Exchange the points you earned from donating unused games for top trending titles on Steam.</p>
        </div>

        <div class="shop-search-wrap">
          <input
            id="shop-search-input"
            type="text"
            placeholder="🔍 Search trending games or genres..."
            value="${shopSearchQuery}"
          />
        </div>
      </div>

      ${
        state.ownedShopGames.length > 0
          ? `<div class="toast-banner">
               🔑 <strong>Your Redeemed Steam Keys (${state.ownedShopGames.length}):</strong>
               ${state.ownedShopGames
                 .map((g) => `<span class="key-chip">${g.title}: <code>${g.key}</code></span>`)
                 .join(" ")}
             </div>`
          : ""
      }

      <div class="match-grid">
        ${filteredGames
          .map((game) => {
            const redeemedEntry = state.ownedShopGames.find((g) => g.title === game.title);
            const isOwned = Boolean(redeemedEntry);
            const canAfford = state.points >= game.cost;
            const isOnWishlist = state.wishlist.some(
              (w) => w.toLowerCase() === game.title.toLowerCase()
            );

            return `
              <div class="match-card shop-game-card ${isOnWishlist ? "highlight-user-card" : ""}">
                <div class="steam-banner-wrap">
                  <img src="${game.bannerUrl}" alt="${game.title}" class="steam-banner-img" loading="lazy" />
                  <span class="banner-players-pill">🔥 ${game.concurrentPlayers}</span>
                  <span class="banner-cost-pill">${game.cost} PTS</span>
                </div>

                <div class="shop-card-body">
                  <div class="shop-title-row">
                    <strong>${game.title}</strong>
                    ${
                      isOnWishlist
                        ? `<span class="wishlist-match-tag">★ Wishlisted</span>`
                        : ""
                    }
                  </div>
                  <span class="item-sub">${game.genre}</span>

                  <div class="recipient-donated" style="margin-top: 10px;">
                    <span>👍 <strong>Steam Reviews:</strong> ${game.steamRating}</span>
                  </div>

                  <button
                    class="submit-button donate-btn ${!canAfford && !isOwned ? "disabled-shop-btn" : ""}"
                    data-buy-title="${game.title}"
                    data-buy-cost="${game.cost}"
                    ${isOwned || !canAfford ? "disabled" : ""}
                  >
                    ${
                      isOwned
                        ? `✓ Key: ${redeemedEntry?.key}`
                        : canAfford
                        ? `Redeem Steam Key (${game.cost} PTS)`
                        : `Need ${game.cost - state.points} More PTS`
                    }
                  </button>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>

    ${
      state.activeModalKey
        ? `
      <div class="modal-backdrop" id="key-modal-backdrop">
        <div class="key-modal" role="dialog" aria-modal="true">
          <span class="eyebrow"><span class="live-dot"></span> STEAM KEY UNLOCKED</span>
          <h3>🎉 You Redeemed ${state.activeModalKey.title}!</h3>
          <p>Thank you for donating to the Chuxmart community. Activate this key in your Steam client:</p>
          <div class="key-display-box">
            <code id="modal-key-code">${state.activeModalKey.key}</code>
            <button class="action-btn mint-btn" id="copy-key-btn">Copy Key</button>
          </div>
          <button class="submit-button" id="close-modal-btn">Awesome, Close</button>
        </div>
      </div>
    `
        : ""
    }
  `;

  // Live search input
  const searchInput = container.querySelector<HTMLInputElement>("#shop-search-input");
  searchInput?.addEventListener("input", (e) => {
    shopSearchQuery = (e.target as HTMLInputElement).value;
    renderShopTab(container, onUpdate);
    const reFocused = container.querySelector<HTMLInputElement>("#shop-search-input");
    if (reFocused) {
      reFocused.focus();
      reFocused.setSelectionRange(shopSearchQuery.length, shopSearchQuery.length);
    }
  });

  // Redeem button handler
  container.querySelectorAll<HTMLButtonElement>("[data-buy-title]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-buy-title");
      const cost = Number(btn.getAttribute("data-buy-cost"));

      if (
        title &&
        state.points >= cost &&
        !state.ownedShopGames.some((g) => g.title === title)
      ) {
        state.points -= cost;
        const newKey = { title, key: generateSteamKey() };
        state.ownedShopGames.push(newKey);
        state.activeModalKey = newKey;
        state.wishlist = state.wishlist.filter(
          (w) => w.toLowerCase() !== title.toLowerCase()
        );
        saveState();
        onUpdate();
      }
    });
  });

  // Modal copy & close buttons
  container.querySelector<HTMLButtonElement>("#copy-key-btn")?.addEventListener("click", (e) => {
    if (state.activeModalKey) {
      navigator.clipboard?.writeText(state.activeModalKey.key);
      (e.currentTarget as HTMLButtonElement).textContent = "✓ Copied!";
    }
  });

  container.querySelector<HTMLButtonElement>("#close-modal-btn")?.addEventListener("click", () => {
    state.activeModalKey = null;
    onUpdate();
  });
}