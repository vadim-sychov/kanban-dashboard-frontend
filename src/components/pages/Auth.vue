<template>
    <div>
        <h2>Auth page</h2>
    </div>
</template>

<script>
    import Auth from '../../store/auth';

    export default {
        name: 'Auth',
        data: function () {
            return {
                email: '',
                password: '',
                error: '',
            }
        },
        methods: {
            submit: function () {
                Auth.auth(this.email, this.password).then(
                    result => {
                        let data = result.data;

                        if (data['token'] !== undefined) {
                            // TODO использовать vuex
                            localStorage.authToken = data['token'];
                            this.$emit('authEvent');
                        }
                    }, () => {
                        this.error('E-mail or/and Password is/are incorrect. Please try again');
                    }
                );
            },
        }
    }
</script>
