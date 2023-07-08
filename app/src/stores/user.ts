import { defineStore } from 'pinia'

function parseJwt(token: string) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    return JSON.parse(jsonPayload)
}

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userIsLogged: false
        }
    },
    actions: {
        login(jwt: string) {
            localStorage.setItem('user', JSON.stringify(jwt))
            this.userIsLogged = true
        },
        logout() {
            localStorage.removeItem('user')
            this.userIsLogged = false
        },
        getUserIdFromToken(): string | boolean {
            const jwt = localStorage.getItem('user') ?? ''
            return jwt ? parseJwt(jwt).data.id : false
        },
        isAdmin(): boolean {
            const jwt = localStorage.getItem('user') ?? ''
            return jwt ? parseJwt(jwt).data.isAdmin : false
        },
        getUserJWT(): string {
            return localStorage.getItem('user') ?? ''
        }
    },
    persist: {
        enabled: true
    }
})
