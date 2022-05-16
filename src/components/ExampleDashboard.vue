<template>
  <div id="main">
    <!--<p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="increment">
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>-->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Todo, Meta } from './models';

export default defineComponent({
  name: 'ExampleDashboard',
  props: {
    title: {
      type: String,
      required: true
    },
    todos: {
      type: Array as PropType<Todo[]>,
      default: () => [] as Todo[]
    },
    meta: {
      type: Object as PropType<Meta>,
      required: true
    },
    active: {
      type: Boolean
    }
  },
  data(): { clickCount: number } {
    return {
      clickCount: 0
    };
  },
  methods: {
    increment(): void {
      this.clickCount += 1;
    }
  },
  computed: {
    todoCount(): number {
      return this.todos.length;
    }
  }
});
</script>

<style lang="scss">
#main {
  margin: 0 auto;
  text-align: left;
  width: 100%;
  height: 100vh !important;
}
#banner {
  max-width: 450px;
  margin: 15px;
}
</style>
