<template>
    <v-dialog max-width="700px" v-model="dialog" :persistent="true">
        <v-form v-on:submit.prevent="save" lazy-validation ref="form">
            <v-card>
                <v-card-title>
                    <h2 class="headline">{{ getTitle() }}</h2>
                </v-card-title>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-text-field :readonly="!$store.getters.isAdminRole" :rules="[rules.required]" label="Назва" type="text" v-model="task.title"></v-text-field>
                        </v-row>
                        <v-row>
                            <v-select
                                :items="priorities"
                                class="tag-input"
                                :rules="[rules.required]"
                                item-text="name"
                                item-value="id"
                                label="Пріорітет"
                                v-model="task.priority.id"
                                :readonly="!$store.getters.isAdminRole"
                            >
                            </v-select>
                        </v-row>
                        <v-row>
                            <v-select
                                :items="columns"
                                class="tag-input"
                                :rules="[rules.required]"
                                deletable-chips
                                item-text="name"
                                item-value="id"
                                label="Колонка"
                                v-model="task.column.id"
                                :readonly="!$store.getters.isAdminRole"
                            >
                            </v-select>
                        </v-row>
                        <v-row>
                            <v-select
                                :items="users"
                                class="tag-input"
                                :rules="[rules.required]"
                                deletable-chips
                                item-text="email"
                                item-value="id"
                                label="Виконавець"
                                v-model="task.executor.id"
                                :readonly="!$store.getters.isAdminRole"
                            >
                            </v-select>
                        </v-row>
                        <v-row>
                            <v-textarea :readonly="!$store.getters.isAdminRole" :rules="[rules.required]" label="Текст" v-model="task.text"></v-textarea>
                        </v-row>

                        <template v-if="isEdit">
                            <v-row class="flex justify-space-between">
                                <div><span class="font-weight-bold">Створена:</span> {{task.owner.email}}</div>
                                <div><span class="font-weight-bold">Дата:</span> {{task.date_created}}</div>
                            </v-row>
                        </template>
                    </v-container>

                    <v-divider></v-divider>

                    <v-card class="mx-auto border-primary" style="margin-top: 30px">
                        <v-card-title>Коментарі до задачі</v-card-title>
                        <v-list-item three-line v-for="comment in comments" v-bind:key="comment.id">
                            <v-list-item-content>
                                <v-list-item-title>{{ comment.text }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ comment.user_id.email }}
                                </v-list-item-subtitle>
                                <v-list-item-subtitle>
                                    {{ comment.date_created }}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-card-actions>
                            <v-text-field type="text" v-model="comment"></v-text-field>
                            <v-btn @click="addComment" color="success" text><v-icon left>add</v-icon>Додати коментар</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-card-text>

                <v-card-actions>
                    <v-btn v-if="isEdit && $store.getters.isAdminRole" type="submit" @click="del" color="error" text><v-icon left>delete</v-icon>Видалити</v-btn>

                    <v-spacer></v-spacer>

                    <v-btn @click="close" color="warning" text><v-icon left>logout</v-icon>Вийти</v-btn>
                    <v-btn type="submit" color="success" text><v-icon left>save</v-icon>Збереги</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script>
import taskStore from '@/store/task';
import commentStore from '@/store/comment';

export default {
    name: 'Task',
    props: {
        dialog: {
            type: Boolean,
            default: true
        },
        taskData: {
            type: Object
        },
        swimlanes: {
            type: Array
        },
        columns: {
            type: Array
        },
        priorities: {
            type: Array
        },
        users: {
            type: Array
        }
    },
    data() {
        return {
            isEdit: false,
            task: {
                "title": "",
                "text": "",
                "priority":{id: 0},
                "column":{id: 0},
                "swimlane":{id: 1},
                "executor":{id: 0}
            },
            rules: {
                required: value => !!value || 'Поле обов\'язкове',
                min: value => value.length >= 6 || 'Мінімум 6 символів',
            },
            comments: [],
            comment: '',
        }
    },
    mounted() {
        if (this.taskData !== null) {
            commentStore.getAll(this.taskData.id).then(response => this.comments = response.data.data);

            this.task = this.taskData;
            this.isEdit = true
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        async save() {
            if (!this.$refs.form.validate()) {
                return false;
            }

            if (this.isEdit) {
                await taskStore.update(this.task.id, this.task);
            } else {
                await taskStore.create(this.task);
            }

            this.$emit('submit');
        },
        async del() {
            await taskStore.delete(this.task.id);

            this.$emit('submit');
        },
        async addComment() {
            await commentStore.create(this.taskData.id, {text: this.comment}).then(
                response => this.comments.push(response.data.data)
            );
        },
        getTitle() {
            if (!this.$store.getters.isAdminRole) {
                return 'Опис задачі';
            }

            return this.isEdit ? 'Редагувати задачу' : 'Нова задача'
        }
    }
}
</script>
