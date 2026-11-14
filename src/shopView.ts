import { state } from "./state";

interface ShopGame {
  id: string;
  title: string;
  genre: string;
  steamRating: string;
  concurrentPlayers: string;
  cost: number;
  icon: string;
}

const TRENDING_STEAM_GAMES: ShopGame[] = [
  {
    id: "s1",
    title: "Elden Ring",
    genre: "Action RPG • Open World",
    steamRating: "93% Very Positive",
    concurrentPlayers: "142,800 In-Game",
    cost: 400,
    icon: "⚔️"
  },
  {
    id: "s2",
    title: "Cyberpunk 2077",
    genre: "Sci-Fi RPG • Night City",
    steamRating: "89% Very Positive",
    concurrentPlayers: "84,210 In-Game",
    cost: 350,
    icon: "🦾"
  },
  {
    id: "s3",
    title: "Baldur's Gate 3",
    genre: "Party RPG • Story Rich",
    steamRating: "96% Overwhelmingly Positive",
    concurrentPlayers: "168,500 In-Game",
    cost: 450,
    icon: "🎲"
  },
  {
    id: "s4",
    title: "Hades II",
    genre: "Action Roguelike • Indie",
    steamRating: "95% Overwhelmingly Positive",
    concurrentPlayers: "61,400 In-Game",
    cost: 250,
    icon: "🔥"
  },
  {
    id: "s5",
    title: "Helldivers 2",
    genre: "Co-op Shooter • Action",
    steamRating: "86% Very Positive",
    concurrentPlayers: "95,120 In-Game",
    cost: 300,
    icon: "🚀"
  },
  {
    id: "s6",
    title: "Balatro",
    genre: "Deckbuilder • Roguelike",
    steamRating: "98% Overwhelmingly Positive",
    concurrentPlayers: "39,900 In-Game",
    cost: 150,
    icon: "🃏"
  }
];

export function renderShopTab(container: HTMLElement, onUpdate: () => void) {
  container.innerHTML = `
    <div class="feature-card">
      <div class="card-header">
        <span class="eyebrow"><span class="live-dot"></span> POWERED BY STEAM MARKET TRENDS</span>
        <h3>🛒 Trending Steam Point Shop (Balance: ${state.points} PTS)</h3>
        <p>Exchange the points you earned from donating unused games for top trending titles on Steam.</p>
      </div>

      ${
        state.ownedShopGames.length > 0
          ? `<div class="toast-banner">
               🔑 <strong>Your Redeemed Steam Keys (${state.ownedShopGames.length}):</strong> ${state.ownedShopGames.join(" • ")}
             </div>`
          : ""
      }

      <div class="match-grid">
        ${TRENDING_STEAM_GAMES.map((game) => {
          const isOwned = state.ownedShopGames.includes(game.title);
          const canAfford = state.points >= game.cost;
          const isOnWishlist = state.wishlist.some(
            (w) => w.toLowerCase() === game.title.toLowerCase()
          );

          return `
            <div class="match-card ${isOnWishlist ? "highlight-user-card" : ""}">
              <div class="match-top">
                <span class="match-badge">🔥 ${game.concurrentPlayers}</span>
                <span class="reward-pill">${game.cost} PTS</span>
              </div>

              <div class="match-game-box">
                <span class="item-icon">${game.icon}</span>
                <div>
                  <strong>${game.title}</strong>
                  <span class="item-sub">${game.genre}</span>
                </div>
              </div>

              <div class="recipient-donated">
                <span>👍 <strong>Steam Reviews:</strong> ${game.steamRating}</span>
                ${
                  isOnWishlist
                    ? `<br /><span style="color: var(--violet);">★ Matches your Wishlist!</span>`
                    : ""
                }
              </div>

              <button
                class="submit-button donate-btn ${!canAfford && !isOwned ? "disabled-shop-btn" : ""}"
                data-buy-title="${game.title}"
                data-buy-cost="${game.cost}"
                ${isOwned || !canAfford ? "disabled" : ""}
              >
                ${
                  isOwned
                    ? "✓ Redeemed in Library"
                    : canAfford
                    ? `Redeem Steam Key (${game.cost} PTS)`
                    : `Need ${game.cost - state.points} More PTS`
                }
              </button>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  container.querySelectorAll<HTMLButtonElement>("[data-buy-title]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-buy-title");
      const cost = Number(btn.getAttribute("data-buy-cost"));

      if (title && state.points >= cost && !state.ownedShopGames.includes(title)) {
        state.points -= cost;
        state.ownedShopGames.push(title);
        // Automatically remove from wishlist if user had it wishlisted
        state.wishlist = state.wishlist.filter(
          (w) => w.toLowerCase() !== title.toLowerCase()
        );
        onUpdate();
      }
    });
  });
}