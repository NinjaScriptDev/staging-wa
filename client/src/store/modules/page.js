export const namespaced = true;

export const state = {
  about: { id: null, title: null, description: null },
  terms: { id: null, title: null, description: null },
  privacy: { id: null, title: null, description: null },
};

export const mutations = {
  setAbout(state, payload) {
    Object.assign(state.about, payload);
  },
  setTerms(state, payload) {
    Object.assign(state.terms, payload);
  },
  setPrivacy(state, payload) {
    Object.assign(state.privacy, payload);
  },
};

export const actions = {
  setAbout({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/page/getAbout")
        .then((response) => {
          console.log(23, response.data?.payload);
          commit("setAbout", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          console.log(24, err);
          reject(err);
        });
    });
  },
  setTerms({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/page/getTerms")
        .then((response) => {
          commit("setTerms", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setPrivacy({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/page/getPrivacy")
        .then((response) => {
          commit("setPrivacy", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateAbout({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/page/updateAbout", request)
        .then((response) => {
          commit("setAbout", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updatePrivacy({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/page/updatePrivacy", request)
        .then((response) => {
          commit("setPrivacy", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateTerms({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/page/updateTerms", request)
        .then((response) => {
          commit("setTerms", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const getters = {
  // getToken(state) {
  //   return state.token;
  // },
  //
};
