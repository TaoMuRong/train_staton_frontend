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
              :value="VabVerifyVis"
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
            <el-button :loading="loading" type="primary" class="login-btn"  size="small" slot="reference" @click="VabVerifyVis=!VabVerifyVis">
              登录
            </el-button>

          </el-popover>
          <el-button type="success" @click="onRegistry" class="registry-btn" size="small"
            >注册</el-button
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
        <el-form-item label="用户昵称" prop="userName">
          <el-input
            v-model="registerInfo.userName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio v-model="registerInfo.gender" label="男">男</el-radio>
          <el-radio v-model="registerInfo.gender" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input
            v-model="registerInfo.pwd"
            autocomplete="off"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="identityCard">
          <el-input
            v-model="registerInfo.identityCard"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话号" prop="tel">
          <el-input
            v-model="registerInfo.tel"
            autocomplete="off"
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
import { isIdentityId,isTel } from "@/views/validate";
import VabVerify from '../plugin/vabVerify'
export default {
  components: { VabVerify },
  data() {
    const checkIdentitytionId  = (rule, value, callback) => {
      let errorMsg = isIdentityId(value);
      if (errorMsg !== "") {
        callback(new Error(errorMsg));
      } else {
        callback();
      }

    };
    const checkMobile  = (rule, value, callback) => {
      let errorMsg = isTel(value);
      if (errorMsg !== "") {
        callback(new Error(errorMsg));
      } else {
        callback();
      }
    };

    return {
      text: "向右滑动",
      loading:false,
      VabVerifyVis:false,
      loginInfo: {
        pwd: "",
        userName: "",
      },
      registerInfo: {
        userName: "",
        pwd: "",
        gender: "男",
        identityCard: "", // 默认为失信人员身份证
        tel: null
      },
      registerInfoRules: {
        userName: [
          { required: true, message: "请输入新用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        pwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        identityCard: [
          { validator: checkIdentitytionId , trigger: "change" }
        ],
        tel: [
          { validator: checkMobile , trigger: "change" }
        ],
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
                await this.$router.replace({path: "/admin"});
              } else {
                await this.$router.replace({path: "/home"});
              }
            } else {
              this.$message({
                message: `登录失败！${data.message}`,
                type: "error",
                showClose: true,
                duration: 1500,
              });
              this.$refs.slideDiv.reset()
            }
          } catch (err) {
            this.$message({
              type: "error",
              message: err,
              duration: 1500,
            });
          }
        }
      });
    },

    onRegistry() {
      this.registerDialogVis = true;
    },
    handleDialogClosed() {
      this.$refs["registerInfoForm"].resetFields();
    },

    handleDialogConfirm() {
      this.$refs["registerInfoForm"].validate(async (valid) => {
        if (valid) {
          try {
            const { data } = await this.$http.post("/user/register", this.registerInfo);
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
        }
      });
    },

    handleDialogCancel() {
      this.registerDialogVis = false;
    },
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
    }
    .item-btn {
      display: flex;
      justify-content: flex-end;
    }
    .item-btn .el-button {
      margin-left: 10px;
    }
  }
}
</style>
