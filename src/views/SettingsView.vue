<script setup lang="ts">
import { NForm, NFormItem, NInput, NButton, NSelect, useMessage } from 'naive-ui';
import type { FormInst, FormRules } from 'naive-ui';
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '@/store';
import { Language } from '@/constant';

const message = useMessage();
const router = useRouter();

const page = reactive({
  submitBtnLoading: false,
});

const model = ref({
  host: '',
  port: '',
  language: Language.enUS,
});
const rules: FormRules = {
  port: [
    {
      type: 'string',
      validator: (rules, value) => {
        if (!value) return new Error();
        const numberV = Number.parseInt(value);
        if (numberV < 0 || numberV > 65535) return new Error();
        return true;
      },
      renderMessage: () => {
        return model.value.language === Language.zhCN ? '端口号范围0-65535' : 'The range of port numbers is 0-65535.';
      },
      trigger: 'blur',
    }
  ]
};
const formRef = ref<FormInst | null>(null);

const langOptions = [
  { label: 'English', value: Language.enUS },
  { label: '简体中文', value: Language.zhCN },
];

const display = computed(() => {
  const languageMap = {
    [Language.enUS]: {
      language: 'language:',
      host: 'host:',
      port: 'port:',
      save: 'save',
    },
    [Language.zhCN]: {
      language: '语言：',
      host: '主机：',
      port: '端口：',
      save: '保存',
    }
  };
  return languageMap[model.value.language];
});

function handleSaveBtnClick(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        page.submitBtnLoading = true;
        const settings = {
          ...model.value,
          port: Number.parseInt(model.value.port),
        };
        const { code, msg } = await window.$main.putSettings(settings);
        if (code !== 0) return message.error(msg);
        router.push('/')
      } catch (err) {
        message.error(err.message);
      } finally {
        page.submitBtnLoading = false;
      }
    }
  });
}

function handleLangSelectUpdate(e: MouseEvent, select: typeof langOptions[0]){
  store.putSettings({ language: select.value });
}

onMounted(async () => {
  try {
    const settings = store.settings;
    if (settings.host) return Object.assign(model.value, settings);
    const { code, msg, data } = await window.$main.getIntranet();
    if (code !== 0) return message.error(msg);
    Object.assign(model.value, { language: settings.language, host: data, port: settings.port.toString() });
  } catch (err) {
    throw new Error;
  }
});

</script>

<template>
  <div class="container">
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        :style="{
          maxWidth: '640px',
        }"
        :label-align="'right'"
        :size="'small'"
      >
        <n-form-item :label="display.language" path="language">
          <n-select v-model:value="model.language" :options="langOptions" :on-update-value="handleLangSelectUpdate"></n-select>
        </n-form-item>
        <n-form-item :label="display.host" path="host">
          <n-input v-model:value="model.host" :disabled="true"/>
        </n-form-item>
        <n-form-item :label="display.port" path="port">
          <n-input v-model:value="model.port"></n-input>
        </n-form-item>
        <n-form-item>
          <n-button type="primary" :loading="page.submitBtnLoading" style="width: 100%" :on-click="handleSaveBtnClick">{{ display.save }}</n-button>
        </n-form-item>
      </n-form>
  </div>
</template>