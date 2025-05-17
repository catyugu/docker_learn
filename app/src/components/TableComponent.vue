<template>
  <div>
    <!-- 表格部分 -->
    <table border="1">
      <thead>
        <tr>
          <!-- 显示"序号"代替_id -->
          <th v-for="(value, key) in headers" :key="key">
            {{ key === '_id' ? '序号' : headers[key] }}
          </th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in tableData" :key="index">
          <!-- 强制渲染固定字段 -->
          <td>
            {{ index + 1 }}
          </td>
          <td v-if="editingIndex === index">
            <input type="text" v-model="row.value" />
          </td>
          <td v-else>
            {{ row.value }}
          </td>
          <td>
            <div v-if="editingIndex === index">
              <button @click="saveEdit(index)">保存</button>
              <button @click="cancelEdit">取消</button>
            </div>
            <div v-else>
              <button @click="editRow(index)">编辑</button>
              <button @click="deleteRow(index)">删除</button>
            </div>
          </td>
        </tr>
        <!-- 新增行 -->
        <tr v-if="newRow">
          <td v-for="(value, key) in headers" :key="key">
            <!-- _id 字段不显示输入框 -->
            <div v-if="key === '_id'">-</div>
            <div v-else>
              <input type="text" v-model="newRow[key]" />
            </div>
          </td>
          <td>
            <button @click="saveNewRow">保存</button>
            <button @click="cancelNewRow">取消</button>
          </td>
        </tr>
        <tr>
          <td :colspan="Object.keys(headers).length + 1">
            <button @click="addNewRow">新增</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TableComponent',
  data() {
    return {
      // 表头定义
      headers: { _id: '_id', value: '值' },
      // 表格数据
      tableData: [],
      // 新增行数据
      newRow: null,
      // 正在编辑的行索引
      editingIndex: null,
      // 编辑中的行数据（用于恢复）
      editingRow: null,
    };
  },
  methods: {
    // 获取数据的方法
    async fetchData() {
      try {
        const response = await axios.get('/api/data');
        this.tableData = response.data;
        // 设置表头字段
        this.headers = { _id: '_id', value: '值' };
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    // 添加新行
    addNewRow() {
      this.newRow = {
        value: '',
      };
    },
    // 取消新增行
    cancelNewRow() {
      this.newRow = null;
    },
    // 保存新增行
    async saveNewRow() {
      if (this.newRow && this.newRow.value) {
        try {
          // 确保不包含_id字段（由MongoDB自动生成）
          const { _id, ...rowData } = this.newRow; // 如果存在_id则排除

          const response = await axios.post('/api/data', rowData);
          // 成功后更新tableData
          this.tableData.push(response.data);
          this.newRow = null;
        } catch (error) {
          console.error('Error saving new row:', error);
        }
      } else {
        console.log(this.newRow);
        alert('请输入值');
      }
    },
    // 开始编辑行
    editRow(index) {
      this.editingIndex = index;
      this.editingRow = { ...this.tableData[index] }; // 备份原数据
    },
    // 保存编辑
    async saveEdit(index) {
      try {
        const rowData = this.tableData[index];
        await axios.put(`/api/data/${rowData._id}`, rowData);
        this.editingIndex = null;
        this.editingRow = null;
      } catch (error) {
        console.error('Error saving edited row:', error);
      }
    },
    // 取消编辑
    cancelEdit() {
      // 恢复原始数据
      this.tableData[this.editingIndex] = this.editingRow;
      this.editingIndex = null;
      this.editingRow = null;
    },
    async deleteRow(index) {
      try {
        // 发送删除请求
        await axios.delete(`/api/data/${this.tableData[index]._id}`);
        // 从数据中删除该行
        this.tableData.splice(index, 1);
      } catch (error) {
        console.error('Error deleting row:', error);
      }
    },
  },
  mounted() {
    // 组件挂载时获取数据
    this.fetchData();
  },
};
</script>

<style scoped>
/* 表格样式 */
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 固定列宽 */
}

/* 表头样式 */
th {
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
  width: 20%; /* 固定列宽 */
}

/* 单元格样式 */
td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
  width: 20%; /* 固定列宽 */
  word-wrap: break-word; /* 自动换行 */
}

/* 按钮容器 */
button {
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 8px 10px; /* 增加内边距 */
  border: none; /* 移除默认边框 */
  border-radius: 4px; /* 添加圆角 */
  background-color: #4CAF50; /* 设置背景颜色 */
  color: white; /* 文字颜色 */
  cursor: pointer; /* 鼠标指针变为手型 */
}

button:hover {
  background-color: #45a049; /* 鼠标悬停时改变背景颜色 */
}

/* 调试信息样式 */
div[v-if="Object.keys(headers).length === 0"] {
  color: red;
  font-weight: bold;
}
</style>
