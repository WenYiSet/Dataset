<template>
  <section
    ref="timeline"
    class="timeline"
    :aria-label="text('历史时期相对分布', 'Relative distribution by historical period')"
  >
    <div class="chart-scroll">
      <svg
        class="period-chart"
        :width="chartWidth"
        :height="chartHeight"
        :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
        role="img"
      >
        <title>{{ text('历史时期相对分布', 'Relative distribution by historical period') }}</title>
        <g class="period-boundaries" aria-hidden="true">
          <line
            v-for="boundary in periodBoundaries"
            :key="boundary.key"
            class="period-boundary"
            :x1="boundary.x"
            :x2="boundary.x"
            :y1="labelY - 9"
            :y2="labelY + 5"
          />
        </g>

        <g
          v-for="bar in plottedBars"
          :key="bar.value"
          class="period-bar"
          :class="{ selected: bar.selected, parallel: bar.parallel }"
          role="button"
          tabindex="0"
          :aria-label="`${bar.label}: ${bar.count}`"
          :aria-pressed="bar.selected"
          @click="$emit('toggle', bar.sourceIndex)"
          @keydown.enter.prevent="$emit('toggle', bar.sourceIndex)"
          @keydown.space.prevent="$emit('toggle', bar.sourceIndex)"
        >
          <title>{{ `${bar.label}: ${bar.count}` }}</title>
          <rect class="bar-rect" :x="bar.x" :y="bar.y" :width="bar.width" :height="bar.height" rx="1" />
          <text class="bar-count" :x="bar.center" :y="bar.countY">{{ bar.count }}</text>
          <text
            class="period-label"
            :class="{ compact: bar.width < 40 }"
            :x="bar.center"
            :y="bar.labelY"
          >{{ shortLabel(bar) }}</text>
        </g>

        <g
          v-if="unknownBar"
          class="period-bar unknown"
          :class="{ selected: unknownBar.selected }"
          role="button"
          tabindex="0"
          :aria-label="`${unknownBar.label}: ${unknownBar.count}`"
          :aria-pressed="unknownBar.selected"
          @click="$emit('toggle', unknownBar.sourceIndex)"
          @keydown.enter.prevent="$emit('toggle', unknownBar.sourceIndex)"
          @keydown.space.prevent="$emit('toggle', unknownBar.sourceIndex)"
        >
          <title>{{ `${unknownBar.label}: ${unknownBar.count}` }}</title>
          <rect class="bar-rect" :x="unknownBar.x" :y="unknownBar.y" :width="unknownBar.width" :height="unknownBar.height" rx="1" />
          <text class="bar-count" :x="unknownBar.center" :y="unknownBar.countY">{{ unknownBar.count }}</text>
          <text class="period-label" :x="unknownBar.center" :y="labelY">{{ unknownBar.label }}</text>
        </g>

        <path class="axis-line" :d="axisPath" aria-hidden="true" />

        <g v-for="tick in axisTicks" :key="tick.year" class="axis-tick" aria-hidden="true">
          <line :x1="tick.x" :x2="tick.x" :y1="axisY" :y2="axisY + 4" />
          <text :x="tick.x" :y="axisY + 12">{{ tick.year }}</text>
        </g>

        <text class="xia-label" :x="xiaCenter" :y="labelY" aria-hidden="true">{{ text('夏', 'Xia') }}</text>
      </svg>
    </div>
  </section>
</template>

<script>
const PERIOD_RANGES = {
  prehistory: [-2200, -2000],
  shang: [-1600, -1046],
  western_zhou: [-1046, -771],
  spring_autumn: [-771, -476],
  warring_states: [-476, -221],
  qin: [-221, -206],
  han: [-206, 220],
  wei_jin: [220, 420],
  northern_southern: [420, 589],
  sui: [589, 618],
  tang: [618, 907],
  five_dynasties: [907, 960],
  song: [960, 1279],
  liao: [916, 1125],
  yuan: [1279, 1368],
  ming: [1368, 1644],
  qing: [1644, 1912],
  modern: [1912, 2025],
};

const PAPER_LABELS = {
  Chinese: {
    prehistory: '新石器时代',
    western_zhou: '西周',
    spring_autumn: '春秋',
    warring_states: '战国',
    northern_southern: '南北朝',
    five_dynasties: '五代',
    modern: '近现代',
  },
  English: {
    prehistory: 'Neolithic Period',
    western_zhou: 'West Zhou',
    spring_autumn: 'Spring and Autumn',
    warring_states: 'Warring State',
    wei_jin: 'Wei-Jin',
    northern_southern: 'North-South',
    five_dynasties: 'Five Dyns',
  },
};

export default {
  name: 'StaticTimeBarChart',
  emits: ['toggle'],
  props: {
    bars: { type: Array, default: () => [] },
    language: { type: String, default: 'Chinese' },
  },
  data() {
    return {
      measuredWidth: 1100,
      measuredHeight: 116,
      resizeObserver: null,
    };
  },
  computed: {
    chartWidth() {
      return Math.max(920, Math.round(this.measuredWidth));
    },
    chartHeight() {
      return Math.max(92, Math.round(this.measuredHeight));
    },
    plotLeft() {
      return 10;
    },
    unknownWidth() {
      return Math.max(54, Math.min(72, this.chartWidth * 0.055));
    },
    unknownGap() {
      return Math.max(14, Math.min(20, this.chartWidth * 0.014));
    },
    knownRight() {
      return this.chartWidth - this.unknownWidth - this.unknownGap - 10;
    },
    axisY() {
      return this.chartHeight - 44;
    },
    labelY() {
      return this.chartHeight - 15;
    },
    xiaGapWidth() {
      return Math.max(24, Math.min(38, this.chartWidth * 0.026));
    },
    yearScale() {
      const chronologicalYears = 200 + (2025 + 1600);
      return (this.knownRight - this.plotLeft - this.xiaGapWidth) / chronologicalYears;
    },
    xiaStart() {
      return this.mapYear(-2000);
    },
    xiaEnd() {
      return this.mapYear(-1600);
    },
    xiaCenter() {
      return (this.xiaStart + this.xiaEnd) / 2;
    },
    axisPath() {
      const y = this.axisY;
      const halfWidth = Math.min(14, this.xiaGapWidth * 0.42);
      const left = this.xiaCenter - halfWidth;
      const right = this.xiaCenter + halfWidth;
      const segmentCount = 12;
      const segmentWidth = (right - left) / segmentCount;
      const commands = [`M 1 ${y}`, `H ${left}`];
      for (let index = 1; index < segmentCount; index += 1) {
        const x = left + segmentWidth * index;
        const offset = index % 2 ? -2.4 : 2.4;
        commands.push(`L ${x.toFixed(2)} ${(y + offset).toFixed(2)}`);
      }
      commands.push(`L ${right.toFixed(2)} ${y}`, `H ${this.chartWidth - 1}`);
      return commands.join(' ');
    },
    axisTicks() {
      const ticks = [];
      for (let year = -2200; year <= -2000; year += 100) ticks.push({ year, x: this.mapYear(year) });
      for (let year = -1600; year <= 2000; year += 100) ticks.push({ year, x: this.mapYear(year) });
      return ticks;
    },
    overallMaxCount() {
      return Math.max(1, ...this.bars.map((bar) => Number(bar.count || 0)));
    },
    regularMaxCount() {
      return Math.max(
        1,
        ...this.bars
          .filter((bar) => bar.value !== 'unknown')
          .map((bar) => Number(bar.count || 0)),
      );
    },
    plottedBars() {
      return this.bars.flatMap((bar, sourceIndex) => {
        const range = PERIOD_RANGES[bar.value];
        if (!range) return [];
        const x = this.mapYear(range[0]);
        const rangeEnd = this.mapYear(range[1]);
        const parallel = bar.value === 'liao';
        const height = this.barHeight(bar.count, parallel ? 0.72 : 1);
        const width = Math.max(parallel ? 10 : 2, rangeEnd - x);
        const y = this.axisY - height;
        return [{
          ...bar,
          sourceIndex,
          x,
          y,
          width,
          height,
          center: x + width / 2,
          countY: Math.max(9, y - 3),
          labelY: parallel ? Math.max(11, y - 13) : this.labelY,
          parallel,
        }];
      });
    },
    periodBoundaries() {
      const boundaries = this.plottedBars
        .filter((bar) => !bar.parallel)
        .map((bar) => ({ key: bar.value, x: bar.x }));
      boundaries.push({ key: 'xia-start', x: this.xiaStart });
      if (this.unknownBar) boundaries.push({ key: 'unknown', x: this.unknownBar.x });
      return boundaries;
    },
    unknownBar() {
      const sourceIndex = this.bars.findIndex((bar) => bar.value === 'unknown');
      if (sourceIndex < 0) return null;
      const bar = this.bars[sourceIndex];
      const height = Math.min(this.axisY - 10, this.barHeight(bar.count) * 1.05);
      const x = this.chartWidth - this.unknownWidth - 10;
      const y = this.axisY - height;
      return {
        ...bar,
        sourceIndex,
        x,
        y,
        width: this.unknownWidth,
        height,
        center: x + this.unknownWidth / 2,
        countY: Math.max(9, y - 3),
      };
    },
  },
  mounted() {
    this.updateSize();
    this.resizeObserver = new ResizeObserver(() => this.updateSize());
    this.resizeObserver.observe(this.$refs.timeline);
  },
  beforeUnmount() {
    this.resizeObserver?.disconnect();
  },
  methods: {
    text(zh, en) {
      return this.language === 'Chinese' ? zh : en;
    },
    updateSize() {
      const element = this.$refs.timeline;
      if (!element) return;
      this.measuredWidth = element.clientWidth;
      this.measuredHeight = element.clientHeight;
    },
    mapYear(year) {
      if (year <= -2000) return this.plotLeft + (year + 2200) * this.yearScale;
      if (year >= -1600) return this.plotLeft + 200 * this.yearScale + this.xiaGapWidth + (year + 1600) * this.yearScale;
      return this.xiaStart + ((year + 2000) / 400) * this.xiaGapWidth;
    },
    barHeight(count, factor = 1) {
      if (!count) return 0;
      const value = Math.max(0, Number(count) || 0);
      const available = Math.max(30, this.axisY - 13);
      const minimum = 4;
      const regularMax = Math.max(1, this.regularMaxCount);
      const overallMax = Math.max(regularMax, this.overallMaxCount);
      const regularCeiling = available * 0.82;
      let scaledHeight;

      if (value <= regularMax || overallMax === regularMax) {
        const regularRatio = Math.min(1, value / regularMax);
        scaledHeight = minimum + regularRatio * (regularCeiling - minimum);
      } else {
        const tailRatio = Math.min(1, (value - regularMax) / (overallMax - regularMax));
        scaledHeight = regularCeiling + Math.sqrt(tailRatio) * (available - regularCeiling);
      }

      return Math.max(minimum, Math.min(available, scaledHeight * factor));
    },
    shortLabel(bar) {
      return PAPER_LABELS[this.language]?.[bar.value] || bar.label;
    },
  },
};
</script>

<style scoped>
.timeline {
  display: block;
  width: calc(100% - var(--timeline-side-margin) - var(--timeline-side-margin));
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  margin: 0 var(--timeline-side-margin) 7px;
  overflow: hidden;
}
.chart-scroll {
  display: block;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}
@media (min-width: 900px) {
  .chart-scroll { overflow-x: hidden; }
}
.period-chart {
  display: block;
  font-family: Inter, Arial, sans-serif;
  overflow: visible;
}
.axis-line {
  fill: none;
  stroke: #111;
  stroke-width: 1.6;
  pointer-events: none;
  vector-effect: non-scaling-stroke;
}
.axis-tick line {
  stroke: #333;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
.period-boundary {
  stroke: #d2d2d2;
  stroke-width: 0.8;
  pointer-events: none;
  vector-effect: non-scaling-stroke;
}
.axis-tick text {
  fill: #555;
  font-size: 7px;
  text-anchor: middle;
}
.xia-label,
.period-label {
  fill: #565656;
  font-size: 8px;
  text-anchor: middle;
}
.period-label.compact { font-size: 7px; }
.period-bar { cursor: pointer; outline: none; }
.bar-rect {
  fill: rgba(157, 187, 232, 0.56);
  stroke: #78a8e8;
  stroke-width: 1.1;
  vector-effect: non-scaling-stroke;
  transition: fill 140ms ease, stroke 140ms ease;
}
.period-bar:hover .bar-rect,
.period-bar:focus-visible .bar-rect {
  fill: rgba(120, 168, 232, 0.68);
  stroke: #4d8edc;
}
.period-bar.selected .bar-rect {
  fill: rgba(250, 198, 50, 0.5);
  stroke: #efb323;
}
.period-bar.parallel .bar-rect {
  fill: rgba(132, 163, 213, 0.72);
  stroke: #628fcf;
  stroke-dasharray: 2 1;
}
.period-bar.parallel .period-label { fill: #496b9a; font-weight: 600; }
.period-bar.unknown .bar-rect { fill: rgba(184, 184, 184, 0.58); stroke: #9c9c9c; }
.period-bar.unknown.selected .bar-rect { fill: rgba(250, 198, 50, 0.5); stroke: #efb323; }
.bar-count { fill: #333; font-size: 8px; text-anchor: middle; }
</style>
