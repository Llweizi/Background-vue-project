<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input
        v-model="params.name"
        clearable
        placeholder="请输入内容"
        class="search-main"
        @clear="search"
      />
      <el-button type="primary" @click="search">查询</el-button>
    </div>
    <!-- 添加/导出 -->
    <div class="create-container">
      <el-button
        type="primary"
        @click="dialogFormVisible = true"
      >添加楼宇</el-button>
      <el-button @click="exportExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="tableList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="楼宇名称" width="180" prop="name" />
        <el-table-column label="层数" prop="floors" />
        <el-table-column label="在管面积(m²)" width="120" prop="area" />
        <el-table-column
          label="物业费(元/m²)"
          width="120"
          prop="propertyFeePrice"
        />
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            {{ scope.row.status ? '空置中' : '租赁中' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="medium"
              type="text"
              @click="editData(scope.row)"
            >编辑</el-button>
            <el-button
              size="medium"
              type="text"
              @click="delData(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination
        layout="->, total, prev, pager, next, ->, sizes, jumper"
        :total="total"
        :page-size="params.pageSize"
        :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 修改楼宇弹框 -->
    <div class="add-enterprise">
      <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form ref="changeForm" :model="form" :rules="rules">
          <el-form-item
            label="楼宇名称"
            prop="name"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.name"
              autocomplete="off"
              placeholder="请输入楼宇名称"
            />
          </el-form-item>
          <el-form-item
            label="楼宇层数"
            prop="floors"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model.number="form.floors"
              autocomplete="off"
              placeholder="请输入楼宇层数"
            />
          </el-form-item>
          <el-form-item
            label="在管面积"
            prop="area"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model.number="form.area"
              autocomplete="off"
              placeholder="请输入在管面积"
            >
              <template slot="append">m²</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="物业费"
            prop="propertyFeePrice"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model.number="form.propertyFeePrice"
              autocomplete="off"
              placeholder="请输入物业费"
            >
              <template slot="append">元/m²</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeData">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getBuildingListAPI,
  addBuildingAPI,
  delBuildingAPI,
  editBuildingAPI
} from '@/api/building'
import { chengfa } from '@/zuoye'
import { utils, writeFileXLSX } from 'xlsx'
export default {
  name: 'Building',
  data() {
    return {
      params: {
        page: 1, // 当前页，默认为第1页
        pageSize: 10, // 每页数据条数
        name: '' // 关键字
      },
      tableList: [], // 列表数据
      total: 0, // 数据总条数
      dialogFormVisible: false, // 默认弹框不可见
      formLabelWidth: '120px',
      form: {
        name: '',
        floors: '',
        area: '',
        propertyFeePrice: ''
      },
      rules: {
        name: [{ required: true, message: '请输入楼宇名称', trigger: 'blur' }],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' }
        ],
        area: [{ required: true, message: '请输入在管面积', trigger: 'blur' }],
        propertyFeePrice: [
          { required: true, message: '请输入物业费', trigger: 'blur' }
        ]
      },
      title: '增加楼宇' // 弹框标题
    }
  },
  mounted() {
    this.getList()
    chengfa()
  },
  methods: {

    // 渲染列表
    async getList() {
      const res = await getBuildingListAPI(this.params)
      this.tableList = res.data.rows
      this.total = res.data.total
    },
    // 清除搜索关键字/搜索关键字
    search() {
      // 重新渲染列表
      this.getList()
    },
    // 更改页码
    handleCurrentChange(val) {
      // 更改当前页码
      this.params.page = val
      // 重新渲染列表
      this.getList()
    },
    // 更改每页数据条数
    handleSizeChange(val) {
      // 更改每页数据数
      this.params.pageSize = val
      // 重新渲染列表
      this.getList()
    },
    // 修改楼宇
    changeData() {
      this.$refs.changeForm.validate(async valid => {
        if (valid) {
          // 根据是否有id判断进行编辑还是新增
          console.log(this.form.id)
          if (this.form.id) {
            // 发起编辑楼宇请求
            console.log(11211)
            await editBuildingAPI(this.form)
          } else {
            // 发起新增数据请求
            await addBuildingAPI(this.form)
          }
          // 重新渲染列表
          this.getList()
          // 关闭弹框
          this.dialogFormVisible = false
          // 重置表单
          this.form = {
            name: '',
            floors: '',
            area: '',
            propertyFeePrice: ''
          }
        }
      })
    },
    // 编辑楼宇
    editData(row) {
      // 打开弹框
      this.dialogFormVisible = true
      // 修改标题
      this.title = '编辑楼宇'
      // 数据回填
      const { id, area, floors, name, propertyFeePrice } = row
      this.form = { id, area, floors, name, propertyFeePrice }
    },
    // 删除楼宇
    async delData(id) {
      this.$confirm('确认删除当前楼宇吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // 发起删除数据请求
          await delBuildingAPI(id)
          // 重新渲染列表
          this.getBuildingList()
        })
        .catch(() => {})
    },
    // 导出Excel
    exportExcel() {
      console.log(123)
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}
.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  .search-label {
    width: 100px;
  }
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container {
  margin: 10px 0px;
}
.table {
  font-size: 14px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>
