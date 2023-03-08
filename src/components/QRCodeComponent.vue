<template>
  <canvas ref="canvas"></canvas>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import QRCode from 'qrcode';

export default defineComponent({
  name: 'QRCode',
  props: {
    width: Number,
    donwload: String || '',
  },
  setup(props) {
    const message = useMessage();
    const canvas = ref<HTMLCanvasElement>()
    onMounted(() => {
      QRCode.toCanvas(canvas.value, props.donwload as string, { width: props.width }, (error) => {
        if (error) {
          message.error(error.message);
        }
      });
    });
    return {
      canvas,
    }
  },
});
</script>