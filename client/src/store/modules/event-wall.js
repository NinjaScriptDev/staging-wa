export const namespaced = true;

export const state = {
  events: [],
  event: {
    comments: [],
  },
  user: {},
  featuredEvent: {},
  foundEvents: [],
  upcomingEvents: [],
};

export const mutations = {
  setEvents(state, payload) {
    state.events = payload;
  },
  setEvent(state, payload) {
    state.event = payload;
    state.event.comments = payload.comments || [];
  },
  addEvent(state, payload) {
    state.events.unshift(payload);
  },
  setUser(state, payload) {
    state.user = payload;
  },
  setFeaturedEvent(state, payload) {
    state.featuredEvent = payload;
  },
  setCategories(state, payload) {
    state.categories = payload;
  },
  setFoundEvents(state, payload) {
    state.foundEvents = payload;
  },
  setUpcomingEvents(state, payload) {
    state.upcomingEvents = payload;
  },
  setCommentsByEventId(state, payload) {
    state.event.comments = payload;
  },
  addComment(state, payload) {
    state.event.comments.unshift(payload);
  },
  removeComment(state, payload) {
    const targetItemIndex = state.event.comments.findIndex(
      (item) => item.id == payload
    );
    state.event.comments.splice(targetItemIndex, 1);
  },
  removeEvent(state, payload) {
    const targetItemIndex = state.events.findIndex(
      (item) => item.id == payload
    );
    state.events.splice(targetItemIndex, 1);
  },
  setEventNotification(state, payload) {
    const targetItemIndex = state.events.findIndex(
      (item) => item.id == payload.eventId
    );
    state.events[targetItemIndex].new_notification = payload.payload;
  },
};

export const actions = {
  addEvent({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/event/save", request)
        .then((response) => {
          commit("addEvent", response.data.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setWallEvents({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/getEventsByUserId", { params: { userId: request } })
        .then((response) => {
          commit("setEvents", response.data.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setBrowseEvents({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/getAllEventsByFriends", {
          params: { userId: request },
        })
        .then((response) => {
          commit("setEvents", response.data.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getUserById({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/user/getUserById", { params: { userId: request } })
        .then((response) => {
          commit("setUser", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getFeaturedEvent({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/getFeaturedEvent", { params: { userId: request } })
        .then((response) => {
          commit("setFeaturedEvent", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setFeaturedEvent({ commit, state }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/setFeaturedEvent", {
          params: {
            oldEventId: state.featuredEvent?.id,
            newEventId: request.eventId,
          },
        })
        .then((response) => {
          const foundFeaturedEvent = state.events.find(
            (item) => item.id === request.eventId
          );
          commit("setFeaturedEvent", foundFeaturedEvent);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setEventNotification({ commit, state }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/setEventNotification", {
          params: { eventId: request.eventId, payload: request.payload },
        })
        .then((response) => {
          commit("setEventNotification", {
            eventId: request.eventId,
            payload: request.payload,
          });
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getCategories({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/getCategories")
        .then((response) => {
          const formattedCategories = response.data?.payload?.map(
            (item) => item.name
          );
          commit("setCategories", formattedCategories);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  findEvents({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/findEvents", {
          params: {
            offset: request.offset,
            startDate: request.startDate,
            endDate: request.endDate,
            category: request.category,
          },
        })
        .then((response) => {
          commit("setFoundEvents", response.data.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getUpcomingEvents({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/getUpcomingEvents", {
          params: { userId: request.userId, source: request.source },
        })
        .then((response) => {
          commit("setUpcomingEvents", response.data.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getEvent({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/getEvent", {
          params: { eventId: request },
        })
        .then((response) => {
          commit("setEvent", response.data.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getCommentsByEventId({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/getCommentsByEventId", {
          params: { eventId: request },
        })
        .then((response) => {
          commit("setCommentsByEventId", response.data.payload);

          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  addFavoriteEvent({ commit, state }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/addFavoriteEvent", {
          params: { eventId: request },
        })
        .then((response) => {
          commit("addEvent", state.event);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getFavoriteEvents({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/getFavoriteEvents", {
          params: { userId: request },
        })
        .then((response) => {
          commit("setEvents", response.data.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setWishlistEvents({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/getWishlistEvents", {
          params: { userId: request },
        })
        .then((response) => {
          commit("setEvents", response.data.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setWishlistEvent({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/getWishlistEvent", {
          params: { eventId: request },
        })
        .then((response) => {
          commit("setEvent", response.data.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  addWishlistEvent({ commit, state }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/event/addWishlistEvent", request)
        .then((response) => {
          commit("addEvent", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  addComment({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/event/setCommentsByEventId", request)
        .then((response) => {
          const savedComment = response.data.payload;
          savedComment.full_name = request.full_name;
          savedComment.image = request.image;

          commit("addComment", savedComment);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteComment({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/deleteComment", { params: { commentId: request } })
        .then((response) => {
          commit("removeComment", request);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteEvent({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/deleteEvent", { params: { eventId: request } })
        .then((response) => {
          commit("removeEvent", request);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteWishlistEvent({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/event/deleteWishlistEvent", { params: { eventId: request } })
        .then((response) => {
          commit("removeEvent", request);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const getters = {
  getMountedEventCategories(state) {
    const uniqueCategories = new Set();
    state.events.forEach((event) => {
      if (event.category) {
        uniqueCategories.add(event.category);
      }
    });
    return Array.from(uniqueCategories);
  },
};
