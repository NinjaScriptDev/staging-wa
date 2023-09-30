<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { isValidEmail } from "@/util";
import PageTitle from "@/components/PageTitle.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const store = useStore();
const router = useRouter();

const email = ref("asdf@asdf.com");
const password = ref("asdfas");
const currentUser = computed(() => store.getters["cuser/getCurrentUser"]);

const form = ref(null);
const isFormValid = ref(true);

const signinUser = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  store
    .dispatch("cuser/signin", {
      email: email.value,
      password: password.value,
    })
    .then((res) => {
      if (currentUser.value.role === "user") {
        router.push({
          name: "wall",
          params: { id: currentUser.value.id },
        });
      } else if (currentUser.value.role === "admin") {
        router.push({
          name: "adminDashboard",
        });
      }
    })
    .catch((err) => {});
};
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="4">
        <page-title justify="center" title="Sign In"></page-title>
        <v-card
          class="mx-auto pa-2 pa-md-5 my-2 my-md-5"
          color="grey-lighten-3"
          elevation="4"
          max-width="500"
        >
          <v-card-text>
            <v-form
              ref="form"
              v-model="isFormValid"
              fast-fail
              @submit.prevent="signinUser"
            >
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
                prepend-inner-icon="mdi-account"
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
                prepend-inner-icon="mdi-lock"
                required
                type="password"
                variant="solo"
              ></v-text-field>

              <div class="d-flex align-center mt-2 mt-md-5">
                <div
                  class="clickable text-center text-blue"
                  @click="router.push({ name: 'register' })"
                >
                  No Account?
                </div>
                <v-spacer></v-spacer>
                <v-btn
                  :density="mobile ? 'comfortable' : 'default'"
                  color="primary"
                  type="submit"
                  >Sign In
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
