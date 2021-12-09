<template>
  <div>
    <el-container >
      <!--    侧栏开始-->
      <el-aside width="234px">
        <el-row class="tac">
          <el-col :span="20">
            <el-menu
                default-active="1"
                active-text-color="#555555"
                class="el-menu-vertical-demo"
                :unique-opened="true"
                @open="handleOpen"
                @close="handleClose">
              <el-menu-item index="0">
                <span slot="title">所有分类</span>
              </el-menu-item>
              <el-submenu v-for="item in categoryList" :key="item.id" :index="item.id + ''">
                <template slot="title">
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item :index="item.parentId + '-' + option.id" v-for="option in item.children" :key="option.id" @click="handleOpen(option.id)">
                  {{option.title}}
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>


      </el-aside>
      <!--    中心部分开始-->
      <el-main >
        <div class="view_area">
          <ul class="show" >
              <li v-for="item in items.list" :key="item.id" class="showDiv" >
                <div class="showBox">
                  <router-link :to="'/home/book_detail/' + item.id" >
                    <img :src="item.cover" alt="斗罗大陆">
                    <div class="showBox_detail">
                      <p class="book_price">￥{{item.price}}</p>
                      <h4 class="book_title">《{{item.bookName}}》</h4>
                      <p>作者：{{item.author}}</p>
                      <p>出版社：{{item.press}}</p>
                      <p>出版时间：{{item.publishTime | timeFormat()}}</p>
                    </div>
                  </router-link>
                </div>
              </li>
          </ul>
        </div>
      </el-main>
      <el-pagination
          background
          layout="prev, pager, next"
          :total="items.pageCount"
          :page-size="items.pageSize"
          :page-count="items.totalPage"
          @current-change="currentChange"
          >
      </el-pagination>
<!--      中心部分结束-->
    </el-container>
  </div>
</template>


<script>
export default {
  data () {
    return {
      items: {},
      categoryList: {}
    }
  },
  methods: {
    handleOpen(key) {
      this.getBooksById(parseInt(key),1)
    },
    handleClose() {
      this.getBooksById(0,1)
    },
    currentChange(currentPage) {
      this.getBooksById(0,currentPage)
    },
    getAllBookLists () {
      this.$http
          .get('category/list/tree')
          .then(response => {
            if (response.status === 200) {
              this.categoryList = response.data.data
              console.log(parseInt(localStorage.active))
            }
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
    },
    getBooksById (Id,currPage) {
      this.$http
          .get('book/list',{
            params: {
              categoryId: Id,
              limit: "8",
              page: currPage
            }
          })
          .then(response => {
            if (response.status === 200) {
              this.items = response.data.data
            }
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
    }
  },
  filters: {
    timeFormat(timeStr) {
      const time = new Date(timeStr)
      const y = time.getFullYear()
      const m = time.getMonth()
      const d = time.getDay()
      return `${y}-${m}-${d}`
    }
  },
  created() {
    this.getAllBookLists()
    this.getBooksById(0,1)
  }
}
</script>

<style scoped lang="less">
* {
  padding: 0;
  margin: 0;
}
ul {
  list-style: none;
}
a {
  text-decoration: none;
}
.el-aside {
  text-align: center;
  height: 630px;
  position: relative;
}
.el-main {
  text-align: left;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  height: 632px;
}

//侧边导航栏开始
.tac {
  text-align: left;
}
.el-menu {
  border: 1px solid #dddddd;
}
.el-submenu {
  border-bottom: 1px solid #dddddd;
  background-color: #dff0d8;
}
.el-menu-item {
  border-bottom: 1px solid #dddddd;
  min-width: 195px;
}
.el-menu-item-group__title {
  padding: 0;
}
.el-submenu:last-child {
  border-bottom: none;
}
.stepBar {
  font-size: 14px;
  position: absolute;
  bottom: 10px;
}
//侧栏结束
//main部分开始
.el-main {
  background-color: #f8f8f8;
  font-family: 'Helvetica Neue', 'Helvetica', 'Microsoft Yahei', sans-serif;
  border: 1px solid #dddddd;
  border-radius: 20px;
}
.view_area {
  width: 1080px;
  height: 100%;
  margin: 0 auto;
  padding-left: -30px;
}
.showDiv {
  width: 234px;
  height: 300px;
  float: left;
  margin-left: 30px;
  margin-top: 15px;
  opacity: 100%;
  flex: 1;
}
.showBox {
  width: 234px;
  height: 295px;
  background-color: #fff;
  text-align: center;
  border-radius: 20px;
  transition: all .2s linear;
  margin-top: 5px;
}
.showBox:hover {
  margin-top: 0;
  box-shadow: 0 8px 16px rgba(100,100,100,.18);
}
.showBox img {
  width: 155px;
  height: 155px;
  margin: 20px auto 18px;
}
h4.book_title {
  margin: 0 20px 3px;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 400;
  color: #212121;
  white-space: nowrap;
}
p.book_price {
  color: #ff6709;
  font-size: 14px;
}
p {
  font-size: 12px;
  color: #b0b0b0;
}
//分页导航部分开始
.el-pagination {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
//main部分结束
</style>

