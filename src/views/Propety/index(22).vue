<!-- eslint-disable vue/no-parsing-error -->
<template>
  <section>
    <!-- 搜索区域 -->
    <div class="search_for">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="企业名称：">
          <el-input v-model.trim="queryForm.enterpriseName" placeholder="请输入企业名称" style="width:15vw" />
        </el-form-item>

        <el-form-item label="缴费时间：">
          <el-date-picker
            v-model="timer"

            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="sergetPropertyFee">查询</el-button>
        </el-form-item>

      </el-form>
      <hr style="border: 1px solid rgb(225, 232, 238);">
    </div>
    <!-- 添加和批量删除按钮 -->
    <div class="addAnddel">
      <el-button type="primary" @click="add">添加账单</el-button>

    </div>
    <!-- 表格 -->
    <div class="tabels">
      <el-table
        :data="propetyForm"
        style="width: 100%"
        stripe

        :highlight-current-row="true"
        @selection-change="selectionChange"
      >
        <el-table-column
          type="selection"
          width="80"
        />
        <el-table-column
          prop="billNumber"
          label="账单编号"
          width="180"
        />
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
          width="260"
        />
        <el-table-column
          prop="buildingName"
          label="租赁楼宇"
        />
        <el-table-column
          prop="propertyFeePrice"
          label="物业费(元/m²)"
          width="180"
        />
        <el-table-column
          prop="paymentAmount"
          label="账单金额(元)"
          width="180"
        />
        <el-table-column
          prop="createTime"
          label="	缴费时间"
        />
        <el-table-column
          label="操作"
          width="100"
        >
          <template #default="scope">
            <el-button size="mini" type="text" style="font-size: 14px" @click="add">查看</el-button>
            <el-button size="mini" type="text" style="font-size: 14px" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table
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
      <!-- <template #default="scope">
        {{ oneType(scope.row.poleType) }}
      </template>
      </el-table-column>
      <el-table-column
        prop="poleStatus"
        label="运行状态"
        width="100"
      >

    </div>
    <!-- 分页 -->
      <div class="page-container">
        <el-pagination

          :page-sizes="[5, 10, 15]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 弹窗 对话框 -->
      <el-dialog
        :title="'添加账单'"
        :visible="dialogVisible"
        width="30%"
        @close="closewindow"
        @open="openDia"
      >
        <div class="form-container">
          <el-form ref="Form" label-position="labelPosition" :model="addForm" :rules="rules">
            <el-form-item label="选择租户" prop="enterpriseId">

              <el-select v-model="addForm.enterpriseId" placeholder="请选择租户" style="width:100%">
                <el-option
                  v-for="item in xlqyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="租赁楼宇" prop="buildingId">
              <el-select v-model="addForm.buildingId" placeholder="请选择楼宇" style="width:100%">
                <el-option
                  v-for="item in xllyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="缴费周期" prop="poleIp">
              <el-input v-model="addForm.poleIp" />
            </el-form-item>

            <el-form-item label="支付金额" prop="areaId">
              <el-select v-model="addForm.enterpriseId" placeholder="请选择关联区域" style="width:100%">
                <el-option
                  v-for="item in xialaList"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="支付方式" prop="poleType">
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
    </div></section>
</template>
<script>
import { getPropertyFeeAPI, delPropertyFeeAPI, getEnterpriseAPI, getBulidingAPI } from '@/api/propertyFee'
import { IntegratedRodListAPI, getxialaListAPI, addPoleAPI, editPoleAPI, delListAPI } from '@/api/rodManage'
export default {
  name: 'Propety',
  data() {
    return {
      xllyList: [],
      xlqyList: [],
      addForm: { enterpriseId: null,
        buildingId: null,
        startTime: '',
        endTime: '',
        paymentAmount: null,
        paymentMethod: null

      },
      timer: '',
      labelPosition: 'left',
      propetyForm: [],
      queryForm: {
        page: 1, // 页数
        pageSize: 5, // 每页条数
        enterpriseName: '', // 一体杆名称
        start: '', // 一体杆编号
        end: ''
      },
      list: [], // 渲染列表
      total: 0, // 总条数
      dialogVisible: false, // 弹窗的显示与隐藏
      xialaList: [], // 下拉列表
      batchId: null, // 批量id
      addFo1rm: { // 添加数据项
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
        enterpriseId: [
          { required: true, message: '请选择租户', trigger: 'blur' }
        ],
        buildingId: [
          { required: true, message: '请选择租赁楼宇', trigger: 'blur' }
        ],
        poleIp: [
          { required: true, message: '请选择缴费周期', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请输入支付金额', trigger: 'blur' }
        ],
        poleType: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ]
      }
    }
  },

  mounted() {
    this.getPropertyFee()
  },
  methods: {

    sergetPropertyFee() {
      this.start = this.timer[0]
      // this.end = this.timer[1]
      this.getPropertyFee()
    },

    payStaus(type) {
      const MAP = {

        1: '微信',
        2: '支付宝',
        3: '现金'
      }
      return MAP[type]
    },
    del(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delPropertyFeeAPI(id)
        this.getPropertyFee()
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
    // 每页多少条
    handleSizeChange(page) {
      // 1. 需要把page交给请求参数
      this.queryForm.pageSize = page
      // 2. 重新发送列表接口请求
      this.getPropertyFee()
    },
    // 当前第几页
    handleCurrentChange(val) {
      // console.log(val)
      this.queryForm.page = val
      console.log(this.queryForm.page, '这是分页方法')
      this.getPropertyFee()
      console.log(this.queryForm.page, '这是分页方法请求')
    },
    // 获取物业费列表
    async getPropertyFee() {
      const res = await getPropertyFeeAPI(this.queryForm)
      console.log('这是个物业费数据集', res.data.rows, res.data.total, `这是${this.queryForm.page}页`, `这是${this.queryForm.pageSize}大小`)
      this.propetyForm = res.data.rows
      this.total = res.data.total
      console.log('这是时间差', this.timer)
    },
    // 渲染列表
    async integratedRodList() {
      const res = await IntegratedRodListAPI(this.queryForm)
      console.log(res)
      this.list = res.data.rows
      this.total = res.data.total
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
    openDia() {
      this.getlyxiala(),
      this.getxiala()
    },
    async getxiala() {
      const res = await getEnterpriseAPI()
      console.log(res)
      this.xlqyList = res.data
    },
    async getlyxiala() {
      const res = await getBulidingAPI()
      console.log(res)
      this.xllyList = res.data
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
        this.getPropertyFee()
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

