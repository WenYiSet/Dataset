<template>
  <div class="container">
    <!-- 顶部栏 -->
    <div class="Header">
        <div class="title">
          <img :src="icon_mark" class="brand-mark" alt="" />
          <img
            :src="language === 'Chinese' ? icon_logo_cn : icon_logo_en"
            class="brand-wordmark"
            :class="language === 'Chinese' ? 'chinese' : 'english'"
            :alt="label_name.SystemName"
          />
        </div>
        <div class="search-box">
          <el-input class="no-border-input" v-model="input_value" :placeholder=label_name.InputHolder  v-on:keyup.enter="search()"/>
          <el-image :src="icon_search" class="search-icon" fit="fill" v-on:click="search()"/>
        </div>
        <div class="Personalization">
          <button
            class="favorites-entry"
            type="button"
            :class="{ active: favorites_drawer_open || favorite_ids.length }"
            :aria-expanded="favorites_drawer_open"
            aria-controls="favorites-drawer"
            :aria-label="favorites_drawer_open
              ? (language === 'Chinese' ? '收起收藏夹' : 'Close favorites')
              : (language === 'Chinese' ? '打开收藏夹' : 'Open favorites')"
            @click="favorites_drawer_open = !favorites_drawer_open"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20.4 4.2 13C.9 9.9 2.6 4.5 7.1 4.5c2.1 0 3.7 1.2 4.9 2.8 1.2-1.6 2.8-2.8 4.9-2.8 4.5 0 6.2 5.4 2.9 8.5L12 20.4Z" />
            </svg>
            <span v-if="favorite_ids.length" class="favorites-count">{{ favorite_ids.length }}</span>
          </button>
          <el-image
            :src="icon_trans"
            class="language-toggle"
            fit="fill"
            role="button"
            tabindex="0"
            :aria-label="language === 'Chinese' ? 'Switch to English' : '切换到中文'"
            v-on:click="switch_language()"
            v-on:keyup.enter="switch_language()"
          />
        </div>
    </div>

    <!-- 主体栏 -->
    <div class="Main" :class="{ 'static-main': static_mode }">
      <div class="controller"> <!-- 左侧控制栏 -->
        
        <div class="Medium_block"> <!-- Medium模块 -->
          <MutipleSelector :size="selectorSize" :title=label_name.MediumName 
              :item_labels=label_name.MediumItems :item_status="medium_items_status"/>
          <!-- <div class="graph">
            <PieChart :size="piechartSize" />

            <div class="clouds">
              <div class="title">
                <span>Medium</span>
              </div>
              <WordCloud :size="wordcloudSize" />
            </div>

          </div>
          <div class="legend">
            <Legend v-for="item in legend_list" :text="item['text']" :color="item['color']" />
          </div> -->
        </div>

        <div class="Subject_block">   <!-- Subject模块 -->
          <MutipleSelector :size="selectorSize" :title="label_name.SubjectName" 
              :item_labels=label_name.SubjectItems :item_status="subject_items_status"/>
          <!-- <div style="margin-top: 1vh;">
            <RadialBarChart :size="radialbarchartSize" />
          </div>
          <div class="clouds">
            <div class="title">
              <span>Subject</span>
            </div>
            <WordCloud :size="subject_wordcloudSize" />
          </div> -->
        </div>

        <div class="Subject_block">   <!-- Symbols模块 -->
          <MutipleSelector :size="selectorSize" :title="label_name.SymbolsName" 
              :item_labels=label_name.SymbolsItems :item_status="symbols_items_status"/>
          <!-- <div style="margin-top: 1vh;">
            <RadialBarChart :size="radialbarchartSize" />
          </div>
          <div class="clouds">
            <div class="title">
              <span>Symbols</span>
            </div>
            <WordCloud :size="subject_wordcloudSize" />
          </div> -->
        </div>

        <div class="VisualFormat_block">
          <VisualFormSelector
            :title="label_name.VisualFormat"
            :structure-title="label_name.StructureName"
            :style-title="label_name.StyleName"
            :structure-items="label_name.StructureItems"
            :style-items="label_name.StyleItems"
            :structure-status="struture_items_status"
            :style-status="style_items_status"
          />
        </div>

      </div>

      <div class="viewer">  <!-- 右侧主视图模块 -->
        <div class="viewer-status" v-if="static_mode && (loading || load_error)">
          <span v-if="loading">{{ language === 'Chinese' ? '正在加载数据' : 'Loading data' }}</span>
          <span v-else class="load-error">{{ load_error }}</span>
        </div>
        <component :is="active_card_component" :size="cardSize" v-for="value in visible_data"
            :key="record_key(value)" :dataset="value" :language=language v-on:click="set_detail(value)"
            :favorite="is_favorite(value)" @toggle-favorite="toggle_favorite"
            @select-motif="set_search_term"
            :class="{ 'static-viewer-card': static_mode }"
            style="cursor: pointer;"/>
        <button v-if="has_more" class="load-more" type="button" @click="load_more">
          {{ language === 'Chinese' ? '加载更多' : 'Load more' }}
        </button>
      </div>
    </div>

    <aside
      v-if="favorites_drawer_open"
      id="favorites-drawer"
      class="favorites-drawer"
      role="region"
      :aria-label="language === 'Chinese' ? '收藏夹' : 'Favorites'"
      aria-live="polite"
    >
      <header>
        <strong>{{ language === 'Chinese' ? '收藏夹' : 'Favorites' }}</strong>
        <button
          type="button"
          class="drawer-close"
          :aria-label="language === 'Chinese' ? '收起收藏夹' : 'Close favorites'"
          @click="favorites_drawer_open = false"
        >×</button>
      </header>
      <p v-if="!favorite_records.length" class="favorites-empty">
        {{ language === 'Chinese' ? '还没有收藏纹样' : 'No saved patterns yet' }}
      </p>
      <div v-else class="favorites-list">
        <article
          v-for="record in favorite_records"
          :key="`favorite-${record_key(record)}`"
          class="favorite-item"
        >
          <button type="button" class="favorite-open" @click="set_detail(record)">
            <img v-if="favorite_image(record)" :src="favorite_image(record)" :alt="favorite_title(record)" />
            <span v-else class="favorite-image-placeholder">{{ language === 'Chinese' ? '无图' : 'No image' }}</span>
            <span>{{ favorite_title(record) }}</span>
          </button>
          <FavoriteButton
            :favorite="true"
            :always-visible="true"
            :language="language"
            :payload="record"
            @toggle="toggle_favorite"
          />
        </article>
      </div>
    </aside>

    <!-- 底部栏 -->
    <div class="Footer" :class="{ 'static-footer': static_mode }">
      <div class="History_period">
        <div class="selector">
          <span>{{ label_name.HistoryName }}</span>
          <div class="icon_arrow" v-on:click="showHistorySelector">
            <img :src="icon_arrow"/>
          </div>
        </div>
        <div class="labels">
          <el-checkbox v-for="(item, index) in label_name.HistoryItems" v-show="history_items_status[index]"
            v-model="history_items_status[index]" :label="item"  />
        </div>
      </div>
      <div class="TimeBarChart" v-if="!static_mode">
        <TimeBarChart style="width: 100%;height: 100%;" :Status="history_items_status"
           :size="timebarchartSize" :language="language" @update:data="update_status"/><!-- @update:data="history_items_status = $event" -->
      </div>
      <StaticTimeBarChart v-else :bars="period_bar_options" :language="language" @toggle="toggle_period" />
    </div>

    <!-- History Period 展开栏 -->
    <div class="history_selector" :class="{ 'static-history-selector': static_mode }" v-show="history_selector_show">
      <el-checkbox v-for="(item, index) in label_name.HistoryItems" 
          v-model="history_items_status[index]" :label="item" font-size="smaller" />
    </div>
  </div>

  <!-- 遮罩层 -->
  <div class="mask" v-show="is_detail_show"></div>

  <!-- Details 详细栏 -->
  <div class="details" v-if="is_detail_show">
    <component :is="active_detail_component" style="width: 100%;height: 100%;" :language="language" :dataset="detail_value"
      :favorite="is_favorite(detail_value)" @toggle-favorite="toggle_favorite"/>
    <div class="button" v-on:click="close_detail()">
      <img :src="icon_close" style="width: 100%;height: 100%;object-fit: fill;"></img>
    </div>
  </div>
  
</template>

<script>
import PieChart from './piechart.vue';
import WordCloud from './WordCloud.vue';
import Legend from './Legend.vue';
import MutipleSelector from './MutipleSelector.vue';
import RadialBarChart from './RadialBarChart.vue';
import Card from './Card.vue';
import Details from './Details.vue';
import StaticPatternCard from './StaticPatternCard.vue';
import StaticPatternDetails from './StaticPatternDetails.vue';
import StaticTimeBarChart from './StaticTimeBarChart.vue';
import TimeBarChart from './TimeBarChart.vue';
import FavoriteButton from './FavoriteButton.vue';
import VisualFormSelector from './VisualFormSelector.vue';

import {ref} from 'vue'
import icon_mark from '../assets/images/mark.png';
import icon_logo_cn from '../assets/images/icon_WenYi_cn.png';
import icon_logo_en from '../assets/images/icon_WenYi_en.png';
import icon_search from '../assets/images/search.png';
import icon_trans from '../assets/images/icon_trans.png';
import icon_arrow_up from '../assets/images/arrow_up.png';
import icon_arrow_down from '../assets/images/arrow_down.png'
import icon_close from '../assets/images/close.png'

import axios from 'axios';
import { GetLabelName_CN, GetCSVTitleName_CN } from '../common/labels_cn';
import { GetLabelName_EN, GetCSVTitleName_EN } from '../common/labels_en';
import { deepCompare } from '../common/common';
import {
  facetOptions,
  isStaticDataMode,
  loadStaticDataset,
  matchesFacetValues,
  recordSearchText,
} from '../data/wenyiData';

export default {
  name: 'Main',
  components:{
    PieChart,
    WordCloud,
    Legend,
    MutipleSelector,
    RadialBarChart,
    Card,
    Details,
    StaticPatternCard,
    StaticPatternDetails,
    StaticTimeBarChart,
    TimeBarChart,
    FavoriteButton,
    VisualFormSelector
  },
  data() {
      return {
        icon_mark: icon_mark,
        icon_logo_cn: icon_logo_cn,
        icon_logo_en: icon_logo_en,
        icon_search: icon_search,
        icon_trans: icon_trans,
        icon_arrow_up: icon_arrow_up,
        icon_arrow_down: icon_arrow_down,
        icon_arrow: icon_arrow_up,
        icon_close: icon_close,
        input_value: '',

        piechartSize: 5.5 * window.innerWidth / 100,
        wordcloudSize: [9.5 * window.innerWidth / 100 ,9.5 * window.innerHeight / 100],
        subject_wordcloudSize: [14.8 * window.innerWidth / 100 ,11 * window.innerHeight / 100],
        legendSize: 0,
        selectorSize: 15 * window.innerWidth / 100,
        radialbarchartSize: [15 * window.innerWidth / 100, 5 * window.innerHeight / 100],
        cardSize: isStaticDataMode()
          ? [228, 318]
          : [
              (82 - 5) * window.innerWidth / 100 / 6 - 8,
              (82 - 5) * window.innerWidth / 100 / 6 * 1.5,
            ],
        timebarchartSize: [98 * window.innerWidth / 100, 13 * window.innerHeight / 100],

        // legend_list: [
        //   { color: "#FAC632", text: "Utensil & Vessel (1234)"},
        //   { color: "#FE7960", text: "Textile (123)"},
        //   { color: "#18B8EB", text: "Sculpture (123)"},
        //   { color: "#F38BA6", text: "Adornment & Ornament (123)"},
        //   { color: "#C8DA55", text: "Pictorial works (123)"},
        //   { color: "#00B88E", text: "Architecture (123)"}
        // ],

        history_selector_show: false,

        language: isStaticDataMode() ? "Chinese" : "English",
        label_name: [],
        csv_title_names: [],
        is_detail_show: false,
        detail_value: null,

        static_mode: isStaticDataMode(),
        static_facets: null,
        static_facet_values: {},
        static_period_keys: [],
        static_all_results: [],
        period_base_data: [],
        data_version: null,
        loading: false,
        load_error: '',
        page_size: 60,
        visible_limit: 60,
        favorites_drawer_open: false,
        favorite_ids: [],

        medium_items_status: [false,false,false,false,false,false],
        subject_items_status: [false,false,false,false],
        symbols_items_status: [false,false,false,false],
        struture_items_status: [false,false,false,false,false],
        style_items_status: [false,false],
        history_items_status: [false,false,false,false,false,false,false,false,false,false,false,false,false,false],

        filtered_data:[],
        results:[],
      };
    },
    computed: {
      active_card_component() {
        return this.static_mode ? 'StaticPatternCard' : 'Card';
      },
      active_detail_component() {
        return this.static_mode ? 'StaticPatternDetails' : 'Details';
      },
      visible_data() {
        return this.filtered_data.slice(0, this.visible_limit);
      },
      has_more() {
        return this.visible_limit < this.filtered_data.length;
      },
      period_bar_options() {
        if (!this.static_mode) return [];
        const groups = this.static_facet_values.periods || [];
        const labels = this.label_name.HistoryItems || [];
        return groups.map((members, index) => ({
          value: this.static_period_keys[index] || members[0],
          label: labels[index] || this.static_period_keys[index] || members[0],
          count: this.period_base_data.filter((record) => (
            matchesFacetValues(record.context?.periods, members)
          )).length,
          selected: Boolean(this.history_items_status[index]),
        }));
      },
      favorite_records() {
        const source = this.static_mode ? this.static_all_results : this.results;
        const recordsById = new Map(source.map((record) => [this.record_key(record), record]));
        return this.favorite_ids.map((id) => recordsById.get(id)).filter(Boolean);
      },
    },
    created(){
      this.load_favorites();
      this.language_change();
      this.getAllCards();

      // console.log(window.innerWidth);
    },
    methods:{
      load_favorites(){
        try {
          const saved = JSON.parse(window.localStorage.getItem('wenyi-favorites') || '[]');
          this.favorite_ids = Array.isArray(saved)
            ? [...new Set(saved.filter((id) => typeof id === 'string'))]
            : [];
        } catch (error) {
          console.warn('Could not read saved favorites.', error);
          this.favorite_ids = [];
        }
      },
      save_favorites(){
        try {
          window.localStorage.setItem('wenyi-favorites', JSON.stringify(this.favorite_ids));
        } catch (error) {
          console.warn('Could not save favorites.', error);
        }
      },
      is_favorite(record){
        if(!record)return false;
        return this.favorite_ids.includes(this.record_key(record));
      },
      toggle_favorite(record){
        if(!record)return;
        const id = this.record_key(record);
        const index = this.favorite_ids.indexOf(id);
        if(index >= 0)this.favorite_ids.splice(index, 1);
        else this.favorite_ids.push(id);
        this.favorite_ids = [...this.favorite_ids];
        this.save_favorites();
      },
      favorite_title(record){
        if(!record)return '';
        if(this.static_mode){
          const title = record.title || {};
          return this.language === 'English'
            ? (title.en || title.zh || 'Untitled Pattern')
            : (title.zh || title.en || '未命名纹样');
        }
        return record[this.csv_title_names.name] || this.record_key(record);
      },
      favorite_image(record){
        return this.static_mode ? (record?.image?.resolvedUrl || '') : '';
      },
      showHistorySelector(){
        this.history_selector_show = (this.history_selector_show)?false:true;
        this.icon_arrow = (this.history_selector_show)?this.icon_arrow_down:this.icon_arrow_up;
      },
      async getAllCards(){
        if(this.static_mode){
          this.loading = true;
          this.load_error = '';
          try {
            const loaded = await loadStaticDataset();
            this.static_all_results = loaded.records;
            this.static_facets = loaded.facets;
            this.data_version = loaded.version;
            this.results = loaded.records;
            this.apply_static_facets();
            this.filter();
          } catch (error) {
            console.error(error);
            this.load_error = error instanceof Error ? error.message : String(error);
          } finally {
            this.loading = false;
          }
          return;
        }
        const response = await axios.get(this.$BackendUrl + '/all_cards');
        this.results = response.data;
        this.filter();
      },
      async search(){
        if(this.static_mode){
          const query = this.input_value.trim().toLocaleLowerCase();
          this.results = query
            ? this.static_all_results.filter((record) => recordSearchText(record).includes(query))
            : this.static_all_results;
          this.filter();
          return;
        }
        if(this.input_value.length==0){
          await this.getAllCards();
          return;
        }
        axios.post(this.$BackendUrl + '/search', {
          "key_word": this.input_value,
        }).then(response => {
          this.results = response.data;
          this.filter();
          // console.log(this.results[0]);
        });
      },
      set_search_term(value){
        this.input_value = String(value || '');
      },
      set_detail(value){
        this.detail_value = value;
        this.is_detail_show = true;
      },
      close_detail(){
        this.is_detail_show = false;
      },
      filter(){           // 过滤器
        const mediums = [], subjects = [], symbols = [], times = [], structures = [], styles = [];
        
        for(let i=0;i<this.label_name.MediumItems.length;i++) 
          if(this.medium_items_status[i])mediums.push(this.static_mode ? this.static_facet_values.carrierCategories?.[i] : this.label_name.MediumItems[i]);

        for(let i=0;i<this.label_name.SubjectItems.length;i++) 
          if(this.subject_items_status[i])subjects.push(this.static_mode ? this.static_facet_values.semanticDomains?.[i] : this.label_name.SubjectItems[i]);

        for(let i=0;i<this.label_name.SymbolsItems.length;i++) 
          if(this.symbols_items_status[i])symbols.push(this.static_mode ? this.static_facet_values.motifCategories?.[i] : this.label_name.SymbolsItems[i]);

        for(let i=0;i<this.label_name.StructureItems.length;i++) 
          if(this.struture_items_status[i])structures.push(this.static_mode ? this.static_facet_values.visualStructures?.[i] : this.label_name.StructureItems[i]);

        for(let i=0;i<this.label_name.StyleItems.length;i++) 
          if(this.style_items_status[i])styles.push(this.static_mode ? this.static_facet_values.visualStyles?.[i] : this.label_name.StyleItems[i]);

        for(let i=0;i<this.label_name.HistoryItems.length;i++) {
          if(!this.history_items_status[i])continue;
          if(this.static_mode){
            const periodValues = this.static_facet_values.periods?.[i] || [];
            times.push(...(Array.isArray(periodValues) ? periodValues : [periodValues]));
          }
          else times.push(this.label_name.HistoryItems[i]);
        }
        // console.log(mediums);
        if(this.static_mode){
          this.period_base_data = this.results.filter((feature) => (
            matchesFacetValues(feature.context?.carrierCategories, mediums)
            && matchesFacetValues(feature.semantics?.domains, subjects)
            && matchesFacetValues(feature.motifs?.categories, symbols)
            && matchesFacetValues(feature.visualForm?.structures, structures)
            && matchesFacetValues(feature.visualForm?.styles, styles)
          ));
          this.filtered_data = this.period_base_data.filter((feature) => matchesFacetValues(feature.context?.periods, times));
          this.visible_limit = this.page_size;
          return;
        }
        var result = [];
        for(const feature of this.results){
          var flag = true;
          if(mediums.length != 0)flag = flag && mediums.includes(feature[this.csv_title_names.medium_lv1]);
          if(subjects.length != 0)flag = flag && subjects.includes(feature[this.csv_title_names.subject_lv1]);
          if(symbols.length != 0)flag = flag && symbols.includes(feature[this.csv_title_names.symbol_lv1]);
          if(structures.length != 0)flag = flag && structures.includes(feature[this.csv_title_names.structure]);
          if(styles.length != 0)flag = flag && styles.includes(feature[this.csv_title_names.style]);
          if(times.length != 0)flag = flag && times.includes(feature[this.csv_title_names.time_lv1]);
          if(flag){
            result.push(feature);
          }
        }
        this.filtered_data = result;
        this.visible_limit = this.page_size;
        // console.log(result);
      },
      apply_static_facets(){
        if(!this.static_mode || !this.static_facets)return;
        const optionGroups = [
          ['MediumItems', 'medium_items_status', 'carrierCategories'],
          ['SubjectItems', 'subject_items_status', 'semanticDomains'],
          ['SymbolsItems', 'symbols_items_status', 'motifCategories'],
          ['StructureItems', 'struture_items_status', 'visualStructures'],
          ['StyleItems', 'style_items_status', 'visualStyles'],
          ['HistoryItems', 'history_items_status', 'periods'],
        ];
        optionGroups.forEach(([labelKey, statusKey, facetKey]) => {
          const options = facetOptions(this.static_facets, facetKey, this.language)
            .sort((left, right) => {
              const leftUnknown = left.value === 'unknown' || ['不详', 'Unknown'].includes(left.label);
              const rightUnknown = right.value === 'unknown' || ['不详', 'Unknown'].includes(right.label);
              return Number(leftUnknown) - Number(rightUnknown);
            });
          if(facetKey === 'periods'){
            const optionByValue = new Map(options.map((option) => [option.value, option]));
            const periodGroups = [
              { key: 'prehistory', members: ['stone_age', 'neolithic'], zh: '新石器时代', en: 'Neolithic' },
              { key: 'shang', members: ['shang'] },
              { key: 'western_zhou', members: ['western_zhou'] },
              { key: 'spring_autumn', members: ['spring_autumn'] },
              { key: 'warring_states', members: ['warring_states'] },
              { key: 'qin', members: ['qin'] },
              { key: 'han', members: ['han', 'western_han', 'eastern_han'], zh: '汉代', en: 'Han' },
              { key: 'wei_jin', members: ['wei_jin'] },
              { key: 'northern_southern', members: ['northern_southern', 'northern_southern_dynasties'] },
              { key: 'sui', members: ['sui'] },
              { key: 'tang', members: ['tang'] },
              { key: 'five_dynasties', members: ['five_dynasties'] },
              { key: 'song', members: ['song'] },
              { key: 'liao', members: ['liao'] },
              { key: 'yuan', members: ['yuan'] },
              { key: 'ming', members: ['ming'] },
              { key: 'qing', members: ['qing'] },
              { key: 'modern', members: ['modern'] },
              { key: 'unknown', members: ['unknown'] },
            ].map((group) => {
              const members = group.members.filter((member) => optionByValue.has(member));
              if(!members.length)return null;
              const firstOption = optionByValue.get(members[0]);
              return {
                ...group,
                members,
                label: this.language === 'Chinese'
                  ? (group.zh || firstOption.label)
                  : (group.en || firstOption.label),
              };
            }).filter(Boolean);
            this.static_period_keys = periodGroups.map((group) => group.key);
            this.static_facet_values[facetKey] = periodGroups.map((group) => group.members);
            this.label_name[labelKey] = periodGroups.map((group) => group.label);
            if(this[statusKey].length !== periodGroups.length){
              this[statusKey] = periodGroups.map(() => false);
            }
            return;
          }
          this.static_facet_values[facetKey] = options.map((option) => option.value);
          this.label_name[labelKey] = options.map((option) => option.label);
          if(this[statusKey].length !== options.length){
            this[statusKey] = options.map(() => false);
          }
        });
      },
      apply_static_ui_labels(){
        if(!this.static_mode)return;
        const chinese = this.language === 'Chinese';
        Object.assign(this.label_name, chinese
          ? {
              SystemName: '纹意',
              InputHolder: '请输入',
              MediumName: '载体',
              SubjectName: '主题',
              SymbolsName: '意象',
              VisualFormat: '视觉形式',
              StructureName: '结构',
              StyleName: '风格',
              HistoryName: '历史时期',
            }
          : {
              SystemName: 'WenYi.Set',
              InputHolder: 'Please input',
              MediumName: 'Medium',
              SubjectName: 'Subject',
              SymbolsName: 'Motif',
              VisualFormat: 'Visual Form',
              StructureName: 'Structure',
              StyleName: 'Style',
              HistoryName: 'History period',
            });
      },
      toggle_period(index){
        this.history_items_status[index] = !this.history_items_status[index];
      },
      load_more(){
        this.visible_limit += this.page_size;
      },
      record_key(value){
        return this.static_mode ? value.id : (value.pattern_id || value.fileName);
      },
      switch_language(){
        this.language = (this.language == "English")?"Chinese":"English";
      },
      language_change(){
        if(this.language=="English"){
          this.label_name = GetLabelName_EN();
          this.csv_title_names = GetCSVTitleName_EN();
        }
        else if(this.language=="Chinese"){
          this.label_name = GetLabelName_CN();
          this.csv_title_names = GetCSVTitleName_CN();
        }
        this.apply_static_ui_labels();
        this.apply_static_facets();
      },
      update_status(newVal){
        if(deepCompare(this.history_items_status, newVal))return;
        this.history_items_status = newVal;
      }
    },
    watch: {
      medium_items_status:{
        handler(newVal, oldVal){
          this.filter();
        },
        deep: true,
      },
      subject_items_status:{
        handler(newVal, oldVal){
          this.filter();
        },
        deep: true,
      },
      symbols_items_status:{
        handler(newVal, oldVal){
          this.filter();
        },
        deep: true,
      },
      history_items_status:{
        handler(newVal, oldVal){
          this.filter();
        },
        deep: true,
      },
      struture_items_status:{
        handler(newVal, oldVal){
          this.filter();
        },
        deep: true,
      },
      style_items_status:{
        handler(newVal, oldVal){
          this.filter();
        },
        deep: true,
      },
      language:{
        handler(newVal, oldVal){
          this.language_change();
        }
      }
    }
}

</script>   


<style scoped>
  @import url('../style/main.css');
.details{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  width: 60vw;
  height: 70vh;
}
.mask{
  position: absolute;
  width: 100vw;
  height: 95vh;
  top: 5vh;
  left: 0%;
  background-color: #00000040;
  z-index: 3;
}
.button{
  position: relative;
  width: 2.1vw;
  height: 2vw;
  top: -0.8vw;
  left: -1.2vw;
  z-index: 3;
  cursor: pointer;
}
.viewer-status{
  display: flex;
  grid-column: 1 / -1;
  min-height: 38px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 7px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
}
.load-error{ color: #a40000; }
.load-more{
  width: 100%;
  min-height: 38px;
  grid-column: 1 / -1;
  margin: 2px 0 10px;
  border: 1px solid #8b8b8b;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
.Main.static-main{
  min-height: 0;
  height: auto;
  flex: 1 1 auto;
}
.Main.static-main .controller{
  width: var(--sidebar-width);
  flex: 0 0 var(--sidebar-width);
}
.Main.static-main .controller :deep(.selector){
  width: 100% !important;
}
.Main.static-main .viewer{
  display: grid;
  width: auto;
  min-width: 0;
  flex: 1 1 auto;
  grid-template-columns: repeat(auto-fill, minmax(252px, 1fr));
  grid-auto-rows: 318px;
  align-content: start;
  gap: 8px;
  padding: 8px;
  box-sizing: border-box;
}
.static-viewer-card{
  width: 100% !important;
  height: 318px !important;
  margin: 0 !important;
}
.Footer.static-footer{
  height: var(--footer-height);
  flex: 0 0 var(--footer-height);
}
.Footer.static-footer .History_period{
  height: 31px;
  min-height: 31px;
  padding-top: 7px;
  box-sizing: border-box;
}
.history_selector.static-history-selector{
  bottom: var(--footer-height);
}
.history_selector.static-history-selector :deep(.el-checkbox){
  min-height: 28px;
  margin-right: 0;
  white-space: nowrap;
}
.favorites-entry{
  display: inline-flex;
  position: relative;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}
.favorites-entry:hover,
.favorites-entry:focus-visible{
  background: rgba(95, 157, 218, 0.14);
  outline: none;
}
.favorites-entry svg{ width: 25px; height: 25px; }
.favorites-entry path{
  fill: rgba(95, 157, 218, 0.14);
  stroke: #555;
  stroke-width: 1.7;
}
.favorites-entry.active path{ fill: #5f9dda; stroke: #3f80bf; }
.favorites-count{
  position: absolute;
  top: -2px;
  right: -3px;
  min-width: 16px;
  height: 16px;
  box-sizing: border-box;
  padding: 0 4px;
  border-radius: 8px;
  background: #3f80bf;
  color: #fff;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
}
.favorites-drawer{
  display: flex;
  position: absolute;
  top: 5vh;
  right: 0;
  bottom: var(--footer-height);
  z-index: 4;
  width: min(340px, 88vw);
  box-sizing: border-box;
  flex-direction: column;
  border-left: 1px solid #b9b9b9;
  background: #fff;
  box-shadow: -5px 0 14px rgba(55, 73, 91, 0.18);
}
.favorites-drawer > header{
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  padding: 0 46px 0 12px;
  border-bottom: 1px solid #b9b9b9;
  background: rgba(95, 157, 218, 0.25);
}
.drawer-close{
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #333;
  cursor: pointer;
  font-size: 23px;
  line-height: 28px;
}
.drawer-close:hover,
.drawer-close:focus-visible{ background: rgba(255,255,255,0.75); outline: none; }
.favorites-list{
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  padding: 10px 46px 10px 10px;
  overflow-y: auto;
}
.favorite-item{
  display: grid;
  min-height: 76px;
  grid-template-columns: minmax(0, 1fr) 34px;
  align-items: center;
  gap: 9px;
  padding: 6px;
  border: 1px solid #c9c9c9;
  border-radius: 7px;
  background: #fff;
}
.favorite-item:hover,
.favorite-item:focus-visible{ border-color: #5f9dda; background: #f4f9fd; outline: none; }
.favorite-open{
  display: grid;
  min-width: 0;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: center;
  gap: 9px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}
.favorite-open:focus-visible{ outline: 2px solid #5f9dda; outline-offset: 2px; }
.favorite-open > img,
.favorite-image-placeholder{
  width: 64px;
  height: 64px;
  box-sizing: border-box;
  border-radius: 4px;
  background: #f2f2f2;
  object-fit: contain;
}
.favorite-image-placeholder{
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 11px;
}
.favorite-open > span:last-child{
  overflow: hidden;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.favorites-empty{ margin: 28px 16px; color: #777; text-align: center; }
@media (max-width: 720px){
  .Main.static-main .viewer{
    grid-template-columns: repeat(auto-fill, minmax(218px, 1fr));
  }
  .favorites-drawer{ bottom: var(--footer-height); }
}
</style>


