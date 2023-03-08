<script setup lang="ts">
import { RouterView } from 'vue-router';
import { NConfigProvider, zhCN, dateZhCN, NMessageProvider, enUS, dateEnUS } from 'naive-ui';
import { store } from '@/store';
import { Language } from './constant';
import { computed } from 'vue';

const lang = computed(() => {
  return store.settings.language === Language.zhCN ? { locale: zhCN, dateLocale: dateZhCN } : { locale: enUS, dateLocale: dateEnUS };
});

</script>

<template>
  <div class="container">
    <n-message-provider>
      <n-config-provider  :locale="lang.locale" :date-locale="lang.dateLocale">
        <RouterView />
      </n-config-provider>
    </n-message-provider>
  </div>
</template>

<style scoped>
.container {
  padding: 20px 20px 0px 20px;
}
</style>
