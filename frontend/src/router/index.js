import Vue from "vue";
import VueRouter from "vue-router";
import RoleSelection from "@/views/RoleSelection.vue";
import SignIn from "@/views/SignIn.vue";
import SignUp from "@/views/SignUp.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "RoleSelection",
    component: RoleSelection,
  },
  {
    path: "/signIn",
    name: "SignIn",
    component: SignIn,
  },
  {
    path: "/signUp",
    name: "SignUp",
    component: SignUp,
  },
];
const router = new VueRouter({
  routes,
});

export default router;
