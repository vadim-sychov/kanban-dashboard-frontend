<template>
    <div>
        <div v-for="(swimlane, index) in swimlanesKanban"  v-bind:key="index">
            <b>{{swimlane.title}}</b>
            <hr>
            <div class="flex justify-center">
                <div class="min-h-screen flex overflow-x-scroll py-12">
                    <div v-for="(column, index) in swimlane.columns" :key="index" class="bg-gray-100 rounded-lg px-3 py-3 column-width rounded mr-4">
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
                                @dblclick.native="doubleClick(task.id)"
                            ></task-card>
                        </draggable>
                    </div>
                </div>

            </div>
        </div>
        <router-view/>
    </div>
</template>
<script>
    import draggable from "vuedraggable";
    import TaskCard from '@/components/common/TaskCard'

    export default {
        name: 'KanbanBoard',
        components: {
            TaskCard,
            draggable,
        },
        data() {
            return {
                swimlanes: [ // TODO get it from storage
                    {
                        "id": 1,
                        "name": "Розробка",
                    }
                ],
                priorities: [ //TODO get it from storage
                    {"id":1,"name":"Низький","positionNumber":0,"color":"#409600"},
                    {"id":2,"name":"Нормальний","positionNumber":1,"color":"#FED74A"},
                    {"id":3,"name":"Високий","positionNumber":2,"color":"#FF7123"},
                    {"id":4,"name":"Критичний","positionNumber":3,"color":"#DC0083"}
                ],
                columns: [ //TODO get it from storage
                    {"id":1,"name":"Зробити","positionNumber":0},
                    {"id":2,"name":"В процесі","positionNumber":1},
                    {"id":3,"name":"Тестування","positionNumber":2},
                    {"id":4,"name":"Готово","positionNumber":3},
                ],
                tasks: [
                    {
                        id: 1,
                        title: 'Test task title',
                        executor: {
                            "id": 6,
                            "email": "writer@maze.com",
                            "role": "ROLE_WRITER",
                            "password": ""
                        },
                        priority: {
                            id: 1,
                            name: 'Major',
                            color: '#FED74A'
                        },
                        swimlane: {
                            "id":1,
                            "name":"Розробка",
                        },
                        column: {
                            "id":3,
                            "name":"Тестування",
                            "positionNumber":2
                        }
                    }
                ],
                swimlanesKanban: [
                    {
                        title: 'Завантаження',
                        columns: [
                            {
                                title: 'Завантаження',
                                id: 0,
                                tasks: [],
                            }
                        ],
                    }
                ],
                oldSwimlanesKanban: [],
            }
        },
        methods: {
            doubleClick(taskId) {
                // TODO push to popup
                this.$router.push({name: 'show_task_kanban', params: {id: taskId}});
            },
            onMove() {
                if (JSON.stringify(this.oldSwimlanesKanban) === JSON.stringify(this.swimlanesKanban)) {
                    return;
                }

                let oldSwimlanesKanban = this.oldSwimlanesKanban;
                let self = this;

                this.swimlanesKanban.forEach(function (swimlane, sk) {
                    for (const [ck, column] of Object.entries(swimlane.columns)) {
                        let oldTasks = oldSwimlanesKanban[sk].columns[ck].tasks;
                        if (column.tasks.length === oldTasks.length) {
                            continue;
                        }
                        if (column.tasks.length > oldTasks.length) {
                            let task = self.findMovedTask(oldTasks, column.tasks);
                            self.changeTaskColumn(task)
                        }

                        if (column.tasks.length < oldTasks.length) {
                            let task = self.findMovedTask(column.tasks, oldTasks);
                            self.changeTaskColumn(task);
                        }
                        return;

                    }
                });
                this.oldSwimlanesKanban = JSON.parse(JSON.stringify(this.swimlanesKanban));

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
            findMovedTaskNewColumn(taskToFind) {
                let columnToFind = {};
                let swimlaneToFind = {};

                this.swimlanesKanban.forEach(function (swimlane) {
                    loop1:
                        // eslint-disable-next-line no-unused-vars
                        for (const [index, column] of Object.entries(swimlane.columns)) {
                            for (const task of column.tasks) {
                                if (task.id === taskToFind.id) {
                                    columnToFind = column;
                                    swimlaneToFind = swimlane;
                                    break loop1;
                                }
                            }

                        }
                    if (columnToFind.id !== undefined) {
                        return;
                    }
                });

                return [columnToFind, swimlaneToFind];
            },
            changeTaskColumn(task) {
                const res = this.findMovedTaskNewColumn(task);
                let newColumn = res[0];
                let newSwimlane = res[1];
                newColumn = JSON.parse(JSON.stringify(newColumn));
                newColumn.tasks = [];
                task.column = newColumn;
                if (!this.checkIsAbleToMoveTask(newColumn, task)) {
                    alert('You are not able to move tasks to Posted column');
                    this.$router.go();
                }
                this.swimlanesKanban.forEach(function (value, index) {
                    if (value.title === newSwimlane.title) {
                        task.swimlane.id = index + 1;
                    }
                });
                this.$emit('updateTask', task);
            },
            checkIsAbleToMoveTask(newColumn, task) {
                if (newColumn.id !== 9) {
                    return true;
                }

                let isWriter = this.$store.getters.getUser.id === task.writer.id;

                if (isWriter && this.$can('close_assigned', 'Task')) {
                    return true;
                }

                if (!this.$can('close', 'Task')) {
                    return false;
                }

                return true;
            },
        },
        mounted() {
            let self = this;
            let swimlanesResult = [];

            this.swimlanes.forEach(function (swimlane, index) {
                swimlanesResult[index] = {
                    'title': swimlane['name'],
                    'columns': [],
                };

                let columnsResult = {};
                self.columns.forEach(function (column) {
                    let columnNum = column['positionNumber'];

                    if (columnsResult[columnNum] === undefined) {
                        columnsResult[columnNum] = {
                            'title': column['name'],
                            'id': column['id'],
                            'tasks': [],
                        };
                    }
                });

                self.tasks.forEach(function (task) {
                    let taskColumnNum = task['column']['positionNumber'];
                    if (task['swimlane']['id'] === swimlane['id']) {
                        columnsResult[taskColumnNum]['tasks'].push(task);
                    }
                });

                swimlanesResult[index]['columns'] = columnsResult;
            });

            this.swimlanesKanban = swimlanesResult;
            this.oldSwimlanesKanban = JSON.parse(JSON.stringify(swimlanesResult));
        },
    };
</script>

<style scoped>
    .column-width {
        min-width: 320px;
        width: 320px;
    }
</style>
