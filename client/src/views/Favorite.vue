<script setup>
import EventCard from "@/components/EventCard.vue";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import PageTitle from "@/components/PageTitle.vue";

const store = useStore();
const router = useRouter();
const events = computed(() => store.state.eventWall.events);

onMounted(() => {
  store.dispatch("eventWall/getFavoriteEvents").then((res) => {});
});
</script>

<template>
  <v-row>
    <!-- Main content -->
    <v-col cols="12">
      <page-title title="Favorite"></page-title>

      <!-- Event Card Feed -->
      <v-row v-if="events?.length > 0">
        <v-col
          v-for="event in events"
          :key="event.id"
          class="mb-md-4"
          cols="12"
          md="4"
          sm="6"
        >
          <event-card
            :event="event"
            source="favorite"
            type="has-header"
          ></event-card>
        </v-col>
      </v-row>
      <v-row v-else align="center" class="fill-height" justify="center">
        <v-col cols="auto"><h3>No events found!</h3></v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<style scoped></style>
