<template>
  <view class="box">
    <view
      v-if="tabList.length < 5"
      :class="classes"
    >
      <view
        v-for="(item, index) in tabList"
        :key="index"
        class="tab-item "
        @click="changeTab(index)"
      >
        <view class="item">
          <text
            :class="[
              index === current ? 'font_active': '']"
          >
            {{ item.title || item }}
          </text>
          <view v-if="index === current">
            <image
              v-if="!customTabColor"
              class="public"
              :src="themeId === 0 ? publicBaseImg : privateBaseImg"
              mode=""
            />
            <view
              v-else
              class="public"
              :style="{ background: customTabColor }"
            />
          </view>
        </view>
      </view>
    </view>
    <view
      v-else
      class="more-Item"
    >
      <scroll-view
        scroll-x="true"
        class="scroll-x"
      >
        <view
          v-for="(item, index) in tabList"
          :key="index"
          class="more-tab-item"
          @click="changeTab(index)"
        >
          <view>
            <text
              :class="[
                index === current ? 'more-font_active': '']"
            >
              {{ item.title || item }}
            </text>
            <view v-if="index === current">
              <image
                v-if="!customTabColor"
                class="more-public"
                :src="themeId === 0 ? publicBaseImg : privateBaseImg"
                mode=""
              />
              <view
                v-else
                class="more-public"
                :style="{ background: customTabColor }"
              />
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="line1rpx" />
  </view>
</template>

<script>
const name = 'e-tab'
export default {
  name,
  props: {
    tabList: {
      type: Array,
      default: () => {
        return []
      }
    },
    activeTab: {
      type: Number,
      default: 0
    },
    themeId: {
      type: Number,
      default: 0
    },
    customTabColor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      current: 0,
      publicBaseImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAMCAYAAACqTLVoAAAAAXNSR0IArs4c6QAAALpJREFUWAntld0NgzAQg3OoYhgemYEV2iHLCszQtzIMapISfoKRbgLLebo4T/ZZXyzAaadP94vpC5JG5gTM5gb9pZhfeNdMnoCF970AFp7klmUPEniYjbUABf8h5w7eNTInsOJ/GfrrCxD+mbfteFvxX9RKgCT8OynxSgX/tQDCP++iXWcH/msBhH83Jl7xwP9VAOGfd9mOsxP/WwGEfychZgnwvxVA+GfetuMN8L8XQPh3UuKVEP/F5R8hcDN213Vz6gAAAABJRU5ErkJggg==',
      privateBaseImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAMCAYAAACqTLVoAAAAAXNSR0IArs4c6QAAALdJREFUWAntlcENwzAMA6OMkzU6Q/3qeH25M2SMZhvHjQxYZQBNQNAvmfCHFHG2BU59vLd2ti9IGokTMLNjRX+tt4J3zdwJ2GL1VoBLeHJbljtM4CLAJwrg+O+9b/hAM28Cjv+yv/5fgPDPu+zMmePf9SCA8J/FxKs5/qMAwj/vojNnE/9RAOE/i4lXm/iPAgj/vMvOnE38jwII/1lEvBrifxRA+OddduYM8T8KIPxnMfFqiH93+QN0ZzJ5y38UmQAAAABJRU5ErkJggg=='
    }
  },
  computed: {
    classes() {
      return [`${name}`]
    }
  },
  watch: {
    current(newVal) {
      this.$emit('input', newVal)
    },
    activeTab() {
      console.log(this.activeTab)
      this.current = this.activeTab
    }
  },
  mounted() {
    this.current = this.activeTab
  },
  methods: {
    changeTab(index) {
      if (this.current !== index) {
        this.current = index
        this.$emit('change', index)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../common/const';
.line1rpx {
  width: 100%;
  height: 1rpx;
  background-color: rgba(0,0,0,0.08);
}
.e-tab {
  top: 80rpx;
  display: flex;
  justify-content: space-between;
  background-color: $background-white-color;
  .tab-item {
    position: relative;
    box-sizing: border-box;
    flex: 1;
    text-align: center;
    font-size: $font-16;
    color: $font-black-color;
    height: 48*2rpx;
    @include text-ellipsis(1);
    line-height: 48*2rpx;
    cursor: pointer;
  }
  .font_active{
    font-weight: bold;
  }
  .public {
    position: absolute;
    bottom: 0;
    left: 50%;
    height: 6rpx;
    width: 64rpx;
    transform: translateX(-50%);
  }
}
.more-Item {
  top: 80rpx;
  width: 100%;
  // padding: 0 48rpx;
  background-color: $background-white-color;
  .scroll-x {
    width: 100%;
    box-sizing: border-box;
    height: 96rpx;
    white-space: nowrap;
  .more-tab-item {
    position: relative;
    box-sizing: border-box;
    text-align: center;
    display: inline-block;
    padding: 0 32rpx;
    font-size: $font-16;
    color: $font-black-color;
    height: 48*2rpx;
    line-height: 48*2rpx;
    // border-bottom: 1rpx solid rgba(0,0,0,0.08);
    cursor: pointer;
  }
  .more-font_active{
    font-weight: bold;
  }
  .more-public {
    position: absolute;
    bottom: 0;
    left: 50%;
    height: 6rpx;
    width: 64rpx;
    transform: translateX(-50%);
    // background-size: 100% ;
  }
  }
}
</style>
