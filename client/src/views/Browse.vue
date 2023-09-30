<script setup>
import EventCard from "@/components/EventCard.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import EventCardSm from "@/components/EventCardSm.vue";
import FindEventForm from "@/components/FindEventForm.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const store = useStore();
const router = useRouter();
const browseEvents = computed(() => store.state.eventWall.events);
const foundEvents = computed(() => store.state.eventWall.foundEvents);
const allEventCategories = computed(() =>
  store.state.category.categories.map((item) => item.name)
);
const upcomingEvents = computed(() => store.state.eventWall.upcomingEvents);

const selectedCategory_sidebar = ref(null);
const eventSource = ref([]);

const filterByCategory = (category) => {
  selectedCategory_sidebar.value = category;
};

const mountedEventCategories = computed(
  () => store.getters["eventWall/getMountedEventCategories"]
);

const fetchData = () => {
  store
    .dispatch("eventWall/setBrowseEvents")
    .then((res) => {
      eventSource.value = browseEvents.value;
      return store.dispatch("category/setCategories");
    })
    .then((res) => {
      return store.dispatch("eventWall/getUpcomingEvents", {
        userId: store.getters["cuser/getCurrentUserId"],
        source: "friends",
      });
    })
    .catch((err) => {});
};
watch(
  () => foundEvents.value,
  (newItem, oldItem) => {
    selectedCategory_sidebar.value = null;
    eventSource.value = foundEvents.value;
  }
);
watch(
  () => selectedCategory_sidebar.value,
  (newItem, oldItem) => {
    eventSource.value = browseEvents.value.filter(
      (event) => event.category === selectedCategory_sidebar.value
    );
  }
);
onMounted(() => {
  fetchData();
});
</script>

<template>
  <!-- Sidebar -->
  <v-row :no-gutters="!!mobile">
    <!-- Sidebar -->
    <v-col cols="12" md="3" order-md="2">
      <!--        for mobile screen-->
      <div v-if="mobile">
        <v-expansion-panels class="mb-4">
          <v-expansion-panel>
            <v-expansion-panel-title>Event Categories</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list
                v-if="mountedEventCategories.length > 0"
                class="bg-grey-lighten-3"
                density="compact"
              >
                <v-list-item
                  v-for="(category, index) in mountedEventCategories"
                  :key="index"
                  :class="{
                    'v-list-item--active':
                      category === selectedCategory_sidebar,
                  }"
                  class="pa-0"
                  @click="filterByCategory(category)"
                >
                  <v-icon
                    class="d-inline"
                    color="primary"
                    icon="mdi-circle-small"
                  ></v-icon>
                  <v-list-item-title class="d-inline"
                    >{{ category }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
              <div v-else>
                <small>No category found</small>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>Upcoming Events</v-expansion-panel-title>
            <v-expansion-panel-text>
              <div
                v-for="(event, index) in upcomingEvents"
                v-if="upcomingEvents?.length > 0"
                :key="index"
              >
                <event-card-sm :event="event"></event-card-sm>
                <v-divider class="my-2"></v-divider>
              </div>
              <div v-else><small>No upcoming events found</small></div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <!--        for large screen-->
      <div v-else>
        <!-- Categories Section -->
        <v-sheet
          :elevation="0"
          class="pa-4 pt-4 mb-5 bg-grey-lighten-3 rounded"
        >
          <h3 class="pb-3 font-weight-bold">Event Categories</h3>
          <!-- Category List -->
          <v-list
            v-if="mountedEventCategories.length > 0"
            class="bg-grey-lighten-3"
            density="compact"
          >
            <v-list-item
              v-for="(category, index) in mountedEventCategories"
              :key="index"
              :class="{
                'v-list-item--active': category === selectedCategory_sidebar,
              }"
              class="pa-0"
              @click="filterByCategory(category)"
            >
              <v-icon
                class="d-inline"
                color="primary"
                icon="mdi-circle-small"
              ></v-icon>
              <v-list-item-title class="d-inline"
                >{{ category }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <div v-else>
            <small>No category found</small>
          </div>
        </v-sheet>

        <!-- Upcoming Events Section -->
        <v-sheet
          :elevation="0"
          class="pa-4 mb-2 mb-md-5 bg-grey-lighten-3 rounded"
        >
          <h3 class="pb-3 font-weight-bold">Upcoming Events</h3>
          <div
            v-for="(event, index) in upcomingEvents"
            v-if="upcomingEvents?.length > 0"
            :key="index"
          >
            <event-card-sm :event="event"></event-card-sm>
            <v-divider class="my-2"></v-divider>
          </div>
          <div v-else><small>No upcoming events found</small></div>
        </v-sheet>
      </div>
    </v-col>

    <!-- Main content -->
    <v-col cols="12" md="9" order-md="1">
      <!-- Filter Form -->
      <find-event-form></find-event-form>

      <!-- Event Posts Feed -->
      <v-row v-if="eventSource?.length > 0">
        <v-col
          v-for="(event, index) in eventSource"
          :key="index"
          class="mb-md-4"
          cols="12"
          sm="6"
        >
          <event-card
            :event="event"
            source="browse"
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
