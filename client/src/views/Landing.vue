<script setup>
import Logo from "@/components/Logo.vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const router = useRouter();
</script>

<template>
  <v-container :class="{ 'text-center': mobile }" fluid>
    <v-row class="bg-grey-lighten-3" justify="center">
      <v-col cols="12" md="8">
        <v-row
          align="center"
          class="py-2 mb-3 py-md-15 my-md-15"
          justify="center"
        >
          <v-col cols="12" md="8">
            <logo />
            <v-img
              class="d-block d-md-none w-50 mx-auto mt-8"
              src="@/assets/img/people.png"
            ></v-img>
            <h1 class="mt-3">Imagine a place….</h1>
            <p class="mt-2">
              Where you can keep a record of the places and experiences you’ve
              enjoyed. A place you can share your thoughts on those experiences
              with just friends and family. Wayzaway is social network that
              enhances real life connections you have with people you love
            </p>
            <div class="mt-4 d-block d-md-flex justify-center justify-md-start">
              <v-btn
                :to="{ name: 'signin' }"
                class="text-capitalize ml-1 ml-md-0 mt-1 mt-sm-0"
                color="secondary"
                >Sign in to Wayzaway
              </v-btn>
              <v-btn
                :to="{ name: 'register' }"
                class="text-capitalize ml-sm-5 ml-1 mt-1 mt-sm-0"
                color="primary"
                >Join Wayzaway
              </v-btn>
            </div>
          </v-col>
          <v-col class="d-none d-md-block" md="4">
            <v-img src="@/assets/img/people.png"></v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="bg-white" justify="center">
      <v-col cols="12" md="6">
        <v-row
          align="center"
          class="py-5 my-5 py-md-15 my-md-15"
          justify="center"
          justify-md="start"
        >
          <v-col cols="6" md="6">
            <v-img src="@/assets/img/motorhome.png"></v-img>
          </v-col>
          <v-col class="pl-md-6" cols="12" md="6">
            <h1>
              Tell your loved ones about your days out and upcoming events
            </h1>
            <p class="mt-2">
              Wayzaway is a way to share the things you’re doing with friends
              that you know in real life. It’s a great way to see what they’re
              up to and get ideas on places to visit from people you trust
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="bg-grey-lighten-3" justify="center">
      <v-col cols="12" md="6">
        <v-row
          align="center"
          class="py-5 my-5 py-md-15 my-md-15"
          justify="center"
        >
          <v-col class="pl-6" cols="12" md="6">
            <h1>Social media site that enhances your real life</h1>
            <p class="mt-2">
              Wayzaway is a social media site that helps you build on
              connections you already have with friends in a unique, useful and
              practical way
            </p>
          </v-col>
          <v-col cols="6" md="6">
            <v-img src="@/assets/img/confetti.png"></v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="py-5 my-5 py-md-15 my-md-15 bg-white" justify="center">
      <v-col class="text-center" cols="12" md="10">
        <v-row justify="center">
          <v-col cols="auto">
            <logo />
          </v-col>
        </v-row>
        <p class="pt-4">
          A social network site that allows you to post places and events you’ve
          visited, or ones that are upcoming to only friends and families. You
          can share your thoughts and help inspire people you love on places to
          visit. Wayzaway is focused on enhancing real life connections you have
          with friends and families. We don’t do trending or allow strangers to
          search for you
        </p>
        <v-row justify="center">
          <v-col cols="8" md="4">
            <v-img src="@/assets/img/beach-sunset.png"></v-img>
          </v-col>
        </v-row>
        <h4>Are you ready?</h4>
        <div class="mt-4">
          <v-btn
            :to="{ name: 'signin' }"
            class="text-capitalize mt-2 mt-sm-0"
            color="primary"
            >Sign in to Wayzaway
          </v-btn>
          <v-btn
            :to="{ name: 'register' }"
            class="text-capitalize ml-2 mt-2 mt-sm-0"
            color="secondary"
            >Join Wayzaway
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
