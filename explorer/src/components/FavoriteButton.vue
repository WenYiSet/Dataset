<template>
  <button
    type="button"
    class="favorite-button"
    :class="{ active: favorite, persistent: favorite || alwaysVisible }"
    :aria-label="ariaLabel"
    :aria-pressed="favorite"
    :title="ariaLabel"
    @click.stop="$emit('toggle', payload)"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20.4 4.2 13C.9 9.9 2.6 4.5 7.1 4.5c2.1 0 3.7 1.2 4.9 2.8 1.2-1.6 2.8-2.8 4.9-2.8 4.5 0 6.2 5.4 2.9 8.5L12 20.4Z" />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'FavoriteButton',
  emits: ['toggle'],
  props: {
    favorite: { type: Boolean, default: false },
    alwaysVisible: { type: Boolean, default: false },
    language: { type: String, default: 'Chinese' },
    payload: { type: [Object, String, Number], default: null },
  },
  computed: {
    ariaLabel() {
      if (this.language === 'English') {
        return this.favorite ? 'Remove from favorites' : 'Add to favorites';
      }
      return this.favorite ? '取消收藏' : '加入收藏';
    },
  },
};
</script>

<style scoped>
.favorite-button {
  display: inline-flex;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  opacity: 0;
  transition: opacity 140ms ease, background-color 140ms ease, transform 140ms ease;
}
.favorite-button.persistent,
.favorite-button:focus-visible {
  opacity: 1;
}
.favorite-button:hover,
.favorite-button:focus-visible {
  background: rgba(95, 157, 218, 0.14);
  outline: none;
  transform: scale(1.05);
}
svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
path {
  fill: rgba(95, 157, 218, 0.18);
  stroke: #5f9dda;
  stroke-width: 1.8;
  stroke-linejoin: round;
  transition: fill 140ms ease, stroke 140ms ease;
}
.favorite-button.active path {
  fill: #5f9dda;
  stroke: #3f80bf;
}
</style>
