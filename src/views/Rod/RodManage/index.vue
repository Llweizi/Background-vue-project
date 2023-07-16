<template>
  <section>
    <!-- 搜索区域 -->
    <div class="search_for">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="一体杆名称：">
          <el-input v-model.trim="queryForm.poleName" placeholder="请输入一体杆名称" style="width:15vw" />
        </el-form-item>

        <el-form-item label="一体杆编号：">
          <el-input v-model.trim="queryForm.poleNumber" placeholder="请输入一体杆编号" style="width:15vw" />
        </el-form-item>

        <el-form-item label="运行状态">
          <el-select v-model="queryForm.poleStatus" placeholder="请选择运行状态" style="width:15vw">
            <el-option label="正常" value="beijing" />
            <el-option label="异常" value="beijing" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="integratedRodList">查询</el-button>
        </el-form-item>

      </el-form>
      <hr style="border: 1px solid rgb(225, 232, 238);">
    </div>
    <!-- 添加和批量删除按钮 -->
    <div class="addAnddel">
      <el-button type="primary" @click="add">添加一体杆</el-button>
      <el-button plain @click="batchDel">批量删除</el-button>
    </div>
    <!-- 表格 -->
    <div class="tabels">
      <el-table
        :data="list"
        stripe
        style="width: 100%"
        :highlight-current-row="true"
        @selection-change="selectionChange"
      >
        <el-table-column
          type="selection"
          width="80"
        />
        <el-table-column
          type="index"
          label="序号"
          width="100"
        />
        <el-table-column
          prop="poleName"
          label="一体杆名称"
          width="200"
        />
        <el-table-column
          prop="poleNumber"
          label="一体杆编号"
          width="240"
        />
        <el-table-column
          prop="poleIp"
          label="一体杆IP"
          width="200"
        />
        <el-table-column
          prop="areaName"
          label="安装区域"
          width="200"
        />
        <el-table-column
          label="一体杆类型"
          width="100"
        >
          <!-- 枚举一体杆类型 -->
          <template #default="scope">
            {{ oneType(scope.row.poleType) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="poleStatus"
          label="运行状态"
          width="100"
        >
          <!-- 枚举状态类型 -->
          <template #default="res">
            {{ statusType(res.row.poleStatus) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160"
        >
          <template #default="scope">
            <el-button size="mini" type="text" style="font-size: 14px" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" style="font-size: 14px" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="fenye">
      <el-pagination
        :current-page="queryForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹窗 对话框 -->
    <el-dialog
      :title="addForm.id?'编辑一体杆':'添加一体杆'"
      :visible="dialogVisible"
      width="30%"
      @close="closewindow"
      @open="getxiala"
    >
      <div class="form-container">
        <el-form ref="Form" label-position="top" :model="addForm" :rules="rules">
          <el-form-item label="一体杆名称" prop="poleName">
            <el-input v-model="addForm.poleName" />
          </el-form-item>
          <el-form-item label="一体杆编号" prop="poleNumber">
            <el-input v-model="addForm.poleNumber" />
          </el-form-item>
          <el-form-item label="一体杆IP" prop="poleIp">
            <el-input v-model="addForm.poleIp" />
          </el-form-item>

          <el-form-item label="关联区域" prop="areaId">
            <el-select v-model="addForm.areaId" placeholder="请选择关联区域" style="width:100%">
              <el-option
                v-for="item in xialaList"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="一体杆类型" prop="poleType">
            <el-select v-model="addForm.poleType" placeholder="请选择一体杆类型" style="width:100%">
              <el-option
                v-for="item in poletypes"
                :key="item.id"
                :label="item.entrance"
                :value="item.id"
              />
              <!-- <el-option>入口</el-option> -->
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
import { IntegratedRodListAPI, getxialaListAPI, addPoleAPI, editPoleAPI, delListAPI } from '@/api/rodManage'
export default {
  name: 'Index',
  data() {
    return {
      queryForm: {
        page: 1, // 页数
        pageSize: 8, // 每页条数
        poleName: '', // 一体杆名称
        poleNumber: '', // 一体杆编号
        poleStatus: null // 运行状态 0:正常,1:异常
      },
      list: [], // 渲染列表
      total: null, // 总条数
      dialogVisible: false, // 弹窗的显示与隐藏
      xialaList: [], // 下拉列表
      batchId: null, // 批量id
      addForm: { // 添加数据项
        poleName: '', // 一体杆名称
        poleNumber: '', // 一体杆编号
        poleIp: '', // 一体杆IP
        areaId: null, // 关联区域ID
        poleType: '' // 一体杆类型entrance:入口,export:出口
      },
      poletypes: [
        { id: 'entrance', entrance: '入口' },
        { id: 'export', entrance: '出口' }
      ],
      rules: {
        poleName: [
          { required: true, message: '请输入一体杆名称', trigger: 'blur' }
        ],
        poleNumber: [
          { required: true, message: '请输入一体杆编号', trigger: 'blur' }
        ],
        poleIp: [
          { required: true, message: '请输入一体杆IP', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请输入区域ID', trigger: 'blur' }
        ],
        poleType: [
          { required: true, message: '请输入一体杆类型', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.integratedRodList()
  },
  mounted() {
  },
  methods: {
    // 渲染列表
    async integratedRodList() {
      const res = await IntegratedRodListAPI(this.queryForm)
      console.log(res)
      this.list = res.data.rows
      this.total = res.data.total
    },
    // 每页多少条
    handleSizeChange(val) {
      // console.log(val)
      this.queryForm.pageSize = val
      this.queryForm.page = 1
      this.integratedRodList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      // console.log(val)
      this.queryForm.page = val
      this.integratedRodList()
    },
    // 点击添加显示弹窗
    async add() {
      this.dialogVisible = true
    },
    // 枚举一体杆类型
    oneType(status) {
      const MAP = {
        'entrance': '入口',
        'export': '出口'
      }
      return MAP[status]
    },
    // 枚举状态类型
    statusType(type) {
      const MAP = {
        0: '正常',
        1: '异常'
      }
      return MAP[type]
    },
    // 关闭弹窗的回调
    closewindow() {
      this.dialogVisible = false
      this.addForm = { // 添加数据项
        poleName: '', // 一体杆名称
        poleNumber: '', // 一体杆编号
        poleIp: '', // 一体杆IP
        areaId: null, // 关联区域ID
        poleType: '' // 一体杆类型entrance:入口,export:出口
      }
    },
    // 打开弹窗的回调
    async getxiala() {
      const res = await getxialaListAPI()
      console.log(res)
      this.xialaList = res.data
    },
    // 添加确定按钮
    addData() {
      this.$refs.Form.validate(async(valid) => {
        if (valid) {
          if (this.addForm.id) {
            await editPoleAPI(this.addForm)
            this.integratedRodList()
            this.dialogVisible = false
          } else {
            await addPoleAPI(this.addForm)
            this.integratedRodList()
            this.$message({
              message: '恭喜你，添加成功',
              type: 'success'
            })
            this.dialogVisible = false
          }
        }
      })
    },
    // 编辑数据回显
    async edit(row) {
      this.dialogVisible = true
      console.log(row)
      const { id, poleName, poleNumber, poleIp, areaId, poleType } = row
      this.addForm = { id, poleName, poleNumber, poleIp, areaId, poleType }
      await editPoleAPI(this.addForm)
    },
    // 删除
    del(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delListAPI(id)
        this.integratedRodList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 批量删除
    async selectionChange(val) {
      // console.log(val)
      const result = val.map(item => item.id).join()
      console.log(result)
      this.batchId = result
    },
    async batchDel() {
      await delListAPI(this.batchId)
      this.integratedRodList()
    }
  }

}
</script>
<style lang='scss' scoped>
.demo-form-inline {
  .el-form-item {
    margin-right: 60px;
    &:nth-child(3) {
      margin-right: 20px;

    }
  }
}
.addAnddel {
  margin-top: 18px;
  margin-bottom: 18px;
  .el-button {
     font-size: 15px;
  }
}
.fenye {
  float: right;
  margin-top: 20px;
}
</style>
