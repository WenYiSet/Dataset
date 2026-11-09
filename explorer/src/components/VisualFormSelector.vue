<template>
  <section class="visual-selector" :class="{ collapsed: !open }">
    <button
      class="visual-title"
      type="button"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span>{{ title }}</span>
      <img :src="open ? iconArrowUp : iconArrowDown" alt="" />
    </button>
    <div v-if="open" class="visual-options">
      <fieldset>
        <legend>{{ structureTitle }}</legend>
        <el-checkbox
          v-for="(item, index) in structureItems"
          :key="`structure-${item}`"
          v-model="structureStatus[index]"
          :label="item"
        />
      </fieldset>
      <fieldset>
        <legend>{{ styleTitle }}</legend>
        <el-checkbox
          v-for="(item, index) in styleItems"
          :key="`style-${item}`"
          v-model="styleStatus[index]"
          :label="item"
        />
      </fieldset>
    </div>
  </section>
</template>

<script>
import iconArrowUp from '../assets/images/arrow_up.png';
import iconArrowDown from '../assets/images/arrow_down.png';

export default {
  name: 'VisualFormSelector',
  props: {
    title: { type: String, default: 'Visual Form' },
    structureTitle: { type: String, default: 'Structure' },
    styleTitle: { type: String, default: 'Style' },
    structureItems: { type: Array, default: () => [] },
    styleItems: { type: Array, default: () => [] },
    structureStatus: { type: Array, required: true },
    styleStatus: { type: Array, required: true },
  },
  data() {
    return {
      open: true,
      iconArrowUp,
      iconArrowDown,
    };
  },
};
</script>

<style scoped>
.visual-selector {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #b9b9b9;
  border-radius: 5px;
  background: #f3f3f3;
}
.visual-title {
  display: flex;
  min-height: 34px;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  border: 0;
  background: rgba(95, 157, 218, 0.25);
  color: #111;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  text-align: left;
}
.visual-title img {
  width: 18px;
  aspect-ratio: 2;
  object-fit: fill;
}
.visual-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px 10px 10px;
  border-top: 1px solid #b9b9b9;
}
fieldset {
  display: flex;
  min-width: 0;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
  border: 0;
}
legend {
  width: 100%;
  margin-bottom: 2px;
  padding: 0;
  font-style: italic;
  font-weight: 600;
}
:deep(.el-checkbox) {
  margin-right: 10px;
}
</style>
