<template>
    <h2 class='mb-5'>{{ !this.form._id ? 'Ajouter un article' : 'Éditer l\'article' }}</h2>
    <div class='alert alert-danger alert-dismissible fade show mb-4' role='alert' v-if='error'>
        {{ error }}
        <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
    </div>
    <form @submit.prevent='savePost'>
        <div class='form-group mb-3 col-lg-5 col-md-6'>
            <label for='title'>Titre</label>
            <input v-model='form.title' type='text' class='form-control' name='title' placeholder='Poulet au four'
                   required>
        </div>
        <div class='form-group col-lg-5 col-md-6'>
            <label for='description'>Description</label>
            <textarea id='description' v-model='form.description' class='form-control' required></textarea>
        </div>
        <button type='submit' class='btn btn-primary mt-4 me-2'>{{ !this.form._id ? 'Ajouter' : 'Enregistrer' }}
        </button>
        <RouterLink to='/articles' class='btn btn-outline-secondary mt-4'>Annuler</RouterLink>
    </form>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useAlertStore } from '@/stores/alert'

const alert = useAlertStore()
const user = useUserStore()
const post = usePostStore()

export default {
    data() {
        if (!user.userIsLogged) this.$router.push('/connexion')

        return {
            form: {
                _id: '',
                title: '',
                description: '',
                user: ''
            },
            error: false
        }
    },
    async beforeMount() {
        if (!user.userIsLogged) {
            this.$router.push('/connexion')
            return
        }

        if (this.$route.params.id) {
            await post.getPost(this.$route.params.id)

            const existingPost = post.getPostData(this.$route.params.id)

            if (!existingPost) {
                this.error = 'Oups, une erreur s\'est produite lors de la récupération de l\'article. ' +
                    'L\'article n\'existe sûrement plus :/'
                return
            }

            const { _id, title, description, user } = existingPost

            if (!this.isAuthorized(user._id)) {
                this.$router.push('/articles')
                return
            }

            this.form = { _id, title, description, user }
        }
    },
    methods: {
        async savePost() {
            if (this.form._id) {
                await post.updatePost(this.form._id, {
                    title: this.form.title,
                    description: this.form.description
                })
                alert.setSuccessMessage('L\'article a bien été modifié.')
            } else {
                this.form.user = user.getUserIdFromToken()

                if (!this.form.user) {
                    user.logout()
                    this.$router.push('/connexion')
                    return
                }

                await post.createPost({
                    title: this.form.title,
                    description: this.form.description,
                    user: this.form.user
                })
                alert.setSuccessMessage('L\'article a bien été ajouté.')
            }
            this.$router.push('/articles')
        },
        isAuthorized(userId) {
            return userId === user.getUserIdFromToken() || user.isAdmin()
        }
    }
}
</script>

<style>
</style>
