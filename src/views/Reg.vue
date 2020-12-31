<template>
  <div class="center">
    <div class="login-box" id="app">
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-input
            type="text"
            id="name"
            v-model="regForm.username"
            placeholder="请输入帐号"
          >
            <template slot="prepend">帐号</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-input
            id="password"
            v-model="regForm.password"
            type="password"
            placeholder="请输入密码"
          >
            <template slot="prepend">密码</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-input
            id="password"
            v-model="regForm.rePassword"
            type="password"
            placeholder="请再次输入密码"
          >
            <template slot="prepend">密码</template>
          </el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button
            id="login"
            style="width: 100%"
            type="primary"
            @click="regAccount"
            >注册</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'Reg',
  data() {
    return {
      regForm: {
        username: '',
        password: '',
        rePassword: '',
      },
    };
  },
  methods: {
    regAccount() {
      let flag = false;
      Object.values(this.regForm).forEach((item, index) => {
        if (item === '') {
          let flag = true;
        }
      });
      if (flag) {
        this.$message({
          type: 'warning',
          message: '请将信息补充完整',
        });
        return;
      }

      if (this.regForm.password != this.regForm.rePassword) {
        this.$message({
          type: 'warning',
          message: '两次输入密码不一致',
        });
        return;
      }

      if (this.checkHasBeenReg(this.getUsers(), this.regForm)) {
        this.$message({
          type: 'warning',
          message: '该用户已经被注册',
        });
        return;
      } else {
        this.$message({
          type: 'success',
          message: '注册成功',
        });
        this.$store.commit('addUser', this.regForm);
        this.$cookies.set('userInfo', JSON.stringify(this.getUsers()), '1d');
        this.$router.push('/list');
      }
    },
    checkHasBeenReg(users, user) {
      let userInfo = users.filter((item) => {
        return (
          item.username === user.username && item.password === user.password
        );
      });
      return userInfo.length === 0 ? false : true;
    },
    getUsers() {
      if (localStorage.getItem('users') === null) {
        this.$axios({
          type: 'get',
          url: '/static/data/users.json',
        })
          .then((res) => {
            console.log(res);
            localStorage.setItem('users', JSON.stringify(res.data));
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        return JSON.parse(localStorage.getItem('users'));
      }
    },
  },
};
</script>

<style scoped>
.center {
  width: 90%;
  min-width: 380px;
  margin: 40px auto;
  padding: 40px 0;
  border-radius: 6px;
  background: #f0f3f8;
}
</style>