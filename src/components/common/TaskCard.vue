<template>
    <div v-if="task.id !== undefined" class="task__item bg-white shadow rounded px-3 pt-3 pb-5 border border-white">

        <div :style="getStatusColor()" class="task__priority-border"></div>

        <div class="flex justify-between">
            <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">#{{task.id}}</p>
            <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">{{task.title}}</p>
        </div>

        <span class="text-sm text-gray-600">{{task.executor.email}}</span>

        <div class="flex mt-4 justify-between items-center">
            <div class="task__bottom">
                <div>
                    <span :style="getStatusColor()" class="task__priority-circle"></span>
                    <span class="task__priority text-sm text-gray-600">{{task.priority.name}}</span>
                </div>
                <span class="text-sm text-gray-600">{{getDateCreated()}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TaskCard',
        props: {
            task: {
                type: Object,
                default: () => ({})
            },
        },
        methods: {
            getDateCreated: function () {
                return '2021-04-21'
            },

            getStatusColor() {
                let color = 'black';

                if (this.task.priority !== undefined) {
                    color = this.task.priority.color;
                }

                return { background: color };
            },
        },
    };
</script>
