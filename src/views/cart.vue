<template>
  <section class="section">
    <table class="table">
      <tr>
        <td colspan="5" class="first" style="border-top: none">购物清单</td>
      </tr>
      <template v-if="items.length !== 0">
        <tr>
          <td class="first" width="48%">
            <span
              :class="
                selectAllFlag
                  ? 'glyphicon glyphicon-check'
                  : 'glyphicon glyphicon-unchecked'
              "
              @click="checkAllItems"
              style="margin-right: 15px"
            ></span>
            商品信息
          </td>
          <td width="31%">数量</td>
          <td width="9%">小计</td>
          <td width="12%">删除</td>
        </tr>
        <template v-for="item in items">
          <tr :key="item.id">
            <td class="first" width="48%">
              <span
                :class="
                  item.selectFlag === 1
                    ? 'glyphicon glyphicon-check'
                    : 'glyphicon glyphicon-unchecked'
                "
                @click="checkItem(item)"
              ></span>
              <img :src="item.img" width="25px" height="25px" />
              <span class="temp">
                {{ item.name }}
              </span>
            </td>
            <td width="31%">
              <span
                class="glyphicon glyphicon-minus-sign"
                @click="reduceItem(item)"
              ></span>
              {{ item.count }}
              <span
                class="glyphicon glyphicon-plus-sign"
                @click="addItem(item)"
              ></span>
            </td>
            <td width="9%">￥{{ item.price * item.count }}</td>
            <td width="12%">
              <span
                class="glyphicon glyphicon-trash"
                @click="deleteItem(item)"
              ></span>
            </td>
          </tr>
        </template>
        <tr>
          <td class="first" colspan="5">
            使用优惠码：
            <input
              type="text"
              v-model="value"
              class="form-control form-control-lg onSale"
            />
            <button class="btn" @click="checkSale">兑换</button>
          </td>
        </tr>
        <tr>
          <td class="totalCounts">共计{{ totalCount }}件商品</td>
          <td style="border-top: none">
            应付金额￥{{ totalMoney }}
            <div class="saleMoney" v-if="sale !== 0">
              -{{ sale }} = {{ afterSale }}元
            </div>
          </td>
          <td colspan="2" style="border-top: none">
            <button class="btn" @click="payItems">现在结算</button>
          </td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <td colspan="4">购物车为空!</td>
        </tr>
      </template>
    </table>
  </section>
</template>

<script>
import store from '@/store';

export default {
  name: 'cart',
  data() {
    return {
      value: '',
      sale: 0,
    };
  },
  beforeDestroy() {
    localStorage.cartItems = JSON.stringify(store.state.cartItems);
  },
  computed: {
    // 获取商品数组
    items() {
      return store.state.cartItems;
    },

    // 判断商品是否为全选
    selectAllFlag() {
      return this.isCheckAllItems();
    },

    // 计算总价
    totalMoney() {
      let total = 0;
      for (let i of this.items) {
        if (i.selectFlag === 1) {
          total += i.count * i.price;
        }
      }
      return total.toString().replace(/\B(?=(\d{3})+$)/g, ',');
    },

    // 使用优惠券后计算总价
    afterSale() {
      let total = 0;
      for (let i of this.items) {
        if (i.selectFlag === 1) {
          total += i.count * i.price;
        }
      }
      return (total - this.sale).toString().replace(/\B(?=(\d{3})+$)/g, ',');
    },

    // 商品总数
    itemCount() {
      return this.items.length;
    },

    // 选中商品总数
    totalCount() {
      let total = 0;
      for (let i of this.items) {
        if (i.selectFlag === 1) {
          total += i.count;
        }
      }
      return total;
    },
  },
  methods: {
    // 某商品选中、取消选中
    checkItem(item) {
      item.selectFlag++;
      item.selectFlag %= 2;
    },

    // 全选、反选商品
    checkAllItems() {
      if (this.isCheckAllItems()) {
        for (let i of this.items) {
          i.selectFlag = 0;
        }
      } else {
        for (let i of this.items) {
          i.selectFlag = 1;
        }
      }
    },

    // 判断商品是否被全选
    isCheckAllItems() {
      let total = 0;
      for (let i of this.items) {
        total += i.selectFlag;
      }
      return total === this.items.length;
    },

    // 减少某商品数目
    reduceItem(item) {
      if (item.count - 1 === 0) {
        let msg = '确定要删除该商品吗？\n\n请确认！';
        if (confirm(msg) === true) {
          for (let i of this.items) {
            if (i === item) {
              store.commit({
                type: 'deleteItems',
                id: item.id,
                count: 1,
              });
              return;
            }
          }
        }
      } else {
        item.count--;
        store.commit({
          type: 'reduceItem',
          count: 1,
        });
      }
    },

    // 增加商品数目
    addItem(item) {
      item.count++;
      store.commit({
        type: 'addItem',
        count: 1,
      });
    },

    // 删除某商品
    deleteItem(item) {
      let msg = '确定要删除该商品吗？\n\n请确认！';
      if (confirm(msg) === true) {
        store.commit({
          type: 'deleteItems',
          id: item.id,
          count: item.count,
        });
      }
    },

    // 优惠码比较
    checkSale() {
      if (this.totalMoney === '0') {
        alert('请先选择商品！');
      } else {
        if (this.value === '88888888') {
          this.sale = 88;
          this.value = '';
        } else {
          alert('优惠码错误，请重新输入！');
        }
      }
    },

    // 支付功能，可只购买部分选中商品
    payItems() {
      if (this.totalMoney === '0') {
        alert('还没有购买商品！');
      } else {
        for (let i = store.state.cartItems.length - 1; i >= 0; i--) {
          if (store.state.cartItems[i].selectFlag === 1) {
            store.commit({
              type: 'deleteItems',
              id: store.state.cartItems[i].id,
              count: store.state.cartItems[i].count,
            });
          }
        }
        alert('支付成功!');
      }
    },
  },
};
</script>

<style scoped>
section {
  width: 94%;
  padding: 18px;
  margin-top: 2%;
  margin-left: 3%;
  margin-right: 3%;
  font-size: 14px;
  border-radius: 5px;
}

.table {
  text-align: center;
}

.first {
  text-align: left;
  margin-left: 20px;
}

img {
  margin-left: 15px;
}

@media (max-width: 600px) {
  td {
    vertical-align: middle;
  }
  img {
    display: none;
  }
  section {
    font-size: 12px;
  }
}
span {
  cursor: pointer;
}

.form-control {
  width: 140px;
}

.onSale {
  display: inline;
}

.totalCounts {
  margin-top: 5px;
  text-align: right;
  border-top: none;
}

.saleMoney {
  color: #dc3545;
  font-size: 13px;
}
</style>
