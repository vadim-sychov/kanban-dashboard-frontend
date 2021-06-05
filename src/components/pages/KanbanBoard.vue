<template>
    <div>
        <div class="align-content-space-between justify-space-between flex">
            <b style="padding-top: 10px">{{currentSwimlane.name}}</b>
            <v-btn v-if="$store.getters.isAdminRole" class="mb-2" color="success" align="right" dark @click="newTaskClick"><v-icon left>add</v-icon> Нова задача</v-btn>
        </div>
        <hr>
        <div class="flex justify-center">
            <div class="min-h-screen flex overflow-x-scroll py-12">
                <div v-for="(column, index) in currentSwimlane.columns" :key="index" class="bg-gray-100 rounded-lg px-3 py-3 column-width rounded mr-4">
                    <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">{{column.title}}</p>
                    <draggable
                        :list="column.tasks"
                        :animation="200"
                        :empty-insert-threshold="100"
                        ghost-class="ghost-card"
                        group="tasks"
                        @change="onMove"
                    >
                        <task-card
                            v-for="(task, index) in column.tasks"
                            :key="index"
                            :task="task"
                            class="mt-3 cursor-move"
                            @dblclick.native="doubleClick(task)"
                        ></task-card>
                    </draggable>
                </div>
            </div>
        </div>

        <task-dialog
            v-if="taskDialog"
            :taskData="editedTask"
            :swimlanes="swimlanes"
            :columns="columns"
            :priorities="priorities"
            :users="users"
            @close="taskDialog = false"
            @submit="updateTasks"
        ></task-dialog>

        <v-overlay :absolute="false" :value="isLoading">
            <rotate-loader></rotate-loader>
        </v-overlay>
    </div>
</template>
<script>
    import draggable from "vuedraggable";
    import TaskCard from '@/components/common/TaskCard'
    import RotateLoader from 'vue-spinner/src/RotateLoader';

    import swimlaneStore from "@/store/swimlane";
    import columnStore from "@/store/column";
    import taskStore from "@/store/task";
    import priorityStore from "@/store/priority";
    import userStore from "@/store/user";

    import TaskDialog from "./TaskDialog";

    export default {
        name: 'KanbanBoard',
        components: {
            TaskCard,
            draggable,
            RotateLoader,
            TaskDialog
        },
        data() {
            return {
                taskDialog: false,
                editedTask: {},
                isLoading: true,
                currentSwimlaneId: 0,
                swimlanes: [
                    {
                        "id": 1,
                        "name": "Завантаження",
                    },
                ],
                priorities: [],
                columns: [],
                tasks: [],
                users: [],
                currentSwimlane: {
                    name: 'Завантаження',
                    columns: [
                        {
                            name: 'Завантаження',
                            id: 0,
                            tasks: [],
                        }
                    ],
                },
                oldCurrentSwimlane: {},
            }
        },
        methods: {
            doubleClick(task) {
                this.editedTask = task;
                this.taskDialog = true;
            },
            newTaskClick() {
                this.editedTask = null;
                this.taskDialog = true;
            },
            async updateTasks() {
                this.isLoading = true;
                this.taskDialog = false;

                await taskStore.getAll().then(response => this.tasks = response.data.data);
                this.buildInitialData();

                this.isLoading = false;
            },
            onMove() {
                if (JSON.stringify(this.oldCurrentSwimlane) === JSON.stringify(this.currentSwimlane)) {
                    return;
                }

                let oldCurrentSwimlane = this.oldCurrentSwimlane;

                for (const [columnIndex, column] of Object.entries(this.currentSwimlane.columns)) {
                    let oldTasks = oldCurrentSwimlane.columns[columnIndex].tasks;

                    if (column.tasks.length === oldTasks.length) {
                        continue;
                    }
                    if (column.tasks.length > oldTasks.length) {
                        let task = this.findMovedTask(oldTasks, column.tasks);
                        this.changeTaskColumn(task)
                    }

                    if (column.tasks.length < oldTasks.length) {
                        let task = this.findMovedTask(column.tasks, oldTasks);
                        this.changeTaskColumn(task);
                    }
                    return;

                }

                this.oldCurrentSwimlane = JSON.parse(JSON.stringify(this.currentSwimlane));

            },
            findMovedTask(columnFrom, columnTo) {
                let task = {};
                for (const taskTo of columnTo) {
                    let taskExistInFrom = false;
                    for (const taskFrom of columnFrom) {
                        if (taskFrom.id === taskTo.id) {
                            taskExistInFrom = true;
                        }
                    }
                    if (!taskExistInFrom) {
                        task = taskTo;
                        break;
                    }

                }
                return task;
            },
            changeTaskColumn(task) {
                let newColumn = this.findMovedTaskNewColumn(task);

                newColumn = JSON.parse(JSON.stringify(newColumn));
                newColumn.tasks = [];
                task.column = newColumn;

                taskStore.update(task.id, task);
            },
            findMovedTaskNewColumn(taskToFind) {
                let columnToFind = {};

                loop1:
                for (const [, column] of Object.entries(this.currentSwimlane.columns)) {
                    for (const task of column.tasks) {
                        if (task.id === taskToFind.id) {

                            columnToFind = column;
                            break loop1;
                        }
                    }

                }

                return columnToFind;
            },
            async getInitialData() {
                await swimlaneStore.getAll().then(response => this.swimlanes = response.data.data);
                await taskStore.getAll().then(response => this.tasks = response.data.data);
                await priorityStore.getAll().then(response => this.priorities = response.data.data);
                await userStore.getAll().then(response => this.users = response.data.data);

                this.currentSwimlane = this.swimlanes[this.currentSwimlaneId];

                await columnStore.getAll(this.currentSwimlane['id']).then(response => this.columns = response.data.data);
            },
            buildInitialData() {
                let columnsResult = [];
                this.columns.forEach((column) => {
                    let columnNum = column['position'];

                    if (columnsResult[columnNum] === undefined) {
                        columnsResult[columnNum] = {
                            'title': column['name'],
                            'id': column['id'],
                            'tasks': [],
                        };
                    }
                });

                this.currentSwimlane['columns'] = columnsResult;

                this.tasks.forEach((task) => {
                    let taskColumnNum = task['column']['position'];
                    if (task['swimlane']['id'] === this.currentSwimlane['id']) {
                        this.currentSwimlane['columns'][taskColumnNum]['tasks'].push(task);
                    }
                });

                this.currentSwimlane = JSON.parse(JSON.stringify(this.currentSwimlane));
                this.oldCurrentSwimlane = JSON.parse(JSON.stringify(this.currentSwimlane));
                this.isLoading = false;
            }
        },
        async mounted() {
            await this.getInitialData();

            this.buildInitialData();
        },
    };
</script>

<style scoped>
    .column-width {
        min-width: 320px;
        width: 320px;
    }
</style>
