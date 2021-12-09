<template>
  <div class="show_cars">
<!--    购物车列表部分开始-->
    <div class="carList">
      <dl>
        <!--      表头部分开始-->
        <dt class="table_head">
          <div class="clearfix">
            <div  >
              <el-checkbox class="btn_head" v-model="checked" @change="changeChecked(checked)">全选</el-checkbox>
            </div>
            <span>图片</span>
            <span>商品名称</span>
            <span>数量</span>
            <span>单价</span>
            <span>总价</span>
          </div>
          <!--        <el-divider></el-divider>-->
        </dt>
        <!--      表头部分结束-->
        <dd v-for="item in items" :key="item.cartId">
          <div class="single_car">
            <span>
              <el-checkbox class="btn_body" v-model="item.checked" @change="itemChangeChecked(item)"></el-checkbox>
            </span>
            <span>
              <img class="show_image" :src="item.cover" alt="斗罗大陆">
            </span>
            <span>
              《{{item.bookName}}》
            </span>
            <span >
              <el-input-number   @change="updateCarNum(item.bookNumber,item.cartId)" size="mini" v-model="item.bookNumber"  :min="1" :max="10" label="描述文字" class="btn_change_count"></el-input-number>
            </span>
            <span>
              ￥{{item.price}}
            </span>
            <span >
              ￥{{item.price*item.bookNumber}}
            </span>
            <el-divider></el-divider>
          </div>
        </dd>
      </dl>





      <el-pagination
          layout="prev, pager, next"
          :total="items.pageCount"
          :page-size="pageSize"
          :page-count="totalPage"
          @current-change="currentChange"
          >
      </el-pagination>
    </div>
<!--    购物车列表部分结束-->
<!--    批量删除部分开始-->
    <div class="clearfix">
      <el-divider></el-divider>
      <div class="left_box">
        <el-button type="danger" @click="deleteCars">批量删除</el-button>
      </div>
      <div class="right_box">
        ￥总价{{newTotalMoney}}
      </div>
<!--      批量删除部分结束-->
    </div>
<!--    收货地址部分开始-->
    <div>
      <el-divider></el-divider>
      <el-input placeholder="默认地址" v-model="address">
        <template slot="prepend">收货地址</template>
      </el-input>
    </div>
<!--    收货地址部分结束-->
<!--    生成订单部分开始-->
    <div class="createOrders">
      <el-button type="primary" @click="createOrders">生成订单</el-button>
    </div>
<!--    生成订单部分结束-->
<!--    alert部分开始-->
    <div class="alertMsg">
      <el-alert
          title="注意：请在30天内完成付款，否则订单会自动取消。"
          type="info">
      </el-alert>
    </div>
<!--    alert部分结束-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      memberId: localStorage.accountId,
      ids: [],
      totalMoney: 90,
      address: "",
      pageCount: 1,
      pageSize: 3,
      totalPage: 1,
      items: []
    }
  },
  created() {
    this.getCarList(1)
  },
  methods: {
    changeChecked(checked) {
      console.log("第一次执行")
      console.log(checked)
      if (!checked) {
        for (let i = 0;i< this.items.length;i++) {
          this.items[i].checked = false;
          this.ids = []
        }
      }
      else {
        for (let i = 0;i< this.items.length;i++) {
          this.items[i].checked = true;
          this.ids.push(this.items[i].cartId);
        }
      }
    },
    itemChangeChecked (item) {
      if (item.checked) {
        this.ids.push(item.cartId)
      }else {
        this.ids.pop(item.cartId)
      }
    },
    getCarList(page) {
      console.log(this.memberId)
      this.$http
          .get("/order/cart/list/" + this.memberId,{
            params: {
              limit: 3,
              page: page
            }
          })
          .then((response) => {
            if (response.status === 200) {
              console.log(response)
              this.items = response.data.data.list

              console.log(this.items)
              this.totalPage = response.data.data.totalPage
              this.pageSize = response.data.data.pageSize
            }
          })
          .catch(function (error) {
            // 请求失败处理
            console.log("请求失败！");
            console.log(error);
          });
    },
    deleteCars() {
      if (this.ids.length === 0) return this.$message.error("请至少选中一个商品！")
      this.$http
          .post("/order/cart/delete",this.ids)
          .then((response) => {
            if (response.status === 200) {
              this.$message({
                message: '删除成功！',
                type: 'success'
              });
              this.getCarList(1)
              this.checked = false
            }
          })
          .catch(function (error) {
            // 请求失败处理
            console.log("请求失败！");
            console.log(error);
          });
    },
    updateCarNum(curVal,id) {
      console.log("购物车书本数目")
      console.log(curVal)
      console.log(id)
      this.$http
          .post("/order/cart/update/number/" + id + "?bookNumber=" + curVal)
          .then((response) => {
            // eslint-disable-next-line no-empty
            if (response.status === 200) {
            }
          })
          .catch(function (error) {
            // 请求失败处理
            console.log("请求失败！");
            console.log(error);
          });
      this.getCarList(1)
    },
    createOrders() {
      if (this.ids.length === 0) return this.$message.error("请至少选中一个商品！")
      for (var i = 0;i<this.items.length;i++) {
        if (this.items[i].checked === true) {
          this.totalMoney = this.items[i].bookNumber * this.items[i].price
          this.$http
              .post("order/create/order",[{
                bookId:this.items[i].bookId,
                bookNumber:this.items[i].bookNumber,
                memberId:parseInt(localStorage.accountId),
                totalPrice:this.totalMoney
              }])
              .then((response) => {
                if (response.status === 200 && response.data.success === true) {
                  console.log(response)
                  this.deleteCars1()
                } else if (response.status === 200 && response.data.success === false) {
                  this.$message.error(response.data.message)
                }
              })
              .catch(function (error) {
                // 请求失败处理
                console.log("请求失败！");
                console.log(error);
              });
        }
      }
    },
    deleteCars1() {
      this.$message({
        message: '生成订单成功！',
        type: 'success'
      });
      this.$http
          .post("/order/cart/delete",this.ids)
          .then((response) => {
            if (response.status === 200) {
              this.getCarList(1)
              this.checked = false
            }
          })
          .catch(function (error) {
            // 请求失败处理
            console.log("请求失败！");
            console.log(error);
          });
    },
    currentChange(currentPage) {
      this.getCarList(currentPage)
    }
  },
  computed: {
    newTotalMoney: function () {
      var m = 0
      for (var i = 0; i < this.items.length;i++) {
        m+=(this.items[i].price * this.items[i].bookNumber)
      }
      return m
    }
  }
}
</script>

<style scoped lang="less">
//初始化部分开始
.show_cars {
  font-family: 'Helvetica Neue', 'Helvetica', 'Microsoft Yahei', sans-serif;
  font-weight: 200;
}
.clearfix:before,.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.clearfix {
  *zoom: 1;
}
//初始化部分结束
//表头部分开始
.table_head {
  //background-color: skyblue;
  height: 20px;
}
//表头部分结束
//表格主体部分开始
.btn_head,
.btn_body{
  width: 200px;
  float: left;
}
.show_cars dl dt span,
.show_cars dl dd span{
  float: left;
  width: 200px;
}
.show_cars dl dd span {
  line-height: 40px;
}
dd {
  height: 80px;
}
.el-divider {
}
.show_image {
  margin-top: 5px;
  width: 80px;
  height: 80px;
  float: left;
  margin-left: -20px;
}
.btn_change_count {
  //margin-left: -50px;
}
.carList {
  height: 370px;
  position: relative;
}
.el-pagination {
  position: absolute;
  bottom: 0;
  right: 0;
}
//表格主体部分结束
//批量删除部分开始
.left_box {
  width: 1000px;
}
.left_box,
.right_box {
  float: left;
}
//批量删除部分结束
.createOrders .el-button {
  float: right;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
