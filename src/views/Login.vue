<template>
  <div id="login-container">
    <!-- 登录 -->
    <div class="login-form-wrap">
      <el-form
        label-position="left"
        label-width="80px"
        :model="loginInfo"
        size="medium"
        class="login-form"
        :rules="loginInfoRules"
        ref="loginInfoForm"
        hide-required-asterisk
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="loginInfo.userName" class="login-input"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input
            v-model="loginInfo.pwd"
            type="password"
            show-password
            class="login-input"
          ></el-input>
        </el-form-item>
        <el-form-item class="item-btn">
          <el-popover
              placement="top"
              width="400"
              trigger="click"
          >
            <!--验证码-->
            <div>
              <vab-verify
                  ref="slideDiv"
                  :w="350"
                  :slider-text="text"
                  :h="175"
                  @success="handleSuccess"
                  @fail="handleError"
              ></vab-verify>
            </div>
            <el-button type="primary" class="login-btn"  size="small" slot="reference" >
              登录
            </el-button>

          </el-popover>
          <el-button type="primary" @click="onRegistry" class="registry-btn" size="small"
            >注册</el-button
          >
          <el-button type="success" @click="onVisit" class="tourist-btn" size="small"
          >游客</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- 注册 -->
    <el-dialog
      title="用户注册"
      :visible.sync="registerDialogVis"
      width="25%"
      @closed="handleDialogClosed"
    >
      <el-form
        :model="registerInfo"
        label-width="80px"
        label-position="left"
        size="medium"
        :rules="registerInfoRules"
        ref="registerInfoForm"
        hide-required-asterisk
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerInfo.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerInfo.password"
            autocomplete="off"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPWD">
          <el-input
            v-model="registerInfo.confirmPWD"
            autocomplete="off"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDialogConfirm">确 定</el-button>
        <el-button @click="handleDialogCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import VabVerify from '../plugin/vabVerify'
export default {
  components: { VabVerify },
  data() {
    const checkconfirmPWD = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== this.registerInfo.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      text: "向右滑动",
      loginInfo: {
        pwd: "",
        userName: "",
      },
      registerInfo: {
        username: "",
        password: "",
        confirmPWD: "",
      },
      registerInfoRules: {
        username: [
          { required: true, message: "请输入新用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        confirmPWD: [{ validator: checkconfirmPWD, trigger: "change" }],
      },
      loginInfoRules: {
        username: {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
        password: { required: true, message: "请输入密码", trigger: "blur" },
      },
      registerDialogVis: false,
    };
  },
  methods: {
    ...mapMutations({
      setRole: "SET_ROLE",
    }),
    // 验证成功则登陆
    handleSuccess () {
      this.onLogin()
    },
    handleError () {
      this.$message.error('验证失败')
    },
    onLogin() {
      this.$refs["loginInfoForm"].validate(async (valid) => {
        if (valid) {
          try {
            const { data } = await this.$http.post(
              "/user/login",
              this.loginInfo
            );
            if (data.success) {
              this.$message({
                message: "登录成功",
                type: "success",
                showClose: true,
                duration: 1500,
              });
              const role = data.data.auth;
              const accountId = data.data.id;
              const username = data.data.userName;
              const token = data.data.token
              window.sessionStorage.setItem('token', token)
              this.setRole({ role, accountId, username });
              if (role === "admin" || role === "finance" || role === "manager") {
                this.$router.replace({ path: "/admin" });
              } else {
                this.$router.replace({ path: "/home" });
              }
            } else {
              this.$message({
                message: `登录失败！${data.message}`,
                type: "error",
                showClose: true,
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
        } else return;
      });
    },

    onRegistry() {
      this.registerDialogVis = true;
    },
    // 游客
    onVisit () {
      this.$message.success("正在跳转")
      // 编程式导航，跳转至书城主页
      this.$router.replace("/book_mall")
    },
    handleDialogClosed() {
      this.$refs["registerInfoForm"].resetFields();
    },

    handleDialogConfirm() {
      this.$refs["registerInfoForm"].validate(async (valid) => {
        if (valid) {
          try {
            const { data } = await this.$http.post("/member/register", {
              username: this.registerInfo.username,
              password: this.registerInfo.password,
            });
            console.log(data);
            if (data.success) {
              this.$message({
                type: "success",
                message: "注册成功",
                duration: 1500,
              });
              this.registerDialogVis = false;
            } else {
              this.$message({
                type: "error",
                message: "注册失败",
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
        } else return;
      });
    },

    handleDialogCancel() {
      this.registerDialogVis = false;
    },
  },
  mounted: function () {
    // axios.get('user/userInfo')
    // .then(res => {
    //   console.log(res)
    // })
    // .catch(err =>{
    //   console.log(err)
    // })
  }
};
</script>


<style scoped lang="less">
#login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../assets/image/beijing.webp") no-repeat;
  background-size: cover;
  .login-form-wrap {
    width: 400px;
    height: 250px;
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    font-weight: bold;
    .login-form {
      width: 80%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .item-btn {
        .login-btn {
          margin-right: 30px;
        }
        .tourist-btn {

        }
      }
    }
  }
}
</style>
