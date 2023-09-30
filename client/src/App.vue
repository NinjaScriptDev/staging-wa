<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const snackbars = computed(() => store.state.snackbars);

const closeSnackbar = (index) => {
  store.dispatch("removeSnackbar", index);
};
</script>
<template>
  <router-view />

  <v-snackbar
    v-for="(snackbar, index) in snackbars.filter((s) => s.show)"
    :key="index"
    v-model="snackbar.show"
    :color="snackbar.color"
    :style="`bottom: ${index * 50}px`"
    :timeout="2000"
  >
    {{ snackbar.msg }}
    <template v-slot:actions>
      <v-btn
        color="white"
        icon="mdi-close"
        variant="text"
        @click="closeSnackbar(index)"
      >
      </v-btn>
    </template>
  </v-snackbar>
</template>
<style>
body {
  font-family: "Oxygen", sans-serif;
}

.clickable {
  cursor: pointer;
}

.v-chip-0-padding {
  padding: 0 !important;
}
</style>
