<template>
  <div class="NavBar">
    <div class="main">
    <div class="logo">
        <img src="../assets/navbar.png" alt="logo">
        <h1><span>Manage</span>Bug</h1>
    </div>
    <div class="navbar-elements">
        <nav>
            <router-link to="/projects"><img src="../assets/project.png" alt="project-logo"><span>Projects</span></router-link>
        <router-link to="/bugs"><img src="../assets/tasks.png" alt="tasks-logo"><span>Tasks</span></router-link>
            <li><img src="../assets/tickets.png" alt="tickets logo"><span>Message</span></li>
            <li><img src="../assets/payments.png" alt="payments logo"><span>Users</span></li>
        </nav>
    </div>

    <div class="right-logos">
        
        <img src="../assets/notification.png" alt="notification logo">
        <img src="../assets/emailnav.png" alt="email navbar logo">
        <div class="companylogo"><img src="../assets/companylogo.png" alt="company log" ></div>
        <button class="logout-btn" @click="logout">Logout</button>
    
        
    </div>
</div>
        
  </div>
</template>

<script>

export default {
  name: "NavBar",
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push({ name: 'SignIn' });
    }
  }
}

</script>

<style scoped>
.main{
    display: flex;
    flex-direction: row;
    
}

.logo{
    display: flex;
    margin-top: 50px;
}
.logo img{
width: auto;
height: 32px;
opacity: 1;
margin-left: 221px;

}
.logo h1{
font-family: "JetBrains Mono";
font-weight: 100;
font-style: Thin;
margin-top: 5px;
font-size: 19px;
line-height: 100%;
letter-spacing: 1%;

}
.logo h1 span{
font-family: "inter";
font-weight: 700;
font-size: 20px;
line-height: 100%;
margin-left: 10px;
}
.navbar-elements{
  margin-left: 14px;
}

.navbar-elements nav{
    display: flex;
    margin-left: 220px;
}
.navbar-elements li , .navbar-elements a{
    display: flex;
    text-decoration: none;
    text-decoration-line: none;
    color:#787486;

     
}

.navbar-elements li img, .navbar-elements a img{
    width:20px;
    height:20px;
    margin-top: 56px;

   
}

.navbar-elements li span, .navbar-elements a span{
    width:49px;
    height:18px;
    margin-top: 56px;
    margin-left: 10px;
    margin-right: 46px;
}

.right-logos{
    display:flex;
    margin-left: 103px;
   
}

.right-logos img{
    width: 24px;
    height: 24px;
    gap:4px;
    margin-right: 19px;
    margin-top: 54px;
}
.companylogo img{
    margin-top:37px;
    width: 168px;
    height: 57px;
    opacity: 1;
    margin-left: 5px;
    border-width: 1px;

}
.logout-btn {
  margin-top: 48px;
  margin-left: 20px;
  padding: 8px 18px;
  background: #ec5962;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  font-family: "Inter";
  font-weight: 600;
  height: 40px;
}
</style>
