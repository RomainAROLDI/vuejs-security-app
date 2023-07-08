<script>
import { mapActions, mapState } from 'pinia'
import { useAlertStore } from '@/stores/alert'

export default {
    name: 'Alert',
    computed: {
        ...mapState(useAlertStore, ['successMessage'])
    },
    methods: {
        ...mapActions(useAlertStore, ['setSuccessMessage']),
        showSuccessToast() {
            if (this.successMessage) {
                const t = document.querySelector('.toast')
                t.addEventListener('hidden.bs.toast', () => this.setSuccessMessage(''))
                const toast = new bootstrap.Toast(t, {
                    delay: 3500
                })
                toast.show()
            }
        }
    },
    watch: {
        $route() {
            this.showSuccessToast()
        }
    },
    mounted() {
        this.showSuccessToast()
    }
}
</script>

<template>
    <div class='position-relative' v-if='successMessage'>
        <div class='toast align-items-center text-bg-success border-0 w-100 position-absolute' role='alert'
             aria-live='assertive'
             aria-atomic='true'>
            <div class='d-flex'>
                <div class='toast-body text-light'>
                    {{ successMessage }}
                </div>
                <button type='button' class='btn-close btn-close-white me-2 m-auto' data-bs-dismiss='toast'
                        aria-label='Close'></button>
            </div>
        </div>
    </div>
</template>