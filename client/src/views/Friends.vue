<script setup>
import NameCard from "@/components/NameCard.vue";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import emailjs from "emailjs-com";
import {
  apiBaseUrl,
  emailJS_serviceId,
  emailJS_templateId,
  emailJS_userId,
  isValidEmail,
} from "@/util";
import PageTitle from "@/components/PageTitle.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const store = useStore();

const friends = computed(() => store.state.cuser.friends);
const currentUser = computed(() => store.getters["cuser/getCurrentUser"]);

const form = ref(null);
const isFormValid = ref(true);

const dialog = ref(false);
const email = ref(null);
const message = ref(null);

const sendInvite = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  const invitation = {
    email: email.value,
    message: message.value,
  };
  store
    .dispatch("cuser/sendInvite", invitation)
    .then((result) => {
      return emailjs.send(
        emailJS_serviceId,
        emailJS_templateId,
        {
          from_name: currentUser.value.name,
          message: message.value,
          apiBaseUrl: apiBaseUrl,
          from_id: result.data.payload.id,
          token: result.data.payload.token,
          to_email: email.value,
          reply_to: "no-reply@wayzaway.com",
        },
        emailJS_userId
      );
    })
    .then((res) => {
      return store.dispatch("setSnackbar", {
        msg: "Invitation sent successfully",
        color: "success",
      });
    })
    .then((res) => {
      email.value = null;
      message.value = null;
      dialog.value = false;
    })
    .catch((err) => {
      store.dispatch("setSnackbar", {
        msg: err.response?.data?.msg || "Invitation sending failed!",
        color: "error",
      });
    });
};

const removeFriend = (friendship_id) => {
  store.dispatch("cuser/removeFriend", friendship_id);
};
onMounted(() => {
  store.dispatch("cuser/setFriends");
});
</script>

<template>
  <v-row justify="center">
    <!-- Main content -->
    <v-col cols="12">
      <page-title :title="`Friends (${friends.length})`">
        <v-dialog v-model="dialog" width="600">
          <template v-slot:activator="{ props }">
            <v-btn
              :density="mobile ? 'comfortable' : 'default'"
              v-bind="props"
              variant="flat"
            >
              <template v-slot:prepend>
                <v-icon color="primary">mdi-plus</v-icon>
              </template>
              Invite a friend
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              <span>Invite friend</span>
            </v-card-title>
            <v-card-text>
              <v-form
                ref="form"
                v-model="isFormValid"
                fast-fail
                @submit.prevent="sendInvite"
              >
                <v-text-field
                  v-model="email"
                  :rules="[
                    (v) => !!v || 'Email is required!',
                    (v) => isValidEmail(v) || 'Invalid Email',
                  ]"
                  class="mt-2"
                  clearable
                  density="compact"
                  hide-details="auto"
                  label="Recipient Email"
                  required
                  variant="solo"
                ></v-text-field>

                <v-textarea
                  v-model="message"
                  class="mt-2"
                  clearable
                  hide-details="auto"
                  label="Message"
                  rows="2"
                  variant="solo"
                ></v-textarea>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :density="mobile ? 'comfortable' : 'default'"
                    color="primary"
                    type="submit"
                    >Submit
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </page-title>

      <v-row justify="center">
        <v-col cols="12" md="5">
          <v-list>
            <v-list-item v-for="(item, index) in friends" :key="index" link>
              <div
                class="d-flex justify-space-between align-center"
                @click="$router.push({ name: 'wall', params: { id: item.id } })"
              >
                <name-card
                  :profile="item"
                  container-class="clickable"
                  img-class="rounded-circle"
                ></name-card>
                <v-btn
                  class="ml-2"
                  color="primary"
                  density="comfortable"
                  variant="flat"
                  @click.stop="removeFriend(item.friendship_id)"
                  >Remove
                </v-btn>
              </div>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<style scoped></style>
