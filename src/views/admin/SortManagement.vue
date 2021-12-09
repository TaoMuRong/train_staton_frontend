<template>
  <div>
    <div class="custom-tree-container">
      <dl>
        <dt class="table_head">
          <div class="clearfix">
            <span>#</span>
            <span>分类名称</span>
            <span>描述</span>
            <span>操作</span>

          </div>

        </dt>
        <dd class="addFirstClass"><el-button @click="updateFirstClassStatus(0)">添加一级分类</el-button></dd>
        <dd v-for="item in items" :key="item.id" class="firstClass">
          <div class="show_first_class clearfix">
            <span>{{item.id}}</span>
            <span>{{item.title}}</span>
            <span>{{item.description}}</span>
            <span>
            <el-button @click="updateFirstClassStatus(item.id)">添加二级分类</el-button>
            <el-button @click="updateClassMsgStatus(0, item.id)">修改</el-button>
            <el-button @click="delCategory(item.id)">删除</el-button>
            </span>
          </div>

          <div class="show_second_class">
            <dl>
              <dd v-for="list in item.children" :key="list.id">
                <span>{{list.id}}</span>
                <span>{{list.title}}</span>
                <span>{{list.description}}</span>
                <span>
                  <el-button @click="updateClassMsgStatus(list.parentId, list.id)">修改</el-button>
                  <el-button @click="delCategory(list.id)">删除</el-button>
                </span>
              </dd>
            </dl>
          </div>

        </dd>
      </dl>
    </div>
<!--    收集添加目录信息的表单-->
    <el-dialog title="目录信息" :visible.sync="firstClassMsgStatus" width="30%">
      <el-form :model="firstClassMsg">
        <el-form-item label="目录名" :label-width="20">
          <el-input v-model="firstClassMsg.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="20">
          <el-input v-model="firstClassMsg.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="firstClassMsgStatus = false">取 消</el-button>
        <el-button type="primary" @click="addFirstClass">确 定</el-button>
      </div>
    </el-dialog>
<!--    收集修改目录信息的表单-->
    <el-dialog title="修改目录信息" :visible.sync="alertClassMsgStatus" width="30%">
      <el-form :model="alertClassMsg">
        <el-form-item label="目录名" :label-width="20">
          <el-input v-model="alertClassMsg.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="20">
          <el-input v-model="alertClassMsg.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="alertClassMsgStatus = false">取 消</el-button>
        <el-button type="primary" @click="updateClassMsg">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

export default {
  data() {
    return {
      items: {
      },
      categoryList: null,
      firstClassMsgStatus: false,
      parentId: 0,
      sonId: 0,
      firstClassMsg: {
        title: " ",
        description: " ",
        createTime:  Date.now(),
        modifyTime:  Date.now()
      },
      alertClassMsgStatus: false,
      alertClassMsg: {
        "description": "",
        "title": ""
      }

    }
  },
  methods: {
      delCategory(id){
        this.$http
          .post('category/delete',[id])
          .then(response => {
            if (response.status === 200) {
              this.$message({
                message: '分类删除成功！',
                type: 'success'
              });
              console.log("删除请求发送成功")
              this.getInfo()
            }
          })
          .catch(function (error) {
            console.log(error);
            alert("删除失败！！" + error);
          });
        this.getInfo()
      },
      //获取目录信息
      getInfo () {
      this.$http
          .get('category/list/tree')
          .then(response => {
            if (response.status === 200) {
              console.log("获取目录信息成功！")
              console.log(response.data)
              this.items = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    updateFirstClassStatus(id) {
      this.firstClassMsgStatus = true
      this.parentId = id
    },
    updateClassMsgStatus(parentId, id) {
      this.alertClassMsgStatus = true
      this.parentId = parentId
      this.sonId = id
    },
    updateClassMsg () {
        const data = {
          "description": this.alertClassMsg.description,
          "id": this.sonId,
          "parentId": this.parentId,
          "title": this.alertClassMsg.title
        }
        this.$http
          .post('/category/update/category', data)
          .then(response => {
            if (response.status === 200) {
              console.log("修改目录成功")
              console.log(response)
              this.alertClassMsgStatus = false
              this.getInfo()
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    addFirstClass() {
      this.$http
          .post('/category/add/category',{
            createTime: this.firstClassMsg.createTime,
            description: this.firstClassMsg.description,
            modifyTime: this.firstClassMsg.modifyTime,
            parentId: this.parentId,
            title: this.firstClassMsg.title
          })
          .then(response => {
            if (response.status === 200) {
              console.log("添加目录成功")
              console.log(response)
              this.firstClassMsgStatus = false
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  },
  created() {
    this.getInfo()
  }

}
</script>

<style scoped lang="less">
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

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    border: 1px solid white;
    border-radius: 10%;
}
    .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-form-item span{
    margin-right: 150px;
  }
.table_head {
  //background-color: skyblue;
  height: 20px;
}
.custom-tree-container span{
  font-weight: 200;
}

.custom-tree-container dt {
  height: 40px;
}
.custom-tree-container>dl>dd:first-child {
  height: 50px;
  background-color: skyblue;
}
.custom-tree-container span{
  float: left;
  width: 300px;
  height: 50px;
}
.custom-tree-container span:first-child {
  width: 100px;
}
.addFirstClass {
  position: relative;
  height: 50px;
}
.addFirstClass .el-button {
  position: absolute;
  left: 700px;
}
.firstClass {
  background-color: #fcf8e3;
  //border-bottom: 1px solid #dee2e6;
}
.show_second_class dl dd {
  height: 50px;
  background-color: #f4f6f9;
  line-height: 50px;
  //border-bottom: 1px solid #dee2e6;
}
</style>
