<template>
  <section class="details-panel">
    <header>
      <div>
        <strong>{{ displayTitle }}</strong>
        <small>{{ dataset.id }}</small>
      </div>
      <FavoriteButton
        :favorite="favorite"
        :always-visible="true"
        :language="language"
        :payload="dataset"
        @toggle="$emit('toggle-favorite', $event)"
      />
    </header>
    <div class="details-body">
      <div class="image-frame">
        <img
          v-if="imageUrl && !imageFailed"
          :src="imageUrl"
          :alt="displayTitle"
          @error="imageFailed = true"
        />
        <div v-else class="image-placeholder">{{ text('图像暂不可用', 'Image unavailable') }}</div>
      </div>
      <div class="fields">
        <FieldRow :label="text('时期', 'Period')" :value="joinPeriods" />
        <FieldRow :label="text('地点', 'Place')" :value="localized(dataset.context?.place)" />
        <FieldRow :label="text('载体', 'Medium')" :value="joinCarriers" />
        <FieldRow :label="text('意象', 'Motifs')" :value="joinMotifs" />
        <FieldRow :label="text('画面描述', 'Description')" :value="localized(dataset.description)" multiline />
        <FieldRow :label="text('文化主题', 'Semantic domain')" :value="joinLocalized(dataset.semantics, 'domains')" />
        <FieldRow :label="text('语义关键词', 'Semantic keywords')" :value="joinLocalized(dataset.semantics, 'keywords')" />
        <FieldRow :label="text('文化含义', 'Cultural interpretation')" :value="localized(dataset.semantics?.description)" multiline />
        <FieldRow :label="text('结构', 'Structure')" :value="joinLocalized(dataset.visualForm, 'structures')" />
        <FieldRow :label="text('形态', 'Morphology')" :value="joinLocalized(dataset.visualForm, 'morphologies')" />
        <FieldRow :label="text('风格', 'Style')" :value="joinLocalized(dataset.visualForm, 'styles')" />
        <FieldRow :label="text('图像质量', 'Image quality')" :value="joinLocalized(dataset.visualForm, 'qualities')" />
        <FieldRow :label="text('来源', 'Source')" :value="dataset.sourceReference" multiline />
      </div>
    </div>
  </section>
</template>

<script>
import FieldRow from './StaticFieldRow.vue';
import FavoriteButton from './FavoriteButton.vue';
import { localizedList } from '../data/wenyiData';

export default {
  name: 'StaticPatternDetails',
  components: { FieldRow, FavoriteButton },
  emits: ['toggle-favorite'],
  props: {
    language: { type: String, default: 'Chinese' },
    dataset: { type: Object, required: true },
    favorite: { type: Boolean, default: false },
  },
  data() {
    return { imageFailed: false };
  },
  computed: {
    displayTitle() {
      return this.localized(this.dataset.title)
        || (this.language === 'English' ? 'Untitled Pattern' : '未命名纹样');
    },
    imageUrl() {
      return this.dataset.image?.resolvedUrl || null;
    },
    joinCarriers() {
      return this.join([
        ...localizedList(this.dataset.context, 'carrierCategories', this.language),
        ...localizedList(this.dataset.context, 'carrierTypes', this.language),
        this.localizedPair(
          this.dataset.context?.carrierDetail,
          this.dataset.context?.carrierDetailEn,
        ),
      ]);
    },
    joinMotifs() {
      return this.join([
        ...localizedList(this.dataset.motifs, 'types', this.language),
      ]);
    },
    joinPeriods() {
      return this.join([
        ...localizedList(this.dataset.context, 'periods', this.language),
        this.localizedPair(
          this.dataset.context?.periodDetail,
          this.dataset.context?.periodDetailEn,
        ),
      ]);
    },
  },
  methods: {
    text(zh, en) {
      return this.language === 'Chinese' ? zh : en;
    },
    localized(value) {
      if (!value) return '';
      return this.language === 'English'
        ? (value.en || (value.zh ? 'Translation pending' : ''))
        : (value.zh || value.en || '');
    },
    localizedPair(chineseValue, englishValue) {
      return this.language === 'English'
        ? (englishValue || (chineseValue ? 'Translation pending' : ''))
        : (chineseValue || englishValue || '');
    },
    join(values) {
      const list = Array.isArray(values) ? values : [];
      return [...new Set(list.filter(Boolean))].join(' · ');
    },
    joinLocalized(container, key) {
      return localizedList(container, key, this.language).join(' · ');
    },
  },
  watch: {
    dataset() {
      this.imageFailed = false;
    },
  },
};
</script>

<style scoped>
.details-panel {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  padding: 16px;
  border: 1px solid #444;
  border-radius: 8px;
  background: #fff;
}
header { display: flex; min-height: 52px; align-items: center; justify-content: space-between; padding-right: 30px; }
header > div { display: flex; flex-direction: column; }
header strong { font-size: 24px; }
header small { margin-top: 3px; color: #777; }
.details-body { display: grid; min-height: 0; flex: 1; grid-template-columns: minmax(0, 1fr) minmax(320px, 1fr); gap: 14px; }
.image-frame { display: flex; min-height: 0; align-items: center; justify-content: center; border: 1px solid #ddd; border-radius: 6px; background: #f5f5f5; }
.image-frame img { width: 100%; height: 100%; object-fit: contain; }
.image-placeholder { color: #777; }
.fields { overflow: auto; border: 1px solid #aaa; border-radius: 6px; }
:deep(.field-row) { display: grid; min-height: 38px; grid-template-columns: 130px 1fr; border-bottom: 1px solid #ddd; }
:deep(.field-row.multiline) { min-height: 72px; }
:deep(.field-label) { padding: 9px; background: #eee; font-weight: 600; }
:deep(.field-value) { padding: 9px; line-height: 1.45; white-space: pre-wrap; }
@media (max-width: 900px) {
  .details-body { grid-template-columns: 1fr; overflow: auto; }
  .image-frame { min-height: 280px; }
}
</style>
