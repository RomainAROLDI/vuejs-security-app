<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="d-flex align-items-center justify-content-center">
        <div class="text-center">
            <h1 class="display-1 fw-bold">404</h1>
            <p class="fs-3"> <span class="text-danger">Oups !</span> Page non trouvée.</p>
            <p class="lead">
                La page que vous recherchez n'existe pas.
            </p>
            <RouterLink to='/' class="btn btn-primary mt-4">Retourner à l'accueil</RouterLink>
        </div>
    </div>
</template>
