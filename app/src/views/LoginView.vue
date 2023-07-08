<script setup lang="ts">
import AuthFormComponent from '@/components/AuthFormComponent.vue'
</script>

<template>
    <div class='row justify-content-center'>
        <div class='col-md-6 col-lg-4'>
            <AuthFormComponent v-bind:is-login='true'/>
        </div>
    </div>
    <div class='row justify-content-center mt-4'>
        <div class='col-md-6 col-lg-4 text-center'>
            <small>
                Vous n'avez pas de compte ?
                <br>
                <RouterLink to='/inscription' class='text-primary'>Cliquez ici</RouterLink> pour en créer un.
            </small>
        </div>
    </div>
</template>
