<template>
  <el-card>
    <div v-if="!data.cid && data.sid">
      <h4>帖子id：{{ data.sid }}</h4>
      <h4>发布者：{{ data.raw_user.username }}</h4>
      <div
        style="padding: 0.5rem; background-color: #e3e2e2"
        v-html="data.content"
      ></div>
      <h4>发布日期：{{ data.post_date }}</h4>
    </div>
    <div v-if="data.cid && data.sid">
      <h4>评论id：{{ data.cid }}</h4>
      <h4>发布者：{{ data.raw_user.username }}</h4>
      <h4>评论内容：{{ data.content }}</h4>
      <h4>发布日期：{{ data.post_date }}</h4>
    </div>
    <div v-if="data.did && data.tid">
      <h4>讨论id：{{ data.did }}</h4>
      <h4>发布者：{{ data.raw_user.username }}</h4>
      <div
        v-html="data.content"
        style="padding: 0.5rem; background-color: #e3e2e2"
      ></div>
      <h4>发布日期：{{ data.post_date }}</h4>
    </div>
    <div v-if="data.tid && !data.did">
      <h4>话题id：{{ data.tid }}</h4>
      <h4>创建者：{{ data.raw_user.username }}</h4>
      <h4>创建日期：{{ data.post_date }}</h4>
    </div>
    <div v-if="!data.sid && !data.cid && !data.tid && !data.did">
      内容不存在：{{ data }}
    </div>
  </el-card>
</template>

<script setup>
defineProps({
  data: Object,
});
</script>

<style scoped></style>
