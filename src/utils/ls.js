// 基于ls封装三个方法 存 取 删

export function lsSet(key, value) {
  // 既调用方法 + 把方法调用完的结果返回(是否正常存入)
  const str = JSON.stringify(value)
  return localStorage.setItem(key, str)
}

export function lsGet(key) {
  return JSON.parse(localStorage.getItem(key))
}

export function lsRemove(key) {
  return localStorage.removeItem(key)
}
