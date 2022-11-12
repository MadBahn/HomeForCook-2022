<script setup>
import { computed, onMounted, onUpdated, ref } from "vue";
import { http } from "@tauri-apps/api";
import { confirm } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";

const d = ref([]);
const final = ref([]);
const _select = ref("share");
const loading = ref(true);
const url_cfg = ref({});

const _selected = computed(() => {
  let t = 0;
  for (let i = 0; i < final.value.length; i++) {
    if (final.value[i].isChosen) t++;
  }
  return t;
});

//get the data
const request = () => {
  loading.value = true;
  _selected.value = [];
  final.value = [];
  http
    .fetch(url_cfg.value.server_url + url_cfg.value.api.get_data, {
      method: "POST",
      body: http.Body.json({
        type: _select.value,
      }),
    })
    .then((res) => {
      console.log(res);
      if (res.data.errCode === "OK-100") {
        d.value = res.data.data;
        console.log(d.value);
        for (let i = 0; i < d.value.length; i++) {
          console.log(d.value[i]);
          final.value.push({ isChosen: false, ...d.value[i] });
        }
        // console.log(final.value);
        loading.value = false;
      }
    });
};

onMounted(async () => {
  // console.log(_total.value);
  await invoke("read_cfg")
    .then((res) => {
      url_cfg.value = JSON.parse(res);
    })
    .catch((err) => console.log(err));
  await request();
  // console.log(d.value);
});

onUpdated(() => {
  console.log("UPDATE");
});

const doSelect = (k) => {
  _select.value = k;
  request();
};

const doDel = async (id) => {
  const warning1 = await confirm("此操作不可逆，是否继续?", {
    title: "警告",
    type: "warning",
  });
  if (warning1) {
    http
      .fetch(url_cfg.value.server_url + url_cfg.value.api.delete_complete, {
        method: "POST",
        body: http.Body.json({
          id_in: id,
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
const lockCommon = async (id, l) => {
  if (
    await confirm(!l ? "是否锁定？" : "是否解锁？", {
      title: "确认",
      type: "info",
    })
  ) {
    http
      .fetch(url_cfg.value.server_url + url_cfg.value.api.lock_content, {
        method: "POST",
        body: http.Body.json({
          data: id,
        }),
      })
      .then((res) => {
        if (res.data.errCode === "OK-200") {
          request();
        }
      });
  }
};
const lockUser = async (id, l) => {
  if (
    await confirm(!l ? "是否锁定用户？" : "是否解锁用户？", {
      title: "确认",
      type: "info",
    })
  ) {
    http
      .fetch(url_cfg.value.server_url + url_cfg.value.api.lock_user, {
        method: "POST",
        body: http.Body.json({
          userid: id,
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

const delMulti = async () => {
  if (_selected.value.length !== 0) {
    if (
      await confirm("警告！您正在进行高风险操作，是否继续？", {
        title: "警告",
        type: "warning",
      })
    ) {
      for (let i = final.value.length - 1; i >= 0; i--) {
        if (final.value[i].isChosen) {
          let id;
          switch (_select.value) {
            case "share":
              id = final.value[i].sid;
              break;
            case "comment":
              id = final.value[i].cid;
              break;
            case "topic":
              id = final.value[i].tid;
              break;
            case "discuss":
              id = final.value[i].did;
              break;
            case "user":
              id = final.value[i].userid;
              break;
          }
          await http
            .fetch(
              url_cfg.value.server_url + url_cfg.value.api.delete_complete,
              {
                method: "POST",
                body: http.Body.json({
                  id_in: id,
                }),
              }
            )
            .then((res) => {
              if (res.data.errCode === "OK-200") {
                console.log("deleted:", final.value[i]);
              }
            });
        }
      }
      request();
    }
  }
};
const handle_selected = () => {
  if (_selected.value !== 0) {
    for (let i = final.value.length - 1; i >= 0; i--) {
      final.value[i].isChosen = false;
    }
  } else {
    for (let i = final.value.length - 1; i >= 0; i--) {
      final.value[i].isChosen = true;
    }
  }
};
const remove_ban = async (id) => {
  if (
    await confirm("是否解封？", {
      title: "确认",
      type: "info",
    })
  ) {
    http
      .fetch(url_cfg.value.server_url + url_cfg.value.api.remove_ban, {
        method: "POST",
        body: http.Body.json({
          userid: id,
        }),
      })
      .then((res) => {
        if (res) request();
      })
      .catch((err) => console.log(err));
  }
};
</script>

<template>
  <div>
    <div>
      <el-menu
        style="display: inline-flex; flex-direction: row"
        @select="doSelect"
        :default-active="_select"
      >
        <el-menu-item index="share"> 帖子 </el-menu-item>
        <el-menu-item index="comment"> 评论 </el-menu-item>
        <el-menu-item index="topic"> 话题 </el-menu-item>
        <el-menu-item index="discuss"> 讨论 </el-menu-item>
        <el-menu-item index="user"> 用户 </el-menu-item>
      </el-menu>
      <el-button @click="handle_selected" style="margin-left: 0.5rem">{{
        _selected === 0 ? "全选" : "取消全选"
      }}</el-button>
      <el-button @click="delMulti" v-show="_selected !== 0" type="danger">
        删除选中的数据
      </el-button>
      <el-skeleton count="5" animated :loading="loading" :throttle="2000">
        <template #template>
          <el-skeleton-item variant="rect" style="width: 80%; height: 16rem" />
        </template>
        <template #default>
          <div style="height: 600px; overflow-y: scroll">
            <el-card
              style="margin: 1rem"
              v-for="(i, index) in final"
              :key="index"
            >
              <!--        share-->
              <div v-if="i.sid && !i.cid">
                <div class="_info">
                  <img
                    height="32"
                    width="32"
                    title="lock"
                    v-if="i.isDel === true"
                    src="/public/lock.png"
                  />
                  <div style="width: 100%">
                    <span>发布者: {{ i.user }}</span
                    ><br />
                    <span>Sid: {{ i.sid }}</span
                    ><br />
                    <span>标题: {{ i.title }}</span
                    ><br />
                    <div
                      style="
                        border: lightgray 1px solid;
                        border-radius: 1rem;
                        padding-left: 1rem;
                      "
                    >
                      <span v-html="i.content"></span>
                    </div>
                    <span>发布日期: {{ i.post_date }}</span
                    ><br />
                  </div>
                </div>
                <br />
                <el-checkbox style="margin-right: 1rem" v-model="i.isChosen" />
                <el-button @click="lockCommon(i.sid, i.isDel)">{{
                  i.isDel ? "解锁" : "锁定"
                }}</el-button>
                <el-button type="danger" @click="doDel(i.sid)">
                  删除
                </el-button>
              </div>
              <!--        comment-->
              <div v-if="i.cid">
                <div class="_info">
                  <img
                    height="32"
                    width="32"
                    title="lock"
                    v-if="i.isDel === true"
                    src="/public/lock.png"
                  />
                  <div style="width: 100%">
                    <span>发布者: {{ i.user }}</span
                    ><br />
                    <span>Cid: {{ i.cid }}</span
                    ><br />
                    <span>所在帖子: {{ i.sid }}</span
                    ><br />
                    <div
                      style="
                        border: lightgray 1px solid;
                        border-radius: 1rem;
                        padding-left: 1rem;
                        max-height: 300px;
                      "
                    >
                      <span>{{ i.content }}</span>
                    </div>
                    <span>发布日期: {{ i.post_date }}</span
                    ><br />
                  </div>
                </div>
                <br />
                <el-checkbox style="margin-right: 1rem" v-model="i.isChosen" />
                <el-button @click="lockCommon(i.cid, i.isDel)">{{
                  i.isDel ? "解锁" : "锁定"
                }}</el-button>
                <el-button type="danger" @click="doDel(i.cid)">
                  删除
                </el-button>
              </div>
              <!--        topic-->
              <div v-if="i.tid && !i.did">
                <div class="_info">
                  <img
                    height="32"
                    width="32"
                    title="lock"
                    v-if="i.isDel === true"
                    src="/public/lock.png"
                  />
                  <div style="width: 100%">
                    <span>创建者: {{ i.user }}</span
                    ><br />
                    <span>Tid: {{ i.tid }}</span
                    ><br />
                    <span>标题: {{ i.title }}</span
                    ><br />
                    <span>创建日期: {{ i.post_date }}</span
                    ><br />
                  </div>
                </div>
                <br />
                <el-checkbox style="margin-right: 1rem" v-model="i.isChosen" />
                <el-button @click="lockCommon(i.tid, i.isDel)">{{
                  i.isDel ? "解锁" : "锁定"
                }}</el-button>
                <el-button type="danger" @click="doDel(i.tid)">
                  删除
                </el-button>
              </div>
              <!--        discuss-->
              <div v-if="i.did">
                <div class="_info">
                  <img
                    height="32"
                    width="32"
                    title="lock"
                    v-if="i.isDel === true"
                    src="/public/lock.png"
                  />
                  <div style="width: 100%">
                    <span>发布者: {{ i.user }}</span
                    ><br />
                    <span>Did: {{ i.did }}</span
                    ><br />
                    <span>所在话题: {{ i.tid }}</span
                    ><br />
                    <span
                      >引用的讨论:
                      {{ i.type === "attach" ? i.attach_did : "none" }}</span
                    ><br />
                    <div
                      style="
                        border: lightgray 1px solid;
                        border-radius: 1rem;
                        padding-left: 1rem;
                        max-height: 300px;
                        overflow: hidden;
                      "
                    >
                      <span v-html="i.content"></span>
                    </div>
                    <span>发布日期: {{ i.post_date }}</span
                    ><br />
                  </div>
                </div>
                <br />
                <el-checkbox style="margin-right: 1rem" v-model="i.isChosen" />
                <el-button @click="lockCommon(i.did, i.isDel)">{{
                  i.isDel ? "解锁" : "锁定"
                }}</el-button>
                <el-button type="danger" @click="doDel(i.did)">
                  删除
                </el-button>
              </div>
              <!--        user-->
              <div v-if="i.userid">
                <div class="_info">
                  <img
                    height="32"
                    width="32"
                    title="lock"
                    v-if="i.isDel === true"
                    src="/public/lock.png"
                  />
                  <div style="width: 100%">
                    <span>用户id: {{ i.userid }}</span
                    ><br />
                    <span>用户名: {{ i.username }}</span
                    ><br />
                    <span>性别: {{ i.gender }}</span
                    ><br />
                    <span>生日: {{ i.birthday }}</span
                    ><br />
                  </div>
                </div>
                <br />
                <el-checkbox style="margin-right: 1rem" v-model="i.isChosen" />
                <el-button @click="lockUser(i.userid, i.isDel)">{{
                  i.isDel ? "解锁" : "锁定"
                }}</el-button>
                <el-button v-if="i.isBan" @click="remove_ban(i.userid)"
                  >解封</el-button
                >
                <el-button type="danger" @click="doDel(i.userid)">
                  删除
                </el-button>
              </div>
            </el-card>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<style scoped>
._info {
  display: flex;
  width: 80%;
}
</style>
