<template>
  <div>
    <section>
      <base-card>
        <h2>{{ fullName }}</h2>
        <h3>${{ rate }}/hour</h3>
      </base-card>
    </section>

    <section>
      <base-card>
        <header>
          <h2>Interested? Reach out now!</h2>
          <base-button link :to="contactLink">Contact</base-button>
        </header>
        <router-view></router-view>
      </base-card>
    </section>

    <section>
      <base-card>
        <base-badget
          v-for="area in areas"
          :key="area"
          :type="area"
          :title="area"
        ></base-badget>
        <p>{{ description }}</p>
      </base-card>
    </section>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useCoachesStore } from '../../stores/coaches';
import { useRoute } from 'vue-router';
const coachStore = useCoachesStore();

const route = useRoute();

const props = defineProps(['id']);

console.log(props.id);

console.log(coachStore.coaches.filter((coach) => coach.id === props.id));

const selectedCoach = computed(() => {
  return useCoachesStore().coaches.find((coach) => coach.id === props.id);
});

const fullName = computed(() => {
  return selectedCoach.value.firstName + ' ' + selectedCoach.value.lastName;
});

const areas = computed(() => {
  return selectedCoach.value.areas;
});

const rate = computed(() => {
  return selectedCoach.value.hourlyRate;
});

const description = computed(() => {
  return selectedCoach.value.description;
});

const contactLink = computed(() => {
  return `${route.path}/${props.id}/contact`;
});
</script>

<style lang="scss" scoped></style>
