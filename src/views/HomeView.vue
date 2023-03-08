<script setup lang="ts">
import { NUpload, NUploadDragger, NIcon, useMessage, NText, NP } from 'naive-ui';
import { IconDragDrop } from '@tabler/icons-vue';
import { computed, onBeforeMount } from 'vue';
import { store } from '@/store';
import { Language } from '@/constant';
import { useRouter } from 'vue-router';

const message = useMessage();
const router = useRouter();

const display = computed(() => {
  const languageMap = {
    [Language.enUS]: {
      uploadDesc: 'Click or drag files to this area to generate a shareable link',
      uploadAttation: 'Not currently supporting folders.',
    },
    [Language.zhCN]: {
      uploadDesc: '点击或者拖动文件到该区域来生成分享链接',
      uploadAttation: '暂不支持文件夹',
    }
  };
  return languageMap[store.settings.language];
});


async function customRequest({ file: { file }, onFinish, onError }: any) {
  try {
    const { code, msg, data } = await window.$main.postFile({name: file.name, mime: file.type, path: file.path });
    if (code !== 0) return message.error(msg);
    const { id, download } = data;
    router.push({ path: `/sharing/${id}`, query: { download } });
    onFinish();
  } catch (err) {
    onError();
    message.error(err.message);
  }
}

onBeforeMount(async () => {
  try {
    const { code, msg, data } = await window.$main.getSettings();
    if (code !== 0) return message.error(msg);
    if (!data) router.push('/settings');
    store.putSettings(data);
  } catch (err) {
    message.error(err.message);
  }
});

</script>
<template>
  <div class="container">
    <n-upload
      directory-dnd
      :show-file-list="false"
      :custom-request="customRequest"
    >
      <n-upload-dragger>
        <div>
          <n-icon size="48" :depth="3">
            <icon-drag-drop />
          </n-icon>
        </div>
        <n-text style="font-size: 16px;">{{ display.uploadDesc }}</n-text>
        <n-p depth="3" style="margin: 10px 0 0 0">
          {{ display.uploadAttation }}
        </n-p>
      </n-upload-dragger>
    </n-upload>
  </div>
</template>
<style scoped>
.container {
  padding: 0px;
}
</style>