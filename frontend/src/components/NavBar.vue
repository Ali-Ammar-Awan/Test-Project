<template>
  <div class="NavBar">
    <div class="main">
    <div class="logo">
        <img src="../assets/navbar.png" alt="logo">
        <h1><span>Manage</span>Bug</h1>
    </div>
    <div class="navbar-elements">
        <nav>
            <li><img src="../assets/project.png" alt="project-logo"><span>Projects</span></li>
            <li><img src="../assets/tasks.png" alt="tasks-logo"><span>Tasks</span></li>
            <li><img src="../assets/tickets.png" alt="tickets logo"><span>Tickets</span></li>
            <li><img src="../assets/payments.png" alt="payments logo"><span>Payments</span></li>
        </nav>
    </div>

    <div class="right-logos">
        
        <img src="../assets/notification.png" alt="notification logo">
        <img src="../assets/emailnav.png" alt="email navbar logo">
        <div class="companylogo"><img src="../assets/companylogo.png" alt="company log" ></div>
    
        
    </div>
</div>
        
  </div>
</template>

<script>

export default {
  name: "NavBar",

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
width: 32px;
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

.navbar-elements nav{
    display: flex;
    margin-left: 357px;
}
.navbar-elements li {
    display: flex;
     
}

.navbar-elements li img{
    width:20px;
    height:20px;
    margin-top: 56px;
   
}

.navbar-elements li span{
    width:49px;
    height:18px;
    margin-top: 56px;
    margin-left: 10px;
    margin-right: 20px;
}

.right-logos{
    display:flex;
    margin-left: 183px;
   
}

.right-logos img{
    width: 24px;
    height: 24px;
    gap:4px;
    margin-right: 35px;
    margin-top: 54px;
}
.companylogo img{
    margin-top:37px;
    width: 168px;
    height: 57px;
    opacity: 1;
    margin-left: 30px;
    border-width: 1px;

}
</style>
