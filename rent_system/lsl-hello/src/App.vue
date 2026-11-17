<template>
  <div class="app">
    <el-header height="70">
      <div class="header-box container">
        <div class="logo">📦 校园闲置租赁平台</div>
        <el-menu mode="horizontal" :router="true" background-color="#fff">
          <el-menu-item index="/">租赁大厅（前台）</el-menu-item>
          <el-menu-item index="/admin">物品管理后台</el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <main class="main">
      <router-view />
    </main>
  </div>
</template>
<style scoped>
.header-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.logo {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}
.main {
  min-height: calc(100vh - 70px);
}
</style>