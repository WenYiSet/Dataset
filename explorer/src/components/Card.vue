<template>
  <div class="container" :style="container_style">
    <div class="img">
      <div class="name"><span :style="name_size">{{ dataset[CSV_title_names.name] }}</span></div>
      <div class="image">
        <img :src="image_path" style="object-fit: contain;"></img>
      </div>
      <div class="symbol">
        <span class="symbol_span" :style="text_size" v-for="item in symbol_lv1">{{ item }}</span>
        <span class="symbol_span" :style="text_size" v-for="item in symbol_lv2">{{ item }}</span>
      </div>
    </div>

    <div class="desc">
      <div class="info">
        <div class="time">
          <span :style="text_size" v-if="time_lv1" v-for="item in time_lv1">{{ item }}</span>
          <span :style="second_size" v-if="time_lv2" v-for="item in time_lv2">{{ item }}</span>
        </div>
        <div class="medium">
          <span :style="text_size" v-if="medium_lv1" v-for="item in medium_lv1">{{ item }}</span>
          <span :style="second_size" v-if="medium_lv2" v-for="item in medium_lv2">{{ item }}</span>
          <span :style="second_size" v-if="medium_lv3" v-for="item in medium_lv3">{{ item }}</span>
        </div>
      </div>
      <div class="subject">
        <div class="btn">
          <span class="span" :style="text_size" v-if="subject_lv1" v-for="item in subject_lv1">{{ item }}</span>
          <span class="span" :style="text_size" v-if="subject_lv2" v-for="item in subject_lv2">{{ item }}</span>
        </div>
        <div class="icon">
          <img :src="icon_like" style="object-fit: contain;"></img>
        </div>
      </div>
    </div>
  </div>
</template>

<script> 
import dragon_image from '../assets/images/test/龙_001 (1).png';
import icon_like from '../assets/images/icon_like_empty.png'
import axios from 'axios';
import { GetCSVTitleName_CN } from '../common/labels_cn';
import { GetCSVTitleName_EN } from '../common/labels_en';

export default {
  name: 'Card',
  props: {
    size:{    // 这里是卡片size
      type: Array,
      default: [300, 450]
    },
    language:{
      type:String,
      default: "Chinese"
    },
    dataset:{
      type: Object,
      default: {
        'fileLocation': 'test', 
        'fileName_cn': '龙_001 (1)', 
        'symbol_lv1_cn': '动物,自然', 
        'symbol_lv1_en': 'Creature,Nature', 
        'symbol_lv2_cn': '龙，凤，云', 
        'symbol_lv2_en': 'dragon, phoenix, cloud', 
        'name_cn': '虬龙纹', 
        'name_en': 'Dragon', 
        'preview': ' ', 
        'description_cn': '', 
        'description_en': '', 
        'medium_lv1_cn': '装饰', 
        'medium_lv1_en': 'Adornment & Ornament', 
        'medium_lv2_cn': '玉饰', 
        'medium_lv3_cn': '玉腰带', 
        'time_lv1_cn': '春秋', 
        'time_lv1_en': 'Spring and Autumn', 
        'time_lv2_cn': '', 
        'location_cn': '', 
        'location_en': '', 
        'subject_lv1_cn': '身份', 
        'subject_lv2_cn': '皇权，力量', 
        'subject_lv3_cn': '象征力量与变化，体现战国“蟠螭穿云”的灵动审美', 
        'subject_lv3_en': '', 
        'structure_cn': '单体', 
        'morphology_cn': '对称', 
        'style_cn': '抽象', 
        'quality': '低', 
        'remark': '', '': ''}
    },
  },
  data(){
    return {
      container_style: {
        width: this.size[0] + 'px',
        height: this.size[1] + 'px'
      },
      image_path: null,
      name_size:{
        'font-size' : this.size[1] * 0.7 * 0.1 * 0.6 + 'px',
      },
      text_size: {
        'font-size' : this.size[1] * 0.7 * 0.1 * 0.5 + 'px',
        'margin-left': '5px'
      },
      second_size:{
        'font-size' : this.size[1] * 0.7 * 0.1 * 0.4 + 'px',
        'color': '#8B8B8B',
        'margin-left': '5px'
      },
      icon_like: icon_like,
      CSV_title_names: {},
      symbol_lv1: null,
      symbol_lv2: null,
      time_lv1: null,
      time_lv2: null,
      medium_lv1: null,
      medium_lv2: null,
      medium_lv3: null,
      subject_lv1: null,
      subject_lv2: null,
    }
  },
  created(){
    this.getImage();
    this.language_change();
    this.load_data();
  },
  methods:{
    load_data(){
      let split_word = /[,，、]/
      this.symbol_lv1 = (this.dataset[this.CSV_title_names.symbol_lv1])?this.dataset[this.CSV_title_names.symbol_lv1].split(split_word):null;
      this.symbol_lv2 = (this.dataset[this.CSV_title_names.symbol_lv2])?this.dataset[this.CSV_title_names.symbol_lv2].split(split_word):null;
      this.time_lv1 = (this.dataset[this.CSV_title_names.time_lv1])?this.dataset[this.CSV_title_names.time_lv1].split(split_word):null;
      this.time_lv2 = (this.dataset[this.CSV_title_names.time_lv2])?this.dataset[this.CSV_title_names.time_lv2].split(split_word):null;
      this.medium_lv1 = (this.dataset[this.CSV_title_names.medium_lv1])?this.dataset[this.CSV_title_names.medium_lv1].split(split_word):null;
      this.medium_lv2 = (this.dataset[this.CSV_title_names.medium_lv2])?this.dataset[this.CSV_title_names.medium_lv2].split(split_word):null;
      this.medium_lv3 = (this.dataset[this.CSV_title_names.medium_lv3])?this.dataset[this.CSV_title_names.medium_lv3].split(split_word):null;
      this.subject_lv1 = (this.dataset[this.CSV_title_names.subject_lv1])?this.dataset[this.CSV_title_names.subject_lv1].split(split_word):null;
      this.subject_lv2 = (this.dataset[this.CSV_title_names.subject_lv2])?this.dataset[this.CSV_title_names.subject_lv2].split(split_word):null;
    },
    language_change(){
      if(this.language=="English")this.CSV_title_names = GetCSVTitleName_EN();
      else if(this.language=="Chinese")this.CSV_title_names = GetCSVTitleName_CN();
    },
    async getImage(){
      try {
          // 发送GET请求到Flask后端
          const response = await axios.get(this.$BackendUrl + '/images/' + this.dataset.fileName, {
              responseType: 'blob' // 重要：指定响应类型为blob
          });
          // 将响应数据转换为可显示的URL
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          this.image_path =  URL.createObjectURL(blob);
      } catch (err) {
          console.error('获取图片失败:', err);
      } 
    }
  },
  watch:{
    dataset:{
      handler(newVal, oldVal){
          this.getImage();
      },
      deep: true,
    },
    language:{
      handler(){this.language_change();this.load_data();}
    }
  }
}
</script>

<style scoped>
div{
  display: flex;
}

.container{
  padding: 2.5px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid #8B8B8B;
  background: #FFF;
  flex-direction: column;
}
.img{
  height: 70%;
  width: 100%;
  flex-direction: column;
  box-sizing: border-box;
  border-bottom: 1px solid #8B8B8B;
  justify-content: space-between;
}
.img .name{
  width: auto;
  height: 20%;
  /* align-items: center; */
  padding-left: 5px;
  z-index: 2;
  background: linear-gradient(to bottom, #fff, transparent);
}
.img .name{
  font-weight: bold;
}
.img .image{
  margin-top: -20%;
  height: 80%;
  aspect-ratio: 1;
  position: relative;
  justify-content: center;
}
.img .image img{
  width: 100%;
  height: 100%;
}
.img .symbol{
  height: 10%;
  width: auto;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;       /* 隐藏溢出内容 */
}
.img .symbol .symbol_span{
  color: #000;
  font-family: Inter;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.24px;
  margin-left: 5px;
  padding: 0 5px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #8B8B8B;

}
.desc{
  width: 100%;
  height: 30%;
  flex-direction: column;
}
.desc .info{
  height: 65%;
  width: 100%;
  flex-direction: column;
}
.desc .info .time{
  height: 50%;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
}
.desc .info .medium{
  height: 50%;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
}
.desc .subject{
  height: 35%;
  width: 100%;
  justify-content: space-between;
}
.desc .subject .btn{
  width: 80%;
  height: auto;

  align-items: end;
  padding-bottom: 5px;
  overflow: hidden;       /* 隐藏溢出内容 */
}
.desc .subject .icon{
  width: 20%;
  height: auto;
  justify-content: center;
  align-items: center;
}
.desc .subject .icon img{
  width: 50%;
  height: auto;
}
.desc .subject .btn .span{
  color: #000;
  font-family: Inter;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.24px;
  margin-left: 5px;
  padding: 0 5px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 1px solid #8B8B8B;
  /* max-width: 100px; */
  white-space: nowrap;    /* 禁止换行 */
  /* overflow: hidden;       隐藏溢出内容 */
  text-overflow: ellipsis; /* 显示省略号 */
}
</style>

