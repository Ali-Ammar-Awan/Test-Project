<template>
  <div class="role-selection-container">
    <!-- Left Side: Image -->
    <div class="side-image"></div>

    <!-- Right Side: Form -->
    <div class="form-side">
      <div class="top-link">
        <span>Already have an account?</span>
        <a @click.prevent="goToSignIn" href="#">Sign In</a>
      </div>
      <div class="form-content">
        <h1>Join Us!</h1>
        <p class="subheading">
          To begin this journey, tell us what type of account you’d be opening.
        </p>
        <div class="role-cards">
          <div
            v-for="role in roles"
            :key="role.value"
            class="role-card"
            @click="selectRole(role.value)"
          >
            <div class="upper">
              <img :src="role.icon" class="role-icon" alt="" />
            </div>
            <div class="role-info">
              <div class="role-title">{{ role.title }}</div>
              <div class="role-desc">{{ role.desc }}</div>
            </div>
            <img :src="arrowIcon" class="arrow-icon" alt="arrow" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import managerIcon from "@/assets/manager.png";
import developerIcon from "@/assets/Developer.png";
import qaIcon from "@/assets/QA.png";
import arrowIcon from "@/assets/logo.png";

export default {
  name: "RoleSelection",
  data() {
    return {
      arrowIcon,
      roles: [
        {
          value: "manager",
          icon: managerIcon,
          title: "Manager",
          desc: "Signup as manager to manage the tasks and bugs",
        },
        {
          value: "developer",
          icon: developerIcon,
          title: "Developer",
          desc: "Signup as Developer to assign the relevant task to QA",
        },
        {
          value: "QA",
          icon: qaIcon,
          title: "QA",
          desc: "Signup as QA to create the bugs and report in tasks",
        },
      ],
    };
  },
  methods: {
    selectRole(role) {
      this.$router.push({ name: "SignUp", query: { role } });
    },
    goToSignIn() {
      this.$router.push({ name: "SignIn" });
    },
  },
};
</script>

<style scoped>
.role-selection-container {
  display: flex;
  max-height: 100vh;
  max-width: 100vw;
}

.side-image {
  width: 655px;
  object-fit: contain;
  background: url("@/assets/landingPage.png") center center / cover no-repeat;
  margin-right: 371px;
}

.form-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  background: #fff;
  min-height: 100vh;
}

.top-link {
  width: 308px;
height: 28px;

opacity: 1;

  position: absolute;
  top: 32px;
  right: 38px;
  font-family: "Poppins";
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #8692ab;
}

.top-link a {
  color: #007dfa;
  margin-left: 6px;
  text-decoration: none;
  font-weight: 500;
}

.top-link:hover {
  text-decoration: underline;
  text-decoration-color: #007dfa;
  text-decoration-thickness: 3px;
}

.form-content {
  max-width: 426px;
  height: 588px;
  padding: 48px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

h1 {
  width: 114px;
  height: 42px;
  opacity: 1;
  font-family: "Poppins";
  font-weight: 700;
  font-size: 28px;
  line-height: 100%;
  letter-spacing: 0;
  vertical-align: middle;
  color: #2f3367;
}

.subheading {
  width: 411px;
  height: 56px;
  opacity: 1;
  font-family: "Poppins";
  font-weight: 400;
  font-size: 16px;
  margin-top:7px;
  line-height: 28px;
  letter-spacing: 0;
  vertical-align: middle;
  color: #8692a6;
  margin-bottom: 32px;
}

.role-cards {
  width: 426px;
  height: 108px;
  display: flex;
  gap: 20px;
  flex-direction: column;
}

.role-card {
  display: flex;
  align-items: center;
  border: 1px solid #f5f5f7;
  border-radius: 6px;
  padding: 23px 31px;
  margin-bottom: 5px;
  box-shadow: 0 1px 6px rgba(117, 116, 116, 0.1);
}

.role-card:hover {
  border-color: #007dfa;
}

.role-card:first-child .upper {
  background-color: #007dfa;
  width: 40px;
  height: 40px;
  margin-right: 26px;
  border-radius: 50%;
  border: 1px solid #007dfa;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.role-card:first-child .upper img {
  filter: brightness(0) invert(1);
  width: 28px;
  height: 28px;
  margin: 0;
  padding: 0;
  border: none;
}

.role-icon {
  max-width: 40px;
  margin-right: 18px;
  padding: 10px;
  border: 1px solid #007dfa;
  border-radius: 100%;
  box-sizing: border-box;
}

.role-info {
  flex: 1;
}

.role-title {
  width: 74px;
  height: 24px;
  opacity: 1;

  font-family: "Poppins";
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0px;
  vertical-align: middle;
  color: #2f3367;
  margin-bottom: -8px;
}

.role-desc {
  width: 238px;
  height: 42px;
  opacity: 1;
  font-family: "Poppins";
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0px;
  vertical-align: middle;
  color: #8692ab;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  margin-left: 12px;
}
</style>
