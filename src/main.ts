import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root element was not found.");
}

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
          <h1 id="welcome-title">Your next great game is <span>out there.</span></h1>
        </div>

        <div class="game-stack" aria-hidden="true">
          <div class="game-card card-back">
            <span class="card-symbol">✦</span>
            <span class="card-name">NEW WORLDS</span>
          </div>
          <div class="game-card card-front">
            <span class="game-art">
              <span class="art-orbit orbit-one"></span>
              <span class="art-orbit orbit-two"></span>
              <span class="art-core">✳</span>
            </span>
            <span class="card-label">YOUR NEXT ADVENTURE</span>
            <span class="card-title">Ready when<br />you are.</span>
            <span class="card-arrow">↗</span>
          </div>
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
          <p>Sign in</p>
        </div>

        <form id="login-form">
          <label for="email">Email address</label>
          <div class="input-wrap">
            <svg class="input-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2.5" y="4" width="15" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="m3.5 5.5 6.5 5 6.5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input id="email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required />
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
            <input id="password" name="password" type="password" placeholder="Enter your password" autocomplete="current-password" required minlength="8" />
            <button class="password-toggle" type="button" aria-label="Show password" aria-pressed="false">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M2.5 10s2.7-5 7.5-5 7.5 5 7.5 5-2.7 5-7.5 5-7.5-5-7.5-5Z" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="10" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </button>
          </div>

          <label class="remember-option" for="remember">
            <input id="remember" name="remember" type="checkbox" />
            <span class="custom-checkbox" aria-hidden="true"></span>
            <span>Remember me</span>
          </label>

          <button class="submit-button" type="submit">
            <span>Sign in</span>
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <p class="form-message" id="form-message" role="status" aria-live="polite"></p>
        </form>

        <p class="signup-prompt">New to Chuxmart? <a class="text-link" href="#create-account" id="signup-link">Create an account</a></p>
      </div>
    </section>
    <span class="page-glow glow-one" aria-hidden="true"></span>
    <span class="page-glow glow-two" aria-hidden="true"></span>
  </main>
`;

const passwordInput = document.querySelector<HTMLInputElement>("#password");
const passwordToggle = document.querySelector<HTMLButtonElement>(".password-toggle");
const loginForm = document.querySelector<HTMLFormElement>("#login-form");
const formMessage = document.querySelector<HTMLParagraphElement>("#form-message");

passwordToggle?.addEventListener("click", () => {
  if (!passwordInput || !passwordToggle) return;

  const isVisible = passwordInput.type === "text";
  passwordInput.type = isVisible ? "password" : "text";
  passwordToggle.setAttribute("aria-pressed", String(!isVisible));
  passwordToggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
});

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (formMessage) {
    formMessage.textContent = "Sign-in is a UI demo and isn’t connected to an account service yet.";
    formMessage.classList.add("is-visible");
  }
});

document.querySelector<HTMLAnchorElement>("#forgot-link")?.addEventListener("click", (event) => {
  event.preventDefault();
  if (formMessage) {
    formMessage.textContent = "Password reset isn’t connected yet. Please contact the site administrator.";
    formMessage.classList.add("is-visible");
  }
});

document.querySelector<HTMLAnchorElement>("#signup-link")?.addEventListener("click", (event) => {
  event.preventDefault();
  if (formMessage) {
    formMessage.textContent = "Account creation isn’t connected yet.";
    formMessage.classList.add("is-visible");
  }
});
