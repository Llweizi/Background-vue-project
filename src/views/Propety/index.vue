<template>
  <div class="propety-container">
    <!-- 搜索框 -->
    <div class="search-container">
      <el-form :inline="true" :model="params">
        <el-form-item label="企业名称：">
          <el-input v-model="params.enterpriseName" placeholder="请输入一体杆名称" />
        </el-form-item>
        <el-form-item label="缴费时间：">
          <el-date-picker
            v-model="params.value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-button type="primary" @click="addBill">添加账单</el-button>
      <el-table style="width: 100%" :data="list">
        <el-table-column label="序号" type="index" width="100" :index="indexMethod" />
        <el-table-column label="账单编号" prop="billNumber" width="260" />
        <el-table-column label="企业名称" prop="enterpriseName" width="300" />
        <el-table-column label="租赁楼宇" prop="buildingName" />
        <el-table-column label="物业费(元/m²)" prop="propertyFeePrice" />
        <el-table-column label="账单金额(元)" prop="paymentAmount" />
        <el-table-column label="缴费时间" prop="createTime" />
        <el-table-column label="操作">
          <template #default>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="footer-container">
      <el-pagination
        :current-page="params.page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!-- 表格弹框 -->
    <el-dialog
      title="添加账单"
      :visible="dialogVisible"
      width="580px"
      :before-close="handleClose"
      style="width:100%"
    >
      <el-form ref="form" :model="addForm" :rules="addFormRules" label-position="top">
        <el-form-item label="选择租户" prop="enterpriseId">
          <el-select v-model="addForm.enterpriseId" placeholder="请选择租户">
            <el-option v-for="item in enterpriseList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="租赁楼宇" prop="buildingId">
          <el-select v-model="addForm.buildingId" placeholder="请选择租赁楼宇">
            <el-option
              v-for="item in buildingList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="缴费周期" prop="value">
          <el-date-picker
            v-model="addForm.value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:540px"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="支付金额" prop="paymentAmount">
          <el-input v-model="addForm.paymentAmount" placeholder="请输入支付金额" disabled />
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select v-model="addForm.paymentMethod" placeholder="请选择支付方式">
            <el-option label="微信" value="1" />
            <el-option label="支付宝" value="2" />
            <el-option label="现金" value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closed">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPropetyListAPI, buildingListAPI, enterpriseListApI, paymentAPI, addBillAPI } from '@/api/propety'
export default {
  name: 'Propety',
  data() {
    return {
      params: {
        page: 1,
        pageSize: 5,
        enterpriseName: '',
        value: ''
      },
      list: [], // 存放物业费列表
      total: 0,
      dialogVisible: false,
      buildingList: [], // 存放可租赁楼宇
      enterpriseList: [], // 存放租户
      // 表单数据对象
      addForm: {
        enterpriseId: '', // 租户
        buildingId: '', // 租赁楼宇
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        paymentAmount: '', // 支付金额
        paymentMethod: '', // 支付方式
        value: '' // 时间
      },
      // 校验规则
      addFormRules: {
        enterpriseId: [{ required: true, message: '请选择租户', trigger: 'blur' }],
        buildingId: [{ required: true, message: '请选择租赁楼宇', trigger: 'blur' }],
        paymentAmount: [{ required: true, message: '请输入支付金额', trigger: 'blur' }],
        paymentMethod: [{ required: true, message: '请选择支付方式', trigger: 'blur' }],
        value: [{ required: true, message: '请选择缴费时间', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'addForm.building'() {
      this.payment()
    },
    'addForm.value'() {
      this.payment()
    }
  },
  mounted() {
    this.getPropetyList()
  },
  methods: {
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
    // 取消添加
    closed() {
      this.dialogVisible = false
      this.addForm.enterpriseId = ''
      this.addForm.buildingId = ''
      this.addForm.startTime = ''
      this.addForm.endTime = ''
      this.addForm.paymentAmount = ''
      this.addForm.paymentMethod = ''
      this.addForm.value = ''
    },
    // 物业费列表
    async getPropetyList() {
      const res = await getPropetyListAPI(this.params)
      this.list = res.data.rows
      this.total = res.data.total
    },
    // 查询
    doSearch() {
      this.getPropetyList()
    },
    // 点击x，空白处关闭弹框
    handleClose() {
      this.dialogVisible = false
      //   this.addForm: {
      //   enterpriseId: '', // 租户
      //   buildingId: '', // 租赁楼宇
      //   startTime: '', // 开始时间
      //   endTime: '', // 结束时间
      //   paymentAmount: '', // 支付金额
      //   paymentMethod: '', // 支付方式
      //   value: '' // 时间
      // }
      this.addForm.enterpriseId = ''
      this.addForm.buildingId = ''
      this.addForm.startTime = ''
      this.addForm.endTime = ''
      this.addForm.paymentAmount = ''
      this.addForm.paymentMethod = ''
      this.addForm.value = ''
    },
    // 点击添加
    async addBill() {
      this.dialogVisible = true
      // 租户
      const _res = await enterpriseListApI()
      this.enterpriseList = _res.data.rows
      // 可租赁楼宇
      const res = await buildingListAPI()
      console.log(res)
      this.buildingList = res.data
    },
    // 页数发生改变
    handleCurrentChange(val) {
      this.params.page = val
      this.getPropetyList()
    },
    // 每页条数发生改变
    handleSizeChange(val) {
      this.params.page = 1
      this.params.pageSize = val
      this.getPropetyList()
    },
    // 自定义序号
    indexMethod(index) {
      // console.log(index)
      return ((this.params.page - 1) * this.params.pageSize) + index + 1
    },
    // 预算金额
    async payment() {
      if (this.addForm.building !== '' && this.addForm.value.length === 2) {
        this.addForm.startTime = this.addForm.value[0]
        this.addForm.endTime = this.addForm.value[1]
        const { buildingId, startTime, endTime } = this.addForm
        const res = await paymentAPI({ buildingId, startTime, endTime })
        this.addForm.paymentAmount = res.data
        // console.log('预算金额', res)
      }
    },
    // async payment() {
    //   if (this.addForm.building !== '' && this.addForm.value.length === 2) {
    //     this.addForm.startTime = this.addForm.value[0]
    //     this.addForm.endTime = this.addForm.value[1]

    //     const { bulidingId, startTime, endTime } = this.addForm
    //     const res = await paymentAPI({ bulidingId, startTime, endTime })
    //     this.addForm.paymentAmount = res.data
    //   }
    // },
    // 点击确认，添加账单

    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { enterpriseId, buildingId, startTime, endTime, paymentAmount, paymentMethod } = this.addForm
          await addBillAPI(
            { buildingId, startTime, endTime, paymentAmount, paymentMethod, enterpriseId }
          )
          this.getPropetyList()
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .search-container{
    display: flex;
    border-bottom: 1px solid #dcdbdb;
    padding-bottom:20px;
    .el-button{
      margin-left: 30px;
    }
  }
  .table-container{
    margin-top: 20px;
  }
  .footer-container{
    float: right;
  }
  .el-date-picker {
     width: 100%;
  }
  .el-dialog{
    .el-select {
    width: 100%;
  }
  }

</style>
