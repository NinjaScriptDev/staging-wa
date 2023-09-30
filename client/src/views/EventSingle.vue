<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  formatDateFromTimestamp,
  formatTimeFromTime,
  getEventImageUrl,
  getUserImageUrl,
} from "@/util";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const route = useRoute();
const store = useStore();
const event = computed(() => store.state.eventWall.event);
const newCommentText = ref(null);
const currentUser = computed(() => store.getters["cuser/getCurrentUser"]);

const isAdmin = computed(() => store.getters["cuser/isAdmin"]);
const isOwner = (commenter_id) => commenter_id == currentUser.value.id;

const handleFavoriteEvent = () => {
  store.dispatch("eventWall/addFavoriteEvent", route.params.id);
};

const addComment = () => {
  const newComment = {
    event_id: route.params.id,
    text: newCommentText.value,
    full_name: currentUser.value.name,
    image: currentUser.value.image,
  };
  store
    .dispatch("eventWall/addComment", newComment)
    .then((res) => {
      newCommentText.value = null;
      return store.dispatch("eventWall/setEventNotification", {
        eventId: route.params.id,
        payload: true,
      });
    })
    .then((res) => {})
    .catch((err) => {});
};

const deleteComment = (commentId) => {
  store
    .dispatch("eventWall/deleteComment", commentId)
    .then((res) => {})
    .catch((err) => {});
};

onMounted(() => {
  store
    .dispatch("eventWall/getEvent", route.params.id)
    .then((res) => {
      return store.dispatch("eventWall/getCommentsByEventId", route.params.id);
    })
    .then((res) => {})
    .catch((err) => {});
});
</script>

<template>
  <v-row align="center" class="pb-1" justify="space-between">
    <v-col class="d-flex align-center" cols="auto">
      <v-avatar color="red" size="45">
        <v-img
          :aspect-ratio="1"
          :src="getUserImageUrl(event?.image)"
          cover
        ></v-img>
      </v-avatar>

      <div class="pl-3">
        <h4>{{ event?.full_name }}</h4>
        <small
          >Posted on {{ formatDateFromTimestamp(event?.created_at) }}</small
        >
      </div>
    </v-col>
    <v-col cols="auto">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        @click="$router.back()"
      ></v-btn>
    </v-col>
  </v-row>

  <v-row justify="center">
    <v-col cols="12" md="8">
      <v-img
        :aspect-ratio="2.5"
        :src="getEventImageUrl(event?.images?.[0] || null)"
        cover
      ></v-img>

      <h2 class="mt-8">{{ event?.title }}</h2>

      <div class="mt-4">
        <div v-if="event?.date" class="d-flex">
          <v-icon class="mt-half" color="primary" size="small"
            >mdi-calendar
          </v-icon>
          <span class="ml-3">{{ formatDateFromTimestamp(event?.date) }}</span>
        </div>
        <div v-if="event?.start_time && event?.end_time" class="d-flex">
          <v-icon class="mt-half" color="primary" size="small"
            >mdi-clock
          </v-icon>
          <span class="ml-3"
            >{{ formatTimeFromTime(event?.start_time) }} -
            {{ formatTimeFromTime(event?.end_time) }}</span
          >
        </div>
        <div v-if="event?.location" class="d-flex">
          <v-icon class="mt-half" color="primary" size="small"
            >mdi-map-marker
          </v-icon>
          <span class="ml-3">{{ event?.location }}</span>
        </div>
        <div v-if="event?.category" class="d-flex">
          <v-icon class="mt-half" color="primary" size="small"
            >mdi-list-box
          </v-icon>
          <span class="ml-3">{{ event?.category }}</span>
        </div>
      </div>

      <p v-if="event?.description" class="mt-6">
        {{ event?.description }}
      </p>

      <v-row v-if="event?.images?.length > 1" class="mt-6" justify="center">
        <v-col v-for="(image, index) in event?.images" :key="index" cols="6">
          <v-img :src="getEventImageUrl(image || null)"></v-img>
        </v-col>
      </v-row>

      <div class="d-flex justify-end">
        <v-btn
          color="primary"
          icon="mdi-heart"
          variant="text"
          @click="handleFavoriteEvent"
        ></v-btn>
      </div>
    </v-col>
  </v-row>

  <!-- Comment Section -->
  <v-row class="mt-2 mt-md-4" justify="center">
    <v-col cols="12" md="8">
      <h3>Comments</h3>
      <v-divider />

      <!-- Comment Input -->
      <v-row :no-gutters="!!mobile" align="center" class="mt-2 mt-md-4">
        <v-col class="mr-2 ml-md-0" cols="auto">
          <v-avatar color="red" size="45">
            <v-img :src="getUserImageUrl(currentUser?.image)" cover></v-img>
          </v-avatar>
        </v-col>
        <v-col class="mr-2 ml-md-0">
          <v-textarea
            v-model="newCommentText"
            auto-grow
            density="compact"
            hide-details
            label="Write a comment..."
            required
            rows="1"
            variant="solo"
          ></v-textarea>
        </v-col>
        <v-col cols="auto">
          <v-btn
            :density="mobile ? 'comfortable' : 'default'"
            color="primary"
            @click="addComment"
            >Post
          </v-btn>
        </v-col>
      </v-row>

      <!-- Comments List -->
      <v-list v-if="event?.comments?.length > 0" class="mt-2 mt-md-4">
        <v-list-item
          v-for="(comment, index) in event?.comments"
          :key="index"
          class="mt-1 mt-md-3 px-0"
        >
          <v-row :no-gutters="!!mobile" align="center">
            <v-col class="mr-2 mr-md-0" cols="auto">
              <v-avatar color="red" size="45">
                <v-img :src="getUserImageUrl(comment?.image)" cover></v-img>
              </v-avatar>
            </v-col>
            <v-col>
              <v-sheet :elevation="5" class="pa-3" color="grey-lighten-3">
                <v-hover v-slot="{ isHovering, props }">
                  <div class="position-relative" v-bind="props">
                    <v-btn
                      v-if="isHovering && (isAdmin || isOwner(comment.user_id))"
                      color="error"
                      icon="mdi-close"
                      location="top end"
                      position="absolute"
                      rounded="0"
                      size="x-small"
                      variant="flat"
                      @click="deleteComment(comment.id)"
                    ></v-btn>
                    <div class="d-flex align-center">
                      <v-list-item-title class="font-weight-bold"
                        >{{ comment.full_name }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="ml-2"
                        >{{ formatDateFromTimestamp(comment.created_at) }}
                      </v-list-item-subtitle>
                    </div>
                    <p>{{ comment.text }}</p>
                  </div>
                </v-hover>
              </v-sheet>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>
<style></style>
