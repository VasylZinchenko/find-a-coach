import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useAuthStore } from './auth';

export const useRequestsStore = defineStore('requests', () => {
  const BASE_URL =
    'https://vue-http-demo-c46ab-default-rtdb.europe-west1.firebasedatabase.app';

  const authStore = useAuthStore();

  const defaultRequests = ref([]);

  const requests = computed(() => {
    const coachId = authStore.userId;
    return defaultRequests.value.filter((req) => req.coachId === coachId);
  });

  const hasRequests = computed(() => {
    return requests.value && requests.value.length > 0;
  });

  async function addRequest(payload) {
    const newRequest = {
      userEmail: payload.email,
      message: payload.message,
    };
    const response = await fetch(
      `${BASE_URL}/requests/${payload.coachId}.json`,
      {
        method: 'POST',
        body: JSON.stringify(newRequest),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to send request.'
      );
      throw error;
    }

    newRequest.id = responseData.name;
    newRequest.coachId = payload.coachId;

    defaultRequests.value.push(newRequest);
  }

  async function fetchRequest() {
    const coachId = authStore.userId;
    const token = useAuthStore().token;

    const response = await fetch(
      `${BASE_URL}/requests/${coachId}.json?auth=${token}`
    );
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to fetch requests.'
      );
      throw error;
    }

    const requestFromServer = [];

    for (const key in responseData) {
      const request = {
        id: key,
        coachId: coachId,
        userEmail: responseData[key].userEmail,
        message: responseData[key].message,
      };

      requestFromServer.push(request);
      console.log(requestFromServer);
    }
    defaultRequests.value = requestFromServer;
  }

  return { requests, addRequest, hasRequests, fetchRequest, defaultRequests };
});
