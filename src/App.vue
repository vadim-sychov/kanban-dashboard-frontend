<template>
    <main id="app">
        <v-app>
            <v-navigation-drawer app v-model="navigationOpen">
<!--                <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>-->
<!--                <router-link :to="{ name: 'error_page' }">Error 404</router-link>-->

                <v-list>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>menu</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Shared with me</v-list-item-title>
                    </v-list-item>
                    <v-list-item link>
                        <v-list-item-icon>
                            <v-icon>folder</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Shared with me</v-list-item-title>
                    </v-list-item>
                    <v-list-item link>
                        <v-list-item-icon>
                            <v-icon>star</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Starred</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-app-bar app color="primary">
                <v-app-bar-nav-icon @click="navigationOpen = !navigationOpen"></v-app-bar-nav-icon>

                <h2>App bar</h2>
            </v-app-bar>

            <!-- Sizes your content based upon application components -->
            <v-main>
                <!-- Provides the application the proper gutter -->
                <v-container fluid>
                    <template v-if="isAuthed">
                        <!-- If using vue-router -->
                        <router-view></router-view>
                    </template>

                    <template v-else>
                        <auth v-on:authEvent="authEventHandle"/>
                    </template>
                </v-container>
            </v-main>

            <v-footer app>
                <!-- -->
            </v-footer>
        </v-app>
    </main>
</template>

<script>
    import Auth from './components/pages/Auth';

    export default {
        name: 'App',
        components: {Auth},
        data: function () {
            return {
                isAuthed: true,
                navigationOpen: true,
            };
        },
        created: function() {
            this.isAuthed = this.authed();
        },
        methods: {
            authed() {
                // let result = false;
                try {
                    // TODO check isAuthed from vuex
                    // let sites = [];
                    // Site.getAll().then((response) =>  {
                    //         sites = response.data.data;
                    //         this.isAuthed = Object.entries(sites).length > 0;
                    //     },
                    //     (reject) => {
                    //         this.isAuthed = false;
                    //     }
                    // );
                } catch (e) {
                    this.isAuthed = false;
                }
                return true;
            },
            authEventHandle() {
                this.isAuthed = true;
            }
        }
    }
</script>

<style lang="sass">
    @import "../src/assets/sass/main.sass"
</style>
