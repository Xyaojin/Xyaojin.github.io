<template>
  <div class="center">
    <div class="login-box" id="app">
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-input
            type="text"
            id="name"
            v-model="loginForm.username"
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
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
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
            @click="checkLogin"
            >登录</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
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
    doFilterUser(users, user) {
      return users.filter((item) => {
        return (
          item.username === user.username && item.password === user.password
        );
      });
    },
    checkLogin() {
      let users = this.getUsers();
      let newArr = this.doFilterUser(users, this.loginForm);
      if (newArr.length === 0) {
        this.$message({
          showClose: true,
          message: '账号或者密码错误',
        });
      } else {
        this.$message({
          showClose: true,
          type: 'success',
          message: '登录成功',
        });
        setTimeout(() => {
          this.$store.commit('addUser', newArr[0]);
          this.$cookies.set('userInfo', JSON.stringify(newArr[0]), '1d');
          this.$router.push('/list');
        }, 1000);
        
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