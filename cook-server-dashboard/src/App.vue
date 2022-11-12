<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="wrapper">
    <el-image></el-image>
    <el-menu default-active="1" mode="horizontal">
      <RouterLink to="/">
        <el-menu-item>
          <template #title>首页</template>
        </el-menu-item>
      </RouterLink>
      <RouterLink to="/data">
        <el-menu-item>
          <template #title>数据</template>
        </el-menu-item>
      </RouterLink>
      <RouterLink to="/notify">
        <el-menu-item>
          <template #title>举报</template>
        </el-menu-item>
      </RouterLink>
      <RouterLink to="/about">
        <el-menu-item>
          <template #title>关于</template>
        </el-menu-item>
      </RouterLink>
    </el-menu>
  </div>
  <RouterView />
</template>

<style scoped>
@media (min-width: 1360px) {
}
</style>
