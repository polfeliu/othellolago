import Vue from 'vue';

import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

//Example
// <h1>{{ $t('welcomeMsg') }}</h1>

const messages = {
    'en': {
        'welcomeMsg': 'Welcome to Your Vue.js Apsp',
        'age': 'age',
        'flight number': 'flight number',
        'I am over 14 years old': 'I am over 14 years old',
        'I accept terms and conditions': 'I accept terms and conditions',
        'Begin the fun!': 'Begin the fun!',
        'Captured Image': 'Captured Image',
        'Capture Photo':'Capture Photo',
        'Take a photo of your face':'Take a photo of your face',
        'You can also take a photo of something that identifies you right now like clothing':'You can also take a photo of something that identifies you right now like clothing',
        'Select Device':'Select device',
        'I KNOW!':'I KNOW!',
        'Now try guessing what did other players choose!':'Now try guessing what did other players choose!',
    },
    'es': {
        'welcomeMsg': 'Bienvenido a tu aplicación Vue.js',
        'age': 'edad',
        'flight number': 'numero de vuelo',
        'I am over 14 years old': 'Tengo mas de 14 años',
        'I accept terms and conditions': 'Acepto los términos y condiciones',
        'Begin the fun!': '¡Comienza la diversión!',
        'Captured Image': 'Imagen capturada',
        'Capture Photo':'Capturar foto',
        'Take a photo of your face':'Sácate una foto de la cara',
        'You can also take a photo of something that identifies you right now like clothing':'También puedes sacarle una foto a algo que te identifique en este momento como tu ropa',
        'Select Device':'Seleccione dispositivo',
        'I KNOW!':'YA LO SE!',
        'Now try guessing what did other players choose!':'Ahora intenta adiivinar que han elejido otros jugadores!',
    }

    // TODO Completar idiomes
};

export let i18n  = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages
});

// https://www.freecodecamp.org/news/how-to-add-internationalization-to-a-vue-application-d9cfdcabb03b/