<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="addSuccessful"
      width="30%"
      :before-close="handleClose">
      <span>添加成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSuccessful = false">取 消</el-button>
        <el-button type="primary" @click="addSuccessful = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 模糊查询 -->
    <el-dialog
      title="模糊查询"
      :visible.sync="searchSuccessful"
      width="60%">
      <el-table
          :data="tableData"
          style="width: 100%"
          height="400px">
        <el-table-column
            label="Name"
            prop="bookName">
        </el-table-column>
        <el-table-column
            label="ID"
            prop="id">
        </el-table-column>
        <el-table-column
            label="Price"
            prop="price">
        </el-table-column>
        <el-table-column
            align="right">
          <template slot="header" slot-scope="scope" >
            <div class="searchElement">
              <el-input
                  v-model="search"
                  size="mini"
                  placeholder="输入关键字搜索"
              >
                <el-button @click="submitForm" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </div>
          </template>
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-form ref="numberValidateForm" :model="numberValidateForm"  :rules="rules" label-width="80px" size="large" label-position="left">
      <!-- 添加图书和高级搜索按钮 -->
      <el-form-item size="large">
        <el-button type="primary" @click="addBook('numberValidateForm')">添加图书</el-button>
        <el-button type="primary" @click="resetForm('numberValidateForm')">重置</el-button>
        <el-button type="primary" @click="searchForm('numberValidateForm')">高级搜索</el-button>
      </el-form-item>

      <!-- 活动名称输入框 -->
      <el-form-item label="书名" prop="bookName">
        <el-input
          v-model="numberValidateForm.bookName"
          class="input"
          placeholder="输入书名"
        ></el-input>
      </el-form-item>

<!--      指定图书所属类别-->
      <el-form-item label="图书类别" prop="categoryId">
        <el-input
            v-model="numberValidateForm.categoryId"
            class="input"
            placeholder="输入图书类别ID"
        ></el-input>
      </el-form-item>
      <!-- 图书封面上传 -->
      <!-- 存在图片上传跨域问题 -->
      <el-form-item label="图书封面" prop="cover">
        <div>
          <el-upload
              action=""
              list-type="picture-card"
              :http-request="Uploadfile">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
          </el-upload>
        </div>
      </el-form-item>

      <!-- 定价 -->
      <el-form-item label="原价" prop="originalPrice">
        <el-input
          v-model.number="numberValidateForm.originalPrice"
          autocomplete="off"
          class="input"
        ></el-input>
      </el-form-item>

      <!-- 折扣 -->
      <el-form-item label="折扣" prop="discount">
        <el-input
          v-model="numberValidateForm.discount"
          autocomplete="off"
          class="input"
        ></el-input>
      </el-form-item>

      <!-- 当前价格 -->
      <el-form-item label="现价" prop="prisentPrice">
        <el-input
          v-model.number="numberValidateForm.prisentPrice"
          autocomplete="off"
          class="input"
        ></el-input>
      </el-form-item>

      <!-- 作者和出版社 -->
      <el-col :span="10">
        <el-form-item :inline="true" label="作者" class="demo-form-inline" prop="author">
          <el-input
          v-model="numberValidateForm.author"
          autocomplete="off"
          class="input"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item :inline="true" label="出版社" class="demo-form-inline" prop="publisher">
          <el-input
          v-model="numberValidateForm.publisher"
          autocomplete="off"
          class="input"
          ></el-input>
        </el-form-item>
      </el-col>

      <!-- 出版时间和印刷时间 -->
      <!-- <el-col :span="10"> -->
        <el-form-item :inline="true" label="出版时间" class="demo-form-inline input" prop="publicationTime">
          <el-date-picker
            v-model="numberValidateForm.publicationTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      <!-- </el-col> -->
      <!-- <el-col :span="14"> -->
        <el-form-item :inline="true" label="印刷时间" class="demo-form-inline input" prop="printingTime">
          <el-date-picker
            v-model="numberValidateForm.printingTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      <!-- </el-col> -->
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 搜索框绑定数据
      search: '',
      // 搜索返回的结果绑定数据
      tableData: [],
      baseUrl: "http://bookmall.natapp1.cc/",
      addSuccessful: false,
      searchSuccessful: false,
      resultFormItems : false,
      data: {},
      searchFormItems:[],
      numberValidateForm: {
        categoryId: 0,
        cover: "",
        bookName: "",
        originalPrice: 0,
        discount: "1.0",
        prisentPrice: 0,
        author: "",
        publisher: "",
        publicationTime: "",
        printingTime: ""
      },
      rules: {
        bookName: [
          { required: true, message: "书名不能为空" }
        ],
        categoryId: [
          { required: true, message: "图书类别ID不能为空" }
        ],
        originalPrice: [
          { required: true, message: "定价不能为空" },
          { type: "number", message: "定价必须为数字" }
        ],
        discount: [
          { required: true, message: "折扣不能为空" }
        ],
        prisentPrice: [
          { required: true, message: "现价不能为空" },
          { type: "number", message: "现价必须为数字" }
        ],
        author: [
          { required: true, message: "作者不能为空" }
        ],
        publisher: [
          { required: true, message: "出版社不能为空" }
        ],
        publicationTime: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
        printingTime: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ]
      },
      // 阿里云oos图片上传绑定对象
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: '',
        // callback:'',
      },
      dialogVisible: false

    };
  },
  methods: {
    //
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      // 发送AJAX请求，删除指定项
      this.$http
          .post('/book/delete',[row.id])
          .then(response => {
            //请求成功
            if (response.status === 200) {
              this.$message.success("删除成功！")
            }
          })
          .catch(function (error) {
            this.$message.error("删除失败！")
            console.log(error);
          });
    },
    //高级搜索
    searchForm(formName){
      this._data.searchSuccessful = true
    },
    submitForm(){
            this.$http
            .get('book/select',{
              params: {
                key: this.search,
              }
            })
            .then(response => {
              //请求成功
              if (response.status === 200) {
                console.log(response)
                this.tableData = response.data.data
                this._data.resultFormItems = true
              }
            })
            .catch(function (error) {
              alert('抱歉没有此书');
              console.log(error);
            });
          },
    // 添加图书
    //添加成功提示
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
    // 添加图书与后台接口
    addBook(formName) {
        //this._data.numberValidateForm当前数据对象
        var result = this._data.numberValidateForm;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http
            .post('book/save',{
              categoryId: result.categoryId,
              author: result.author,
              bookName: result.bookName,
              cover: result.cover,
              press: result.publisher,
              price: result.prisentPrice,
              printTime: result.printingTime,
              publishTime: result.publicationTime,
            })
            .then(response => {
              //请求成功
              if (response.status === 200) {
                if (response.data.errCode === 10000) {
                  this.$message.error("该图书已经存在！")
                } else {
                  console.log("请求发送成功")
                  console.log(response)
                  this._data.addSuccessful = true;
                  this._data.data = response.data.data;
                }
              }
            })
            .catch(function (error) {
              alert('添加失败!!');
              console.log(error);
            });

          } else {
            return false;
          }
        });
      },
    // 重置
    resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    // 文件移出警告提示
    beforeRemove(file, fileList) {
        return this.$confirm('确定移除？');
      },
    //自己编写的函数用于生成文件名，防止上传的文件重名
    getUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
      })
    },
    // 图片上传钩子函数
    Uploadfile (param) {
      let file = param.file; // 得到文件的内容
      // 发送axios请求获取签名
      this.$http
          .get('/oos/policy')
          .then(response => {
            if (response.status === 200) {
              let policyData = response.data.data;
              console.log(policyData);
              let ossUrl = policyData.host
              let accessUrl = policyData.dir + '/' + this.getUUID() + file.name;//设置上传的访问路径
              let sendData = new FormData();// 上传文件的data参数
              sendData.append('OSSAccessKeyId', policyData.accessId);
              sendData.append('policy', policyData.policy);
              sendData.append('Signature', policyData.signature);
              sendData.append('keys', policyData.dir);
              sendData.append('key', accessUrl);//上传的文件路径
              sendData.append('success_action_status', 200); // 指定返回的状态码
              sendData.append('type', 'image/jpeg');
              sendData.append('file', file);
              console.log(sendData);
              this.$http.post(ossUrl, sendData).then((res) => {
                this.numberValidateForm.cover = ossUrl + '/' + accessUrl;//获得到的url需要将其存数据库中
                console.log("上传成功！")
                console.log(this.numberValidateForm.cover)
              })
            }
          })
          .catch(function (error) { // 请求失败处理
            console.log(error)
          });
    },

  },
  filters: {
    //时间格式化
    timeFormat(timeStr) {
      const time = new Date(timeStr)
      const y = time.getFullYear()
      const m = time.getMonth()
      const d = time.getDay()
      return `${y}-${m}-${d}`
    }
  }
}
</script>

<style scoped lang="less">
.input {
  width: 300px;
}
.searchElement {
}
</style>
