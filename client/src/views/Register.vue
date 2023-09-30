<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Event from "@/model/event";
import { formatTimeFromDate, getCountryList, isValidEmail } from "@/util";
import Cuser from "@/model/cuser";
import PageTitle from "@/components/PageTitle.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const store = useStore();
const router = useRouter();
const fullName = ref("Max Payne");
const email = ref("raf.utb@gmail.com");
const password = ref("asdfas");
const confirmPassword = ref("asdfas");
const dateOfBirth = ref("1990-01-23");
const selectedCountry = ref("Indonesia");
const form = ref(null);
const isFormValid = ref(true);

const currentUser = computed(() => store.getters["cuser/getCurrentUser"]);

const isValidDOB = (dateOfBirth) => {
  const currentDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(currentDate.getFullYear() - 13);

  const inputDate = new Date(dateOfBirth);
  return inputDate <= minDate;
};

const registerUser = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  const cuser = new Cuser(
    fullName.value,
    email.value,
    password.value,
    dateOfBirth.value,
    selectedCountry.value
  );
  $axios
    .post("/api/user/register", cuser)
    .then((response) => {
      const newFriendsCount = response.data?.payload?.newFriendsCount;
      if (newFriendsCount) {
        store.dispatch("setSnackbar", {
          msg: `You've accepted ${newFriendsCount} new friend invitation!`,
          color: "success",
        });
      }

      // set authentication
      store.commit("cuser/setToken", response.headers?.authorization);
      store.commit("cuser/setCurrentUser", response.data?.payload?.currentUser);

      // add event
      const event = new Event(
        "Joined WayzAway!",
        new Date(),
        formatTimeFromDate(new Date()),
        null,
        selectedCountry.value,
        null,
        "Registration",
        null,
        false,
        null
      );

      return store.dispatch("eventWall/addEvent", event);
    })
    .then((res) => {
      router.push({
        name: "wall",
        params: { id: currentUser.value.id },
      });
    })
    .catch((err) => {});
};
</script>
<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="5">
        <page-title justify="center" title="Registration"></page-title>
        <v-card
          class="pa-2 pa-md-5 my-2 my-md-5 d-block mx-auto"
          color="grey-lighten-3"
          elevation="4"
          max-width="500"
        >
          <v-card-text>
            <v-form
              ref="form"
              v-model="isFormValid"
              fast-fail
              @submit.prevent="registerUser"
            >
              <!-- Full Name -->
              <v-text-field
                v-model="fullName"
                :rules="[(v) => !!v || 'Full Name is required!']"
                class="mt-2 mt-md-4"
                clearable
                density="compact"
                hide-details="auto"
                label="Full Name"
                required
                variant="solo"
              ></v-text-field>

              <!-- Email Address -->
              <v-text-field
                v-model="email"
                :rules="[
                  (v) => !!v || 'Email is required!',
                  (v) => isValidEmail(v) || 'Invalid Email',
                ]"
                class="mt-2 mt-md-4"
                clearable
                density="compact"
                hide-details="auto"
                label="Email Address"
                required
                variant="solo"
              ></v-text-field>

              <!-- Password -->
              <v-text-field
                v-model="password"
                :rules="[
                  (v) => !!v || 'Password is required!',
                  (v) => v.length >= 6 || 'Password must be 6 or more chars!',
                ]"
                class="mt-2 mt-md-4"
                clearable
                density="compact"
                hide-details="auto"
                label="Password"
                required
                type="password"
                variant="solo"
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                :rules="[
                  (v) => !!v || 'Confirm Password is required!',
                  (v) => v === password || 'Confirm password didn\'t match!',
                ]"
                class="mt-2 mt-md-4"
                clearable
                density="compact"
                hide-details="auto"
                label="Confirm Password"
                required
                type="password"
                variant="solo"
              ></v-text-field>

              <v-text-field
                v-model="dateOfBirth"
                :rules="[
                  (v) => !!v || 'DOB is required!',
                  (v) => isValidDOB(v) || 'Must be 13 years old!',
                ]"
                class="mt-2 mt-md-4"
                density="compact"
                hide-details="auto"
                label="Date of Birth"
                required
                type="date"
                variant="solo"
              ></v-text-field>

              <v-select
                v-model="selectedCountry"
                :items="getCountryList('name')"
                class="mt-2 mt-md-4"
                density="compact"
                hide-details="auto"
                label="Country"
                required
                variant="solo"
              ></v-select>

              <div class="pb-3 pl-1 mt-3">
                By signing up, you agree to the
                <span
                  class="clickable mt-5 text-center text-blue"
                  @click="router.push({ name: 'terms' })"
                >
                  Terms of Service
                </span>
              </div>

              <!-- Register Button -->
              <v-btn
                :density="mobile ? 'comfortable' : 'default'"
                block
                color="primary"
                @click="registerUser"
                >Register
              </v-btn>
              <div
                class="clickable mt-3 text-center text-blue"
                @click="router.push({ name: 'signin' })"
              >
                Already registered?
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
