<template>
  <section class="timeline" :aria-label="text('历史时期相对分布', 'Relative distribution by historical period')">
    <div class="bars">
      <button
        v-for="(bar, index) in bars"
        :key="bar.value"
        type="button"
        class="bar-item"
        :class="{ selected: bar.selected }"
        :aria-pressed="bar.selected"
        :title="`${bar.label}: ${bar.count}`"
        @click="$emit('toggle', index)"
      >
        <span class="count">{{ bar.count }}</span>
        <span class="track"><span class="fill" :style="{ height: `${height(bar.count)}%` }"></span></span>
        <span class="label">{{ bar.label }}</span>
      </button>
    </div>
    <div class="scale-note">
      {{ text('柱高为相对数量，并采用平方根尺度压缩差异。', 'Bars show relative counts with square-root scaling.') }}
    </div>
  </section>
</template>

<script>
export default {
  name: 'StaticTimeBarChart',
  emits: ['toggle'],
  props: {
    bars: { type: Array, default: () => [] },
    language: { type: String, default: 'Chinese' },
  },
  computed: {
    maxCount() {
      return Math.max(1, ...this.bars.map((bar) => Number(bar.count || 0)));
    },
  },
  methods: {
    text(zh, en) {
      return this.language === 'Chinese' ? zh : en;
    },
    height(count) {
      if (!count) return 0;
      return Math.max(6, Math.sqrt(Number(count) / this.maxCount) * 100);
    },
  },
};
</script>

<style scoped>
.timeline {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  padding: 4px 10px 3px;
  overflow: hidden;
}
.bars {
  display: flex;
  min-height: 0;
  flex: 1;
  align-items: stretch;
  gap: 4px;
  overflow-x: auto;
}
.bar-item {
  display: grid;
  min-width: 64px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #333;
  cursor: pointer;
  grid-template-rows: 16px minmax(34px, 1fr) 28px;
}
.count { font-size: 10px; line-height: 16px; }
.track {
  display: flex;
  min-height: 34px;
  align-items: flex-end;
  border-bottom: 1px solid #8b8b8b;
  background: linear-gradient(to top, #f7f7f7, #fff);
}
.fill {
  width: 100%;
  min-height: 0;
  border-radius: 3px 3px 0 0;
  background: #9dbbe8;
  transition: height 160ms ease, background 160ms ease;
}
.bar-item:hover .fill { background: #6f9bd8; }
.bar-item.selected .fill { background: #f3c662; }
.bar-item.selected .label { font-weight: 700; }
.label {
  display: -webkit-box;
  padding: 3px 2px 0;
  overflow: hidden;
  font-size: 9px;
  line-height: 12px;
  text-align: center;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.scale-note {
  justify-content: flex-end;
  color: #777;
  font-size: 9px;
  line-height: 12px;
}
</style>
