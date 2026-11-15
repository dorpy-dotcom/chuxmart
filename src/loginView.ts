import { state, FAKE_LOCATIONS } from "./state";

export function renderLogin(app: HTMLDivElement, onLoginSuccess: () => void) {
  app.innerHTML = `
    <main class="page-shell">
      <a class="brand" href="/" aria-label="Chuxmart home">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M7.5 9.5h17v13h-17z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
            <path d="M12 5.5v8m-4-4h8m7 5.5h.01M19.5 19h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
          </svg>
        </span>
        <span>chux<span class="brand-accent">mart</span></span>
      </a>

      <section class="login-layout" aria-labelledby="welcome-title">
        <div class="welcome-panel">
          <div class="welcome-copy">
            <span class="eyebrow"><span class="live-dot"></span> THE PLAYER-POWERED EXCHANGE</span>
            <h1 id="welcome-title">Your next great game is <span>out there.</span></h1>
            <p>Donate unused games from your library, match with players who wishlisted them, and earn points for top trending Steam titles.</p>
          </div>

          <div class="game-stack" aria-hidden="true">
            <span class="float-spark spark-one">✦</span>
            <span class="float-spark spark-two">✳</span>
          </div>

          <div class="community-note">
            <span class="avatar-stack" aria-hidden="true">
              <span class="avatar avatar-one">J</span>
              <span class="avatar avatar-two">M</span>
              <span class="avatar avatar-three">A</span>
              <span class="avatar avatar-more">+</span>
            </span>
            <span><strong>Good games go further</strong><br />When players pass them on.</span>
          </div>
        </div>

        <div class="form-panel">
          <div class="form-heading">
            <span class="mobile-eyebrow">WELCOME BACK</span>
            <h2>Welcome back</h2>
            <p>Sign in with your username and password</p>
          </div>

          <form id="login-form">
            <label for="username">Username</label>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="6.5" r="3.2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M4 16.5c1.2-2.8 3.5-4.2 6-4.2s4.8 1.4 6 4.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <input id="username" name="username" type="text" placeholder="e.g. PixelHero99" autocomplete="username" required />
            </div>

            <div class="password-label">
              <label for="password">Password</label>
              <a class="text-link" href="#forgot-password" id="forgot-link">Forgot password?</a>
            </div>
            <div class="input-wrap">
              <svg class="input-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <rect x="3.5" y="8.5" width="13" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <input id="password" name="password" type="password" placeholder="Enter your password" autocomplete="current-password" required minlength="4" />
              <button class="password-toggle" type="button" aria-label="Show password" aria-pressed="false">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M2.5 10s2.7-5 7.5-5 7.5 5 7.5 5-2.7 5-7.5 5-7.5-5-7.5-5Z" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="10" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
            </div>

            <label for="location-select">Spawn Location (Fake Region)</label>
            <div class="input-wrap">
              <select id="location-select" class="select-input">
                ${FAKE_LOCATIONS.map((loc) => `<option value="${loc}">📍 ${loc}</option>`).join("")}
              </select>
            </div>

            <label class="remember-option" for="remember">
              <input id="remember" name="remember" type="checkbox" checked />
              <span class="custom-checkbox" aria-hidden="true"></span>
              <span>Remember me</span>
            </label>

            <button class="submit-button" type="submit">
              <span>Enter Exchange</span>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <p class="form-message" id="form-message" role="status" aria-live="polite"></p>
          </form>

          <p class="signup-prompt">New to Chuxmart? <a class="text-link" href="#create-account" id="signup-link">Type any username to auto-register</a></p>
        </div>
      </section>
      <span class="page-glow glow-one" aria-hidden="true"></span>
      <span class="page-glow glow-two" aria-hidden="true"></span>
    </main>
  `;

  const passwordInput = app.querySelector<HTMLInputElement>("#password");
  const passwordToggle = app.querySelector<HTMLButtonElement>(".password-toggle");
  const loginForm = app.querySelector<HTMLFormElement>("#login-form");
  const formMessage = app.querySelector<HTMLParagraphElement>("#form-message");

  passwordToggle?.addEventListener("click", () => {
    if (!passwordInput || !passwordToggle) return;
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    passwordToggle.setAttribute("aria-pressed", String(!isVisible));
  });

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const usernameInput = app.querySelector<HTMLInputElement>("#username");
    const locationSelect = app.querySelector<HTMLSelectElement>("#location-select");

    if (usernameInput && usernameInput.value.trim()) {
      state.username = usernameInput.value.trim();
      state.location = locationSelect ? locationSelect.value : FAKE_LOCATIONS[0];
      state.isLoggedIn = true;
      onLoginSuccess();
    }
  });

  app.querySelector<HTMLAnchorElement>("#forgot-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    if (formMessage) {
      formMessage.textContent = "Demo mode: Enter any password (4+ characters) to sign in!";
      formMessage.classList.add("is-visible");
    }
  });

  app.querySelector<HTMLAnchorElement>("#signup-link")?.addEventListener("click", (event) => {
    event.preventDefault();
    if (formMessage) {
      formMessage.textContent = "Simply enter your desired username and password above to create your profile!";
      formMessage.classList.add("is-visible");
    }
  });
}