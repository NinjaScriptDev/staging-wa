<script setup>
import { computed, onMounted } from "vue";
import { formatDateFromTimestamp, getBlogImageUrl } from "@/util";
import { useStore } from "vuex";
import PageTitle from "@/components/PageTitle.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const store = useStore();
const blogs = computed(() => store.state.blog.blogs);

onMounted(() => {
  store.dispatch("blog/setBlogs");
});
</script>
<template>
  <page-title title="Blog"></page-title>

  <!-- Blog Post List -->
  <v-row class="mt-5" justify="center">
    <v-col cols="12" md="7">
      <v-card v-for="(item, index) in blogs" :key="index" class="mb-5">
        <v-img
          :src="getBlogImageUrl(item.image)"
          aspect-ratio="2.5"
          cover
        ></v-img>
        <v-card-title class="mt-3">{{ item.title }}</v-card-title>
        <v-card-subtitle
          >Posted on
          {{ formatDateFromTimestamp(item.created_at) }}
        </v-card-subtitle>
        <v-card-text>
          {{ item.description }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            :density="mobile ? 'compact' : 'default'"
            :to="{ name: 'blogSingle', params: { id: item.id } }"
            color="primary"
            text
            >Read More
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
