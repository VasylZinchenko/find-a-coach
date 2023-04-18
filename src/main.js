import { createApp, defineAsyncComponent } from 'vue';
import { createPinia } from 'pinia';

import router from './router';
import App from './App.vue';
import BaseCard from './components/ui/BaseCard';
import BaseButton from './components/ui/BaseButton';
import BaseBadge from './components/ui/BaseBadge';
import BaseSpinner from './components/ui/BaseSpinner';

const BaseDialog = defineAsyncComponent(() =>
  import('./components/ui/BaseDialog')
);

const pinia = createPinia();
const app = createApp(App);

app.component('base-card', BaseCard);
app.component('base-button', BaseButton);
app.component('base-badget', BaseBadge);
app.component('base-spinner', BaseSpinner);
app.component('base-dialog', BaseDialog);

app.use(router).use(pinia).mount('#app');
