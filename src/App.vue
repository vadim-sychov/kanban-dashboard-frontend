<template>
    <main id="app">
        <v-app>
            <template v-if="!isEmptyPage">
                <v-navigation-drawer width="350" app v-model="navigationOpen">
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon large>account_circle</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ $store.state.userData.email ? $store.state.userData.email : 'Неавторизований користвач' }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list>
                        <v-list-item to="/">
                            <v-list-item-icon>
                                <v-icon>dashboard</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                                Канбан-дошка
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item to="/users">
                            <v-list-item-icon>
                                <v-icon>supervised_user_circle</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>
                                Керування користувачами
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>

                <v-app-bar app color="primary">
                    <v-app-bar-nav-icon @click="navigationOpen = !navigationOpen"></v-app-bar-nav-icon>

                    <h2>{{ $route.meta.title }}</h2>

                    <v-spacer></v-spacer>

                    <v-btn class="mx-1" @click="logout">
                        <v-icon left>logout</v-icon>
                        Вихід
                    </v-btn>
                </v-app-bar>

                <!-- Sizes your content based upon application components -->
                <v-main>
                    <!-- Provides the application the proper gutter -->
                    <v-container fluid>
                        <router-view></router-view>
                    </v-container>
                </v-main>

                <v-footer app>
                    <!-- -->
                </v-footer>
            </template>

            <template v-else>
                <v-main>
                    <v-container fluid>
                        <router-view></router-view>
                    </v-container>
                </v-main>
            </template>
        </v-app>
    </main>
</template>

<script>
    export default {
        name: 'App',
        data: function () {
            return {
                navigationOpen: true,
            };
        },
        methods: {
            logout() {
                localStorage.authToken = null;

                this.$router.push('/login');
            }
        },
        computed: {
            isEmptyPage() {
                return this.$route.name === 'login';
            }
        }
    }
</script>

<style lang="sass">
    @import "../src/assets/sass/main.sass"
</style>
