<template>
    <div>
        <h2>Помилка 404</h2>
        <p>
            <router-link :to="{name: 'dashboard'}">На головну</router-link>
        </p>
    </div>
</template>

<script>
    export default {
        name: 'Dashboard'
    }
</script>
