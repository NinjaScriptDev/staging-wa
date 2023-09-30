import { createStore } from "vuex";
import * as cuser from "./modules/cuser";
import * as eventWall from "./modules/event-wall";
import * as category from "./modules/category";
import * as page from "./modules/page";
import * as blog from "./modules/blog";

const store = createStore({
  modules: {
    cuser,
    eventWall,
    category,
    page,
    blog,
  },
  state: () => ({
    snackbars: [],
  }),
  mutations: {
    setSnackbar(state, payload) {
      payload.message = payload.message || "Something went wrong!";
      state.snackbars.push(payload);
    },
    removeSnackbar(state, payload) {
      state.snackbars[payload].show = false;
      state.snackbars.splice(payload, 1);
    },
  },
  actions: {
    setSnackbar({ commit }, request) {
      if (request.show !== false) request.show = true;
      commit("setSnackbar", request);
    },
    removeSnackbar({ commit }, request) {
      commit("removeSnackbar", request);
    },
  },
});

export default store;
