<template>
  <div class="selector" :class="{ collapsed: !isActive }" :style="{ width: size + 'px' }">
    <div class="title">
      <div class="panel">
        <span class="panel-title">{{ this.title }}</span>
        <el-checkbox class="panel_checkbox" v-for="(label, index) in item_labels"
            v-model="item_status[index]" :label=label v-show="item_status[index]"/>
      </div>
      <div class="btn" v-on:click="handleClick">
        <img class="img" :src="isActive ? icon_arrow_up : icon_arrow_down"/>
      </div>
    </div>
    <div class="options" v-if="isActive">
      <el-checkbox v-for="(label, index) in item_labels"
          v-model="item_status[index]" :label=label />
    </div>
  </div>
</template>

<script>
import icon_arrow_up from '../assets/images/arrow_up.png';
import icon_arrow_down from '../assets/images/arrow_down.png';

export default {
  name: 'MutipleSelector',
  props: {
    title:{
      type: String,
      default: "Medium",
    },
    item_labels:{
      type: Array,
      default:[
        "Utensil & Vessel",
        "Sculpture",
        "Textile",
        "Adornment & Ornament",
        "Pictorial work",
        "Architecture"
      ]
    },
    item_status:{
      type: Array,
      default: [
        false, false, false, false, false, false,
      ]
    },
    size:{
      type: Number,
      default: 300,
    }
  },
  data() {
    return {
      icon_arrow_up: icon_arrow_up,
      icon_arrow_down: icon_arrow_down,
      isActive: true,
    }
  },
  methods: {
    handleClick(){
      this.isActive = (this.isActive)?false:true;
    },
  },
}

</script>

<style scoped>
.selector{
  display: flex;
  overflow: hidden;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid #B9B9B9;
  border-radius: 5px;
  background: #F3F3F3;
}
.selector .title{
  display: flex;
  min-height: 34px;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  background-color: #5F9DDA40;
}
.panel{
  display: flex;
  min-width: 0;
  flex: 1 1 auto;
  flex-wrap: wrap;
}
.panel-title{
  margin-right: 5px;
  font-size: 16px;
  font-weight: 700;
}
.panel_checkbox{
  border: 1px solid #B9B9B9;
  background-color: #F3F3F3;
  padding: 0 0.3vw 0 0.1vw;
  margin: 0.1vh 0.1vw 0 0;
  border-radius: 5px;
}

.selector .options{
  display: flex;
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  padding: 4px 8px 6px;
  border-top: 1px solid rgba(185, 185, 185, 1);
  background-color: #F3F3F3;
}
:deep(.el-checkbox),
:deep(.el-checkbox__label){
  white-space: nowrap;
}
.btn{
  display: flex;
  width: 18px;
  height: 100%;
  flex: 0 0 18px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.img{
  width: 18px;
  aspect-ratio: 2;
}
</style>
