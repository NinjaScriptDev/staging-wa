<script setup>
import EventCard from "@/components/EventCard.vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Event from "@/model/event";
import PageTitle from "@/components/PageTitle.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const store = useStore();
const router = useRouter();

const allEventCategories = computed(() =>
  store.state.category.categories.map((item) => item.name)
);
const events = computed(() => store.state.eventWall.events);
const dialog = ref(false);

const form = ref(null);
const isFormValid = ref(true);

const newEventTitle = ref(null);
const newEventLocation = ref(null);
const newEventDescription = ref(null);
const newEventSelectedCategory = ref(null);

const addNewEvent = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  const event = new Event(
    newEventTitle.value,
    null,
    null,
    null,
    newEventLocation.value,
    newEventDescription.value,
    newEventSelectedCategory.value,
    null,
    null,
    null
  );
  store
    .dispatch("eventWall/addWishlistEvent", event)
    .then((response) => {
      dialog.value = false;
    })
    .catch((err) => {});
};

onMounted(() => {
  store
    .dispatch("eventWall/setWishlistEvents")
    .then((res) => {
      return store.dispatch("category/setCategories");
    })
    .catch((err) => {});
});
</script>

<template>
  <v-row>
    <!-- Main content -->
    <v-col cols="12">
      <page-title title="Wishlist">
        <v-dialog v-model="dialog" width="600">
          <template v-slot:activator="{ props }">
            <v-btn
              v-if="mobile"
              color="primary"
              density="compact"
              icon="mdi-plus-circle-outline"
              v-bind="props"
              variant="text"
            >
            </v-btn>
            <v-btn v-else color="primary" v-bind="props"> Add Event</v-btn>
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
                @submit.prevent="addNewEvent"
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

                <v-select
                  v-model="newEventSelectedCategory"
                  :items="allEventCategories"
                  :rules="[(v) => !!v || 'Category is required!']"
                  class="mt-2"
                  clearable
                  density="compact"
                  hide-details="auto"
                  label="Category"
                  required
                  variant="solo"
                ></v-select>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :density="mobile ? 'comfortable' : 'default'"
                    color="primary"
                    type="submit"
                    >Add
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </page-title>

      <!-- Event Card Feed -->
      <v-row v-if="events?.length > 0">
        <v-col
          v-for="(event, index) in events"
          :key="index"
          class="mb-md-4"
          cols="12"
          md="4"
          sm="6"
        >
          <event-card
            :event="event"
            source="wishlist"
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
