<template>
  <div>
    <eTab
      :active-tab="currentNavIndex"
      :tab-list="navList"
      @change="chanegNav"
    />
    <div
      class="one-tags"
    >
      <span
        v-for="tag in tabList"
        :key="tag.id"
        :class="{
          'tag': true,
          'active': tag.id === currentTabId
        }"
        @click="changeTab(tag)"
      >{{ tag.name }}</span>
    </div>
    <div
      class="two-tags"
    >
      <span
        v-for="tag in tagList"
        :key="tag.id"
        :class="{
          'tag': true,
          'active': tag.id === currentTagId
        }"
        @click="changeTag(tag)"
      >{{ tag.name }}</span>
    </div>
  </div>
  
</template>

<script>
import eTab from '../tab/index'
import {getTags} from '@/api'
export default {
  props: {
    defaultNavId: {
      type: Number
    },
    tagType: {
      type: String,
      default: '1'
    }
  },
  mounted() {
    this.getList(0, (list) => {
      this.currentNavIndex = list.findIndex(nav => nav.id === this.defaultNavId)
      if (this.currentNavIndex === -1) {
        this.currentNavIndex = 0
      } 
      this.navList =list
      this.currentNavId = this.navList[this.currentNavIndex].id
    })
  },
  components: {
    eTab
  },
  data() {
    return {
      currentNavIndex: 0,
      // 一级tab
      navList:[],
      currentNavId: -1,
      // 二级Tab
      tabList: [],
      currentTabId: -1,
      // 三级Tab
      tagList: [],
      currentTagId: -1
    }
  },
  watch: {
    async currentNavId(id) {
      if (!id) return
      this.getList(id, (list) => {
        this.tabList = list
        if (this.tabList.length) {
          this.currentTabId = this.tabList[0].id
        } else {
          this.exportId(id)
        }
      })
    },
    async currentTabId(id) {
      this.getList(id, (list) => {
        this.tagList = list
        if (this.tagList.length) {
          this.currentTagId = this.tagList[0].id
        } else {
          this.exportId(id)
        }
      })
    },
    currentTagId(id) {
      this.exportId(id)
    },
  },

  methods: {
    changeTag(tag) {
      this.currentTagId = tag.id
    },
    async getList(fatherId, cb) {
      const res = await getTags.list({
        count: 100,
        offset: 0,
        fatherId,
        type: this.tagType
      })
      cb && cb(res.list)
    },
    chanegNav(index) {
      this.currentNavId = this.navList[index].id
    },
    changeTab(data) {
      this.currentTabId = data.id
    },
    exportId(id) {
      this.$emit('tagChange', id)
    }
  }
}
</script>

<style  lang="scss">
.one-tags, .two-tags {
  min-height: 100%;
  padding: 32rpx 34rpx;
  font-size: 0;
  white-space: nowrap;
  overflow: auto;
  border-bottom: 1px solid #efeff9;
  .tag {
    vertical-align: top;
    box-sizing: border-box;
    display: inline-block;
    font-size: 22rpx;
    line-height: 54rpx;
    padding: 0 30rpx;
    min-width: 158rpx;
    text-align: center;
    color: #969696;
    margin-right: 17rpx;
    border-radius: 30rpx;
    background-color: #c5efe0;
  }
  .active {
    background-color: #6fca95;
    color: #fff;
  }
}
.two-tags {
  border: none;
  .tag {
    box-sizing: border-box;
    border: 1rpx solid #f0f2f4;
    color: #969696;
    background-color: #fff;
  }
  
  .active {
    background-color: #f0f2f4;
  }
} 

</style>