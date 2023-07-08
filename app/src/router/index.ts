import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/HomeView.vue')
        },
        {
            path: '/connexion',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },
        {
            path: '/inscription',
            name: 'register',
            component: () => import('../views/RegisterView.vue')
        },
        {
            path: '/editer-article/:id?',
            name: 'postEdit',
            component: () => import('../views/PostFormView.vue')
        },
        {
            path: '/articles',
            name: 'posts',
            component: () => import('../views/PostsView.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notFound',
            component: () => import('../views/NotFoundView.vue')
        }
    ]
})

export default router
