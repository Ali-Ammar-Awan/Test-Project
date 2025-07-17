
<template>
  <div class="sign-up-page">
    <div class="side-image"></div>

    <div class="form">
      <div class="form-content">
        <h1>Sign Up</h1>
        <p class="subheading">Please fill your information below</p>

        <form class="form-fields" @submit.prevent="onSignUp">
         <div class="input-group" :class="{ focused: focusedField === 'name' || form.name }">
            <img src="@/assets/person.png" alt="user icon" />
            <input
              type="text"
              placeholder=" "
              v-model="form.name"
              required
              @focus="focusedField = 'name'"
              @blur="focusedField = ''"
            />
            <label>Name</label>
          </div>

          <!-- Phone -->
          <div class="input-group" :class="{ focused: focusedField === 'phone' || form.phone_number }">
            <img src="@/assets/phone.png" alt="phone icon" />
            <input
              type="text"
              placeholder=" "
              v-model="form.phone_number"
              required
              @focus="focusedField = 'phone'"
              @blur="focusedField = ''"
            />
            <label>Mobile Number</label>
          </div>

          <!-- Email -->
          <div class="input-group" :class="{ focused: focusedField === 'email' || form.email }">
            <img src="@/assets/email.png" alt="email icon" />
            <input
              type="email"
              placeholder=" "
              v-model="form.email"
              required
              @focus="focusedField = 'email'"
              @blur="focusedField = ''"
            />
            <label>Email</label>
          </div>

          <!-- Password -->
          <div class="input-group" :class="{ focused: focusedField === 'password' || form.password }">
            <img src="@/assets/lock.png" alt="password icon" />
            <input
              type="password"
              placeholder=" "
              v-model="form.password"
              required
              @focus="focusedField = 'password'"
              @blur="focusedField = ''"
            />
            <label>Password</label>
          </div>


          <button @click.prevent="onSignUp" type="submit" class="submit-btn">
            Sign Up <span>></span>
          </button>

          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
        
<div class="line"></div>
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
      focusedField: "",
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
    const response = await axios.post("http://localhost:5000/auth/signup", this.form);
    console.log("🟢 Signup response:", response);

    if (response.status === 201 || response.status === 200) {
      this.$router.push({ name: "SignIn" });
    } else {
      this.error = "Signup failed. Please try again.";
    }
  } catch (err) {
     console.error("❌ Signup error:", err); 
    this.error =
      err.response?.data?.message || "Something went wrong during signup.";
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
  height: 650px;
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
  width: 109px;
  height: 42px;
  opacity: 1;

}

.subheading {
  width: 267px;
height: 24px;
opacity: 1;
margin-top: 10px;
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
  margin-bottom: 20px;
}

.input-group img {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 50%;
  left: 17px;
  transform: translateY(-50%);
  opacity: 1;
   filter: grayscale(100%);
  transition: 0.3s ease;
}

.input-group input {
  width: 443px;
  height: 64px;
  padding-left: 48px;
  padding-top: 18px;
  padding-bottom: 8px;
  border: 3px solid #f5f5f7;
  border-radius: 6px;
  font-family: "Poppins";
  background-color: #f5f5f7;
  font-size: 16px;
  transition: all 0.3s ease;
}


.input-group label {
  position: absolute;
  left: 48px;
  top: 22px;
  color: #a9a9a9;
  font-size: 16px;
  font-family: "Poppins";
  pointer-events: none;
  transition: 0.2s ease all;
  
  padding: 0 4px;
}

.input-group.focused label {
  top: -8px;
  font-size: 12px;
  color: #007dfa;
  background: white;
}
.input-group input:focus {
  outline: none;
  box-shadow: none;
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
  align-items: center;
  gap: 19px;
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
  height: 24px;
  line-height: 100%;
  letter-spacing: 0%;
  vertical-align: middle;
  
}

.bottom-text a {
  color: #007dfa;
  margin-left: 6px;
  font-weight: 600;
  text-decoration: none;
  margin-left:50px
}
.line{
width: 443px;
height: 0px;
margin-top: 10px;
margin-bottom: 15px;
opacity: 1;
border-width: 1px;
border: 1px solid #ECECF0;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
