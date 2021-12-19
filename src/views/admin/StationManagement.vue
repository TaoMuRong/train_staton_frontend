<template>
  <div>

    <el-form :inline="true" class="queryTrains">
      <el-form-item label="车次">
        <el-input v-model="trainId"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-button style="float:right;" type="primary" icon="el-icon-plus" circle @click="addStation"></el-button>
    </el-form>

    <el-table
    height="470"
    border
    v-loading="loading"
    :data="tableData"
    :default-sort = "{prop: 'trainNumber', order: 'ascending'}"
    style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="trainManager_expand">
            <el-form-item label="列车编号">
              <span>{{ props.row.trainNo }}</span>
            </el-form-item>
            <el-form-item label="车次">
              <span>{{ props.row.trainNumber }}</span>
            </el-form-item>
            <el-form-item label="站点编号">
              <span>{{ props.row.stationNo }}</span>
            </el-form-item>
            <el-form-item label="站点名称">
              <span>{{ props.row.stationName }}</span>
            </el-form-item>
            <el-form-item label="到达时间">
              <span>{{ props.row.arriveTime }}</span>
            </el-form-item>
            <el-form-item label="出发时间">
              <span>{{ props.row.startTime }}</span>
            </el-form-item>
            <el-form-item label="历时">
              <span>{{ props.row.runningTime + " 分钟"}}</span>
            </el-form-item>
            <el-form-item label="与前站相隔">
              <span>{{ props.row.startStationDistance + " 公里"}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="车次"
        prop="trainNumber">
      </el-table-column>
      <el-table-column
        label="站点名称"
        prop="stationName">
      </el-table-column>
      <el-table-column
        label="到达时间"
        prop="arriveTime">
      </el-table-column>
      <el-table-column
        label="出发时间"
        prop="startTime">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editStation(scope.row)">编辑</el-button>
          <el-popconfirm
            title="确定删除此经停站吗？"
            icon="el-icon-warning"
            icon-color="red"
            @confirm="deleteStation(scope.row)"
          >
            <el-button
            slot="reference"
            size="mini"
            type="danger"
            style="marginLeft: 10px;">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改经停站信息 -->
    <el-dialog
      title="编辑经停站信息"
      :visible.sync="infoDialogVis"
      width="40%"
      center
    >
      <el-form
        :model="trainInfo"
        class="train-form"
        label-width="120px"
        label-position="left"
        size="medium"
        hide-required-asterisk
      >
        <el-form-item label="列车编号" prop="stationNo">
          <el-input
            v-model="trainInfo.stationNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="车次" prop="trainNumber">
          <el-input
            v-model="trainInfo.trainNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="站点编号" prop="trainNo">
          <el-input
            v-model="trainInfo.trainNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="到达时间" prop="arriveTime">
          <el-input
            v-model="trainInfo.arriveTime"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="出发时间" prop="startTime">
          <el-input
            v-model="trainInfo.startTime"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="历时" prop="runningTime">
          <el-input
            v-model="trainInfo.runningTime"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="与前站相隔" prop="startStationDistance">
          <el-input
            v-model="trainInfo.startStationDistance"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
        <el-button @click="handleDialogCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="添加经停站"
      :visible.sync="addDialogVis"
      width="40%"
      center
    >
      <el-form
        :model="addTrainInfo"
        class="train-form"
        label-width="120px"
        label-position="left"
        size="medium"
        hide-required-asterisk
      >
        <el-form-item label="列车编号" prop="stationNo1">
          <el-input
            v-model="addTrainInfo.stationNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="车次" prop="trainNumber1">
          <el-input
            v-model="addTrainInfo.trainNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="站点编号" prop="trainNo1">
          <el-input
            v-model="addTrainInfo.trainNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="到达时间" prop="arriveTime1">
          <el-input
            v-model="addTrainInfo.arriveTime"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="出发时间" prop="startTime1">
          <el-input
            v-model="addTrainInfo.startTime"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="历时" prop="runningTime1">
          <el-input
            v-model="addTrainInfo.runningTime"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="与前站相隔" prop="startStationDistance1">
          <el-input
            v-model="addTrainInfo.startStationDistance"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddDialogConfirm">添 加</el-button>
        <el-button @click="handleAddDialogCancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

export default {
  data() {
    return {
      loading: true,
      tableData: [],
      infoDialogVis: false,
      addDialogVis: false,
      trainInfo: {},
      addTrainInfo: {},
      trainId: "",
      currentPage: 1
    }
  },

  methods: {
    // 将一个车次的所有数据添加到tableData，不能使用forEach
    getOneTrain(trainNum) {   
      this.$http
        .get('/admin/queryParkStationByTrainNumber', { params: { trainNumber: trainNum } })
        .then(response => {
          if (response.data.success) {
            const { data } = response.data
            for(let i = 0; i < data.length; i++) {
              this.tableData.push(data[i])
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 获取全部车次的详细信息
    async getInfo () {
      // 获取全部车次
      var allTrains = []
      await this.$http
          .get('/train/queryAllTrainNoPage')
          .then(response => {
            if (response.data.success) {
              response.data.data.forEach(function(item) {
                allTrains.push(item.trainNumber)
              })
            }
          })
          .catch(function (error) {
            console.log(error);
          });

      // 循环将所有车次详细信息push到tableData
      for(let i = 0; i < allTrains.length; i++) {
        this.getOneTrain(allTrains[i])
      }
    },

    // 打开修改经停站对话框并传递选中经停站信息
    editStation(info) {
      this.infoDialogVis = true;
      this.trainInfo = info;
    },

    // 打开添加经停站对话框
    addStation() {
      this.addDialogVis = true
    },
    
    // 删除经停站
    deleteStation(info) {
      this.$http
        .post('/admin/deleteParkStation',{ trainNumber: info.trainNumber, stationName:info.stationName } )
        .then(response => {
          if (response.status === 200) {
            this.$message({
            message: "删除成功!",
            type: "success",
            showClose: true,
            duration: 1500,
          });
          }
        })
        .catch(function (error) {
          this.$message({
            message: `删除失败!${error}`,
            type: "error",
            showClose: true,
            duration: 1500,
          });
        });
    },

    // 确认修改经停站信息
    handleDialogConfirm() {
      this.$http
        .post('/admin/updateParkStation', this.trainInfo)
        .then(response => {
          if (response.status === 200) {
            this.$message({
            message: "编辑成功!",
            type: "success",
            showClose: true,
            duration: 1500,
          });
          }
        })
        .catch(function (error) {
          console.log(error)
          this.$message({
            message: `编辑失败!`,
            type: "error",
            showClose: true,
            duration: 1500,
          });
        });
    },

    // 确认添加经停站
    handleAddDialogConfirm() {
      this.$http
        .post('/admin/saveParkStation', this.addTrainInfo)
        .then(response => {
          console.log(response)
          if (response.status === 200) {
            this.$message({
            message: "增加成功!",
            type: "success",
            showClose: true,
            duration: 1500,
          });
          }
        })
        .catch(function (error) {
          console.log(error)
          this.$message({
            message: `增加失败!`,
            type: "error",
            showClose: true,
            duration: 1500,
          });
        });
    },

    // 取消修改经停站，关闭对话框
    handleDialogCancel() {
      this.infoDialogVis = false;
    },

    // 取消添加经停站，关闭对话框
    handleAddDialogCancel() {
      this.addDialogVis = false;
    },

    // 查询对应车次下所有经停站
    onSubmit() {
      this.tableData.splice(0,this.tableData.length)
      this.getOneTrain(this.trainId)
    },

  },
  async created() {
      await this.getInfo()
      this.loading = false
  }
}
</script>

<style scoped lang="less">
.trainManager_expand {
  font-size: 0;
  label {
    width: 90px;
    color: #99a9bf;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 70%;
  }
}
  

.train-form {
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

}
</style>
