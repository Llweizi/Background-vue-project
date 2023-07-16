<template>
  <div class="root">
    <div class="tabels">
      <el-table
        :data="propetyFeeData"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="序号"
          width="180"
        />
        <el-table-column
          prop="billNumber"
          label="物业费账单编号"
          width="180"
        />
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
        />
        <el-table-column
          prop="buildingName"
          label="楼宇名称"
        />
        <el-table-column
          prop="propertyFeePrice"
          label="物业费"
        />
        <el-table-column
          prop="paymentAmount"
          label="账单金额"
        />
        <el-table-column
          prop="startTime"
          label="缴费时间"
        />
        <el-table-column
          prop="enterpriseName"
          label="企业名称"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="fenye">
      <el-pagination
        :current-page="params.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getPropertyFeeAPI } from '@/api/propertyFee'

export default {
  name: 'Propety',
  data() {
    return {
      propetyFeeData: [],
      params: {

        page: 1, // 页数
        pageSize: 5, // 每页条数
        enterpriseName: '', // 一体杆名称
        start: '', // 一体杆编号
        end: ''
      }, total: 0

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await getPropertyFeeAPI(this.params)
      this.propetyFeeData = res.data.rows
      this.total = res.data.total
      console.log(res.data.rows, res.data.total)
    },
    handleClick(row) {
      console.log(row)
    },
    // 每页多少条
    handleSizeChange(val) {
      // console.log(val)
      this.params.pageSize = val
      this.params.page = 1
      this.getList() // 渲染
    },
    // 当前第几页
    handleCurrentChange(val) {
      // console.log(val)
      this.params.page = val
      this.getList() // 渲染
    }

  }
}
</script>

<style>

</style>
