<template>
  <form @submit.prevent="submitForm">
    <div class="form-control">
      <label for="email">Your E-mail</label>
      <input type="email" id="email" v-model.trim="email" />
    </div>

    <div>
      <label for="message">Message</label>
      <textarea id="Message" rows="5" v-model.trim="message"></textarea>
    </div>

    <p class="errors" v-if="!formIsValid">
      Please enter a valid email and non-empty message.
    </p>

    <div class="actions">
      <base-button>Send Message</base-button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRequestsStore } from '../../stores/requests';
import { useRouter, useRoute } from 'vue-router';
const requestsStore = useRequestsStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const message = ref('');
const formIsValid = ref(true);

function submitForm() {
  formIsValid.value = true;
  if (
    email.value === '' ||
    !email.value.includes('@') ||
    message.value === ''
  ) {
    formIsValid.value = false;
    return;
  }
  requestsStore.addRequest({
    email: email.value,
    message: message.value,
    coachId: route.params.id,
  });

  router.replace('/coaches');

  console.log(route.params.id);
  console.log(requestsStore.requests);
}
</script>

<style scoped>
form {
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}

.errors {
  font-weight: bold;
  color: red;
}

.actions {
  text-align: center;
}
</style>
