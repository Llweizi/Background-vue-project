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
      >添加一体杆</el-button>

    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="tableList">
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column type="index" label="序号" />

        <el-table-column label="一体杆名称" width="180" prop="poleName" />
        <el-table-column label="一体杆编号" prop="poleNumber" />
        <el-table-column label="一体杆IP" width="180" prop="poleIp" />
        <el-table-column label="安装区域" width="120" prop="areaName" />
        <el-table-column
          label="一体杆类型"
          width="120"
          prop="poleType"
        />
        <el-table-column label="运行状态" prop="poleStatus">
          <template #default="scope">
            {{ scope.row.poleStatus ? '异常' : '正常' }}
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

    <div class="block">
      <span class="demonstration" />
      <el-pagination
        :current-page="currentPage"

        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加楼宇弹框 -->
    <!-- <div class="add-enterprise">
      <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form ref="changeForm" :label-position="labelPosition" :model="form" :rules="rules">
          <el-form-item
            label="一体杆名称"
            prop="name"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="form.name"
              autocomplete="off"
              placeholder="请输入一体杆名称"
            />
          </el-form-item>
          <el-form-item
            label="一体杆编号"
            prop="floors"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model.number="form.floors"
              autocomplete="off"
              placeholder="请输入一体杆编号"
            />
          </el-form-item>
          <el-form-item
            label="一体杆IP"
            prop="area"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model.number="form.area"
              autocomplete="off"
              placeholder="请输入一体杆IP"
            />

          </el-form-item>
          <el-form-item
            label="关联区域"
            prop="propertyFeePrice"
            :label-width="formLabelWidth"
          >
            <!-- <el-input
              v-model.number="form.propertyFeePrice"
              autocomplete="off"
              placeholder="请选择关联区域"
            /> -->
            <!-- <el-select v-model="value" placeholder="请选择关联区域">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="一体杆IP"
            prop="area"
            :label-width="formLabelWidth"
          >
            <el-select v-model="value" placeholder="请选择一体杆IP">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeData">确 定</el-button>
        </div>
      </el-dialog>
    </div> --> -->
  </div>
</template>

<script>
import {
  getRodManageListAPI,
  addRodManageAPI,
  delRodManageAPI,
  editRodManageAPI
} from '@/api/rodManage.js'
import { chengfa } from '@/zuoye'

export default {
  name: 'RodManage',
  data() {
    return {
      labelPosition: 'top',
      multipleSelection: [],
      params: {
        page: 1, // 当前页，默认为第1页
        pageSize: 5, // 每页数据条数
        poleName: '', // 关键字
        poleNumber: '',
        poleStatus: ''
      },
      tableList: [], // 列表渲染的   数据
      total: 0, // 数据总条数
      dialogFormVisible: false, // 默认弹框不可见
      formLabelWidth: '80px',
      data: {
        poleName: '',
        flopoleNumberors: '',
        arepoleIpa: '',
        areaId: '',
        poleType: ''
      }, form: {},
      rules: {
        poleName: [{ required: true, message: '请输入一体杆名称', trigger: 'blur' }],
        flopoleNumberors: [
          { required: true, message: '请输入一体杆编号', trigger: 'blur' }
        ],
        arepoleIpa: [{ required: true, message: '请输入在一体杆IP', trigger: 'blur' }],
        propertyFeePrice: [
          { required: true, message: '请选择一体杆关联区域', trigger: 'blur' }
        ],
        poleType: [
          { required: true, message: '请选择一体杆类型', trigger: 'blur' }
        ]
      },
      title: '添加一体杆' // 弹框标题
    }
  },
  mounted() {
    this.getList()
    console.log(total)
    chengfa()
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 渲染列表
    async getList() {
      const res = await getRodManageListAPI(this.params)
      console.log('数据', res.data, res.total)
      this.tableList = res.data.rows
      this.total = res.total
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
            await editRodManageAPI(this.form)
          } else {
            // 发起新增数据请求
            await addRodManageAPI(this.form)
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
          await delRodManageAPI(id)
          // 重新渲染列表
          this.getBuildingList()
        })
        .catch(() => {})
    },
    poleStatus(Status) {
      const MAP = {
        0: '正常',
        1: '异常'

      }
      return MAP[Status]
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
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
.el-input  :v-deep .el-input__inner{

  width: 70%;
}
</style>
