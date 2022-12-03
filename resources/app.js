// Import CSS fontov
import './css/fonts.css';

// Import CSS ikoniek
import './css/icons.css';

// Import CSS stylov
import './css/fw-reset.css';
import './css/fw-elements.css';
import './css/fw-grid.css';
import './css/fw-animations.css';
import './css/fw-components.css';
import './css/fw-helpers.css';
import './css/fw-viewport.css';
import './css/fw-safe-area.css';

// Import podpory pre async/await vo VUE metodach
import 'regenerator-runtime';

// Import modulov
import * as Vue from 'vue';
import * as VueRouter from 'vue-router';

// Import VUE pluginov
import VueDropDown from './other/fw-vue-plugin-dropdown.js';
import VueInputLabeled from './other/fw-vue-plugin-input-labeled.js';
import VueInputProgressed from './other/fw-vue-plugin-input-progressed.js';

// Import ostatnych pluginov
import Waves from './other/waves/waves.js';

// Import komponentov
import VueEntry from './app.vue';
import RouterIndex from './components/router/router-index.vue';
import RouterError from './components/router/router-error.vue';

// Konfiguracia routera
const Router = new VueRouter.createRouter({
    linkActiveClass : '',
    linkExactActiveClass : '',
    history : VueRouter.createWebHashHistory(),
    routes : [
        { path : '/', name : 'route-index', component : RouterIndex },
        { path : '/error', name : 'route-error', component : RouterError },
        { path : '/:pathMatch(.*)*', redirect : { name : 'route-error' } },
    ],
});

// Vytvorenie appky
const App = Vue.createApp(VueEntry);

// Aplikovanie router pluginu
App.use(Router);

// Aplikovanie dropdown pluginu
App.use(VueDropDown);

// Aplikovanie input-labeled pluginu
App.use(VueInputLabeled);

// Aplikovanie input-progressed pluginu
App.use(VueInputProgressed);

// Mountnutie appky
App.mount('#app');
