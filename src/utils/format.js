export function addDisabled(treeList) {
  treeList.forEach(item => {
    item.disabled = true
    // 递归处理
    if (item.children && item.children.length > 0) {
      addDisabled(item.children)
    }
  })
}
