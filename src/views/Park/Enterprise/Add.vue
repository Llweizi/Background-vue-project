<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ id?'编辑':'添加' }}企业</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <!--
            el-form: 1.绑定表单数据对象 2.绑定校验规则对象
            el-form-item: prop指定规则
            e-input: v-model双向绑定
           -->
          <el-form ref="ruleForm" :model="addForm" :rules="rules" label-width="100px">
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <!--
                value: 表示将来要提交给后端的选中数据 1001
                label：直接给用户看的中文显示
                交互双向绑定逻辑：当选中某一项的时候，选中项的value的值会自动绑定到v-model后面的属性身上
               -->
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <!--
                action: 上传的接口地址 这里只适合简单的上传
                自定义上传：按照业务的需要自定义一些上传配置 :http-request

                上传：1.拿到用户选择的图片文件 2. 调用上传接口
               -->
              <el-upload
                class="upload-demo"
                action="#"
                :http-request="upload"
                :before-upload="beforeUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg文件，且不超过5M</div>

              </el-upload>
              <span class="preview"><img :src="addForm.businessLicenseUrl" alt=""></span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button>重置</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { updateExterpriseAPI, getIndustryListAPI, uploadAPI, createExterpriseAPI, getEnterpriseDetailAPI } from '@/api/enterprise'
export default {
  name: 'AddEnterprise',
  data() {
    // 自定义手机号校验
    const validateMobile = (rule, value, callback) => {
      console.log('开始对手机号进行校验了')
      // 编写逻辑
      // rule：当前校验的规则对象
      // value：用户在输入框中输入的具体的内容就是对它校验
      // callback: 校验处理放行函数 必须在校验通过之后调用这个函数才可以
      if (/^1[3-9]\d{9}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号格式'))
      }
    }
    return {
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      rules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        legalPerson: [
          { required: true, message: '请输入法人名称', trigger: 'blur' }
        ],
        registeredAddress: [
          { required: true, message: '请输入注册地址', trigger: 'blur' }
        ],
        industryCode: [
          { required: true, message: '请选择所在行业', trigger: 'change' }
        ],
        contact: [
          { required: true, message: '请选择企业联系人', trigger: 'blur' }
        ],
        contactNumber: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        businessLicenseId: [
          { required: true, message: '请上传合同文件' }
        ]
      },
      industryList: []
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  mounted() {
    this.getIndustryList()
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    async getIndustryList() {
      const res = await getIndustryListAPI()
      this.industryList = res.data
    },
    // 上传前校验
    // 注意的事儿
    // 1. file对象 描述了文件的信息 文件的名称(文件名) 大小(字节) 格式（image/png）
    // 2. 上传前的校验函数决定了正式上传函数是否能执行 上传前函数必须返回true才能继续执行上传函数
    // 3. 数组判断的时候includes

    beforeUpload(file) {
      console.log('上传前函数执行了', file)
      // file用户选择的文件
      const allowType = ['image/jpeg', 'image/png', 'image/jpg']
      // 判断传入的参数是否在数组中能找到 找到返回true 找不到就是false
      const isType = allowType.includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isType) {
        this.$message.error('上传合同只能是 JPG/JPEG/PNG 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传合同文件大小不能超过 5MB!')
      }
      return isType && isLt5M
    },
    // 自定义上传
    async upload(res) {
      console.log('正式上传函数执行了', res)
      // 1. 获取用户文件
      const file = res.file
      // 2. 调用上传接口
      // FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'businessLicense')
      const _res = await uploadAPI(formData)
      // 没有给对应的合同字段赋值
      this.addForm.businessLicenseId = _res.data.id
      this.addForm.businessLicenseUrl = _res.data.url
      // 单独校验字段
      this.$refs.ruleForm.validateField('businessLicenseId')
    },
    confirm() {
      this.$refs.ruleForm.validate(async(valid) => {
        // valid: 只有所有项都通过校验 才为true
        if (valid) {
          // TODO
          // 如果是编辑状态 调用编辑接口
          // 如果是新增状态 调用新增接口
          if (this.id) {
            // 编辑
            await updateExterpriseAPI({
              ...this.addForm,
              id: this.id
            })
          } else {
            // 新增
            await createExterpriseAPI(this.addForm)
          }

          this.$router.back()
          this.$message({
            message: `${this.id ? '编辑' : '新增'}成功`,
            type: 'success'
          })
        }
      })
    },
    // 回填数据 获取当前的详情数据
    async getDetail() {
      // 获取id参数从路由参数
      const res = await getEnterpriseDetailAPI(this.id)
      // 回填
      const { businessLicenseId, businessLicenseUrl, contact, contactNumber, industryCode, legalPerson, name, registeredAddress } = res.data
      this.addForm = { businessLicenseId, businessLicenseUrl, contact, contactNumber, industryCode, legalPerson, name, registeredAddress }
    }
  }
}
</script>

<style scoped lang="scss" scoped>
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;
  ::v-deep.el-input__inner{
  border: none;
}
  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }
      .arrow{
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left:20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form{
          display: flex;
          flex-wrap: wrap;
          .el-form-item{
            width: 50%;
          }
        }
      }
    }
    .preview{
      img{
        width: 80px;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
