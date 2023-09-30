<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import PageTitle from "@/components/PageTitle.vue";

const store = useStore();
const terms = computed(() => store.state.page.terms);

onMounted(() => {
  store.dispatch("page/setTerms");
});
</script>
<template>
  <page-title :title="terms.title"></page-title>

  <v-row class="mt-2" justify="center">
    <v-col md="7">
      <v-card>
        <v-card-text>
          {{ terms.description }}
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
