<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>{{ roleId?'编辑':'添加' }}角色</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <!-- 核心：控制active属性的变化 1-2-3 -->
      <div class="step-container">
        <el-steps direction="vertical" :active="activeStep">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <!-- 三块内容根据当前的状态只显示一块 -->
      <!--
        1. 频繁切换 v-show
        2. v-show 本质是控制样式的变化 - 不丢失dom状态
       -->
      <div v-show="activeStep === 1" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="infoForm" class="form-box" :model="roleForm" :rules="roleRules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.remark" />
            </el-form-item>
          </el-form>
        </div>

      </div>
      <div v-show="activeStep === 2" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <div class="tree-title">{{ item.title }}</div>
              <el-tree
                ref="tree"
                :data="item.children"
                show-checkbox
                check-strictly
                default-expand-all
                check-strictly
                node-key="id"
                highlight-current
                :props="{ label: 'title' }"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="activeStep === 3" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ roleForm.roleName }}</div>
            <div class="form-item">角色描述：{{ roleForm.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in disabledTreeList" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="diabledTree"
                  :data="item.children"
                  show-checkbox

                  default-expand-all
                  node-key="id"
                  :highlight-current="false"
                  :props="{ label: 'title'}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button v-if="activeStep > 1" @click="pre">上一步</el-button>
        <el-button v-if="activeStep < 3" type="primary" @click="next">下一步</el-button>
        <el-button v-if="activeStep === 3" @click="confirmAdd">确认</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getTreeListAPI, createRoleAPI, getRoleDetailAPI, updateRoleAPI } from '@/api/role'
import { addDisabled } from '@/utils/format'

export default {
  data() {
    return {
      disabledTreeList: [], treeList: [],
      activeStep: 1,
      roleForm: {
        roleName: '',
        remark: '',
        perms: [] // 添加选中的节点
      },
      roleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }}
  }, computed: {
    roleId() {
      return this.$route.query.roleId
    }
  }, mounted() {
    this.getTreeList()
    if (this.roleId) {
      this.getDetail()
    }
  },
  methods: { async getDetail() {
    const res = await getRoleDetailAPI(this.roleId)
    const { roleName, remark, perms } = res.data
    // 1. 回填基础表单
    this.roleForm.roleName = roleName
    this.roleForm.remark = remark
    this.roleForm.perms = perms
    // 2. 回填Tree
    this.$refs.tree.forEach((treeInstance, index) => {
      treeInstance.setCheckedKeys(this.roleForm.perms[index])
    })
  },
  async confirmAdd() {
    // await createRoleAPI(this.roleForm)
    await createRoleAPI(this.roleForm)
    if (this.roleId) {
      await updateRoleAPI({
        ...this.roleForm,
        roleId: this.roleId
      })
    } else {
      await createRoleAPI(this.roleForm)
    }
    this.$router.back()
  },
  async getTreeList() {
    const res = await getTreeListAPI()
    // 分开管理数据(引用类型 一个地方发生变化另一个地方也变 - 深拷贝)
    this.treeList = res.data
    // 深拷贝
    this.disabledTreeList = JSON.parse(JSON.stringify(res.data))
    // 处理禁用
    addDisabled(this.disabledTreeList)
  },
  // 下一步
  next() {
    if (this.activeStep === 3) return
    // this.activeStep++
    if (this.activeStep === 1) {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.activeStep++
        }
      })
    } else if (this.activeStep === 2) {
      // 处于权限状态
      // 在权限状态下需要做至少选择一项 校验通过才进入到下一个状态
      // 1. 需要在activeStep === 2下面做事儿
      // 2. 进入下一个状态 操作的activeStep++
      // 3. 获取到当前用户选择了什么 以这个作为条件
      this.roleForm.perms = []
      this.$refs.tree.forEach(treeInstance => {
        // 拿到的是五棵树各自选中的内容节点
        const list = treeInstance.getCheckedKeys()
        console.log(list)
        this.roleForm.perms.push(list)
        // 判断是否至少选中了一项
        // 思路：把五个数组合成一个数组 判断这个数组的长度是否大于零
      })
      console.log(this.roleForm.perms.flat())
      if (this.roleForm.perms.flat().length === 0) {
        // 一个都没选 给用户提示
        this.$message({ type: 'warning', message: '请至少选择一项' })
      } else {
        this.activeStep++
        // 给树形组件回填
        // 1. 拿到tree实例  2. 已经选择的节点数组
        this.$refs.diabledTree.forEach((tree, index) => {
          tree.setCheckedKeys(this.roleForm.perms[index])
        })
      }
    }
  },
  // next() {
  //   if (this.activeStep === 3) return
  //   // 在角色信息状态下需要做表单校验 校验通过之后才能进入到下一个状态
  //   // 1. 需要在activeStep === 1下面做事儿
  //   // 2. 进入下一个状态 操作的activeStep++
  //   if (this.activeStep === 1) {
  //     // 处于信息状态
  //     // TODO 表单校验 校验通过之后才执行activeStep++
  //     this.$refs.infoForm.validate(valid => {
  //       if (valid) {
  //         this.activeStep++
  //       }
  //     })
  //   } else if (this.activeStep === 2) {
  //     // 处于权限状态
  //     // 在权限状态下需要做至少选择一项 校验通过才进入到下一个状态
  //     // 1. 需要在activeStep === 2下面做事儿
  //     // 2. 进入下一个状态 操作的activeStep++
  //     // 3. 获取到当前用户选择了什么 以这个作为条件
  //     this.roleForm.perms = []
  //     this.$refs.tree.forEach(treeInstance => {
  //       // 拿到的是五棵树各自选中的内容节点
  //       const list = treeInstance.getCheckedKeys()
  //       this.roleForm.perms.push(list)
  //       // 判断是否至少选中了一项
  //       // 思路：把五个数组合成一个数组 判断这个数组的长度是否大于零
  //     })
  //     console.log(this.roleForm.perms.flat())
  //     if (this.roleForm.perms.flat().length === 0) {
  //       // 一个都没选 给用户提示
  //       this.$message({
  //         type: 'warning',
  //         message: '请至少选择一项'
  //       })
  //     } else {
  //       this.activeStep++
  //       // 给树形组件回填
  //       // 1. 拿到tree实例  2. 已经选择的节点数组
  //       this.$refs.diabledTree.forEach((tree, index) => {
  //         tree.setCheckedKeys(this.roleForm.perms[index])
  //       })
  //     }
  //   }
  // },

  pre() {
    if (this.activeStep === 1) return
    this.activeStep--
  }
  }
}
</script>
<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;

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

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;
    .step-container {
      height: 400px;
      width: 200px;
    }
    .form-container {
      flex:1;
      background-color: #fff;
      overflow-y: auto;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
          display: flex;
          flex-wrap: wrap;
        }
        .info{
          font-size:14px;
          color:#666;
          .form-item{
            margin-bottom:20px;
          }
        }
      }
      .form-box{
        width: 600px;
        display: flex;
        flex-direction: column;
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
    z-index: 10001;
  }
  .tree-wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .tree-item {
        flex: 1;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }
}
</style>
