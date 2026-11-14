import { state } from "./state";

export function renderWishlistTab(container: HTMLElement, onUpdate: () => void) {
  container.innerHTML = `
    <div class="grid-two-col">
      <!-- LEFT CARD: WISHLIST -->
      <div class="feature-card">
        <div class="card-header">
          <span class="eyebrow"><span class="live-dot"></span> GAMES YOU WANT</span>
          <h3>★ My Wishlist (${state.wishlist.length})</h3>
          <p>Add games you want to play so donors can match with your profile.</p>
        </div>

        <form id="add-wishlist-form" class="inline-form">
          <input
            id="wishlist-input"
            type="text"
            placeholder="e.g. Baldur's Gate 3, Hades II..."
            required
          />
          <button type="submit" class="action-btn">+ Add Wanted</button>
        </form>

        <ul class="item-list">
          ${
            state.wishlist.length === 0
              ? `<li class="empty-note">Your wishlist is empty. Add a game above!</li>`
              : state.wishlist
                  .map(
                    (game, index) => `
                <li class="item-row">
                  <div class="item-info">
                    <span class="item-icon">★</span>
                    <div>
                      <strong>${game}</strong>
                      <span class="item-sub">Seeking Donor Match</span>
                    </div>
                  </div>
                  <button class="remove-btn" data-remove-wish="${index}" title="Remove">✕</button>
                </li>
              `
                  )
                  .join("")
          }
        </ul>
      </div>

      <!-- RIGHT CARD: UNUSED INVENTORY TO DONATE -->
      <div class="feature-card">
        <div class="card-header">
          <span class="eyebrow"><span class="live-dot"></span> READY TO PASS ON</span>
          <h3>📦 My Unused Games (${state.unusedInventory.length})</h3>
          <p>List old or unplayed games in your library to match with players and earn points.</p>
        </div>

        <form id="add-inventory-form" class="inline-form">
          <input
            id="inv-title-input"
            type="text"
            placeholder="Game title (e.g. Terraria, Celeste)"
            required
          />
          <select id="inv-platform-input" class="mini-select">
            <option value="Steam">Steam</option>
            <option value="Epic">Epic</option>
            <option value="GOG">GOG</option>
          </select>
          <button type="submit" class="action-btn mint-btn">+ List Game</button>
        </form>

        <ul class="item-list">
          ${
            state.unusedInventory.length === 0
              ? `<li class="empty-note">No unused games listed yet. Add one above to start matching!</li>`
              : state.unusedInventory
                  .map(
                    (item, index) => `
                <li class="item-row">
                  <div class="item-info">
                    <span class="item-icon mint-icon">🎁</span>
                    <div>
                      <strong>${item.title}</strong>
                      <span class="item-sub">${item.platform} Key • Rewards <strong>+${item.pointsValue} PTS</strong> on donation</span>
                    </div>
                  </div>
                  <button class="remove-btn" data-remove-inv="${index}" title="Remove">✕</button>
                </li>
              `
                  )
                  .join("")
          }
        </ul>

        <div class="donated-history-bar">
          <span><strong>Previously Donated by ${state.username}:</strong> ${
            state.donatedGames.length ? state.donatedGames.join(", ") : "None yet"
          }</span>
        </div>
      </div>
    </div>
  `;

  // Add to Wishlist handler
  const wishlistForm = container.querySelector<HTMLFormElement>("#add-wishlist-form");
  wishlistForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = container.querySelector<HTMLInputElement>("#wishlist-input");
    if (input && input.value.trim()) {
      state.wishlist.push(input.value.trim());
      onUpdate();
    }
  });

  // Remove from Wishlist handler
  container.querySelectorAll<HTMLButtonElement>("[data-remove-wish]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-remove-wish"));
      state.wishlist.splice(idx, 1);
      onUpdate();
    });
  });

  // Add to Unused Inventory handler
  const invForm = container.querySelector<HTMLFormElement>("#add-inventory-form");
  invForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const titleInput = container.querySelector<HTMLInputElement>("#inv-title-input");
    const platformInput = container.querySelector<HTMLSelectElement>("#inv-platform-input");
    if (titleInput && titleInput.value.trim()) {
      state.unusedInventory.push({
        title: titleInput.value.trim(),
        platform: platformInput ? platformInput.value : "Steam",
        pointsValue: 150
      });
      onUpdate();
    }
  });

  // Remove from Unused Inventory handler
  container.querySelectorAll<HTMLButtonElement>("[data-remove-inv]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-remove-inv"));
      state.unusedInventory.splice(idx, 1);
      onUpdate();
    });
  });
}