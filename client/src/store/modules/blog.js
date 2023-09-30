export const namespaced = true;

export const state = {
  blogs: [],
  blog: {},
};

export const mutations = {
  setBlogs(state, payload) {
    state.blogs = payload;
  },
  setBlog(state, payload) {
    state.blog = payload;
  },
  addBlog(state, payload) {
    state.blogs.unshift(payload);
  },
  editBlog(state, payload) {
    const targetItemIndex = state.blogs.findIndex(
      (item) => item.id === payload.id
    );
    state.blogs[targetItemIndex] = payload;
  },
  deleteBlog(state, payload) {
    const targetItemIndex = state.blogs.findIndex(
      (item) => item.id === payload
    );
    state.blogs.splice(targetItemIndex, 1);
  },
};

export const actions = {
  setBlogs({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/blog/getBlogs")
        .then((response) => {
          commit("setBlogs", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setBlog({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/blog/getBlog", { params: { blogId: request } })
        .then((response) => {
          commit("setBlog", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  addBlog({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/blog/save", request)
        .then((response) => {
          commit("addBlog", response.data.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  editBlog({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/blog/edit", request)
        .then((response) => {
          commit("editBlog", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteBlog({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/blog/delete", { params: { id: request } })
        .then((response) => {
          commit("deleteBlog", request);
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
