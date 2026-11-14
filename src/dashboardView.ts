import { state, type UserState } from "./state";
import { renderWishlistTab } from "./wishlistView";

export function renderDashboard(app: HTMLDivElement, onLogout: () => void) {
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
            ⇄ Donate & Match
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
          <button class="logout-btn" id="logout-btn">Log out</button>
        </div>
      </header>

      <section class="dashboard-content" id="tab-container"></section>

      <span class="page-glow glow-one" aria-hidden="true"></span>
      <span class="page-glow glow-two" aria-hidden="true"></span>
    </main>
  `;

  const tabContainer = app.querySelector<HTMLElement>("#tab-container");
  if (tabContainer) {
    if (state.activeTab === "wishlist") {
      renderWishlistTab(tabContainer, () => renderDashboard(app, onLogout));
    } else {
      tabContainer.innerHTML = `
        <div class="step-card">
          <span class="eyebrow"><span class="live-dot"></span> COMING UP IN STEP 3 & 4</span>
          <h2>${state.activeTab.toUpperCase()} TAB</h2>
          <p class="dashboard-subtext">We will hook up this tab next!</p>
        </div>
      `;
    }
  }

  app.querySelectorAll<HTMLButtonElement>(".nav-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab") as UserState["activeTab"];
      if (tab) {
        state.activeTab = tab;
        renderDashboard(app, onLogout);
      }
    });
  });

  app.querySelector<HTMLButtonElement>("#logout-btn")?.addEventListener("click", () => {
    state.isLoggedIn = false;
    onLogout();
  });
}