<template>
    <div>
        <v-data-table :headers="headers" :items="users" hide-default-footer :items-per-page="100" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-spacer></v-spacer>
                    <v-dialog max-width="500px" v-model="dialog">
                        <template v-slot:activator="{ on }">
                            <v-btn class="mb-2" color="success" dark v-on="on">Новий користувач</v-btn>
                        </template>
                        <v-form v-on:submit.prevent="save" lazy-validation ref="form">
                            <v-card>
                                <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-text-field :rules="[rules.required]" label="Email" type="email" v-model="editedItem.email"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4" sm="6">
                                                <v-select
                                                    :items="roles"
                                                    class="tag-input"
                                                    :rules="[rules.required]"
                                                    deletable-chips
                                                    item-text="text"
                                                    item-value="key"
                                                    label="Роль"
                                                    v-model="editedItem.role"
                                                >
                                                </v-select>
                                            </v-col>
                                        </v-row>
                                        <template v-if="editedIndex === -1">
                                            <v-row>
                                                <v-col cols="12" md="6" sm="6">
                                                    <v-text-field
                                                        :rules="[rules.required, rules.min]"
                                                        type="password"
                                                        name="input-10-2"
                                                        label="Пароль"
                                                        v-model="editedItem.password"
                                                    ></v-text-field>
                                                </v-col>

                                            </v-row>
                                        </template>
                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="close" color="error" text>Відміна</v-btn>
                                    <v-btn type="submit" color="success" text>Збереги</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                    </v-dialog>
                </v-toolbar>
            </template>

            <template v-slot:item="{ item }">
                <tr>
                    <td>
                        {{item.id}}
                    </td>
                    <td>
                        {{item.email}}
                    </td>
                    <td>
                        {{ roles.find(x => x.key === item.role).text }}
                    </td>
                    <td class="text-center">
                        <v-icon @click="editItem(item)" small>edit</v-icon>
                    </td>
                    <td class="text-center">
                        <v-icon @click="deleteItem(item)" small>delete</v-icon>
                    </td>
                </tr>
            </template>
            <template v-slot:header.ID></template>
        </v-data-table>

        <v-overlay :absolute="false" :value="isLoading">
            <rotate-loader></rotate-loader>
        </v-overlay>
    </div>
</template>

<script>
    import userStore from '@/store/user';
    import RotateLoader from 'vue-spinner/src/RotateLoader';

    export default {
        name: 'UserManagement',
        components: { RotateLoader },
        data: () => {
            return {
                isLoading: false,
                headers: [
                    {
                        name: 'id',
                        text: 'ID',
                        sortable: true,
                        value: 'id',
                        visible: false,
                        hidden: true,
                        active: false,
                        disabled: true
                    },
                    {text: 'Email', value: 'email'},
                    {text: 'Роль', value: 'role'},
                    {text: 'Редагувати', sortable: false, align: 'center'},
                    {text: 'Видалити', sortable: false, align: 'center'},
                ],
                roles: [
                    {
                        'key': 'ROLE_MANAGER',
                        'text': 'Менеджер'
                    },
                    {
                        'key': 'ROLE_ADMIN',
                        'text': 'Адмін'
                    },
                    {
                        'key': 'ROLE_USER',
                        'text': 'Користувач'
                    },
                ],
                users: [],
                dialog: false,
                rules: {
                    required: value => !!value || 'Поле обов\'язкове',
                    min: value => value.length >= 6 || 'Мінімум 6 символів',
                },
                isPasswordVisible: false,
                editedIndex: -1,
                editedItem: {
                    email: '',
                    role: 0,
                    password: '',
                },
                defaultItem: {
                    email: '',
                    role: 0,
                    password: '',
                }
            }
        },
        methods: {
            updateUser (user) {
                userStore.update(user.id, user).then((response) => {
                    this.users.push(response.data.data);
                }).catch((errorResponse) => {
                    alert('Помилка: ' + errorResponse.data.message);
                }).finally(() => {
                    this.isLoading = false;
                });
            },
            save () {
                if (!this.$refs.form.validate()) {
                    return false;
                }

                this.isLoading = true;
                this.editedItem.roles = [this.editedItem.role];

                if (this.editedIndex > -1) {
                    Object.assign(this.users[this.editedIndex], this.editedItem);
                    this.updateUser(this.editedItem);
                } else {
                    this.createUser(this.editedItem);
                }
                this.close();
            },
            editItem (item) {
                this.editedIndex = this.users.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialog = true;
            },
            deleteItem (item) {
                this.isLoading = true;

                const index = this.users.indexOf(item);
                this.users.splice(index, 1);
                this.deleteUser(item);
            },
            close () {
                this.dialog = false;
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                }, 300);
            },
            createUser (user) {
                userStore.create(user).then((response) => {
                    this.users.push(response.data.data);
                }).catch((errorResponse) => {
                    alert('Помилка: ' + errorResponse.data.message);
                }).finally(() => {
                    this.isLoading = false;
                });
            },
            deleteUser (user) {
                userStore.delete(user.id).finally(() => { this.isLoading = false });
            }
        },
        computed: {
            formTitle () {
                return this.editedIndex === -1 ? 'Новий користувач' : 'Редагувати користувача';
            }
        },
        watch: {
            dialog (val) {
                val || this.close();
            }
        },
        mounted: function () {
            userStore.getAll().
            then(response => {
                console.log(response);
                this.users = response.data.data;
            });
        }
    }
</script>
