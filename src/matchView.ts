import { state, communityMembers, type CommunityMember } from "./state";

export function renderMatchTab(container: HTMLElement, onUpdate: () => void) {
  // Build matches for each unused game in user's inventory
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
      // Fallback: pair with a community player who needs it so any added game can be donated!
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
        // 1. Add points to current user
        state.points += item.pointsValue;
        // 2. Record in user's donated games history
        state.donatedGames.push(item.title);
        // 3. Remove from user's unused inventory
        state.unusedInventory.splice(invIndex, 1);
        // 4. Remove from recipient's wishlist if present
        const member = communityMembers.find((c) => c.id === recipientId);
        if (member) {
          member.wishlist = member.wishlist.filter(
            (w) => w.toLowerCase() !== item.title.toLowerCase()
          );
        }
        // 5. Show celebration banner
        state.lastMessage = `You donated "${item.title}" to ${recipientName} and earned +${item.pointsValue} PTS!`;
        onUpdate();
      }
    });
  });
}

export function renderCommunityTab(container: HTMLElement) {
  // Include current logged-in user at the top of the community map!
  container.innerHTML = `
    <div class="feature-card">
      <div class="card-header">
        <span class="eyebrow"><span class="live-dot"></span> LIVE EXCHANGE NETWORK</span>
        <h3>🌍 Community Profiles, Fake Locations & Donation Ledger</h3>
        <p>Explore where players are connecting from and see which games each member has donated to the community.</p>
      </div>

      <div class="match-grid">
        <!-- CURRENT USER CARD -->
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

        <!-- OTHER COMMUNITY MEMBERS -->
        ${communityMembers
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
}