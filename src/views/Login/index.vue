<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <!-- 表单区域 -->
      <!--
        el-form: 绑定表单对象 / 绑定校验规则对象
        el-form-item: 通过prop属性指定一下当前的表单要使用哪条校验规则
        el-input: 双向绑定的 v-model
       -->
      <el-form ref="form" :model="loginForm" :rules="loginRules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="loginForm.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="doLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const LOGINFORMKEY = 'loginformkey'
import { lsGet, lsSet, lsRemove } from '@/utils/ls'
export default {
  name: 'Login',
  data() {
    return {
      // 注意：这里的字段名要以将来提交给后端的接口为主
      loginForm: {
        username: 'admin',
        password: 'admin123',
        remember: false
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // 先取后赋值
    const formObj = lsGet(LOGINFORMKEY)
    if (formObj) {
      this.loginForm.username = formObj.username
      this.loginForm.password = formObj.password
    }
  },
  methods: {
    doLogin() {
      // 表单的统一校验
      // this.$refs[formName] -> el-form组件实例对象
      // .validate 调用实例身上的校验方法 -> 对所有需要校验的表单进行统一验证
      // valid 布尔值 只有当所有表单都通过校验时才为true
      console.log(this.$refs.form)
      this.$refs.form.validate(async(valid) => {
        console.log(valid)
        if (valid) {
          // 校验通过 -> 登录
          // 为了保证token成功拿到并且存入vuex中才进行跳转
          // 需要做一些同步处理 async await
          await this.$store.dispatch('user/asyncLogin', this.loginForm)
          // 1. 跳转到首页
          // 路由跳转传参
          // 俩种
          // params  path/1001   this.$route.param.id
          // query  path?id=1001  this.$route.query.id

          const redirect = this.$route.query.redirect // /sys/role
          if (redirect) {
            this.$router.push(redirect) // push('/sys/role')
          } else {
            this.$router.push('/')
          }
          // 2. 提示用户当前成功
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          // 记住密码功能 判断当前选择框是否为true，如果是，就存入本地

          // 回填 当用户再次回到登录页的时候 把记录的数据再次填入输入框
          // 1. 取出来存的数据
          // 2. 双向绑定 给loginForm赋值 就可以在浏览器中显示
          // 3. 一上来就要回填 找一个一上来就执行的生命周期 在它内部进行操作

          // 用户不选中 登录的之后需要清除数据
          if (this.loginForm.remember) {
            const { username, password } = this.loginForm
            lsSet(LOGINFORMKEY, { username, password })
          } else {
            lsRemove(LOGINFORMKEY)
          }
        }
      })
    }
  }
}

</script>

<style scoped lang="scss">
.login_body {
  display: flex;
}

.bg {
  width: 60vw;
  height: 100vh;
  background: url('~@/assets/login-bg.svg') no-repeat;
  background-position: right top;
  background-size: cover;
}

.box {
  margin: 200px 10% 0;
  flex: 1;

  .title {
    padding-bottom: 76px;
    font-size: 26px;
    font-weight: 500;
    color: #1e2023;
  }

  ::v-deep() {
    .ant-form-item {
      display: flex;
      margin-bottom: 62px;
      flex-direction: column;
    }

    .ant-form-item-label label {
      font-size: 16px;
      color: #8b929d;
    }

    .ant-input,
    .ant-input-password {
      border-radius: 8px;
    }
  }
}

.login_btn {
  width: 100%;
}
</style>
