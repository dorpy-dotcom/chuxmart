// @ts-ignore
import "./style.css";
import { state } from "./state";
import { renderLogin } from "./loginView";
import { renderDashboard } from "./dashboardView";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root element was not found.");
}

function renderApp() {
  if (!app) return;

  if (state.isLoggedIn) {
    renderDashboard(app, renderApp);
  } else {
    renderLogin(app, renderApp);
  }
}

renderApp();