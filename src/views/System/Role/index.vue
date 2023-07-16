<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div v-for="(item,index ) in roleList" :key="item.roleId" class="role-item" :class="{active:index===currentIndex}" @click="switchRole(index,item.roleId)">
        <div class="role-info">

          <svg-icon :icon-class="index===currentIndex?'user-active' : 'user'" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <el-dropdown>
            <span class="el-dropdown-link">
              <svg-icon icon-class="more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <!--
                这个组件本身内部并没有抛出一个click事件  e-button @click
                .native 事件修饰符 把当前的点击事件自动绑定的组件内部的根元素身上
               -->
              <el-dropdown-item @click.native="editRole(item.roleId)">编辑角色</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/RoleAdd')">
        添加角色
      </el-button>
    </div>
    <div class="right-wrapper">
      <el-tabs v-model="activeName">
        <el-tab-pane label="功能权限" name="tree">
          <div class="tree-wrapper">
            <div v-for="item in treeList" :key="item.id" class="tree-item">
              <!-- title -->
              <div class="tree-title">{{ item.title }}</div>
              <!-- 树形结构 -->
              <el-tree
                ref="tree"
                :props="{label:'title'}"
                :data="item.children"
                show-checkbox
                :default-expand-all="true"
                node-key="id"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`成员列表(${memeberTotal})`" name="member">
          <el-table
            :data="roleUserList"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              width="250"
              label="序号"
            />
            <el-table-column
              prop="name"
              label="员工姓名"
            />
            <el-table-column
              prop="userName"
              label="登录账号"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
// 添加disabled属性方法
function addDisabled(treeList) {
  treeList.forEach(item => {
    item.disabled = true
    // 递归处理
    if (item.children && item.children.length > 0) {
      addDisabled(item.children)
    }
  })
}
import { getRoleListAPI, getTreeListAPI, getRoleDetailAPI, getRoleUserAPI } from '@/api/role'
export default {
  name: 'Role',

  data() {
    return {
      memeberTotal: 0,
      roleUserList: [],
      perms: [], // 当前角色权限点列表,
      treeList: [],
      activeName: 'tree',
      roleList: [],
      currentIndex: 0,
      defaultProps: {

        label: 'title'
      }
    }
  },
  async mounted() {
    await this.getRoleList()

    await this.getTreeList()
    this.setTreeByPerms(this.roleList[0].roleId)
    this.getRoleMemeber(this.roleList[0].roleId)
  }, methods: {
    editRole(roleId) {
      this.$router.push({
        path: '/roleAdd',
        query: {
          roleId
        }
      })
    },
    async getRoleMemeber(roleId) {
      const res = await getRoleUserAPI(roleId)
      console.log(res)
      this.roleUserList = res.data.rows
      this.memeberTotal = res.data.total
    },
    async setTreeByPerms(roleId) {
      const res = await getRoleDetailAPI(roleId)
      console.log(res)
      // 获取tree组件的实例对象
      console.log(this.$refs.tree)
      // 遍历tree实例对象 给它们分别调用 setCheckedKeys()
      this.$refs.tree.forEach((treeInstance, index) => {
        treeInstance.setCheckedKeys(res.data.perms[index])
      })
    },

    async getTreeList() {
      const res = await getTreeListAPI()
      this.treeList = res.data
      // 禁用
      // 目标：treeList里面的每一项以及嵌套的子项都添加一个disabled = true
      addDisabled(this.treeList)
    },
    async switchRole(index, roleId) {
      this.currentIndex = index
      this.setTreeByPerms(roleId)
      this.getRoleMemeber(roleId)
    },
    async getRoleList() {
      const res = await getRoleListAPI()
      this.roleList = res.data
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding:10px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
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

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>
