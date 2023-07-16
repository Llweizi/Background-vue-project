<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <!--
        搜索：拿到当前用户输入的关键词 以这个关键词作为接口字段拿到列表数据 重新把列表数据渲染到模版中
        清空：既要清除输入框的显示（做好了） + 把列表所有的数据重新拉回来
       -->
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="clearSearch" />
      <el-button type="primary" @click="getList">查询</el-button>
    </div>
    <div class="create-container">
      <el-button v-auth-btn="'park:enterprise:add_edit'" type="primary" @click="$router.push('/enterpriseAdd')">添加企业</el-button>
      <el-button v-auth-btn="'park:enterprise:remove'">删除企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="tableList" @expand-change="expandChange">
        <el-table-column type="expand">
          <template #default="res">
            <el-table :data="res.row.rentList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" prop="startTime" />
              <!--
                el-table-column 默认只需要制定prop就可以渲染出来数据 必须是可以直接显示的
                如果数据不能直接显示 需要做二次转化 插槽
               -->
              <el-table-column label="合同状态">
                <template #default="scope">
                  <!-- 改造成差值之后就可以基于原始数据做二次处理了 -->
                  <!--
                    1. 要转化的数据非常简单  0/1  男/女  三元  {{ statas === 0 ?'女':'男'}}
                    2. 要转化的数据比较复杂  映射关系（枚举） 通过状态码和中文的一一对应关系 配合一个函数调用
                    前提：差值表达式中式可以进行函数调用的 且渲染的内容为函数的返回值
                   -->
                  {{ formatStatus(scope.row.status) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
            
                <template #default="scope">
                  <!--
                    生效状态下 - 退租按钮可点击的  删除不可点击
                    退租的状态下 - 退租按钮不可点击 删除可点击
                    1. 拿到当前合同的状态 作为条件   已退租 3  生效中 1
                    2. disabled  true就不可点击了
                   -->
                  <el-button size="mini" type="text" :disabled="scope.row.status === 3" @click="outRent(scope.row.id)">退租</el-button>
                  <el-button size="mini" type="text" :disabled="scope.row.status ===1">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
          width="120"
        />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text" @click="addRent(scope.row.id)">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editHandle(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页区域 -->
    <div class="page-container">
      <!--
        1. 根据后端的数据 渲染分页组件
           分页核心逻辑：页数 = 总数 / 每页条数(默认10条)
        2. 点击分页中的每一页切换table中的显示
           拿到当前点击的是第几页
           使用当前页的去后端获取数据
       -->
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </div>
    <!-- 弹框 -->
    <!--
      点击蒙层区域和小叉号会自动执行close事件
     -->
    <el-dialog
      title="提示"
      :visible="dialogVisible"
      width="580px"
      @close="closeDialog"
      @open="openDialog"
    >
      <div class="form-container">
        <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
          <el-form-item label="租赁楼宇" prop="buildingId">
            <el-select v-model="rentForm.buildingId" placeholder="请选择">
              <el-option
                v-for="item in buildingList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="租赁起止日期" prop="rentTime">
            <el-date-picker
              v-model="rentForm.rentTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="租赁合同" prop="contractId">
            <el-upload
              ref="uploadRef"
              action="#"
              :http-request="upload"
            >
              <el-button size="small" type="primary" plain>上传合同文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmCreateRent">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { outRentAPI, getExterpriseListAPI, getRentListAPI, getRentBuildListAPI, uploadAPI, createRentAPI } from '@/api/enterprise'
export default {
  data() {
    return {
      params: {
        page: 1, // 当前页数
        pageSize: 10, // 每页条数
        name: '' // 搜索的关键词 企业名称
      },
      tableList: [], // 列表
      total: 0,
      dialogVisible: false,
      buildingList: [],
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async outRent(id) {
      // 1. 使用id调用退租接口
      await outRentAPI(id)
      // 2. 后端拿到你退租的id 数据库操作 把当前行数据的出租状态更改为退租
      // 3. 重新获取新列表 （拿到的已经是更改完的列表）
      this.getList()
      // 4. 在模版中通过状态适配各种按钮的显示（按钮的显示和隐藏 / 是否可点击）
    },
    // 上传合同
    async upload(res) {
      console.log(res)
      // 1. 得到了File对象
      const file = res.file
      // 2. 创建一个formData实例
      const formData = new FormData()
      // 3. 往实例中按照接口文档格式添加字段和值
      formData.append('file', file)
      formData.append('type', 'contract')
      // 4. 调用接口
      const _res = await uploadAPI(formData)
      this.rentForm.contractId = _res.data.id
      this.rentForm.contractUrl = _res.data.url
    },
    // 新增合同
    addRent(id) {
      // 1. 打开弹框
      this.dialogVisible = true
      // 2. 记录当前项的id参数
      this.rentForm.enterpriseId = id
    },
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false
      // 清空表单 (reset方法在dialog一起使用的时候会有bug 手动控制数据初始化 + reset方法调用)
      this.rentForm = {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      }
      this.$refs.addForm.resetFields()
      this.$refs.uploadRef.clearFiles()
    },
    // 获取楼宇列表
    async getBuildinglist() {
      const res = await getRentBuildListAPI()
      this.buildingList = res.data
    },
    // 弹框打开
    openDialog() {
      this.getBuildinglist()
    },
    // 确认提交
    async confirmCreateRent() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          await createRentAPI({
            buildingId: this.rentForm.buildingId, // 楼宇id
            contractId: this.rentForm.contractId, // 合同id
            contractUrl: this.rentForm.contractUrl, // 合同Url
            enterpriseId: this.rentForm.enterpriseId, // 企业名称
            type: this.rentForm.type, // 合同类型
            startTime: this.rentForm.rentTime[0],
            endTime: this.rentForm.rentTime[1]
          })
          // 关闭弹框
          this.dialogVisible = false
          // 提示用户
          this.$message({
            type: 'success',
            message: '创建合同成功'
          })
          // 刷新列表
          this.getList()
        }
      })
    },
    // 获取企业列表
    async getList() {
      const res = await getExterpriseListAPI(this.params)
      // rows本来是一个数组 最终想要得到一个个数一样的数组 但是想把它里面的每一项中
      // 都增加一个新的rentList:[] 字段
      this.tableList = res.data.rows.map(item => {
        // 这里return出去的是啥 新数组中的每一项就是啥
        return {
          ...item,
          rentList: [] // 存放嵌套的合同列表的地方
        }
      })
      this.total = res.data.total
    },
    clearSearch() {
      // 1. 使用空的name再次获取最新的列表 2.渲染到table模版
      this.getList()
    },
    // 点击翻页
    pageChange(page) {
      console.log(page)
      this.params.page = page
      this.getList()
    },
    // 编辑企业
    editHandle(id) {
      this.$router.push({
        path: '/enterpriseAdd',
        query: {
          id
        }
      })
    },
    // 点击行展开式触发
    async expandChange(row, rows) {
      console.log('展开了', row, rows)
      // 1. 使用当前行的id （企业id去获取当前下的表格数据）
      const id = row.id
      // 2. 渲染内嵌table
      // 1. 二次处理表格数据 在每一行中都添加一个专门用来渲染自己下面的合同列表
      // 2. 获取到当前企业下的合同列表之后赋值给专门用来存放合同列表的数组中

      // 请求优化：只有在展开时才发送网络请求
      // 判断当前row是否能在rows中找到  查找方法 - find
      const isExpand = rows.find(item => item.id === row.id)
      if (isExpand) {
        const res = await getRentListAPI(id)
        // eslint-disable-next-line require-atomic-updates
        row.rentList = res.data
      }
    },
    // 格式化合同状态
    formatStatus(status) {
      // 基础status做处理
      // 1. 定义对应关系  key-value  对象
      // 2. 使用对象的中括号取值 传入status变量 拿到对应的中文 返回
      const MAP = {
        0: '待生效',
        1: '生效中',
        2: '已到期',
        3: '已退租'
      }
      return MAP[status]
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
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 400px;
  // text-align: center;
}
.form-container{
  padding:0px 80px;
}
</style>
