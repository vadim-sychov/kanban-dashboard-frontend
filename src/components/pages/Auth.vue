<template>
    <div class="mt-5 p-5">
        <mdb-container fluid grid-list-xl>
            <mdb-row></mdb-row>
            <mdb-row>
                <mdb-col col="4"></mdb-col>
                <mdb-col col="4">
                    <form v-on:submit.prevent="submit">
                        <p class="h4 text-center mb-4">Авторизація</p>
                        <div class="grey-text">
                            <mdb-input v-model="email" label="Ваш email" icon="key" type="email" color="primary"/>
                            <mdb-input v-model="password" label="Ваш пароль" icon="key" type="password"/>
                        </div>
                        <div class="text-center">
                            <v-alert dense outlined type="error" style="margin-left: 40px" v-if="error.length > 0">
                                {{error}}
                            </v-alert>
                        </div>
                        <div class="text-center">
                            <mdb-btn type="submit" color="primary">Вхід</mdb-btn>
                        </div>
                    </form>

                </mdb-col>
                <mdb-col col="4"></mdb-col>
            </mdb-row>
        </mdb-container>

        <v-overlay :absolute="false" :value="isLoading">
            <rotate-loader></rotate-loader>
        </v-overlay>
    </div>
</template>

<script>
    import Auth from '../../store/auth'
    import RotateLoader from 'vue-spinner/src/RotateLoader';
    import {
        mdbContainer,
        mdbRow,
        mdbCol,
        mdbInput,
        mdbBtn,
    } from 'mdbvue';

    export default {
        name: 'Auth',
        components: {
            mdbContainer,
            mdbRow,
            mdbCol,
            mdbBtn,
            mdbInput,
            RotateLoader
        },
        data: function () {
            return {
                email: '',
                password: '',
                error: '',
                isLoading: false
            }
        },
        methods: {
            submit: function () {
                this.error = '';
                this.isLoading = true;

                Auth.auth(this.email, this.password)
                    .then(result => {
                        let data = result.data;

                        if (data['token'] !== undefined) {
                            localStorage.authToken = data['token'];

                            this.$router.push('/');
                        }
                    }).catch(() => {
                        this.error = 'Невірний логін або пароль';
                    }).then(() => {
                        this.isLoading = false;
                    });
            },
        }
    }
</script>
