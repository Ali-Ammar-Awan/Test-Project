<template>
  <div class="sign-up-page">
    <div class="side-image"></div>

    <div class="form">
      <div class="form-content">
        <h1>Login</h1>
        <p class="subheading">Please enter your login details</p>

        <form @click.prevent="onSignIn" class="form-fields">
          <div
  class="input-group"
  :class="{ focused: focusedInput === 'email' }"
>
  <img src="@/assets/email.png" alt="email icon" />
  <input
    type="email"
    placeholder="E-mail"
    v-model="form.email"
    required
    @focus="focusedInput = 'email'"
    @blur="focusedInput = ''"
/>
</div>

<div
  class="input-group"
  :class="{ focused: focusedInput === 'password' }"
>
  <img src="@/assets/lock.png" alt="password icon" />
  <input
    type="password"
    placeholder="Password"
    v-model="form.password"
    required
    @focus="focusedInput = 'password'"
    @blur="focusedInput = ''"
/>
</div>

          

          <button type="submit" class="submit-btn">
            Login <span>></span>
          </button>
        </form>
<div class="line"></div>
        <div class="bottom-text">
          Don’t have an account account?
          <a @click.prevent="goToSignUp" href="#">Create Account</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "SignIn",

  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      focusedInput: null,
    };
  },
  methods: {
    goToSignUp() {
      this.$router.push({ name: "SignUp" });
    },
    async onSignIn() {
      try {
        this.error = null;
        const response = await axios.post(
          "http://localhost:5000/auth/login",
          this.form
        );
        if (response.status === 201 || response.status === 200) {
          
          localStorage.setItem('token', response.data.token);
          this.$router.push({ name: "Projects" });
        } else {
          this.error = "Signin failed. Please try again.";
        }
      } catch (err) {
        this.error =
          err.response?.data?.error || "Something went wrong during signin.";
      }
    },
  },
};
</script>

<style scoped>
.sign-up-page {
  display: flex;
  max-height: 100vh;
  max-width: 100vw;
}

.side-image {
  width: 655px;
  height: 100vh;
  background: url("@/assets/landingPage.png") center center / cover no-repeat;
}

.form {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.form-content {
 width: 395px;
    height: 463px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

h1 {
  font-family: "Poppins";
  font-weight: 700;
  font-size: 28px;
  color: #2f3367;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
}

.subheading {
  font-family: "Poppins";
  font-size: 16px;
  color: #8692a6;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  position: relative;
}

.input-group img {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 50%;
  left: 17px;
  transform: translateY(-50%);
  opacity: 1;
}

.input-group.focused input {
  border-color: #80BEFC;
  background-color: #fff;
  outline: none;
  box-shadow: none;
}

.input-group.focused img {
  filter: brightness(0) saturate(100%) invert(0%);
}
.input-group input {
  width: 443px;
  height: 64px;
  padding-left: 48px;
  border: 3px solid #f5f5f7;
  border-radius: 6px;
  font-family: "Poppins";
  background-color: #f5f5f7;
  font-size: 16px;
}
.input-group input:hover {
  border-color: #80befc;
}

.submit-btn {
  width: 206px;
  height: 70px;
  background-color: #007dfa;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: "Poppins";
  font-size: 22px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18.5px;
  margin-top: 20px;
}
.submit-btn span {
  margin-left: 50px;
}

.bottom-text {
  font-family: "Poppins";
  font-weight: 500;
  font-size: 16px;
  color: #8692a6;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  width: 480px;
}

.line{
width: 443px;
height: 0px;
margin-top: 10px;
margin-bottom: 15px;
opacity: 1;
border-width: 1px;
border: 1px solid #ECECF0
}


.bottom-text a {
  color: #007dfa;
  margin-left: 49px;
  font-weight: 600;
  text-decoration: none;
}
</style>
