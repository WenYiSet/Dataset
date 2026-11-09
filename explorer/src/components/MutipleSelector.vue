<template>
  <div class="selector" :style="selector_style">
    <div class="title" :style="title_style">
      <div class="panel">
        <span class="panel-title">{{ this.title }}</span>
        <el-checkbox class="panel_checkbox" v-for="(label, index) in item_labels"
            v-model="item_status[index]" :label=label size="large" v-show="item_status[index]"/>
      </div>
      <div class="btn" v-on:click="handleClick">
        <img class="img" :src="icon_arrow" :style="image_style"/>
      </div>
    </div>
    <div class="options" v-if="isActive">
      <el-checkbox v-for="(label, index) in item_labels"
          v-model="item_status[index]" :label=label size="large" />
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
      icon_arrow: icon_arrow_up,
      isActive: true,
      selector_style: null,
      title_style: null,
      image_style:{
        width: 0.06 * this.size  + 'px',
      },
    }
  },
  created(){
    this.selector_style = {
        width: this.size + 'px',
        "border": (this.isActive)?"1px solid rgba(185, 185, 185, 1)":"none"
      }
    this.title_style = {
        "backgound-color": (this.isActive)?"#5F9DDA40":"none"
      }
  },
  methods: {
    handleClick(){
      this.isActive = (this.isActive)?false:true;
    },
  },
  watch:{
    isActive(newVal, oldVal){
      this.selector_style = {
        width: this.size + 'px',
        "border": (this.isActive)?"1px solid rgba(185, 185, 185, 1)":"none"
      }
      this.icon_arrow = (this.isActive)?this.icon_arrow_up:this.icon_arrow_down;
      this.title_style = {
        "backgound-color": (this.isActive)?"#5F9DDA40":"none"
      }
    },
    // item_list:{
    //   handler(newVal, oldVal){
    //     console.log(newVal);
    //   },
    //   deep: true,
    // }
  }
}

</script>

<style scoped>
.selector{
  /* min-height: 5vh; */
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  box-sizing: border-box;
  border: 1px solid #B9B9B9;
}
.selector .title{
  /* width: 100%; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5vw;
  background-color: #5F9DDA40;
}
.panel{
  width: 90%;
  display: flex;
  flex-wrap: wrap;
}
.panel-title{
  margin-right: 5px;
  font-size: 2vh;
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
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F3F3F3;
  border-top: 1px solid rgba(185, 185, 185, 1);
}
.btn{
  display: flex;
  width: 10%;
  height: 100%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.img{
  aspect-ratio: 2;
}
</style>
