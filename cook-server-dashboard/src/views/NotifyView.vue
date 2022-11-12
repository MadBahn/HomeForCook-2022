<template>
  <el-table :data="notify" max-height="700">
    <template #empty>
      <el-empty description="还没有数据欸。" />
    </template>
    <el-table-column type="expand">
      <template #default="props">
        <div style="display: flex; flex-direction: row; align-items: center">
          <img
            height="32"
            width="32"
            title="lock"
            v-if="props.row.isDone === true"
            src="/public/done.png"
          />
          <div style="flex-direction: column; margin-left: 1rem">
            <h4>举报者：{{ props.row.user.username }}</h4>
            <h4>举报日期：{{ props.row.post_date }}</h4>
            <h4>举报原因：{{ props.row.content }}</h4>
          </div>
        </div>
        <el-card style="margin-top: 1rem; margin-bottom: 1rem">
          <template
            v-if="
              (!props.row.refer_to.cid && props.row.refer_to.sid) ||
              (!props.row.refer_to.did && props.row.refer_to.tid)
            "
            #header
          >
            <div v-if="props.row.refer_to.sid">
              帖子: {{ props.row.refer_to.title }}
            </div>
            <div v-if="props.row.refer_to.tid">
              话题: {{ props.row.refer_to.title }}
            </div>
          </template>
          <div>
            <div v-if="!props.row.refer_to.cid && props.row.refer_to.sid">
              <h4>帖子id：{{ props.row.refer_to.sid }}</h4>
              <h4>发布者：{{ props.row.refer_to.raw_user.username }}</h4>
              <div
                style="padding: 0.5rem; background-color: #e3e2e2"
                v-html="props.row.refer_to.content"
              ></div>
              <h4>发布日期：{{ props.row.refer_to.post_date }}</h4>
            </div>
            <div v-if="props.row.refer_to.cid && props.row.refer_to.sid">
              <h4>评论id：{{ props.row.refer_to.cid }}</h4>
              <h4>发布者：{{ props.row.refer_to.raw_user.username }}</h4>
              <h4>评论内容：{{ props.row.refer_to.content }}</h4>
              <h4>发布日期：{{ props.row.refer_to.post_date }}</h4>
            </div>
            <div v-if="props.row.refer_to.did && props.row.refer_to.tid">
              <h4>讨论id：{{ props.row.refer_to.did }}</h4>
              <h4>发布者：{{ props.row.refer_to.raw_user.username }}</h4>
              <div
                v-html="props.row.refer_to.content"
                style="padding: 0.5rem; background-color: #e3e2e2"
              ></div>
              <h4>发布日期：{{ props.row.refer_to.post_date }}</h4>
            </div>
            <div v-if="props.row.refer_to.tid && !props.row.refer_to.did">
              <h4>话题id：{{ props.row.refer_to.tid }}</h4>
              <h4>创建者：{{ props.row.refer_to.raw_user.username }}</h4>
              <h4>创建日期：{{ props.row.refer_to.post_date }}</h4>
            </div>
          </div>
          <div
            v-if="
              !props.row.refer_to.sid &&
              !props.row.refer_to.cid &&
              !props.row.refer_to.tid &&
              !props.row.refer_to.did
            "
          >
            内容不存在：{{ props.row.refer_to }}
          </div>
        </el-card>
        <el-button @click="doExec(props.row.notify_id)">处理举报</el-button>
      </template>
    </el-table-column>
    <el-table-column label="举报id" prop="notify_id" />
    <el-table-column label="举报者" prop="user.username" />
  </el-table>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { http } from "@tauri-apps/api";
import { confirm } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";

const url_cfg = ref({});
const notify = ref([]);

const request = async () => {
  notify.value = (
    await http
      .fetch("http://localhost:3000/api/manage/get_notify", {
        method: "POST",
        body: http.Body.json({
          amount: 5,
          isRecent: false,
          isDetail: true,
        }),
      })
      .then()
  ).data.data;
};

const doExec = async (id) => {
  if (
    await confirm("是否处理？", {
      title: "确认",
      type: "info",
    })
  ) {
    await http
      .fetch("http://localhost:3000/api/manage/exec_notify", {
        method: "POST",
        body: http.Body.json({
          notify_id: id,
        }),
      })
      .then((res) => {
        if (res.data.errCode === "OK-200") {
          request();
        }
      });
  }
};

onMounted(async () => {
  await invoke("read_cfg")
    .then((res) => {
      url_cfg.value = JSON.parse(res);
    })
    .catch((err) => console.log(err));
  await request();
});
</script>

<style scoped></style>
