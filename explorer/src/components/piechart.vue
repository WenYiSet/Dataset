<template>
  <div class="donut-chart" ref="chartContainer"></div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'PieChart',
  props: {
    color: {
      type: Array,
      default: [
        "#F38BA6", "#C8DA55", "#00B88E", "#FAC632", "#FE7960", "#18B8EB"
      ]
    },
    size: {
      type: Number,
      default: 300
    },
    dataset: {
      type: Object,
      default: {
        "Utensil & Vessel":321,
        "Sculpture":123,
        "Textile":123,
        "Adornment & Ornament":123
      }
    }
  },
  data() {
    return {
      svg: null,
      percentage: 0,
      title: "aaaa &asa",
    };
  },
  mounted() {
    this.initChart();
    this.text_show();
  },
  methods: {
    initChart() {
      // 清除现有内容
      if (this.svg) {
        this.svg = null;
      }

      const container = this.$refs.chartContainer;
      const width = this.size;
      const height = this.size;
      const outerRadius = Math.min(width, height) / 2;
      const innerRadius = outerRadius / 1.8;


      // 创建 SVG
      this.svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      
      const color = d3.scaleOrdinal()
        .range(this.color)

      // 自动计算弧度
      const pie = d3.pie()
        .value(d=>d[1])
      var data_ready = pie(Object.entries(this.dataset))

      // 绘制圆环
      this.svg
        .selectAll('whatever')
        .data(data_ready)
        .join('path')
        .attr('d', d3.arc()
          .innerRadius(innerRadius)         // This is the size of the donut hole
          .outerRadius(outerRadius)
        )
        .attr('fill', d => color(d.data[0]))
        .style("opacity", 0.7)
        .on('click', (event, d)=>{
          const keys = Object.keys(this.dataset);
          const values = Object.values(this.dataset);
          this.percentage = (d.value / values.map(Number).reduce((acc, curr) => acc + curr, 0) * 100).toFixed(1);
          this.title = keys[d.index];
          this.text_show();
        });
      const keys = Object.keys(this.dataset);
      const values = Object.values(this.dataset);
      this.percentage = (values[0] / values.map(Number).reduce((acc, curr) => acc + curr, 0) * 100).toFixed(1);
      this.title = keys[0];
    },
    text_show(){
      d3.select('#textGroup').remove();

      // 创建文本组
      const textGroup = this.svg.append('g')
        .attr('id', 'textGroup')
        .attr('text-anchor', 'middle');

      // 百分比文本
      this.percentageText = textGroup.append('text')
        .attr('class', 'percentage-text')
        .attr('dy', ()=>{ return this.size * -0.04 })
        .style('font-size', ()=>{ return this.size * 0.15 })
        .text(this.percentage + '%');

      var titles = new Array();
      if(this.title.includes("&")){
        titles = this.title.split("&");
        titles[0] = titles[0] + " &"
      }else titles.push(this.title);

      // 标题文本
      textGroup.append('text')
        .attr('class', 'title-text')
        .attr('dy', ()=>{ return this.size * 0.08 })
        .style('font-size', ()=>{ return this.size * 0.1 })
        .text(titles[0]);
      
      if(this.title.includes("&")){
        textGroup.append('text')
          .attr('class', 'title-text')
          .attr('dy', ()=>{ return this.size * 0.18 })
          .style('font-size', ()=>{ return this.size * 0.1 })
          .text(titles[1]);
      }
    }
  },
  watch: {
    // percentage(newVal) {
    //   this.animateChart();
    // },
    // title() {
    //   this.initChart();
    //   this.animateChart();
    // },
    // color() {
    //   this.initChart();
    //   this.animateChart();
    // }
  }
};
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.donut-chart {
  background: white;
}

:deep(.percentage-text) {
  font-size: 48px;
  font-weight: bold;
  fill: #333;
  font-family: 'Arial', sans-serif;
}

:deep(.title-text) {
  font-size: 24px;
  fill: #666;
  font-family: 'Arial', sans-serif;
  letter-spacing: 1px;
}
</style>