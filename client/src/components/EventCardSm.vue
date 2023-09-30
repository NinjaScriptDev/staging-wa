<script setup>
import { formatMonthDate, formatTimeFromTime, getEventImageUrl } from "@/util";

const { event } = defineProps(["event"]);
</script>

<template>
  <div class="d-flex">
    <v-img
      :aspect-ratio="1"
      :src="getEventImageUrl(event?.images[0] || null)"
      class="flex-grow-0"
      cover
      width="80"
    >
    </v-img>

    <div class="ml-2">
      <h5>{{ event.title }}</h5>

      <div>
        <small
          >{{ formatMonthDate(event.date) }} @{{
            formatTimeFromTime(event.start_time)
          }}
          <a
            class="text-primary text-decoration-none clickable"
            @click="
              $router.push({
                name: 'eventSingle',
                params: { id: event.id },
              })
            "
            >more</a
          ></small
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
