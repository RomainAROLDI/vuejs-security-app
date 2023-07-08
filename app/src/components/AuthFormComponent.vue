<script>
import axios from 'axios'
import { useAlertStore } from '@/stores/alert'
import { useUserStore } from '@/stores/user'

const alert = useAlertStore()
const user = useUserStore()

export default {
    name: 'AuthForm',
    props: ['isLogin'],
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            error: false
        }
    },
    methods: {
        register() {
            const { username, password } = this.form

            axios.post('http://localhost:3000/users/signUp', { username, password })
                .then(async (resp) => {
                    if (resp.status === 200) {
                        if (resp.data.token) {
                            user.login(resp.data.token)
                            alert.setSuccessMessage('Votre compte a bien été créé ! Vous y êtes maintenant connecté :)')
                            this.$router.push('/')
                        }

                        this.error = 'Une erreur s\'est produite, veuillez réessayer.'
                    }
                }).catch(() => this.error = 'Une erreur s\'est produite, veuillez réessayer.')
        },
        login() {
            const { username, password } = this.form

            axios.post('http://localhost:3000/users/signIn', { username, password })
                .then(async (resp) => {
                    if (resp.status === 200) {
                        if (resp.data.token) {
                            user.login(resp.data.token)
                            alert.setSuccessMessage('Connecté avec succès !')
                            this.$router.push('/')
                        }

                        this.error = 'Une erreur s\'est produite, veuillez réessayer.'
                    }
                }).catch(() => this.error = 'Combinaison nom d\'utilisateur / mot de passe invalide.')
        }
    }

}
</script>

<template>
    <div class='alert alert-danger alert-dismissible fade show mb-4' role='alert' v-if='error'>
        {{ error }}
        <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
    </div>

    <form @submit.prevent='isLogin ? login() : register()'>
        <div class='form-group mb-3'>
            <label for='username'>Nom d'utilisateur</label>
            <input v-model='form.username' type='text' class='form-control' name='username' placeholder='toto69'
                   required>
        </div>
        <div class='form-group'>
            <label for='password'>Mot de passe</label>
            <input v-model='form.password' type='password' class='form-control' name='password' required>
        </div>

        <div class='d-flex justify-content-center'>
            <button type='submit' class='btn btn-primary mt-5'>
                {{ isLogin ? 'Se connecter' : 'S\'inscrire' }}
            </button>
        </div>
    </form>
</template>