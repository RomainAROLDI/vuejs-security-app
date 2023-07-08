import { defineStore } from 'pinia'
import axios from 'axios'
import type { PostInterface } from '@/interfaces/PostInterface'
import { useUserStore } from '@/stores/user'

let token = useUserStore().getUserJWT()
if (token.at(0) === '"' && token.at(-1) === '"') {
    token = token.slice(1, -1)
}
const config = { headers: { authorization: `Bearer ${token}` } }

export const usePostStore = defineStore('post', {
    state: () => {
        return {
            posts: [
                {
                    _id: String,
                    title: String,
                    description: String,
                    user: String,
                    likes: Number,
                    commentsCount: Number,
                    comments: []
                }
            ]
        }
    },
    actions: {
        getPostData(id: string) {
            return this.posts.find(post => post._id === id)
        },
        getPost(id: string) {
            axios.get('http://localhost:3000/posts/' + id, config).then((resp) => {
                const post = this.getPostData(id)
                if (resp.status === 200 && resp.data._id) {
                    const { _id, title, description, user, likes, commentsCount } = resp.data

                    if (post) {
                        Object.assign(post, { title, description, user, likes, commentsCount })
                    } else {
                        this.posts.push({ _id, title, description, user, likes, commentsCount, comments: [] })
                    }
                    console.log(post)
                }
            })
        },
        updatePost(id: string, post: PostInterface) {
            axios.put('http://localhost:3000/posts/' + id, post, config).then((resp) => {
                const post = this.getPostData(id)
                if (resp.status === 200 && resp.data._id) {
                    const { _id, title, description, user, likes, commentsCount } = resp.data

                    if (post) {
                        Object.assign(post, { title, description, user, likes, commentsCount })
                    } else {
                        this.posts.push({ _id, title, description, user, likes, commentsCount, comments: [] })
                    }
                }
            })
        },
        createPost(post: PostInterface) {
            axios.post('http://localhost:3000/posts', post, config).then((resp) => {
                if (resp.status === 200 && resp.data._id) {
                    const { _id, title, description, user, likes, commentsCount } = resp.data

                    this.posts.push({ _id, title, description, user, likes, commentsCount, comments: [] })
                }
            })
        },
        getAllPosts() {
            axios.get('http://localhost:3000/posts', config).then((resp) => {
                if (resp.status === 200 && resp.data && resp.data.length) {
                    this.posts = resp.data
                }
            })
        },
        deleteOne(id: string) {
            axios.delete('http://localhost:3000/posts/' + id, config).then((resp) => {
                if (resp.status === 200 && resp.data.deletedCount) {
                    const index = this.posts.findIndex(post => post._id === id)

                    if (index !== -1) {
                        this.posts.splice(index, 1)
                    }
                }
            })
        }
    },
    persist: {
        enabled: true
    }
})
