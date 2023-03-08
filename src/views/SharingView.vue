<script setup lang="ts">
import { NIcon, useMessage, NGrid, NGi, NButton, NPopover } from 'naive-ui';
import { reactive, onMounted, computed } from 'vue';
import { IconLink } from '@tabler/icons-vue';
import QrCode from '../components/QRCodeComponent.vue';
import { useRouter, useRoute } from 'vue-router';
import { Language } from '../constant';
import { store } from '../store';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const id = route.params.id as string, download = route.query.download as string;
const page = reactive({
  cancelBtnLoading: false,
  copyLinkBtnLoading: false,
});

const display = computed(() => {
  const languageMap = {
    [Language.enUS]: {
      cancelBtnText: 'Cancel',
      copyLinkBtnText: 'Copy Download',
      copyLinkMsg: 'The link has been copied to clipboard.',
    },
    [Language.zhCN]: {
      cancelBtnText: '取消',
      copyLinkBtnText: '复制分享链接',
      copyLinkMsg: '链接已复制到粘贴板',
    }
  };
  return languageMap[store.settings.language];
});

async function handleCancelBtnClick() {
  try {
    page.cancelBtnLoading = true;
    const { code, msg } = await window.$main.deleteFile(id);
    if (code !== 0) return message.error(msg);
    router.back();
  } catch (err) {
    message.error(err.message);
  } finally {
    page.cancelBtnLoading = false;
  }
}

async function handleCopyLinkBtnClick() {
  try {
    page.copyLinkBtnLoading = true;
    await navigator.clipboard.writeText(download);
    message.success(display.value.copyLinkMsg);
  } catch (err) {
    message.error(err.message);
  } finally {
    page.copyLinkBtnLoading = false;
  }
}

setTimeout(() => window.$main.focusWebView(), 5000);

onMounted(async () => {
  await window.$main.focusWebView();
  await navigator.clipboard.writeText(download);
  message.success(display.value.copyLinkMsg);
});

</script>
<template>
  <div class="container">
    <n-grid :cols="1">
      <n-gi class="alginCenter">
        <n-popover trigger="hover" width="trigger" :overlap="true" placement="top" style="margin-top: 20px;">
          <template #trigger>
            <qr-code :width="220" :donwload="download"></qr-code>
          </template>
          <span>{{ download }}</span>
        </n-popover>
      </n-gi>
      <n-gi class="alginCenter">
        <n-button style="margin-right: 20px" :loading="page.cancelBtnLoading" :on-click="handleCancelBtnClick">
          {{ display.cancelBtnText }}
        </n-button>
        <n-button type="primary" :loading="page.copyLinkBtnLoading" :on-click="handleCopyLinkBtnClick">
          <template #icon>
            <n-icon>
              <icon-link></icon-link>
            </n-icon>
          </template>
          {{ display.copyLinkBtnText }}
        </n-button>
      </n-gi>
    </n-grid>
  </div>
</template>
<style scoped>
.container {
  margin-top: -40px;
}
.alginCenter {
  display: flex;
  justify-content: center;
}
</style>