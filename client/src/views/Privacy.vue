<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import PageTitle from "@/components/PageTitle.vue";

const store = useStore();
const privacy = computed(() => store.state.page.privacy);

onMounted(() => {
  store.dispatch("page/setPrivacy");
});
</script>
<template>
  <page-title :title="privacy.title"></page-title>

  <v-row class="mt-2" justify="center">
    <v-col md="7">
      <v-card>
        <v-card-text>
          {{ privacy.description }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
