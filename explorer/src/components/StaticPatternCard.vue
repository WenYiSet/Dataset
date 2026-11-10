<template>
  <article class="pattern-card" :style="containerStyle">
    <header :class="{ compact: compactTitle }" :title="displayTitle">{{ displayTitle }}</header>
    <div class="image-frame">
      <img
        v-if="imageUrl && !imageFailed"
        :src="imageUrl"
        :alt="displayTitle"
        loading="lazy"
        @error="imageFailed = true"
      />
      <div v-else class="image-placeholder">{{ placeholderText }}</div>
      <FavoriteButton
        class="card-favorite"
        :favorite="favorite"
        :language="language"
        :payload="dataset"
        @toggle="$emit('toggle-favorite', $event)"
      />
    </div>
    <div class="tags" :class="{ english: language === 'English' }">
      <button
        v-for="item in motifTags"
        :key="item"
        type="button"
        :class="{ long: item.length > 20 }"
        :aria-label="motifSearchLabel(item)"
        @click.stop="$emit('select-motif', item)"
      >{{ item }}</button>
    </div>
    <div class="metadata-values">
      <span :class="{ unknown: isUnknown(periods) }">{{ periods }}</span>
      <span :class="{ unknown: isUnknown(carriers) }">{{ carriers }}</span>
      <span :class="{ unknown: isUnknown(semantics) }">{{ semantics }}</span>
    </div>
  </article>
</template>

<script>
import FavoriteButton from './FavoriteButton.vue';
import { localizedList } from '../data/wenyiData';

export default {
  name: 'StaticPatternCard',
  components: { FavoriteButton },
  emits: ['toggle-favorite', 'select-motif'],
  props: {
    size: { type: Array, default: () => [200, 300] },
    language: { type: String, default: 'Chinese' },
    dataset: { type: Object, required: true },
    favorite: { type: Boolean, default: false },
  },
  data() {
    return { imageFailed: false };
  },
  computed: {
    containerStyle() {
      return { width: '100%', height: `${this.size[1]}px` };
    },
    displayTitle() {
      const title = this.dataset.title || {};
      return this.language === 'English'
        ? (title.en || 'Translation pending')
        : (title.zh || title.en || '未命名纹样');
    },
    compactTitle() {
      const visualLength = [...this.displayTitle].reduce(
        (total, character) => total + (/[^\x00-\xff]/.test(character) ? 1 : 0.55),
        0,
      );
      return visualLength > 11;
    },
    imageUrl() {
      return this.dataset.image?.resolvedUrl || null;
    },
    placeholderText() {
      return this.language === 'Chinese' ? '图像暂不可用' : 'Image unavailable';
    },
    motifTags() {
      return this.unique(localizedList(this.dataset.motifs, 'types', this.language)).slice(0, 5);
    },
    periods() {
      return this.displayOrUnknown(
        localizedList(this.dataset.context, 'periods', this.language),
        '未知时期',
        'Unknown period',
      );
    },
    carriers() {
      return this.displayOrUnknown(
        [
          ...localizedList(this.dataset.context, 'carrierCategories', this.language),
          ...localizedList(this.dataset.context, 'carrierTypes', this.language),
        ],
        '未知载体',
        'Unknown medium',
      );
    },
    semantics() {
      return this.displayOrUnknown(
        [
          ...localizedList(this.dataset.semantics, 'domains', this.language),
          ...localizedList(this.dataset.semantics, 'keywords', this.language),
        ],
        '未知语义',
        'Unknown semantics',
        4,
      );
    },
  },
  methods: {
    motifSearchLabel(item) {
      return this.language === 'English' ? `Use ${item} as search text` : `将${item}填入搜索框`;
    },
    unique(values) {
      return [...new Set(values.filter(Boolean))];
    },
    displayOrUnknown(values, chineseFallback, englishFallback, limit = null) {
      const knownValues = this.unique(values).filter((value) => !this.isUnknown(value));
      const displayedValues = limit ? knownValues.slice(0, limit) : knownValues;
      if (displayedValues.length) return displayedValues.join(' · ');
      return this.language === 'English' ? englishFallback : chineseFallback;
    },
    isUnknown(value) {
      const normalized = String(value || '').trim().toLowerCase();
      return ['不详', 'unknown', '—', ''].includes(normalized)
        || normalized.startsWith('未知')
        || normalized.startsWith('unknown ');
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
.pattern-card {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #8b8b8b;
  border-radius: 10px;
  background: #fff;
}
.card-favorite {
  position: absolute;
  right: 6px;
  bottom: 6px;
  z-index: 2;
}
.pattern-card:hover :deep(.favorite-button),
.pattern-card:focus-within :deep(.favorite-button) {
  opacity: 1;
}
header {
  display: -webkit-box;
  height: 3.2em;
  min-height: 3.2em;
  box-sizing: border-box;
  padding: 7px 10px 3px;
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
header.compact {
  font-size: 13px;
}
.image-frame {
  display: flex;
  position: relative;
  min-height: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  background: #fff;
}
.image-frame img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.image-placeholder {
  padding: 12px;
  color: #777;
  text-align: center;
}
.tags {
  display: flex;
  min-height: 0;
  max-height: 55px;
  box-sizing: border-box;
  flex: 0 0 auto;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: flex-start;
  gap: 4px;
  padding: 4px 8px 5px;
  overflow: hidden;
}
.tags button {
  box-sizing: border-box;
  padding: 3px 6px;
  border: 1px solid #aaa;
  border-radius: 5px;
  background: #fff;
  color: inherit;
  cursor: pointer;
  font-family: inherit;
  font-size: 11px;
  line-height: 16px;
  overflow-wrap: normal;
  word-break: normal;
  white-space: nowrap;
}
.tags button:hover,
.tags button:focus-visible {
  border-color: #5f9dda;
  background: rgba(95, 157, 218, 0.1);
  outline: none;
}
.tags.english button {
  font-size: 10.5px;
}
.tags.english button.long {
  font-size: 9px;
}
.metadata-values {
  display: flex;
  min-height: 61px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  margin: 0;
  padding: 6px 8px 8px;
  border-top: 1px solid #ddd;
  font-size: 11px;
}
.metadata-values span {
  overflow: hidden;
  color: #222;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.metadata-values span.unknown {
  color: #999;
}
</style>
