<script setup>
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const { customClass } = defineProps(["customClass"]);
</script>

<template>
  <div :class="`d-flex align-center ${customClass}`">
    <div style="width: 28px">
      <v-img src="@/assets/img/Logo.png"></v-img>
    </div>

    <div class="pl-2">
      <h2 v-if="mobile">
        <span class="text-primary">Wayz</span>
        <span class="text-secondary pl-1">Away</span>
      </h2>
      <h1 v-else>
        <span class="text-primary">Wayz</span>
        <span class="text-secondary pl-1">Away</span>
      </h1>
    </div>
  </div>
</template>

<style scoped></style>
