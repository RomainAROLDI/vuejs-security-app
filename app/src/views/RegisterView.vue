<script setup lang="ts">
import AuthFormComponent from '@/components/AuthFormComponent.vue'
</script>

<template>
    <div class='row justify-content-center'>
        <div class='col-md-6 col-lg-4'>
            <AuthFormComponent v-bind:is-login='false'/>
        </div>
    </div>
    <div class='row justify-content-center mt-4'>
        <div class='col-md-6 col-lg-4 text-center'>
            <small>
                Vous avez déjà un compte ?
                <br>
                <RouterLink to='/inscription' class='text-primary'>Cliquez ici</RouterLink> pour vous y connecter.
            </small>
        </div>
    </div>
</template>
