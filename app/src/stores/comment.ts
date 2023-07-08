import { defineStore } from 'pinia'
import axios from 'axios'
import type { CommentInterface } from '@/interfaces/CommentInterface'
import { useUserStore } from '@/stores/user'

let token = useUserStore().getUserJWT()
if (token.at(0) === '"' && token.at(-1) === '"') {
    token = token.slice(1, -1)
}
const config = { headers: { authorization: `Bearer ${token}` } }

export const useCommentStore = defineStore('comment', {
    state: () => {
        return {
            comments: [
                {
                    _id: String,
                    post: String,
                    user: String,
                    likes: Number
                }
            ]
        }
    },
    actions: {
        createComment(comment: CommentInterface) {
            axios.post('http://localhost:3000/comments', comment, config).then((resp) => {
                if (resp.status === 200) {
                    this.comments.push(resp.data)
                }
            })
        },
        getAllPostComments(postId: string) {
            axios.get('http://localhost:3000/posts/' + postId + '/comments', config)
                .then((resp) => {
                    if (resp.status === 200 && resp.data) {
                        this.comments = resp.data
                    }
                })
        }
    }
})
