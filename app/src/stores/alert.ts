import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
    state: () => {
        return { successMessage: '' }
    },

    actions: {
        setSuccessMessage(message: string): void {
            this.successMessage = message
        }
    }
})
