<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import PageTitle from "@/components/PageTitle.vue";

const store = useStore();
const about = computed(() => store.state.page.about);

onMounted(() => {
  store.dispatch("page/setAbout");
});
</script>
<template>
  <page-title :title="about.title"></page-title>

  <v-row class="mt-2" justify="center">
    <v-col md="7">
      <v-card>
        <v-card-text>
          {{ about.description }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
