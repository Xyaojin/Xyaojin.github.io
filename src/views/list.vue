<template>
  <section>
    <div class="top"><top /></div>

    <div class="mainTop">
      <div>
        <div class="conditionOne">
          <span class="intro">品牌：</span>
          <template v-for="item in brandsArray">
            <button
              @click="addCondition(item, 0)"
              :key="item.id"
              :class="item.selectFlag === 0 ? 'btn' : 'btn selected'"
            >
              {{ item.brand }}
            </button>
          </template>
        </div>

        <div class="conditionThree">
          <span class="intro">排序：</span>
          <template v-for="item in sortsArray">
            <button
              @click="changeSortMethod(item)"
              :key="item.id"
              :class="item.selectFlag === 0 ? 'btn' : 'btn selected'"
            >
              {{ item.value }}
            </button>
          </template>
        </div>

        <div class="conditionTwo">
          <span class="intro">颜色：</span>
          <template v-for="item in colorsArray">
            <button
              @click="addCondition(item, 1)"
              :key="item.id"
              :class="item.selectFlag === 0 ? 'btn' : 'btn selected'"
            >
              {{ item.value }}
            </button>
          </template>
        </div>
      </div>
      <div class="right">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="input"
          @keyup.enter.native="search()"
        >
        </el-input>

      </div>
    </div>
    <router-link class="glyphicon glyphicon-shopping-cart fix" to="/cart">
      <span class="itemCount">{{ itemCount }}</span>
    </router-link>
    <div class="mainBottom">
      <template v-if="current === '↑'">
        <item
          v-for="item in doFilter.slice(pageBegin, pageBegin + disp)"
          @click="addItems(item)"
          @leave="leave(item)"
          @display="display(item)"
          @select="addItems(item)"
          :id="item.id"
          :display="item.display"
          :key="item.id"
          :name="item.name"
          :price="item.price"
          :color="item.color"
          :img="item.img"
          :sale="item.salesVolume"
          :intro="item.intro"
        >
        </item>
      </template>
      <template v-else>
        <item
          v-for="item in doFilterReverse.slice(pageBegin, pageBegin + disp)"
          @click="addItems(item)"
          @leave="leave(item)"
          @display="display(item)"
          @select="addItems(item)"
          :id="item.id"
          :display="item.display"
          :key="item.id"
          :name="item.name"
          :price="item.price"
          :color="item.color"
          :img="item.img"
          :sale="item.salesVolume"
          :intro="item.intro"
        >
        </item>
      </template>
      <template v-if="noItemsFlag">
        <span class="errorText">
          抱歉，没有找到符合条件的商品，<br />
          可以减少筛选条件再试试！
        </span>
      </template>
    </div>
    <div class="pag">
      <template v-for="(page, index) in pages">
        <li
          v-if="page === begin"
          :key="page.id"
          v-bind:class="active === begin - 1 ? 'disabled begin' : 'begin'"
        >
          <span @click="activeClassBefore">上一页</span>
        </li>
        <li
          :key="page.id"
          v-bind:class="active === index ? 'active middle' : 'middle'"
        >
          <span @click="activeClass(index)">{{ page }}</span>
        </li>
        <li
          :key="page.id"
          v-if="page === last"
          v-bind:class="active === last - 1 ? 'disabled end' : 'end'"
        >
          <span @click="activeClassNext">下一页</span>
        </li>
      </template>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import store from '@/store';
import item from './items.vue';
import products from '../product';
import top from './Top';

export default {
  name: 'list',
  components: {
    item,
    top,
  },
  data() {
    return {
      beifen: products,
      products,
      input: '',
      items: [],
      // 商标筛选数组
      brandsArray: [
        {
          brand: 'IPHONE',
          selectFlag: 0,
        },
        {
          brand: 'HUAWEI',
          selectFlag: 0,
        },
        {
          brand: 'OPPO',
          selectFlag: 0,
        },
        {
          brand: 'VIVO',
          selectFlag: 0,
        },
        {
          brand: 'MI',
          selectFlag: 0,
        },
      ],

      // 颜色筛选数组
      colorsArray: [
        {
          color: 'white',
          value: '白色',
          selectFlag: 0,
        },
        {
          color: 'black',
          value: '黑色',
          selectFlag: 0,
        },
        {
          color: 'red',
          value: '红色',
          selectFlag: 0,
        },
        {
          color: 'blue',
          value: '蓝色',
          selectFlag: 0,
        },
      ],

      // 排序类型数组
      sortsArray: [
        {
          method: 'default',
          value: '默认↑',
          selectFlag: 1,
        },
        {
          method: 'salesVolume',
          value: '销量↑',
          selectFlag: 0,
        },
        {
          method: 'price',
          value: '价格↑',
          selectFlag: 0,
        },
      ],

      // 分页有关代码
      begin: 1, // 初始页
      last: 4, // 尾页
      disp: 12, // 每页显示数量
      pageBegin: 0, // 新页相对开始位置
      pages: [], // 分页数组1，2，3...
      active: 0, // 当前页数组下标
      totalPage: 0, // 总页数
      noItemsFlag: false, // 筛选数组为空标志
      current: '↑', // 当前排序为升序
      sortMethod: 'default', //当前排序方式

      // 条件数组
      conditions: {
        brands: [],
        colors: [],
      },

      // 筛选函数有关代码
      itemFilters: {
        //商标筛选
        brandsFilter: function (items, brands) {
          let tempItems = [];
          if (brands.length === 0) {
            tempItems = items;
          } else {
            for (let brand of brands) {
              tempItems = tempItems.concat(
                items.filter((self) => self.brand === brand)
              );
            }
          }
          return tempItems;
        },

        // 颜色筛选
        colorsFilter: function (items, colors) {
          let tempItems = [];
          if (colors.length === 0) {
            tempItems = items;
          } else {
            for (let color of colors) {
              tempItems = tempItems.concat(
                items.filter((self) => self.color === color)
              );
            }
          }
          return tempItems;
        },

        // 排序方式
        salesVolumeSort(items) {
          return items.sort((a, b) => a.salesVolume - b.salesVolume);
        },
        priceSort(items) {
          return items.sort((a, b) => a.price - b.price);
        },
        defaultSort(items) {
          return items.sort(
            (a, b) => a.price * a.salesVolume - b.price * b.salesVolume
          );
        },
      },
    };
  },
  watch: {
    conditions() {
      return {
        brands: this.conditions['brands'],
        colors: this.conditions['color'],
      };
    },
    itemFilters() {
      return this.itemFilters;
    },
    noItemsFlag() {
      return this.doFilter.length === 0;
    },
    current() {
      return this.current;
    },
  },
  computed: {
    // 嵌套筛选,实现多条件筛选
    doFilter() {
      return this.itemFilters[this.sortMethod + 'Sort'](
        this.itemFilters['brandsFilter'](
          this.itemFilters['colorsFilter'](this.items, this.conditions.colors),
          this.conditions.brands
        )
      );
    },

    // 降序筛选
    doFilterReverse() {
      let temp = [];
      for (let i = this.doFilter.length - 1; i >= 0; i--) {
        temp.push(this.doFilter[i]);
      }
      return temp;
    },

    // 商品总数
    itemCount() {
      return store.state.itemCount;
    },
  },
  created() {
    this.init();
  },
  updated() {
    // 购物车动画
    $('.cart').on('click', function () {
      let cart = $('.fix');
      let imgtodrag = $(this).parent('.card').find('img');
      if (imgtodrag) {
        let imgclone = imgtodrag
          .clone()
          .offset({
            top: imgtodrag.offset().top,
            left: imgtodrag.offset().left,
          })
          .css({
            opacity: '0.5',
            position: 'absolute',
            height: '150px',
            width: '150px',
            'z-index': '100',
          })
          .appendTo($('body'))
          .animate(
            {
              top: cart.offset().top + 15,
              left: cart.offset().left + 10,
              width: 75,
              height: 75,
            },
            1000,
            'easeInOutExpo'
          );
        imgclone.animate(
          {
            width: 0,
            height: 0,
          },
          function () {
            $(this).detach();
          }
        );
      }
    });
  },
  methods: {
    init() {
      // 获取商品数组
      setTimeout(() => {
        let products_x = this.products;
        this.items = [...products_x];
      }, 500);
      // this.items = [...products]

      // 初始化分页数据
      let i = this.products.length;
      this.totalPage = Math.ceil(i / this.disp);
      this.last = this.totalPage;
      this.pages = [];
      for (let j = 0; j < this.totalPage; j++) {
        this.pages.push(j + 1);
      }
    },

    // 点击数字选择当前页
    activeClass(index) {
      this.active = index;
      this.pageBegin = this.active * this.disp;
    },

    search() {
      console.log(this.input);

      let query = this.input;
      // 根据关键词生成正则表达式
      let patt = new RegExp(query.toLowerCase());
      let newArr = this.beifen.filter((item) => {
        return patt.test(item['name'].toLowerCase());
      });

      if (this.input === '') newArr = this.beifen;

      this.items = newArr;
      this.products = newArr;
      this.init();
    },

    // 点击上一页选择
    activeClassBefore() {
      if (this.active > 0) {
        this.active -= 1;
      }
      this.pageBegin = this.active * this.disp;
    },

    // 点击下一页选择
    activeClassNext() {
      if (this.active < this.last - 1) {
        this.active += 1;
      }
      this.pageBegin = this.active * this.disp;
    },

    // 增加筛选条件
    addCondition(item, flag) {
      // 使页面在筛选刷新后，分页始终为首页
      this.active = 0;
      this.pageBegin = 0;

      // 控制某个筛选条件加入/清除，并修改选择标志
      if (flag === 0) {
        let temp = this.conditions['brands'];
        if (temp.indexOf(item.brand) !== -1) {
          temp.splice(temp.indexOf(item.brand), 1);
        } else {
          temp.push(item.brand);
        }
      } else {
        let temp = this.conditions['colors'];
        if (temp.indexOf(item.color) !== -1) {
          temp.splice(temp.indexOf(item.color), 1);
        } else {
          temp.push(item.color);
        }
      }
      item.selectFlag += 1;
      item.selectFlag %= 2;

      // 刷新分页
      let i = this.doFilter.length;
      this.totalPage = Math.ceil(i / this.disp);
      this.last = this.totalPage;
      this.pages = [];
      for (let j = 0; j < this.totalPage; j++) {
        this.pages.push(j + 1);
      }

      // 判断加入新条件后，筛选结果是否为0，修改标志
      if (this.doFilter.length === 0) {
        this.noItemsFlag = true;
      } else {
        this.noItemsFlag = false;
      }
    },

    // 更换排序方式
    changeSortMethod(item) {
      if (item.method === this.sortMethod) {
        if (item.value[item.value.length - 1] === '↑') {
          item.value = item.value.substring(0, item.value.length - 1) + '↓';
          this.current = '↓';
        } else {
          item.value = item.value.substring(0, item.value.length - 1) + '↑';
          this.current = '↑';
        }
      }
      this.active = 0;
      this.pageBegin = 0;
      this.sortMethod = item.method;
      for (let i of this.sortsArray) {
        if (i !== item) {
          i.selectFlag = 0;
        } else {
          i.selectFlag = 1;
        }
      }
    },

    // 添加商品时提交mutations
    addItems(item) {
      store.commit({
        type: 'addItem',
        count: 1,
      });
      store.commit({
        type: 'addCartItems',
        id: item.id,
        name: item.name,
        price: item.price,
        count: 1,
        img: item.img,
      });
    },

    // 悬浮、离开商品样式切换
    display(item) {
      item.display = '';
    },
    leave(item) {
      item.display = 'none';
    },
  },
};
</script>


<style scoped>
.top {
  height: 460px;
  margin: 10px;
}

.mainTop {
  display: flex;
  justify-content: space-between;
}

.right {
  width: 500px;
  margin: 40px 60px;
}

.mainTop {
  height: 135px;
  margin-top: 1%;
  margin-left: 12%;
  margin-right: 12%;
  border-radius: 5px;
}

.intro {
  font-size: 14px;
  margin-left: 20px;
  line-height: 45px;
}

.itemCount {
  color: white;
  width: 18px;
  height: 18px;
  font-size: 15px;
  border-radius: 50%;
  display: inline-block;
  background-color: red;
  line-height: 14px;
  text-align: center;
}

.btn {
  margin-left: 5px;
}

.fix {
  position: fixed;
  color: red;
  top: 200px;
  left: 90%;
  font-size: 35px;
  cursor: pointer;
  z-index: 99;
}

@media (max-width: 600px) {
  .fix {
    left: 80%;
  }
}

.mainBottom {
  border: 2px solid #f0f3f8;
  margin-top: 2%;
  margin-left: 3%;
  margin-right: 3%;
  text-align: center;
}

.errorText {
  text-align: center;
  font-size: 16px;
}

.pag {
  clear: both;
  height: 31px;
  width: 250px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}

.pag span {
  font-size: 12px;
  cursor: pointer;
}

.disabled span {
  color: black;
  cursor: not-allowed;
}

.begin {
  width: 55px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-right: none;
}

.middle {
  width: 29.4px;
  border-right: none;
}

.end {
  width: 55px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}

li {
  line-height: 31px;
  margin-left: -5px;
  text-align: center;
  display: inline-block;
}

.active {
  position: relative;
  right: 1px;
}

.active span {
  color: #ffffff;
}
</style>
