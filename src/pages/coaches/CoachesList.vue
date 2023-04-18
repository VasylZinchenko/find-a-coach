<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occured!"
      @close="handleError"
      >{{ error }}</base-dialog
    >
    <section>
      <CoachFilter @change-filter="setFilters" />
    </section>
    <section>
      <base-card>
        <div class="controls">
          <base-button @click="loadCoaches(true)" mode="outline"
            >Refresh</base-button
          >
          <base-button link to="/auth?redirect=register" v-if="!isLoggedIn">Login to Register as Coach</base-button>
          <base-button
            v-if="isLoggedIn && !isCoach && !isLoading"
            link
            to="/register"
            >Register as Coach</base-button
          >
        </div>
        {{ error }}
        <div v-if="isLoading">
          <base-spinner />
        </div>

        <ul v-else-if="hasCoaches">
          <CoachItem
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :firstName="coach.firstName"
            :lastName="coach.lastName"
            :hourlyRate="coach.hourlyRate"
            :areas="coach.areas"
          />
        </ul>

        <h3 v-else>No coaches found.</h3>
      </base-card>
    </section>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, reactive, ref } from 'vue';
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';
import { useCoachesStore } from '../../stores/coaches';
import { useAuthStore } from '../../stores/auth';

const coachStore = useCoachesStore();
const authStore = useAuthStore();

const { hasCoaches, isCoach, isLoading } = storeToRefs(useCoachesStore());

loadCoaches();

const error = ref(null);

let activeFilters = reactive({
  frontend: true,
  backend: true,
  career: true,
});

const isLoggedIn = computed(() => {
  return authStore.isAuthenticated;
});

const filteredCoaches = computed(() => {
  const coaches = coachStore.coaches;
  return coaches.filter((coach) => {
    if (activeFilters.frontend && coach.areas.includes('frontend')) {
      return true;
    }
    if (activeFilters.backend && coach.areas.includes('backend')) {
      return true;
    }
    if (activeFilters.career && coach.areas.includes('career')) {
      return true;
    }
  });
});

async function loadCoaches(refresh = false) {
  isLoading.value = true;
  try {
    await coachStore.loadCoaches({ forceRefresh: refresh });
  } catch (err) {
    error.value = err.message || 'Something went wrong!';
  }
  isLoading.value = false;
}

function handleError() {
  error.value = null;
}

function setFilters(updatedFilters) {
  activeFilters = Object.assign(activeFilters, updatedFilters);
}
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
