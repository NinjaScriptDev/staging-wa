/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import router from "../router";
import store from "../store";
import { removeQueryParams } from "@/util";

export function registerPlugins(app) {
  loadFonts();

  router.beforeEach((to, from, next) => {
    const signedin = store.getters["cuser/signedin"];
    const isAdmin = store.getters["cuser/isAdmin"];

    if (
      to.name === "register" ||
      to.name === "signin" ||
      to.name === "landing"
    ) {
      if (signedin) {
        if (isAdmin) {
          return next({ name: "adminDashboard" });
        } else {
          return next({
            name: "wall",
            params: { id: store.getters["cuser/getCurrentUserId"] },
          });
        }
      }
    } else if (
      to.matched.some((record) => record.meta.requiresAuth) &&
      !signedin
    ) {
      return next({ name: "signin" });
    } else if (
      to.matched.some((record) => record.meta.requiresAdmin) &&
      !isAdmin
    ) {
      return next({ name: "signin" });
    }

    //check if message came from server through query params
    const queryParams = new URLSearchParams(window.location.search);
    const apiQueryMsg = queryParams.get("apiQueryMsg");

    if (apiQueryMsg) {
      const newUrl = removeQueryParams(window.location.href, ["apiQueryMsg"]);
      localStorage.setItem("apiQueryMsg", apiQueryMsg);
      window.location.href = newUrl;
    } else if (localStorage.getItem("apiQueryMsg")) {
      store.dispatch("setSnackbar", {
        msg: localStorage.getItem("apiQueryMsg"),
        color: "primary",
      });
      localStorage.removeItem("apiQueryMsg");
    }

    next();
  });

  app.use(vuetify).use(router).use(store);
}
