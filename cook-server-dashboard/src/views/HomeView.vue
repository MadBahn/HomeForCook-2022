<script setup>
import { onMounted, ref } from "vue";
import { http } from "@tauri-apps/api";
import { ResponseType } from "@tauri-apps/api/http";
import { confirm } from "@tauri-apps/api/dialog";
import ReferToCard from "../components/ReferToCard.vue";
import { invoke } from "@tauri-apps/api/tauri";

const count_s = ref({
  share: 0,
  comment: 0,
  topic: 0,
  discuss: 0,
  user: 0,
});

const notify = ref([]);

const url_cfg = ref({});
const status = ref({});

const request = async () => {
  notify.value = (
    await http
      .fetch(url_cfg.value.server_url + url_cfg.value.api.get_notify, {
        method: "POST",
        body: http.Body.json({
          amount: 5,
          isRecent: true,
          isDetail: true,
        }),
      })
      .then()
      .catch((err) => console.log(err))
  ).data.data;
};

onMounted(async () => {
  await invoke("read_cfg")
    .then((res) => {
      url_cfg.value = JSON.parse(res);
    })
    .catch((err) => console.log(err));
  await http
    .fetch(url_cfg.value.server_url, {
      method: "GET",
      responseType: ResponseType.Text,
      timeout: 5000,
    })
    .then(async (res) => {
      console.log(res);
      if (res.status === 200) {
        count_s.value.share = (
          await http
            .fetch(url_cfg.value.server_url + url_cfg.value.api.count + "/s", {
              method: "GET",
            })
            .then()
        ).data.data.count;
        count_s.value.comment = (
          await http
            .fetch(url_cfg.value.server_url + url_cfg.value.api.count + "/c", {
              method: "GET",
            })
            .then()
        ).data.data.count;
        count_s.value.topic = (
          await http
            .fetch(url_cfg.value.server_url + url_cfg.value.api.count + "/t", {
              method: "GET",
            })
            .then()
        ).data.data.count;
        count_s.value.discuss = (
          await http
            .fetch(url_cfg.value.server_url + url_cfg.value.api.count + "/d", {
              method: "GET",
            })
            .then()
        ).data.data.count;
        count_s.value.user = (
          await http
            .fetch(url_cfg.value.server_url + url_cfg.value.api.count + "/u", {
              method: "GET",
            })
            .then()
        ).data.data.count;
        await request();
        status.value = { success: true, msg: "?????????????????????", url: res.url };
        // console.log(status.value);
      }
    })
    .catch((err) => {
      console.log(err);
      status.value = { success: false, msg: "?????????????????????" };
    });
});

const doExec = async (id) => {
  console.log(id);
  if (
    await confirm("???????????????", {
      title: "??????",
      type: "info",
    })
  ) {
    await http
      .fetch(url_cfg.value.server_url + url_cfg.value.api.exec_notify, {
        method: "POST",
        body: http.Body.json({
          notify_id: id,
        }),
      })
      .then((res) => {
        console.log(res);
        if (res.data.errCode === "OK-200") {
          request();
        }
      });
  }
};
</script>

<template>
  <main>
    <div class="block">
      <div class="display-row" style="border: none; padding: 0">
        <img height="32" width="32" src="/public/data.png" />
        <h3 style="padding-left: 0.5rem">??????????????????</h3>
      </div>
      <div style="margin-top: 1rem; display: flex; flex-direction: column">
        <div class="display-row">
          <img height="32" width="32" src="/public/share.png" />
          <span> ??????: {{ count_s.share }} </span>
          <img height="32" width="32" src="/public/comment.png" />
          <span> ??????: {{ count_s.comment }} </span>
        </div>
        <div class="display-row">
          <img height="32" width="32" src="/public/topic.png" />
          <span>??????: {{ count_s.topic }}</span>
          <img height="32" width="32" src="/public/discuss.png" />
          <span>??????: {{ count_s.discuss }}</span>
        </div>
        <div class="display-row" style="border: none; padding: 0">
          <img height="32" width="32" src="/public/server.png" />
          <h3 style="padding-left: 0.5rem">?????????</h3>
        </div>
        <div class="display-column">
          <span>
            ?????????
            <div
              v-if="status.msg"
              :style="{
                display: 'inline-flex',
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                backgroundColor: status.success ? 'lightgreen' : 'red',
              }"
            ></div>
            {{ status.msg }}
          </span>
          <span v-if="status.url">?????????{{ status.url }}</span>
        </div>
      </div>
    </div>
    <div class="block" style="width: 90%">
      <h3>???????????????</h3>
      <div style="margin-top: 1rem; height: 500px; overflow-y: scroll">
        <el-card
          style="margin-top: 1rem"
          v-for="(i, index) in notify"
          :key="index"
        >
          <template #header>
            <div style="display: flex; align-items: center">
              <h4>??????{{ i.user.username }}?????????</h4>
            </div>
          </template>
          ???????????????{{ i.content }}<br />
          ???????????????<ReferToCard :data="i.refer_to" /><br />
          ???????????????{{ i.post_date }}<br />
          <el-button @click="doExec(i.notify_id)">????????????</el-button>
        </el-card>
        <el-empty description="????????????????????????" v-if="notify.length === 0" />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: row;
}
.block {
  width: 40%;
  margin: 1rem;
}
.display-row,
.display-column {
  border: lightgray 1px solid;
  margin-bottom: 1rem;
  padding: 1rem;
  display: flex;
}
.display-row {
  align-items: center;
  flex-direction: row;
}
.display-column {
  align-items: start;
  flex-direction: column;
}
.display-row span {
  width: 40%;
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>
