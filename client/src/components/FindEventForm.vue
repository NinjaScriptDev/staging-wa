<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const store = useStore();
const form = ref(null);
const isFormValid = ref(true);

const findStartDate = ref(null);
const findEndDate = ref(null);
const findCategory = ref(null);

const allEventCategories = computed(() =>
  store.state.category.categories.map((item) => item.name)
);

const handleFindEvents = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  store
    .dispatch("eventWall/findEvents", {
      offset: 0,
      startDate: findStartDate.value,
      endDate: findEndDate.value,
      category: findCategory.value,
    })
    .then((res) => {})
    .catch((err) => {});
};
const resetForm = () => {
  form.value.reset();
};
</script>

<template>
  <v-sheet class="pa-3 mb-4 bg-grey-lighten-3 rounded">
    <v-form ref="form" v-model="isFormValid" @submit.prevent="handleFindEvents">
      <v-row align="center" no-gutters>
        <v-col class="d-flex" cols="12" md="10">
          <v-row no-gutters>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="findStartDate"
                :rules="[(v) => !!v || 'Start Date is required!']"
                class="mb-3 mb-md-0 mr-0 mr-md-2"
                density="compact"
                hide-details="auto"
                label="Start Date"
                required
                type="date"
                variant="solo"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="findEndDate"
                :rules="[
                  (v) => !!v || 'End Date is required!',
                  (v) =>
                    findStartDate < findEndDate ||
                    'Start Date must be less than End Date!',
                ]"
                class="mb-3 mb-md-0 mr-0 mr-md-2"
                density="compact"
                hide-details="auto"
                label="End Date"
                required
                type="date"
                variant="solo"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="findCategory"
                :items="allEventCategories"
                :rules="[(v) => !!v || 'Event is required!']"
                class="mb-3 mb-md-0 mr-0 mr-md-2"
                density="compact"
                hide-details="auto"
                label="Category"
                required
                variant="solo"
              ></v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="text-center d-flex" cols="12" md="2">
          <v-btn
            :density="mobile ? 'comfortable' : 'default'"
            class="mr-1 rounded flex-grow-1"
            color="primary"
            icon="mdi-magnify"
            type="submit"
          >
          </v-btn>
          <v-btn
            :density="mobile ? 'comfortable' : 'default'"
            class="ml-2 ml-md-0 rounded flex-grow-1"
            color="primary"
            icon="mdi-restore"
            @click="resetForm"
          >
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<style scoped></style>
