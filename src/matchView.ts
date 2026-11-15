import { state, communityMembers, FAKE_LOCATIONS, saveState, type CommunityMember } from "./state";

let selectedRegionFilter = "ALL";

export function renderMatchTab(container: HTMLElement, onUpdate: () => void) {
  const matches: {
    invIndex: number;
    gameTitle: string;
    platform: string;
    pointsValue: number;
    recipient: CommunityMember;
  }[] = [];

  state.unusedInventory.forEach((item, idx) => {
    const matchedUsers = communityMembers.filter((member) =>
      member.wishlist.some((w) => w.toLowerCase() === item.title.toLowerCase())
    );

    if (matchedUsers.length > 0) {
      matchedUsers.forEach((recipient) => {
        matches.push({
          invIndex: idx,
          gameTitle: item.title,
          platform: item.platform,
          pointsValue: item.pointsValue,
          recipient
        });
      });
    } else {
      const fallbackUser = communityMembers[idx % communityMembers.length];
      matches.push({
        invIndex: idx,
        gameTitle: item.title,
        platform: item.platform,
        pointsValue: item.pointsValue,
        recipient: fallbackUser
      });
    }
  });

  container.innerHTML = `
    <div class="feature-card">
      <div class="card-header">
        <span class="eyebrow"><span class="live-dot"></span> SMART INVENTORY MATCHER</span>
        <h3>⇄ Donate Unused Games & Earn Points (${matches.length} Matches)</h3>
        <p>We matched the unused games in your inventory with players who have them on their wishlist.</p>
      </div>

      ${
        state.lastMessage
          ? `<div class="toast-banner">🎉 ${state.lastMessage}</div>`
          : ""
      }

      ${
        matches.length === 0
          ? `<div class="empty-note" style="margin-top: 20px;">
               You have no unused games left in your inventory! Go to <strong>★ My Wishlist & Inventory</strong> to list more games to donate.
             </div>`
          : `<div class="match-grid">
              ${matches
                .map(
                  (m, cardIdx) => `
                  <div class="match-card">
                    <div class="match-top">
                      <span class="match-badge">98% WISHLIST MATCH</span>
                      <span class="reward-pill">+${m.pointsValue} PTS</span>
                    </div>

                    <div class="match-game-box">
                      <span class="item-icon mint-icon">🎮</span>
                      <div>
                        <strong>${m.gameTitle}</strong>
                        <span class="item-sub">Your ${m.platform} Inventory Key</span>
                      </div>
                    </div>

                    <div class="match-arrow">↓ Matches Wishlist Of ↓</div>

                    <div class="recipient-box">
                      <span class="user-avatar">${m.recipient.avatar}</span>
                      <div>
                        <strong>${m.recipient.username}</strong>
                        <span class="user-loc">📍 ${m.recipient.location}</span>
                      </div>
                    </div>

                    <p class="recipient-bio">"${m.recipient.bio}"</p>

                    <div class="recipient-donated">
                      <span>🎁 <strong>Donated by ${m.recipient.username}:</strong> ${m.recipient.donatedGames.join(", ")}</span>
                    </div>

                    <button
                      class="submit-button donate-btn"
                      data-donate-idx="${m.invIndex}"
                      data-recipient="${m.recipient.username}"
                      data-recipient-id="${m.recipient.id}"
                      data-card="${cardIdx}"
                    >
                      Donate ${m.gameTitle} (+${m.pointsValue} PTS)
                    </button>
                  </div>
                `
                )
                .join("")}
            </div>`
      }
    </div>
  `;

  container.querySelectorAll<HTMLButtonElement>(".donate-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const invIndex = Number(btn.getAttribute("data-donate-idx"));
      const recipientName = btn.getAttribute("data-recipient") || "Player";
      const recipientId = btn.getAttribute("data-recipient-id");
      const item = state.unusedInventory[invIndex];

      if (item) {
        state.points += item.pointsValue;
        state.donatedGames.push(item.title);
        state.unusedInventory.splice(invIndex, 1);
        const member = communityMembers.find((c) => c.id === recipientId);
        if (member) {
          member.wishlist = member.wishlist.filter(
            (w) => w.toLowerCase() !== item.title.toLowerCase()
          );
        }
        state.lastMessage = `You donated "${item.title}" to ${recipientName} and earned +${item.pointsValue} PTS!`;
        saveState();
        onUpdate();
      }
    });
  });
}

export function renderCommunityTab(container: HTMLElement) {
  const filteredMembers =
    selectedRegionFilter === "ALL"
      ? communityMembers
      : communityMembers.filter((m) => m.location === selectedRegionFilter);

  container.innerHTML = `
    <div class="feature-card">
      <div class="shop-header-row">
        <div class="card-header">
          <span class="eyebrow"><span class="live-dot"></span> LIVE EXCHANGE NETWORK</span>
          <h3>🌍 Community Profiles, Fake Locations & Donation Ledger</h3>
          <p>Explore where players are connecting from and see which games each member has donated.</p>
        </div>

        <div class="shop-search-wrap">
          <select id="region-filter-select" class="select-input">
            <option value="ALL">🌍 All Fake Locations (${communityMembers.length + 1})</option>
            ${FAKE_LOCATIONS.map(
              (loc) =>
                `<option value="${loc}" ${selectedRegionFilter === loc ? "selected" : ""}>📍 ${loc}</option>`
            ).join("")}
          </select>
        </div>
      </div>

      <div class="match-grid">
        ${
          selectedRegionFilter === "ALL" || selectedRegionFilter === state.location
            ? `
          <div class="match-card highlight-user-card">
            <div class="recipient-box">
              <span class="user-avatar">${state.username.charAt(0).toUpperCase()}</span>
              <div>
                <strong>${state.username} (You)</strong>
                <span class="user-loc">📍 ${state.location}</span>
              </div>
            </div>
            <div class="profile-detail-group">
              <p><strong>★ Wishlist (${state.wishlist.length}):</strong> ${
                state.wishlist.length ? state.wishlist.join(", ") : "None"
              }</p>
              <p><strong>🎁 Games Donated (${state.donatedGames.length}):</strong> ${
                state.donatedGames.length ? state.donatedGames.join(", ") : "None yet"
              }</p>
            </div>
          </div>
        `
            : ""
        }

        ${filteredMembers
          .map(
            (member) => `
          <div class="match-card">
            <div class="recipient-box">
              <span class="user-avatar">${member.avatar}</span>
              <div>
                <strong>${member.username}</strong>
                <span class="user-loc">📍 ${member.location}</span>
              </div>
            </div>
            <p class="recipient-bio">"${member.bio}"</p>
            <div class="profile-detail-group">
              <p><strong>★ Wishlist:</strong> ${
                member.wishlist.length ? member.wishlist.join(", ") : "All fulfilled!"
              }</p>
              <p><strong>🎁 Games Donated (${member.donatedGames.length}):</strong> ${member.donatedGames.join(", ")}</p>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  container
    .querySelector<HTMLSelectElement>("#region-filter-select")
    ?.addEventListener("change", (e) => {
      selectedRegionFilter = (e.target as HTMLSelectElement).value;
      renderCommunityTab(container);
    });
}