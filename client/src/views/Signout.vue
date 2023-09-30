<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
store
  .dispatch("cuser/signout")
  .then((response) => {
    router.push({ name: "landing" });
  })
  .catch((err) => {});
</script>
