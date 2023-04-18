<template>
  <TheHeader />
  <router-view v-slot="slotProps">
    <Transition name="route" mode="out-in">
      <component :is="slotProps.Component"></component>
    </Transition>
  </router-view>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

* {
  box-sizing: border-box;
}

html {
  font-family: 'Roboto', sans-serif;
}

body {
  margin: 0;
}

.route-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.route-enter-active {
  transition: all 0.3s ease-out;
}

.route-leave-active {
  transition: all 0.3s ease-in;
}

.router-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

<script setup>
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import TheHeader from './components/layout/TheHeader.vue';
import { useAuthStore } from './stores/auth';
const router = useRouter()

useAuthStore().tryLogin();

watch(
  () => useAuthStore().didAutoLogout,
  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      router.replace('/coaches');
    }
  }
);

</script>
