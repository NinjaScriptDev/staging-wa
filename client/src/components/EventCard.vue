//types = [has-header, headerless] //source = [browse, wall, favorite, wishlist,
featured]

<script setup>
import {
  formatDate,
  formatDateFromTimestamp,
  formatMonthYear,
  formatTimeFromTime,
  getEventImageUrl,
  getUserImageUrl,
} from "@/util";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const router = useRouter();
const { event, type, source } = defineProps(["event", "type", "source"]);

const currentUser = computed(() => store.getters["cuser/getCurrentUser"]);
const isAdmin = computed(() => store.getters["cuser/isAdmin"]);
const isOwner = computed(() => event.user_id == currentUser.value.id);

const goUserProfile = () => {
  router.push({ name: "wall", params: { id: event.user_id } });
};
const handleSetFeaturedEvent = (eventId) => {
  store.dispatch("eventWall/setFeaturedEvent", { eventId });
};
const setEventNotification = (eventId) => {
  store
    .dispatch("eventWall/setEventNotification", {
      eventId: eventId,
      payload: false,
    })
    .then((res) => {
      router.push({
        name: source === "wishlist" ? "wishlistSingle" : "eventSingle",
        params: { id: event.id },
      });
    })
    .catch((err) => {});
};

const deleteEvent = (eventId) => {
  if (source === "wishlist") {
    store
      .dispatch("eventWall/deleteWishlistEvent", eventId)
      .then((res) => {})
      .catch((err) => {});
  } else {
    store
      .dispatch("eventWall/deleteEvent", eventId)
      .then((res) => {})
      .catch((err) => {});
  }
};
</script>

<template>
  <v-sheet :elevation="3" class="bg-grey-lighten-4 rounded">
    <!--      user name with date-->
    <div
      v-if="type === 'has-header'"
      class="d-flex align-center position-relative clickable pa-2"
      @click="goUserProfile"
    >
      <v-menu v-if="isAdmin || isOwner">
        <template v-slot:activator="{ props: menuProps }">
          <v-btn
            class="pa-2 rounded-0"
            color="primary"
            icon="mdi-dots-vertical"
            location="top end"
            position="absolute"
            size="x-small"
            v-bind="menuProps"
            @click.stop=""
          >
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item density="compact" link @click="deleteEvent(event.id)">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-img
        :aspect-ratio="1"
        :max-width="45"
        :src="getUserImageUrl(event?.image)"
        class="rounded-circle"
        cover
      >
      </v-img>
      <div class="ml-3">
        <h4>
          {{ event?.full_name }}
        </h4>

        <small>Posted on {{ formatDateFromTimestamp(event.created_at) }}</small>
      </div>
    </div>

    <v-img
      :class="type === 'headerless' ? 'position-relative' : ''"
      :src="getEventImageUrl(event?.images?.[0] || null)"
      aspect-ratio="2"
      class="relative"
      cover
    >
      <v-chip
        v-if="event.date"
        class="mt-4 absolute bg-white high-z-index v-chip-0-padding rounded-0"
        label
        variant="text"
      >
        <div class="d-flex">
          <div class="text-overline bg-primary pa-2">
            {{ formatDate(event.date) }}
          </div>
          <div class="text-overline text-primary pa-2">
            {{ formatMonthYear(event.date) }}
          </div>
        </div>
      </v-chip>

      <v-menu v-if="type === 'headerless' && source !== 'featured'">
        <template
          v-if="isAdmin || isOwner"
          v-slot:activator="{ props: menuProps }"
        >
          <v-btn
            class="pa-2 rounded-0"
            color="primary"
            icon="mdi-dots-vertical"
            location="top end"
            position="absolute"
            size="x-small"
            v-bind="menuProps"
          >
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item
            v-if="isAdmin || isOwner"
            density="compact"
            link
            @click="deleteEvent(event.id)"
          >
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="isOwner && source === 'wall'"
            density="compact"
            link
          >
            <v-list-item-title @click="handleSetFeaturedEvent(event.id)"
              >Feature
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-img>

    <div class="pa-3">
      <div class="text-primary text-overline">
        {{ event.category }}
      </div>
      <h4 class="mb-2">{{ event.title }}</h4>
      <div v-if="event.start_time" class="d-flex align-center">
        <v-icon class="mr-2" color="primary" size="small">mdi-clock</v-icon>
        <span>{{ formatTimeFromTime(event.start_time) }}</span>
        <span v-if="event.end_time">
          - {{ formatTimeFromTime(event.end_time) }}</span
        >
      </div>
      <div v-if="event.location" class="d-flex align-center">
        <v-icon class="mr-2" color="primary" size="small"
          >mdi-map-marker
        </v-icon>
        <span>{{ event.location }}</span>
      </div>

      <div class="d-flex justify-space-between">
        <v-btn
          :to="{
            name: source === 'wishlist' ? 'wishlistSingle' : 'eventSingle',
            params: { id: event.id },
          }"
          class="mt-4"
          density="comfortable"
          variant="tonal"
          >More Details
        </v-btn>

        <!--        only show in own wall page-->
        <v-btn
          v-if="
            event.new_notification &&
            source === 'wall' &&
            $route.params.id === currentUser?.id
          "
          icon
          variant="text"
          @click="setEventNotification(event.id)"
        >
          <v-badge color="primary" dot>
            <v-icon icon="mdi-bell-outline"></v-icon>
          </v-badge>
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped></style>
