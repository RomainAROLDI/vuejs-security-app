<script lang='ts'>
import { mapActions, mapState } from 'pinia'
import { useUserStore } from '@/stores/user'

export default {
    computed: {
        ...mapState(useUserStore, ['userIsLogged'])
    },
    methods: {
        ...mapActions(useUserStore, ['logout']),
        logoutUser() {
            this.logout()
            this.$router.push('/')
        }
    }
}
</script>

<template>
    <nav class='navbar navbar-expand-lg navbar-light bg-light mb-4'>
        <div class='container-fluid'>
            <RouterLink to='/' class='ms-3 fs-3'>Sécurité APP</RouterLink>
            <button class='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNavAltMarkup'
                    aria-controls='navbarNavAltMarkup' aria-expanded='false' aria-label='Toggle navigation'>
                <span class='navbar-toggler-icon'></span>
            </button>
            <div class='collapse navbar-collapse' id='navbarNavAltMarkup'>
                <div class='navbar-nav ms-auto me-3 align-items-center'>
                    <RouterLink to='/' class='me-4' active-class='active'>Accueil</RouterLink>
                    <RouterLink to='/articles' class='me-4' active-class='active'>Articles</RouterLink>
                    <font-awesome-icon @click='logoutUser' v-if='userIsLogged' icon='fa-solid fa-right-from-bracket'
                                       style='cursor: pointer' />
                    <RouterLink v-else to='/connexion' active-class='active'>
                        <font-awesome-icon icon='fa-solid fa-right-to-bracket' />
                    </RouterLink>
                </div>
            </div>
        </div>
    </nav>

    <div id='main' class='container'>
        <Alert />
        <RouterView />
    </div>

    <footer class="bg-dark text-white text-center py-4 fixed-bottom">
        <div class="container">
            <p class='m-0'>© 2023 Sécurité - APP. Tous droits réservés.</p>
        </div>
    </footer>
</template>

<style scoped>
</style>
