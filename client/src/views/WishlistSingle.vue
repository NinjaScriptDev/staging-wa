<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  formatDateFromTimestamp,
  getEventImageUrl,
  getUserImageUrl,
} from "@/util";

const route = useRoute();
const store = useStore();
const event = computed(() => store.state.eventWall.event);

onMounted(() => {
  store
    .dispatch("eventWall/setWishlistEvent", route.params.id)
    .then((res) => {})
    .catch((err) => {});
});
</script>

<style lang=""></style>
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
  <v-divider class="my-2"></v-divider>
  <v-row justify="center">
    <v-col cols="8">
      <v-img
        :aspect-ratio="3"
        :src="getEventImageUrl(event?.images?.[0] || null)"
        cover
      ></v-img>
      <h2 class="mt-8">Title: {{ event?.title }}</h2>

      <div class="mt-4">
        <div v-if="event?.location" class="d-flex">
          <v-icon class="mt-half" color="primary" size="small"
            >mdi-map-marker
          </v-icon>
          <span class="ml-3">Location: {{ event?.location }}</span>
        </div>
        <div v-if="event?.category" class="d-flex">
          <v-icon class="mt-half" color="primary" size="small"
            >mdi-list-box
          </v-icon>
          <span class="ml-3">Category: {{ event?.category }}</span>
        </div>
      </div>

      <p v-if="event?.description" class="mt-6">
        Description: {{ event?.description }}
      </p>
    </v-col>
  </v-row>
</template>
