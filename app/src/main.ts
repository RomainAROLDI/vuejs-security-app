import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

import App from './App.vue'
import router from './router'
import AlertComponent from '@/components/AlertComponent.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faRightToBracket,
    faRightFromBracket,
    faPenToSquare,
    faTrash,
    faHeart,
    faComment
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'

library.add(faRightToBracket, faRightFromBracket, faPenToSquare, faTrash, faHeart, faRegularHeart, faComment)

const app = createApp(App)

const pinia = createPinia()

pinia.use(piniaPersist)

app.use(pinia)
app.use(router)

app.component('Alert', AlertComponent)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
