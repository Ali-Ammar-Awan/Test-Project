
<template>
  <div class="sign-up-page">
    <div class="side-image"></div>

    <div class="form">
      <div class="form-content">
        <h1>Sign Up</h1>
        <p class="subheading">Please fill your information below</p>

        <form class="form-fields" @submit.prevent="onSignUp">
          <div class="input-group">
            <img src="@/assets/person.png" alt="user icon" />
            <input type="text" placeholder="Name" v-model="form.name" required />
          </div>

          <div class="input-group">
            <img src="@/assets/phone.png" alt="phone icon" />
            <input type="text" placeholder="+92 342 418 6063" v-model="form.phone_number" required />
          </div>

          <div class="input-group">
            <img src="@/assets/email.png" alt="email icon" />
            <input type="email" placeholder="E-mail" v-model="form.email" required />
          </div>

          <div class="input-group">
            <img src="@/assets/lock.png" alt="password icon" />
            <input type="password" placeholder="Password" v-model="form.password" required />
          </div>

          <button @click.prevent="onSignUp" type="submit" class="submit-btn">
            Sign Up <span>></span>
          </button>

          <p v-if="error" class="error-message">{{ error }}</p>
        </form>

        <div class="bottom-text">
          Already have an account?
          <a @click.prevent="goToSignIn" href="#">Login to your account</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SignUp",
  data() {
    return {
      form: {
        name: "",
        phone_number: "",
        email: "",
        password: "",
        user_type: ""
      },
      error: null,
    };
  },

  created() {
  this.form.user_type = this.$route.query.role || "developer";
  },
  methods: {
    goToSignIn() {
      this.$router.push({ name: "SignIn" });
    },
    async onSignUp() {
      try {
        this.error = null;
        const response = await axios.post("http://localhost:5000/users/signup", this.form);

        if (response.status === 201 || response.status === 200) {
         
          this.$router.push({ name: "SignIn" });
        } else {
          this.error = "Signup failed. Please try again.";
        }
      } catch (err) {
        this.error =
          err.response?.data?.error || "Something went wrong during signup.";
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
  width: 443px;
  height: 672px;
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

.input-group input {
  width: 443px;
  height: 64px;
  padding-left: 48px;
  border: 3px solid #F5F5F7;
  border-radius: 6px;
  font-family: "Poppins";
  background-color: #F5F5F7;
  font-size: 16px;
}
.input-group input:hover{
  border-color:#80befc ;
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
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding:18.5px;
}
.submit-btn span{
  margin-left: 50px;
}

.bottom-text {
  font-family: "Poppins";
  font-weight: 500;
  font-size: 16px;
  color: #8692a6;
  text-align: center;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
}

.bottom-text a {
  color: #007dfa;
  margin-left: 6px;
  font-weight: 600;
  text-decoration: none;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
