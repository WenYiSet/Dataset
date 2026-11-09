<template>
  <div class="container" :style="container_style">
    <div class="quantity" :style="quantity_style">
      <div class="text_container" v-for="(value, index) in quantity" 
            :style="{
              'width': real_width[index] + 'px', 
              'font-size': size[1] * 0.25 + 'px',
              'color': color[index]
            }">
        <span>{{ value }}</span>
      </div>

    </div>
    <div class="bar-chart" :style="chart_style">
      <div class="bar" v-for="(value, index) in quantity" 
          :style="{'background-color': color[index], 'width': real_width[index] + 'px'}"></div>
    </div>
    <div class="legend" :style="legend_style">
      <Legend v-for="item in legend_list" :color="item['color']" :size="item['size']"
        :text="item['text']"/>
    </div>
  </div>
</template>

<script>
import Legend from './Legend.vue';

export default {
  name: 'RadialBarChart',
  components:{
    Legend
  },
  props: {
    color:{
      type: Array,
      default: [
        "#F99E6E", "#FAC632", "#00B88E", "#F38BA6"
      ]
    },
    size:{
      type: Array,
      default: [500, 50]
    },
    quantity:{
      type: Array,
      default: [
        1500, 631, 642, 421
      ]
    },
    text:{
      type: Array,
      default:[
        "Auspiciousness",
        "Narrativity",
        "Identity",
        "Ideology"
      ]
    },
  },
  data(){
    return {
      container_style: {
        width: this.size[0] + 'px',
        height: this.size[1] + 'px'
      },
      chart_style: null,
      quantity_style: null,
      legend_style: null,
      real_width: [],
      legend_list: []
    }
  },
  created(){
    const total = this.quantity.reduce((acc, curr) => acc + curr, 0);
    for(const item of this.quantity){
      this.real_width.push(Math.round(item / total * this.size[0]));
    }
    this.chart_style = { height: Math.round(1 / 6 * this.size[1]) + 'px' }
    this.quantity_style = { height: Math.round(2 / 6 * this.size[1]) + 'px' }
    this.legend_style = { height: Math.round(3 / 6 * this.size[1]) + 'px' }
    for(let i=0;i<this.quantity.length;i++){
      this.legend_list.push({
        'color': this.color[i], 'text': this.text[i], 'size': this.size[1] / 5
      })
    }
  },
  methods:{

  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.quantity{
  width: 100%;
  display: flex;
}
.text_container{
  height: 100%;
}
.bar-chart{
  width: 100%;
  display: flex;
}
.bar-chart .bar{
  height: 100%;
}
.legend{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>