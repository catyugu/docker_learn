<template>

  <div>
      <h1>Hello Table Manager!</h1>
      <TableComponent></TableComponent>
      <ul id="list">
      </ul>
  </div>
</template>

<script>
import TableComponent from './components/TableComponent.vue';

export default {
  name: 'App',
  components: {
    TableComponent, // 注册组件
  },
  mounted() {
    // 每秒添加时间戳
    setInterval(() => {
      const list = document.getElementById("list");
      const li = document.createElement("li");
      li.innerHTML = `<div>${new Date().toString()}</div>`;
      list.appendChild(li);

      // 如果列表项超过10个，则移除最早的一个
      if (list.childElementCount > 10) {
        list.removeChild(list.firstElementChild);
      }
    }, 1000);
  }
};
</script>
<style scoped>
h1 {
  color: #42b883;
}
</style>