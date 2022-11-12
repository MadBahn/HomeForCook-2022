<template>
  <div class="about">
    <h1>关于本应用:</h1>
    <span>应用名: {{ appName }}</span
    ><br />
    <span>应用版本: {{ appVer }}</span
    ><br />
    <span>Powered by Tauri{{ tauriVer }}</span
    ><br />
  </div>
</template>

<script setup>
import { getName, getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { ref } from "vue";
import { onMounted } from "vue";

const [appName, tauriVer, appVer] = [ref(""), ref(""), ref("")];

onMounted(async () => {
  [appName.value, tauriVer.value, appVer.value] = [
    await getName(),
    await getTauriVersion(),
    await getVersion(),
  ];
  console.log(appName.value, tauriVer.value, appVer.value);
});
</script>
