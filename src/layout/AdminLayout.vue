<template>
  <div id="admin-container">
    <el-container>
      <el-aside width="200px">
        <header>HUBU12305</header>
        <div class="divider"></div>
        <div class="admin-info-wrap">
          <img
            class="avatar"
            src="../assets/image/avatar.jpg"
            alt="adminAvatar"
          />
          <div class="name">{{operator}}</div>
        </div>
        <div class="divider"></div>
        <el-menu
          background-color="#343a40"
          text-color="#FFF"
          :default-active="currPagePath"
          router
        >
<!--          菜单管理-->
            <el-menu-item-group>
              <el-menu-item
                  :index="item.path"
                  v-for="item in menuList"
                  :key="item.id"
                  @click="handleMenuItemClick(item)"
              >
                <i class="el-icon-menu" v-if="item.name === '经停站管理'"></i>
                <i
                    class="el-icon-menu"
                    v-else-if="item.name === '车次管理'"
                ></i>
                <span>{{ item.name }}</span>
              </el-menu-item>
            </el-menu-item-group>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header height="60px">
          <div class="header-part">
            <div class="to-book-mall" @click="goToBookMall">
              <i class="el-icon-position"></i>
              <span>购票首页</span>
            </div>
            <el-dropdown class="admin-settings">
              <span class="el-dropdown-link">
                {{ operator }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="showDialog"
                  >修改密码</el-dropdown-item
                >
                <el-dropdown-item @click.native="logout"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <span>{{ currPageName }}</span>
          <el-divider></el-divider>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- 修改密码登录框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordDialogVis"
      width="25%"
      @closed="handleDialogClosed"
    >
      <el-form
        :model="changeInfo"
        label-width="80px"
        label-position="left"
        size="medium"
        :rules="changeInfoRules"
        ref="changeInfoForm"
        hide-required-asterisk
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="changeInfo.oldPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="changeInfo.newPassword"
            autocomplete="off"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPWD">
          <el-input
            v-model="changeInfo.confirmPWD"
            autocomplete="off"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogConfirm">确 定</el-button>
        <el-button @click="handleDialogCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const checkconfirmPWD = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== this.changeInfo.newPassword) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      menuList: [
        {
          id: "1",
          name: "经停站管理",
          path: "/admin/station_management",
        },
        {
          id: "2",
          name: "车次管理",
          path: "/admin/train_management",
        }
      ],
      currPageName: "",
      role: localStorage.role,
      operator: "",
      currPagePath: "",
      changeInfo: {
        oldPassword: "",
        newPassword: "",
        confirmPWD: "",
      },
      changePasswordDialogVis: false,
      changeInfoRules: {
        oldPassword: [
          { required: true, message: "请输入新用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        confirmPWD: [{ validator: checkconfirmPWD, trigger: "change" }],
      },
    };
  },
  created() {
    this.operator = localStorage.username
    this.currPagePath = sessionStorage.getItem('currPagePath') ? sessionStorage.getItem('currPagePath') : this.$route.fullPath
    this.currPageName = sessionStorage.getItem('currPageName') ? sessionStorage.getItem('currPageName') : '销量统计'
    // console.log(this.$route.fullPath);
  },
  mounted() {
    // console.log(this.$route.fullPath);
  },

  methods: {
    handleMenuItemClick({ name,path }) {
      sessionStorage.setItem('currPageName',name)
      sessionStorage.setItem('currPagePath',path)
      this.currPageName = name
    },
    async logout() {
      try {
        const { data } = await this.$http.get("/user/logout");
        console.log(data)
        if (data.success) {
          console.log(data)
          window.sessionStorage.clear()
          this.$store.commit("REMOVE_ROLE");
          this.$router.replace({
            name: "login",
          });
        } else {
          this.$message({
            type: "error",
            message: "退出失败！",
            duration: 1500,
          });
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: err,
          duration: 1500,
        });
      }
    },
    goToBookMall() {
      this.$router.push({ path: "/home/book_mall" });
    },
    showDialog() {
      this.changePasswordDialogVis = true;
    },
    handleDialogCancel() {
      this.changePasswordDialogVis = false;
    },
    handleDialogConfirm() {
      this.$refs["changeInfoForm"].validate(async (valid) => {
        if (valid) {
          const { data } = await this.$http.post("/member/update", {
            id: localStorage.accountId,
            oldPassword: this.changeInfo.oldPassword,
            newPassword: this.changeInfo.newPassword,
          });
          console.log(data);
          if (data.success) {
            this.$message({
              type: "success",
              message: data.message,
              duration: 1500,
            });
            this.changePasswordDialogVis = false;
          } else {
            this.$message({
              type: "error",
              message: data.message,
              duration: 1500,
            });
          }
        } else return;
      });
    },

    handleDialogClosed() {
      this.$refs["changeInfoForm"].resetFields();
    },
  },
};
</script>

<style scoped lang="less">
@menu-bgc: #343a40;
.hover-style() {
  cursor: pointer;
  color: #39d7da;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

#admin-container {
  height: 100%;
  font-family: "微软雅黑";
  background-color: #fff;
  .el-container {
    .divider {
      background-color: #454d55;
      margin: 0 2%;
      height: 1px;
    }
    .el-aside {
      color: white;
      background-color: @menu-bgc;
      header {
        font-size: 18px;
        text-align: center;
        height: 50px;
        line-height: 50px;
      }
      .admin-info-wrap {
        display: flex;
        align-items: center;
        height: 80px;
        .avatar {
          border-radius: 50%;
          width: 60px;
          height: 60px;
        }
        .name {
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }

    .el-header {
      display: flex;
      align-items: center;
      font-size: 18px;
      background-color: #f4f6f9;
      justify-content: flex-end;
      .header-part {
        height: 60px;
        width: 20%;
        display: flex;
        justify-content: space-around;
        .to-book-mall {
          flex: 1;
          .center;
          &:hover {
            .hover-style;
          }
          font-size: 14px;
        }
        .admin-settings {
          &:hover {
            .hover-style;
          }
          flex: 1;
          .center;
          font-size: 14px;
          .el-dropdown-link {
            width: 100%;
            display: block;
            height: 100%;
            .center;
          }
        }
      }
    }
  }
}
</style>
