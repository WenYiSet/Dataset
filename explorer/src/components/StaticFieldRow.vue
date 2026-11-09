<template>
  <div class="field-row" :class="{ multiline }">
    <div class="field-label">{{ label }}</div>
    <div class="field-value">{{ value || '—' }}</div>
  </div>
</template>

<script>
export default {
  name: 'StaticFieldRow',
  props: {
    label: { type: String, default: '' },
    value: { type: [String, Number], default: '' },
    multiline: { type: Boolean, default: false },
  },
};
</script>
