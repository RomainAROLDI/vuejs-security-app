<script lang='ts'>
import { useUserStore } from '@/stores/user'
import { usePostStore } from '@/stores/post'
import { useLikeStore } from '@/stores/like'
import { useCommentStore } from '@/stores/comment'
import { mapActions, mapState } from 'pinia'

const post = usePostStore()
const user = useUserStore()
const comment = useCommentStore()
const like = useLikeStore()

export default {
    data() {
        if (!user.userIsLogged) this.$router.push('/connexion')

        return {
            itemIdToDelete: null,
            error: false,
            form: {
                message: ''
            },
            showingComments: false
        }
    },
    computed: {
        ...mapState(usePostStore, ['posts']),
        ...mapState(useCommentStore, ['comments'])
    },
    beforeMount() {
        if (!user.userIsLogged) {
            this.$router.push('/connexion')
            return
        }
        post.getAllPosts()
        like.getUserLikes(user.getUserIdFromToken())
    },
    methods: {
        ...mapActions(usePostStore, ['deleteOne']),
        ...mapActions(useLikeStore, ['isUserAlreadyLikeThePost']),
        ...mapActions(useUserStore, ['getUserIdFromToken']),

        isAuthorized(userId: string) {
            return userId === user.getUserIdFromToken() || user.isAdmin()
        },

        deletePost(id: string) {
            const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'))
            confirmDeleteModal.show()

            this.itemIdToDelete = id
        },

        showComments(idPost: string) {
            if (!this.showingComments) {
                comment.getAllPostComments(idPost)
                this.showingComments = idPost
            } else if (this.showingComments !== idPost) {
                this.showingComments = false
                comment.getAllPostComments(idPost)
                this.showingComments = idPost
            } else {
                this.showingComments = false
            }
        },

        addComment(idPost: string) {
            comment.createComment({
                post: idPost,
                message: this.form.message,
                user: user.getUserIdFromToken()
            })
            comment.getAllPostComments(idPost)
            post.getPost(idPost)
        },

        async like(postId: string) {
            await like.createLike({ post: postId, user: user.getUserIdFromToken() })
            post.getPost(postId)
        }
    }
}
</script>

<template>
    <div class='d-flex justify-content-between align-content-center'>
        <div>
            <h2>Articles</h2>
        </div>
        <div>
            <RouterLink to='/editer-article' class='btn btn-primary'>Ajouter un article</RouterLink>
        </div>
    </div>

    <div class='alert alert-danger alert-dismissible fade show my-2' role='alert' v-if='error'>
        {{ error }}
        <button @click='error = ""' type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
    </div>

    <div class='row py-4 w-100' v-if='posts.length'>
        <div v-for='post in posts' class='card post col-md-5 col-lg-3 col-xl-2 m-3 p-0'>
            <div class='card-body d-flex flex-column justify-content-between pb-1'>
                <div class='mb-2'>
                    <div class='d-flex justify-content-between align-items-start'>
                        <h5 class='card-title overflow-auto'>{{ post.title }}</h5>
                        <div v-if='isAuthorized(post.user._id)' class='ms-2 d-flex align-items-center'>
                            <RouterLink :to='`/editer-article/${post._id}`'>
                                <font-awesome-icon icon='fa-solid fa-pen-to-square' class='text-primary me-2' />
                            </RouterLink>
                            <font-awesome-icon @click='deletePost(post._id)' icon='fa-solid fa-trash'
                                               class='text-danger' />
                        </div>
                    </div>
                    <h6 class='card-subtitle mb-2 text-muted'>{{ post.user.username }}</h6>
                    <p class='card-text'>{{ post.description }}</p>
                </div>
                <div class='d-flex justify-content-end align-items-center'>
                    <div class='me-3'>
                        <span class='me-1'>{{ post.commentsCount }}</span>
                        <font-awesome-icon @click='showComments(post._id)' icon='fa-solid fa-comment' />
                    </div>
                    <div>
                        <span class='me-1'>{{ post.likes }}</span>
                        <font-awesome-icon @click='this.like(post._id)' class='text-danger'
                                           :icon="isUserAlreadyLikeThePost(post._id, getUserIdFromToken()) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" />
                    </div>
                </div>
            </div>
            <div class='card-footer bg-light position-absolute w-100 top-100 border' v-if='this.showingComments === post._id'>
                <form @submit.prevent='addComment(post._id)' id='addCommentForm'
                      class='d-flex align-items-center justify-content-between'>
                    <textarea id='message' v-model='form.message' class='p-2 border-0 flex-grow-1'
                              placeholder='Commentez...' required></textarea>
                    <button type='submit' class='btn btn-primary btn-sm ms-2'>Envoyer</button>
                </form>
                <div v-if='comments.length' class='my-2'>
                    <span class='mb-1'>Commentaire{{ comments.length > 1 ? 's' : '' }}</span>
                    <div id='comment'>
                        <div v-for='comment in comments' class='mt-2 rounded bg-white pb-1 px-2'>
                            <p class='m-0 text-wrap comment-body'>
                                <small class='text-muted'>{{ comment.user.username }}</small>
                                <br />
                                {{ comment.message }}
                            </p>
                            <div class='d-flex justify-content-end align-items-center comment-footer'>
                                <span class='me-1'>{{ comment.likes }}</span>
                                <font-awesome-icon icon='fa-regular fa-heart' class='text-danger' />
                            </div>
                        </div>
                    </div>
                </div>
                <p class='mt-2' v-else>
                    Aucun commentaire
                </p>
            </div>
        </div>
    </div>
    <p v-else class='mt-3'>Aucun article.</p>

    <div class='modal' id='confirmDeleteModal' tabindex='-1' role='dialog'>
        <div class='modal-dialog' role='document'>
            <div class='modal-content'>
                <div class='modal-header'>
                    <h5 class='modal-title'>Confirmation de suppression</h5>
                    <button type='button' class='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                </div>
                <div class='modal-body'>
                    <p>Êtes-vous sûr de vouloir supprimer cet article ?</p>
                </div>
                <div class='modal-footer'>
                    <button type='button' class='btn btn-danger' data-bs-dismiss='modal'
                            @click='deleteOne(this.itemIdToDelete)'>
                        Supprimer
                    </button>
                    <button type='button' class='btn btn-secondary' data-bs-dismiss='modal'>Annuler</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
div.card svg.svg-inline--fa {
    cursor: pointer;
}

textarea#message {
    font-size: 12px;
    resize: none;
    max-height: 33px;
}

div#comment {
    max-height: 20vh;
    overflow-y: scroll;
}

div.card-body p.card-text {
    max-height: 8vh;
    overflow-y: scroll;
}

div.card-body h5.card-title {
    max-height: 50px;
}

div.card-footer {
    z-index: 10000;
}

div.card-footer .comment-body {
    font-size: 15px;
}

div.card-footer .comment-footer {
    font-size: 13px;
}

div.card.post {
    min-width: 22%;
}
</style>
