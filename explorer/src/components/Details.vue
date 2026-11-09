<template>
  <div class="container">
    <div class="head">
      <span class="title_text">{{ dataset[CSV_title_names.name] }}</span>
      <div style="align-items: center;">
        <img :src="icon_svg" class="img_style"></img>
        <img :src="icon_png" class="img_style"></img>
        <img :src="icon_like" class="img_style"></img>
      </div>
    </div>
    <div class="body">
      <div class="img_container">
        <img :src="image_path" style="object-fit: fill; aspect-ratio: 1; width: 100%;"></img>
      </div>
      <div class="info_container">
        <div class="group"><span>{{ label_name.Information }}</span></div>
        <div class="info">  <!-- Time  -->
          <div class="name"><span>{{ label_name.Time }}</span></div>
          <div class="text">
            <span>{{ dataset[CSV_title_names.time_lv1] }}</span>
            <span>{{ dataset[CSV_title_names.time_lv2] }}</span>
          </div>
        </div>
        <div class="info" style="height: fit-content;">  <!-- Location  -->
          <div class="name"><span>{{ label_name.Location }}</span></div>
          <div class="text">
            <span>{{ dataset[CSV_title_names.location] }}</span>
          </div>
        </div>
        <div class="info" style="height: fit-content; ">  <!-- Medium  -->
          <div class="name"><span>{{ label_name.Medium }}</span></div>
          <div class="text" style="flex-wrap: wrap;">
            <span>{{ dataset[CSV_title_names.medium_lv1] }}</span>
            <span>{{ dataset[CSV_title_names.medium_lv2] }}</span>
            <span>{{ dataset[CSV_title_names.medium_lv3] }}</span>
          </div>
        </div>
        <div class="group"><span>{{ label_name.Content }}</span></div>
        <div class="info" style="height: fit-content;">  <!-- Symbols  -->
          <div class="name"><span>{{ label_name.Symbols }}</span></div>
          <div class="text" style="flex-wrap: wrap;">
            <span>{{ dataset[CSV_title_names.symbol_lv1] }}</span>
            <span>{{ dataset[CSV_title_names.symbol_lv2] }}</span>
            <span>{{ dataset[CSV_title_names.symbol_lv3] }}</span>
          </div>
        </div>
        <div class="info"  style="flex-grow: 1;">  <!-- Description  -->
          <div class="name"><span>{{ label_name.Description }}</span></div>
          <div class="text overflow" style="align-items: flex-start;"><span>{{ dataset[CSV_title_names.description] }}</span></div>
        </div>
        <div class="info" style="height: fit-content;">  <!-- Subject  -->
          <div class="name"><span>{{ label_name.Subject }}</span></div>
          <div class="text" style="flex-wrap: wrap;">
            <span>{{ dataset[CSV_title_names.subject_lv1] }}</span>
            <span>{{ dataset[CSV_title_names.subject_lv2] }}</span>
          </div>
        </div>
        <div class="info" style="flex-grow: 1;">  <!-- Connotation  -->
          <div class="name"><span>{{ label_name.Connotation }}</span></div>
          <div class="text overflow" style="align-items: flex-start;"><span>{{ dataset[CSV_title_names.subject_lv3] }}</span></div>
        </div>
        <div class="group"><span>{{ label_name.Visual_Format }}</span></div>
        <div class="info">  <!-- Stucture  -->
          <div class="name"><span>{{ label_name.Stucture }}</span></div>
          <div class="text"><span>{{ dataset[CSV_title_names.structure] }}</span></div>
        </div>
        <div class="info">  <!-- Style  -->
          <div class="name"><span>{{ label_name.Style }}</span></div>
          <div class="text"><span>{{ dataset[CSV_title_names.style] }}</span></div>
        </div>
        <div class="info"> <!-- Morphology  -->
          <div class="name"><span>{{ label_name.Morphology }}</span></div>
          <div class="text"><span>{{ dataset[CSV_title_names.morphology] }}</span></div>
        </div>
        <div class="info" style="border: none;"> <!-- Quality  -->
          <div class="name"><span>{{ label_name.Quailty }}</span></div>
          <div class="text"><span>{{ dataset[CSV_title_names.quality] }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import icon_svg from '../assets/images/svg_download.png';
import icon_png from '../assets/images/png_download.png';
import icon_like from '../assets/images/icon_like_empty.png';
import { GetLabelName_CN, GetCSVTitleName_CN } from '../common/labels_cn';
import { GetLabelName_EN, GetCSVTitleName_EN } from '../common/labels_en';

export default {
  name: 'Details',
  props: {
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
      image_path: null,
      icon_like: icon_like,
      icon_svg: icon_svg,
      icon_png: icon_png,
      label_name: [],
      CSV_title_names: {},
    }
  },
  created(){
    this.getImage();
    this.language_change();
  },
  methods:{
    language_change(){
      if(this.language=="English"){
        this.label_name = GetLabelName_EN();
        this.CSV_title_names = GetCSVTitleName_EN();
      }
      else if(this.language=="Chinese"){
        this.label_name = GetLabelName_CN();
        this.CSV_title_names = GetCSVTitleName_CN();
      }
      // console.log(this.CSV_title_names.name);
      // console.log(this.dataset[this.CSV_title_names.name]);
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
      handler(){this.language_change();}
    }
  }
}
</script>

<style scoped>
div{
  display: flex;
}

.container {
  /* width: 50vw;
  height: 60vh; */
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  padding: 1vw;
  border-radius: 8px;
  border: 1px solid #000;
  flex-direction: column;
  background-color: #FFF;
}
.head{
  height: 8%;
  width: auto;
  justify-content: space-between;
  
  /* align-items: center; */
}
.head .title_text{
  font-size: 24px;
  color: #000;
  font-weight: bold;
}
.img_style{
  object-fit: fill; 
  height: 50%; 
  margin: 0 8px;
}
.body{
  height: 92%;
  width: auto;
  justify-content: space-between;
}
.body .img_container{
  padding: 4%;
  height: 100%;
  width: 49%;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #CDCDCD;
  align-items: center;
}
.body .info_container{
  height: 100%;
  width: 49%;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid #8B8B8B;
  flex-direction: column;
}
.body .info_container .group{
  height: 5%;
  width: auto;
  justify-content: center;
  align-items: center;
  background-color: #EAEAEA;
  color: #8B8B8B;
  font-weight: 700;
  border-bottom: 1px solid #8B8B8B;
}
.body .info_container .info{
  height: 4%;
  width: auto;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  border-bottom: 1px solid #8B8B8B;
}
.body .info_container .info .name{
  align-items: center;
  height: 100%;
  width: 25%;
  padding: 0 2%;
  background-color: #EAEAEA;
  font-weight: 500;
  border-right: 1px solid #8B8B8B;
}
.body .info_container .info .text{
  align-items: center;
  height: 100%;
  width: 75%;
  padding: 0 2%;
  font-weight: 500;
}
.body .info_container .info .text span{
  padding: 2px 0;
  margin-right: 8px;
}
.overflow{
  overflow: auto;
}
</style>