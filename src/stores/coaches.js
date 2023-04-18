import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useAuthStore } from './auth';

export const useCoachesStore = defineStore('coaches', () => {
  const authStore = useAuthStore();
  const isLoading = ref(true);
  const lastFetch = ref(null);
  const coaches = ref([
    {
      id: 'c1',
      firstName: 'Maximilian',
      lastName: 'Schwarzmüller',
      areas: ['frontend', 'backend', 'career'],
      description:
        "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
      hourlyRate: 30,
    },
    {
      id: 'c2',
      firstName: 'Julie',
      lastName: 'Jones',
      areas: ['frontend', 'career'],
      description:
        'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
      hourlyRate: 30,
    },
  ]);

  function setFetchTimetamp() {
    lastFetch.value = new Date().getTime();
  }

  const shouldUpdate = computed(() => {
    const fetchLast = lastFetch.value;
    if (!fetchLast) {
      return true;
    }
    const currentTimeStamp = new Date().getTime();
    return (currentTimeStamp - fetchLast) / 1000 > 60;
  });

  const BASE_URL =
    'https://vue-http-demo-c46ab-default-rtdb.europe-west1.firebasedatabase.app';

  const url = `${BASE_URL}/coaches/${authStore.userId}.json`;

  async function registerCoach(firstName, lastName, description, rate, areas) {
    const userId = authStore.userId;
    const coachData = {
      firstName: firstName,
      lastName: lastName,
      description: description,
      hourlyRate: rate,
      areas: areas,
    };

    const token = authStore.token;

    const response = await fetch(
      `${BASE_URL}/coaches/${userId}.json?auth=${token}`,
      {
        method: 'PUT',
        body: JSON.stringify(coachData),
      }
    );


    if (!response.ok) {
      //error
    }

    coaches.value.push({
      ...coachData,
      id: userId,
    });
		console.log(coaches.value);
  }

  async function loadCoaches(payload) {
    if (!payload.forceRefresh && !shouldUpdate.value) {
      return;
    }

    const response = await fetch(`${BASE_URL}/coaches.json`);
    const responseData = await response.json();

    if (!response.ok) {
      const error = 'Failed to fetch';
      console.log(error);
      throw error;
    }

    const coachesFromServer = [];

    for (const key in responseData) {
      const coach = {
        id: key,
        firstName: responseData[key].firstName,
        lastName: responseData[key].lastName,
        description: responseData[key].description,
        hourlyRate: responseData[key].hourlyRate,
        areas: responseData[key].areas,
      };
      coachesFromServer.push(coach);
    }

    coaches.value = coachesFromServer;
    setFetchTimetamp();
  }

  const isCoach = computed(() => {
    const innerCoaches = coaches.value;
    const innerUserId = authStore.userId;
    return innerCoaches.some((coach) => coach.id === innerUserId);
  });

  const hasCoaches = computed(() => {
    return !isLoading.value && coaches.value && coaches.value.length > 0;
  });

  return {
    coaches,
    hasCoaches,
    isCoach,
    url,
    registerCoach,
    loadCoaches,
    isLoading,
  };
});
