<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import EventCard from "@/components/EventCard.vue";
import NameCard from "@/components/NameCard.vue";
import EventCardSm from "@/components/EventCardSm.vue";
import Event from "@/model/event";
import FindEventForm from "@/components/FindEventForm.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const router = useRouter();
const route = useRoute();
const store = useStore();

const currentUser = store.getters["cuser/getCurrentUser"];
const dialog = ref(false);

const newEventTitle = ref("Aus vs Eng");
const newEventLocation = ref("London");
const newEventDescription = ref(
  "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum "
);
const newEventSelectedCategory = ref("Sports");
const newEventDate = ref("2023-08-10");
const newEventStartTime = ref("14:30:00");
const newEventEndTime = ref("16:30:00");
const newEventImages = ref([]);

const form = ref(null);
const isFormValid = ref(true);

const handleEventImageChange = (files) => {
  newEventImages.value = Array.from(files);
};

const addEvent = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  const event = new Event(
    newEventTitle.value,
    newEventDate.value,
    newEventStartTime.value,
    newEventEndTime.value,
    newEventLocation.value,
    newEventDescription.value,
    newEventSelectedCategory.value
  );

  const formData = new FormData();
  formData.append("title", newEventTitle.value);
  formData.append("date", newEventDate.value);
  formData.append("start_time", newEventStartTime.value);
  formData.append("end_time", newEventEndTime.value);
  formData.append("location", newEventLocation.value);
  formData.append("description", newEventDescription.value);
  formData.append("category", newEventSelectedCategory.value);
  newEventImages.value.forEach((file) => {
    formData.append("files", file);
  });

  formData.append("is_featured", false);

  store
    .dispatch("eventWall/addEvent", formData)
    .then((response) => {
      dialog.value = false;
    })
    .catch((err) => {});
};

const wallEvents = computed(() => store.state.eventWall.events);
const foundEvents = computed(() => store.state.eventWall.foundEvents);
const user = computed(() => store.state.eventWall.user);
const featuredEvent = computed(() => store.state.eventWall.featuredEvent);
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
    .dispatch("eventWall/setWallEvents", route.params.id)
    .then((res) => {
      eventSource.value = wallEvents.value;
      return store.dispatch("eventWall/getUserById", route.params.id);
    })
    .then((res) => {
      return store.dispatch("eventWall/getFeaturedEvent", route.params.id);
    })
    .then((res) => {
      return store.dispatch("category/setCategories");
    })
    .then((res) => {
      return store.dispatch("eventWall/getUpcomingEvents", {
        userId: route.params.id,
        source: "own",
      });
    })
    .catch((err) => {});
};
watch(
  () => route.params.id,
  (newItem, oldItem) => {
    fetchData();
  }
);
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
    eventSource.value = wallEvents.value.filter(
      (event) => event.category === selectedCategory_sidebar.value
    );
  }
);
onMounted(() => {
  fetchData();
});
</script>

<template>
  <!-- New Event Button -->
  <div class="d-flex justify-space-between align-center">
    <name-card :imgSize="80" :profile="user" img-class="rounded-xl"></name-card>

    <v-divider v-if="mobile" inset vertical></v-divider>

    <v-dialog
      v-if="route.params.id == currentUser.id"
      v-model="dialog"
      width="600"
    >
      <template v-slot:activator="{ props }">
        <!--          :density="mobile ? 'compact' : 'default'"-->
        <v-btn
          v-if="mobile"
          color="primary"
          density="compact"
          icon="mdi-plus-circle-outline"
          v-bind="props"
          variant="text"
        >
        </v-btn>
        <v-btn v-else color="primary" v-bind="props">Add Event </v-btn>
      </template>

      <v-card>
        <v-card-title>
          <span>Add Event</span>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="isFormValid"
            fast-fail
            @submit.prevent="addEvent"
          >
            <v-text-field
              v-model="newEventTitle"
              :rules="[(v) => !!v || 'Title is required!']"
              class="mt-2"
              clearable
              density="compact"
              hide-details="auto"
              label="Title"
              required
              variant="solo"
            ></v-text-field>

            <v-text-field
              v-model="newEventLocation"
              :rules="[(v) => !!v || 'Location is required!']"
              class="mt-2"
              clearable
              density="compact"
              hide-details="auto"
              label="Location"
              required
              variant="solo"
            ></v-text-field>

            <v-textarea
              v-model="newEventDescription"
              :rules="[(v) => !!v || 'Description is required!']"
              class="mt-2"
              clearable
              hide-details="auto"
              label="Description"
              rows="2"
              variant="solo"
            ></v-textarea>
            <v-row :no-gutters="!!mobile">
              <v-col class="mt-2" cols="12" md="6">
                <v-select
                  v-model="newEventSelectedCategory"
                  :items="allEventCategories"
                  :rules="[(v) => !!v || 'Category is required!']"
                  clearable
                  density="compact"
                  hide-details="auto"
                  label="Category"
                  required
                  variant="solo"
                ></v-select>
              </v-col>
              <v-col class="mt-2" cols="12" md="6">
                <v-text-field
                  v-model="newEventDate"
                  :rules="[(v) => !!v || 'Date is required!']"
                  density="compact"
                  hide-details="auto"
                  label="Date"
                  required
                  type="date"
                  variant="solo"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row :no-gutters="!!mobile">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newEventStartTime"
                  :rules="[(v) => !!v || 'Start Time is required!']"
                  class="mt-2"
                  density="compact"
                  hide-details="auto"
                  label="Start Time"
                  required
                  type="time"
                  variant="solo"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="newEventEndTime"
                  :rules="[(v) => !!v || 'End Time is required!']"
                  class="mt-2"
                  density="compact"
                  hide-details="auto"
                  label="End Time"
                  required
                  type="time"
                  variant="solo"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-file-input
              v-model="newEventImages"
              accept="image/*"
              class="mt-2"
              clearable
              density="compact"
              label="Upload Image"
              multiple
              prepend-icon=""
              prepend-inner-icon="mdi-camera"
              variant="solo"
              @update:modelValue="handleEventImageChange"
            >
              <template v-slot:selection="{ fileNames }">
                <template v-for="fileName in fileNames" :key="fileName">
                  <v-chip class="me-2" color="primary" label size="small">
                    {{ fileName }}
                  </v-chip>
                </template>
              </template>
            </v-file-input>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :density="mobile ? 'compact' : 'default'"
                color="primary"
                type="submit"
                >Add
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
  <v-divider class="my-3"></v-divider>

  <v-row :no-gutters="!!mobile">
    <!-- Sidebar -->
    <v-col cols="12" md="3" order-md="2">
      <!--        for mobile screen-->
      <div v-if="mobile">
        <v-expansion-panels class="mb-4">
          <v-expansion-panel>
            <v-expansion-panel-title>Featured Event</v-expansion-panel-title>
            <v-expansion-panel-text>
              <event-card
                v-if="featuredEvent?.id"
                :event="featuredEvent"
                source="featured"
                type="headerless"
              ></event-card>
              <div v-else>
                <small>No featured event found</small>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
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
        <!-- Featured event -->
        <v-sheet :elevation="0" class="pa-4 mb-5 bg-grey-lighten-3 rounded">
          <h3 class="pb-3 font-weight-bold">Featured Event</h3>

          <event-card
            v-if="featuredEvent?.id"
            :event="featuredEvent"
            source="featured"
            type="headerless"
          ></event-card>
          <div v-else>
            <small>No featured event found</small>
          </div>
        </v-sheet>

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
            source="wall"
            type="headerless"
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
