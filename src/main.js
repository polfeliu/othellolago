import Vue from 'vue'
import App from './App.vue'

import vuetify from './plugins/vuetify';
Vue.use(vuetify)

Vue.config.productionTip = false;

// Router Configuration
//import router from "@/plugins/router";

//Firebase
//import {firebaseApp} from "@/plugins/firebase";// by importing the app the other modules are not loaded by default
//Vue.use(firestorePlugin)

//Vuex
//import store from './plugins/store';

//Form validations
//import Vuelidate from 'vuelidate'
//import {firestorePlugin} from "vuefire";
//Vue.use(Vuelidate)

//Confirmations
//import VuetifyConfirm from 'vuetify-confirm'
//Vue.use(VuetifyConfirm, {vuetify})

//localization
//import {i18n} from "@/plugins/localization";

//PeerJS
import VuePeerJS from 'vue-peerjs';
import Peer from 'peerjs';

Vue.use(VuePeerJS, new Peer({}));

//Clipboard
import VueClipboard from 'vue-clipboard2'

VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)

new Vue({
  vuetify,

  render: h => h(App),
  created (){

  },
  destroy(){

  }
}).$mount('#app');


