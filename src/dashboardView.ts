import { state, communityMembers, saveState, resetDemoState, type UserState } from "./state";
import { renderWishlistTab } from "./wishlistView";
import { renderMatchTab, renderCommunityTab } from "./matchView";
import { renderShopTab } from "./shopView";

export function renderDashboard(app: HTMLDivElement, onLogout: () => void) {
  const totalCommunityDonations =
    state.donatedGames.length +
    communityMembers.reduce((sum, m) => sum + m.donatedGames.length, 0);

  app.innerHTML = `
    <main class="page-shell dashboard-shell">
      <header class="top-nav">
        <a class="brand" href="#" id="brand-home">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M7.5 9.5h17v13h-17z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
              <path d="M12 5.5v8m-4-4h8m7 5.5h.01M19.5 19h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
            </svg>
          </span>
          <span>chux<span class="brand-accent">mart</span></span>
        </a>

        <nav class="nav-tabs" aria-label="Main Navigation">
          <button class="nav-tab ${state.activeTab === "wishlist" ? "active" : ""}" data-tab="wishlist">
            ★ My Wishlist & Inventory
          </button>
          <button class="nav-tab ${state.activeTab === "match" ? "active" : ""}" data-tab="match">
            ⇄ Donate & Match (${state.unusedInventory.length})
          </button>
          <button class="nav-tab ${state.activeTab === "shop" ? "active" : ""}" data-tab="shop">
            🛒 Steam Point Shop
          </button>
          <button class="nav-tab ${state.activeTab === "community" ? "active" : ""}" data-tab="community">
            🌍 Community & Locations
          </button>
        </nav>

        <div class="user-bar">
          <div class="points-badge" title="Earn points by donating games!">
            <span class="points-icon">✦</span>
            <span><strong>${state.points}</strong> PTS</span>
          </div>
          <div class="user-profile-chip">
            <span class="user-avatar">${state.username.charAt(0).toUpperCase()}</span>
            <div class="user-meta">
              <span class="user-name">${state.username}</span>
              <span class="user-loc">📍 ${state.location}</span>
            </div>
          </div>
          <button class="logout-btn" id="reset-demo-btn" title="Reset all demo data">↺ Reset Demo</button>
          <button class="logout-btn" id="logout-btn">Log out</button>
        </div>
      </header>

      <!-- LIVE IMPACT METRICS BAR -->
      <section class="impact-stats-bar" aria-label="Community Impact Metrics">
        <div class="stat-pill">
          <span class="stat-label">TOTAL GAMES DONATED</span>
          <strong class="stat-value">${totalCommunityDonations} Games</strong>
        </div>
        <div class="stat-pill">
          <span class="stat-label">YOUR DONATIONS</span>
          <strong class="stat-value mint-text">${state.donatedGames.length} (${state.donatedGames.join(", ")})</strong>
        </div>
        <div class="stat-pill">
          <span class="stat-label">ACTIVE EXCHANGE REGIONS</span>
          <strong class="stat-value">6 Fake Hubs Online</strong>
        </div>
      </section>

      <section class="dashboard-content" id="tab-container"></section>

      <span class="page-glow glow-one" aria-hidden="true"></span>
      <span class="page-glow glow-two" aria-hidden="true"></span>
    </main>
  `;

  const tabContainer = app.querySelector<HTMLElement>("#tab-container");
  if (tabContainer) {
    const refresh = () => {
      saveState();
      renderDashboard(app, onLogout);
    };

    if (state.activeTab === "wishlist") {
      renderWishlistTab(tabContainer, refresh);
    } else if (state.activeTab === "match") {
      renderMatchTab(tabContainer, refresh);
    } else if (state.activeTab === "community") {
      renderCommunityTab(tabContainer);
    } else if (state.activeTab === "shop") {
      renderShopTab(tabContainer, refresh);
    }
  }

  app.querySelectorAll<HTMLButtonElement>(".nav-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab") as UserState["activeTab"];
      if (tab) {
        state.activeTab = tab;
        saveState();
        renderDashboard(app, onLogout);
      }
    });
  });

  app.querySelector<HTMLButtonElement>("#reset-demo-btn")?.addEventListener("click", () => {
    const currentName = state.username;
    const currentLoc = state.location;
    resetDemoState();
    state.isLoggedIn = true;
    state.username = currentName;
    state.location = currentLoc;
    saveState();
    renderDashboard(app, onLogout);
  });

  app.querySelector<HTMLButtonElement>("#logout-btn")?.addEventListener("click", () => {
    state.isLoggedIn = false;
    saveState();
    onLogout();
  });
}