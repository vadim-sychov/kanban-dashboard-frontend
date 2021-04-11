<template>
    <div>
        <h2>Error 404</h2>
        <p>
            <router-link :to="{name: 'dashboard'}">Go on main page</router-link>
        </p>
    </div>
</template>

<script>
    export default {
        name: 'Dashboard'
    }
</script>
