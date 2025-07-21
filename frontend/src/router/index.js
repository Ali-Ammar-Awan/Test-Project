import Vue from "vue";
import VueRouter from "vue-router";
import RoleSelection from "@/views/RoleSelection.vue";
import SignIn from "@/views/SignIn.vue";
import SignUp from "@/views/SignUp.vue";
import Projects from "@/views/Projects.vue";
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
  {
    path: "/projects",
    name:"Projects",
    component: Projects
  },
  {
    path: "/bugs",
    name: "Bugs",
    component: () => import("@/views/Bugs.vue")
  },
  {
    path: "/projects/:id/bugs",
    name: "ProjectBugs",
    component: () => import("@/views/Bugs.vue"),
    props: true 
  }
];
const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['RoleSelection', 'SignIn', 'SignUp'];
  const authRequired = !publicPages.includes(to.name);
  const loggedIn = !!localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next({ name: 'SignIn' });
  }
  
  if (loggedIn && publicPages.includes(to.name)) {
    return next({ name: 'Projects' });
  }
  next();
});


export default router;
