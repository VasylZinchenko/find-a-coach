<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occured!"
      @close="handleError"
      >{{ error }}</base-dialog
    >
    <section>
      <base-card>
        <header>
          <h2>Requests Received</h2>
        </header>
        <base-spinner v-if="isLoading"></base-spinner>
        <ul v-else-if="requestsStore.hasRequests && !isLoading">
          <RequestItem
            v-for="req in useRequestsStore().defaultRequests"
            :key="req.id"
            :email="req.userEmail"
            :message="req.message"
          />
        </ul>
        <h3>You haven't reveived any requests yet!</h3>
      </base-card>
    </section>
  </div>
</template>

<script setup>
import { useRequestsStore } from '../../stores/requests';
import RequestItem from '../../components/requests/RequestItem.vue';
import { ref } from 'vue';
const requestsStore = useRequestsStore();

const isLoading = ref(false);
const error = ref(null);

async function loadRequests() {
  isLoading.value = true;
  try {
    await requestsStore.fetchRequest();
  } catch (err) {
    error.value = err.message || '❌';
  }
  isLoading.value = false;
}

loadRequests();

function handleError() {
  error.value = null;
}
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
