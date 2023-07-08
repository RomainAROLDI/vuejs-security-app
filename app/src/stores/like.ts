import { defineStore } from 'pinia'
import axios from 'axios'
import type { LikeInterface } from '@/interfaces/LikeInterface'
import { useUserStore } from '@/stores/user'

let token = useUserStore().getUserJWT()
if (token.at(0) === '"' && token.at(-1) === '"') {
    token = token.slice(1, -1)
}
const config = { headers: { authorization: `Bearer ${token}` } }

export const useLikeStore = defineStore('like', {
    state: () => {
        return {
            likes: [
                {
                    _id: String,
                    post: String,
                    user: String
                }
            ]
        }
    },
    actions: {
        getLikeData(id: string) {
            return this.likes.find(like => like._id === id)
        },
        async createLike(like: LikeInterface) {
            await axios.post('http://localhost:3000/likes', like, config).then(async (resp) => {
                if (resp.status === 200) {
                    const { _id, post, user } = resp.data

                    if (resp.data && resp.data.error === 'The user already like this post.') {
                        await this.deleteOne(_id)
                    } else {
                        this.likes.push({ _id, post, user })
                    }
                }
            })
        },
        getUserLikes(idUser: string) {
            return axios.get('http://localhost:3000/users/' + idUser + '/likes', config).then((resp) => {
                if (resp.status === 200 && resp.data) {
                    resp.data.forEach((datum) => {
                        const { _id, post, user } = datum

                        const like = this.getLikeData(_id)

                        if (like) {
                            Object.assign(like, { post, user })
                        } else {
                            this.likes.push({ _id, post, user })
                        }
                    })
                }
            })
        },
        deleteOne(id: string) {
            axios.delete('http://localhost:3000/likes/' + id, config).then((resp) => {
                if (resp.status === 200 && resp.data.deletedCount) {
                    const index = this.likes.findIndex(like => like._id === id)

                    if (index !== -1) {
                        this.likes.splice(index, 1)
                    }
                }
            })
        },
        isLikeExist(idPost: string, idUser: string) {
            return axios.post('http://localhost:3000/likes/isExist', {
                user: idUser,
                post: idPost
            }, config)
        },
        isUserAlreadyLikeThePost(idPost: string, idUser: string) {
            return !!this.likes.find(like => like.post === idPost && like.user === idUser)
        }
    }
})
