<script setup>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getUserImageUrl, isValidEmail } from "@/util";
import PageTitle from "@/components/PageTitle.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const router = useRouter();
const store = useStore();

const profile = computed(() => store.state.cuser.profile);

const fullname = ref(profile.value?.full_name);
const newEmail = ref(profile.value?.email);
const newPassword = ref(null);
const newProfilePicture = ref(null);

const handleEventImageChange = (files) => {
  newProfilePicture.value = files;
};

const form = ref(null);
const isFormValid = ref(true);

const updateProfile = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  const formData = new FormData();
  formData.append("full_name", fullname.value);
  formData.append("email", newEmail.value);
  if (newPassword.value) {
    formData.append("password", newPassword.value);
  }
  formData.append("file", newProfilePicture.value?.[0]);
  store
    .dispatch("cuser/updateProfile", formData)
    .then((response) => {})
    .catch((err) => {});
};

const deleteAccount = () => {
  store
    .dispatch("cuser/deleteAccount")
    .then((response) => {
      router.push({ name: "signout" });
    })
    .catch((err) => {});
};

onMounted(() => {
  store.dispatch("cuser/setProfile").then((res) => {
    fullname.value = profile.value?.full_name;
    newEmail.value = profile.value?.email;
  });
});
</script>
<template>
  <page-title title="Settings"></page-title>

  <v-row justify="center">
    <v-col cols="12" md="5">
      <h3 class="mt-5">Update profile</h3>
      <v-divider></v-divider>

      <v-form
        ref="form"
        v-model="isFormValid"
        class="mt-5"
        fast-fail
        @submit.prevent="updateProfile"
      >
        <v-text-field
          v-model="fullname"
          :rules="[(v) => !!v || 'Full Name is required!']"
          class="mt-3"
          clearable
          density="compact"
          hide-details="auto"
          label="Full Name"
          variant="solo"
        ></v-text-field>
        <v-text-field
          v-model="newEmail"
          :rules="[
            (v) => !!v || 'Email is required!',
            (v) => isValidEmail(v) || 'Invalid Email',
          ]"
          class="mt-3"
          clearable
          density="compact"
          hide-details="auto"
          label="Email Address"
          variant="solo"
        ></v-text-field>
        <v-text-field
          v-model="newPassword"
          class="mt-3"
          clearable
          density="compact"
          hide-details="auto"
          label="New Password"
          type="password"
          variant="solo"
        ></v-text-field>
        <div class="d-flex align-center mt-3">
          <v-avatar
            :image="getUserImageUrl(profile?.image)"
            rounded
            size="x-large"
          ></v-avatar>
          <v-file-input
            v-model="newProfilePicture"
            accept="image/*"
            class="ml-2"
            density="compact"
            hide-details="auto"
            label="Profile picture"
            prepend-icon=""
            prepend-inner-icon="mdi-camera"
            show-size
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
        </div>

        <v-btn
          :density="mobile ? 'comfortable' : 'default'"
          class="ml-auto mt-5 d-block"
          color="primary"
          type="submit"
          >Update Profile
        </v-btn>
      </v-form>
    </v-col>
  </v-row>

  <v-row align="center" class="mt-2 mt-md-5" justify="center">
    <v-col cols="12" md="5">
      <v-divider></v-divider>
      <v-row align="center" class="mt-1" justify="center">
        <v-col cols="auto"> Do you want to delete your account?</v-col>
        <v-col cols="auto">
          <v-btn
            :density="mobile ? 'comfortable' : 'default'"
            class="text-capitalize"
            color="error"
            variant="text"
            @click="deleteAccount"
            >Delete Account
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<style></style>
