<template>
  <div class="lengend-container">
    <div :style="squre"></div>
    <span class="span" :style="word">{{ this.text }}</span>
  </div>
</template>

<script>
export default {
  name: 'Legend',
  props: {
    color:{
      type: String,
      default: "#FAC632"
    },
    size:{    // 这里是方块size
      type: Number,
      default: 10
    },
    text:{
      type: String,
      default: "Sculpture (123)"
    }
  },
  data(){
    return {
      squre: {
        "background-color": this.color,
        width: this.size + 'px',
        height: this.size + 'px'
      },
      word: {
        fontSize: 1.2 * this.size + 'px'
      },
    }
  }
}
</script>

<style scoped>
.lengend-container {
  display: flex;
  align-items: center;
  margin-right: 5px;
}
.span {
  margin-left: 5px;
}
</style>