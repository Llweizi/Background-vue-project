<template>
  <div class="navbar">
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-button type="mini" @click="$router.push('/big-screen')">智慧大屏</el-button>
          <!-- 用户名称 -->
          <span class="name">黑马管理员</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank">
            <el-dropdown-item> 项目地址 </el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 退出登录
    logout() {
      // 1. 询问用户
      this.$confirm('是否确认退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确定时执行
        // 2. 实现退出逻辑 清空用户数据
        this.$store.commit('user/removeToken')
        // 清空路由
        this.$store.commit('menu/resetMenu')
        // fullPath 当前路由的完整路径(既包括path也包括路由的参数)
        // 你在哪里进行退出登录操作，再次登录之后要回到哪里
        // 当前路径：/url?id=1001
        // path  只包含路径 this.$route.path  /url
        // fullPath  路径和参数都在  this.$route.fullPath  /url?id=1001
        // 为啥要fullPath 跳回去的时候如果页面中有依赖于参数的请求不报错还可以继续请求
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }).catch(() => {
        // 取消时执行

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  position: relative;
  .app-breadcrumb {
    display: inline-block;
    font-size: 18px;
    line-height: 50px;
    margin-left: 10px;
    color: #ffffff;
    cursor: text;

    .breadBtn {
      background: #84a9fe;
      font-size: 14px;
      padding: 0 10px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      border-radius: 10px;
      margin-left: 15px;
    }
  }

  .user-dropdown {
    color: #fff;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .name{
          font-weight: 600;
          cursor: pointer;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
