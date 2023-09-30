<script setup>
import { getToLink } from "@/util";

const items = [
  { title: "Home", to: { name: "landing" } },
  { title: "Blog", to: { name: "blog" } },
  { title: "About", to: { name: "about" } },
  { title: "T&C", to: { name: "terms" } },
  { title: "Privacy", to: { name: "privacy" } },
];
</script>
<template>
  <v-footer app class="bg-grey-lighten-3">
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="(item, index) in items"
        :key="index"
        :to="getToLink(item)"
        class="mx-md-2"
        color="primary"
        exact
        rounded
        size="small"
        variant="text"
      >
        {{ item.title }}
      </v-btn>
      <v-col class="text-center mt-1" cols="12">
        <small>
          &copy; {{ new Date().getFullYear() }} — <strong>WayzAway</strong>
        </small>
      </v-col>
    </v-row>
  </v-footer>
</template>
