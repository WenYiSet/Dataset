<template>
  <div ref="wordCloud" class="word-cloud"
    :style="{'width': size[0] + 'px', 'height': size[1] + 'px'}"></div>
</template>

<script>
import * as d3 from 'd3';
import cloud from 'd3-cloud';

export default {
  name: 'WordCloud',
  props: {
    dataset:{
        type: Array,
        default:[
            {
                color:"#FAC632",
                words:["Ceramics", "Bronze Ware", "Jade Ware"],
                frequencys:[10, 30, 50]
            },
            {
                color:"#F38BA6",
                words:["Accessories", "Bronze Mirror", "Jewelry"],
                frequencys:[13, 25, 40]
            }
        ]
    },
    size:{
        type: Array,
        default:[400, 200]  //第一个元素为宽，第二个元素为高
    }
  },
  data() {
    return {
      words: [],
      selectedFont: 'Arial',
      colorScale: null,
      svg: null,
      layout: null,
      maxFrequency: 0,
    };
  },
  mounted() {
    this.initWordCloud();
    this.updateWordCloud();
  },
  methods: {
    initWordCloud() {
      // 创建SVG容器
      this.svg = d3.select(this.$refs.wordCloud)
        .append('svg')
        .attr('width', this.size[0])
        .attr('height', this.size[1]);
      
      // 创建词云布局
      this.layout = cloud()
        .size(this.size)
        .words([])
        .padding(5)
        .rotate(() => 0)
        .font(this.selectedFont)
        .fontSize(d => this.calculateFontSize(d.frequency))
        .on('end', this.drawWordCloud);
    },
    
    generateWords() {
      // 生成词汇数据
      var data = [];
      for(const item of this.dataset){
        for(let index=0; index<item['words'].length; index++){
            data.push({
                text: item['words'][index],
                frequency: item['frequencys'][index],
                color: item['color']
            })
            this.maxFrequency = Math.max(this.maxFrequency, item['frequencys'][index]);
        }
      }
      return data;
    },
    
    updateWordCloud() {
      // 更新词云布局设置
      this.layout
        .font(this.selectedFont)
        .words(this.words);
      
      // 开始布局计算
      this.layout.start();
    },
    
    drawWordCloud(words) {
      // 清除现有内容
      this.svg.selectAll('*').remove();
      
      // 绘制词云
      this.svg
        .append('g')
        .attr('transform', `translate(`+ this.size[0]/2 +`, `+ this.size[1]/2 +`)`)
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', d => `${this.calculateFontSize(d.frequency)}px`)
        .style('font-family', this.selectedFont)
        .style('fill', (d, i) => d.color)
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
        .text(d => d.text)
        .on('mouseover', function() {
          d3.select(this).style('cursor', 'pointer').style('opacity', 0.7);
        })
        .on('mouseout', function() {
          d3.select(this).style('opacity', 1);
        })
        .on('click', (event, d) => {
          alert(`点击了: ${d.text}`);
        });
    },
    calculateFontSize(frequency) {
      const minSize = this.size[1] / 25;
      const maxSize = this.size[0] / 12;
      const normalizedFrequency = frequency / this.maxFrequency;
      
      // 使用平方根缩放，使大小差异更明显
      return minSize + Math.sqrt(normalizedFrequency) * (maxSize - minSize);
    },
  },
  
  created() {
    // 初始化词汇数据
    this.words = this.generateWords();
  }
};
</script>

<style scoped>
.word{
  margin-left: 0.1vw;
  color: #FFFFFF;
}

.word-cloud {
  display: flex;
  justify-content: center;
  background: white;
}

:deep(text) {
  transition: all 0.3s ease;
}

:deep(text:hover) {
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}
</style>
