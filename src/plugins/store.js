import Vue from 'vue';
import Vuex from "vuex";

Vue.use(Vuex);

import VuexPersistence from 'vuex-persist'

import { vuexfireMutations, firestoreAction } from 'vuexfire'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
});

//Firebase authentication
import firebase from "firebase/app";
import "firebase/auth";

import router from "@/plugins/router";
import {i18n} from "@/plugins/localization";

const getDefaultState = () =>  {
    return {
        locale: 'en',
        registered: false,
        user:{
            id:'',
            nickname: '',
            photo: '',
            age: '',
            flightnumber: '',
        },
        proves: "asdfawerqgsegser"
    }
}

const LanguageLocales = {
    "English": "en",
    "Spanish": "es"
}

import {db} from "@/plugins/firebase"

export default new Vuex.Store({
    plugins: [vuexLocal.plugin],
    state: getDefaultState(),
    mutations: {
        setWebLanguage(state,language){
            state.locale = LanguageLocales[language];
            i18n.locale = state.locale;
        },
        ResetState(state){
            Object.assign(state, getDefaultState())
        },
        setUserAge(state, age){
            state.user.age = age;
        },
        setUserFlightNumber(state,flightnumber){
            state.user.flightnumber = flightnumber
        },

        setPhoto(state, photo) {
            state.user.photo = photo
        },
        setUserNickname(state, nickname){
            state.user.nickname = nickname
        },
        ...vuexfireMutations //this appends the mutations from the vuexfire to the actual mutations
    },
    actions: {
        //can contain asynchronous operations
        bindUser: firestoreAction(context =>{
            return context.bindFirestoreRef('proves', db.collections('proves'))
        })
    },
    getters:{

    }
})

//persitance of auth could also be implemented with the same firebase SDK. I didn't do it because i didn't know such a thing existed