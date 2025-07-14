<template>
  <div class="projects-page">
   <NavBar></NavBar>
    <div class="projects-header">
      <div class="projects-title">
        <div class="green-line"></div>
        <span class="projects-label">Projects</span>
        <span class="projects-welcome">Hi {{ userName }}, welcome to ManageBug</span>
      </div>
      <div class="projects-actions">
        <div class="input-group">
          <img src="../assets/search.png" alt="search logo">
        <input v-model="search" class="search-bar" placeholder="Search for Projects here" />
        </div>
        <button class="add-btn" @click="showAddModal = true">+ Add New Project</button>
        <div class="sort">
        <select v-model="sortBy" class="sort-select">
          <option value="name">Sort by</option>
          
        </select>
            <img src="../assets/filter.png" alt="">
        </div>
        <div class="sort">
        <select v-model="filter" class="filter-select">
          <option value="all">All Projects</option>
        </select>
        <img src="../assets/filter.png" alt="">
        </div>
        <div class="invert-logo">
          <img src="../assets/navbar.png" alt="website logo">
        </div>
      </div>
    </div>
    <div class="projects-list">
      <div v-for="project in paginatedProjects" :key="project.id" class="project-card" @click="goToProjectBugs(project)">
        <div class="project-icon" :style="{ background: project.iconBg }">
          <img :src="project.imageUrl" />
           
        </div>
        <div class="project-info">
          <div class="project-name">{{ project.name }}</div>
          <div class="project-desc">{{ project.details }}</div>
          <div class="project-tasks"><span>Task Done:</span> {{ project.resolvedBugs }}/{{ project.totalBugs }}</div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <span class="left-span">Showing {{ startEntry }} to {{ endEntry }} of {{ totalProjects }} entries</span>
            <div class="visible-projects">
              <div class="sort">
              <span>Display</span>
      <select v-model.number="perPage" class="per-page-select">
        <option :value="10">10</option>
      </select>
      <img src="../assets/filter.png" alt="">
      </div>
      </div>
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="page === 1">&lt;</button>
        <span v-for="n in totalPages" :key="n" :class="['page-btn', { active: n === page }]" @click="goToPage(n)">{{ n }}</span>
        <button @click="nextPage" :disabled="page === totalPages">&gt;</button>
      </div>


    </div>
    <AddProjectModal :visible="showAddModal" @close="showAddModal = false" @project-added="fetchProjects" />
  </div>
</template>

<script>
import axios from 'axios';
import AddProjectModal from '@/components/AddProjectModal.vue';
import managerIcon from '@/assets/manager.png';
import developerIcon from '@/assets/Developer.png';
import qaIcon from '@/assets/QA.png';
import NavBar from '@/components/NavBar.vue';
export default {
  name: 'Projects',
  components: { 
  AddProjectModal,
  NavBar },
  data() {
    return {
      userName: 'DevVinsnext',
      projects: [],
      search: '',
      sortBy: 'name',
      filter: 'all',
      page: 1,
      perPage: 10,
      showAddModal: false,
      icons: [managerIcon, developerIcon, qaIcon],
      iconBgs: ['#7de2d1', '#e6e97d', '#f7c6c7', '#b6a6f7', '#f7d6b6', '#b6d6f7'],
    };
  },
  computed: {
    filteredProjects() {
      let filtered = this.projects;
      if (this.search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()));
      }
      return filtered;
    },
    sortedProjects() {
      if (this.sortBy === 'name') {
        return [...this.filteredProjects].sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.sortBy === 'tasks') {
        return [...this.filteredProjects].sort((a, b) => (b.tasksDone || 0) - (a.tasksDone || 0));
      }
      return this.filteredProjects;
    },
    paginatedProjects() {
      const start = (this.page - 1) * this.perPage;
      return this.sortedProjects.slice(start, start + this.perPage);
    },
    totalProjects() {
      return this.sortedProjects.length;
    },
    totalPages() {
      return Math.ceil(this.totalProjects / this.perPage) || 1;
    },
    startEntry() {
      return (this.page - 1) * this.perPage + 1;
    },
    endEntry() {
      return Math.min(this.page * this.perPage, this.totalProjects);
    },
  },
  methods: {
    async fetchProjects() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const res = await axios.get('http://localhost:5000/projects', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
      
        const projectsWithStats = await Promise.all(res.data.projects.map(async (p, i) => {
          let totalBugs = 0;
          let resolvedBugs = 0;
          try {
            const bugRes = await axios.get(`http://localhost:5000/bugs?project_id=${p.id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            totalBugs = bugRes.data.bugs.length;
            resolvedBugs = bugRes.data.bugs.filter(bug => bug.status === 'resolved' || bug.status === 'completed').length;
          } catch (e) {
          
          }
          return {
            ...p,
            icon: this.icons[i % this.icons.length],
            iconBg: this.iconBgs[i % this.iconBgs.length],
            totalBugs,
            resolvedBugs,
            imageUrl: p.image ? `http://localhost:5000/uploads/${p.image}` : null,
          };
        }));
        this.projects = projectsWithStats;
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        alert('Failed to fetch projects: ' + (err.response?.data?.message || err.message));
      }
    },
    prevPage() {
      if (this.page > 1) this.page--;
    },
    nextPage() {
      if (this.page < this.totalPages) this.page++;
    },
    goToPage(n) {
      this.page = n;
    },
    goToProjectBugs(project) {
      this.$router.push({ name: 'ProjectBugs', params: { id: project.id } });
    },
  },
  mounted() {
    this.fetchProjects();
  },
};
</script>

<style scoped>
.projects-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 100px; 
}


.projects-header {
  display: flex;
  align-items: center;
}

.green-line{
width: 4px;
height: 72px;
margin-top: 65px;
margin-left: 221px;
opacity: 1;
background-color: #50A885;
;

} 

.profile {
  margin-left: auto;
  font-weight: 600;
  color: #2f3367;
  font-size: 1.1rem;
}
.projects-title {
  display: flex;
  flex-direction: row;
}
.projects-label {
width: 66px;
height: 24px;
margin-top: 79px;
margin-left: 20px;
opacity: 1;
font-family: "Poppins";
font-weight: 600;
font-size: 16px;
line-height: 100%;
letter-spacing: 0%;
}
.projects-welcome {
    width: 280px;
    height: 21px;
    margin-top: 98px;
    margin-left: -66px;
    opacity: 1;
    font-family: "Poppins";
    font-weight: 400;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #AEAEAE;

}

.projects-actions {
  display: flex;
  
}

.input-group {
  position: relative;
}
.input-group img {
  width: 15px;
  height: 15px;
  position: absolute;
  top: 82%;
  left: 60px;
  transform: translateY(-50%);
  opacity: 1;
}

.input-group input {
  width: 336px;
  height: 45px;
  padding-left: 48px;
  border: 3px solid #F1F1F1;
  font-family: "Poppins";
  background-color: #F1F1F1;
  font-size: 18px;
  font-weight: 400;
}
.search-bar {
margin-top: 79px;
margin-left: 43px;
color:#6E6F72;
opacity: 1;
border-radius: 5px;
}
.add-btn {
width: 163px;
height: 45px;
margin-top: 79px;
margin-left: 22px;
border-radius: 5px;
opacity: 1;
background-color: #007DFA;
color:#FFFFFF;
font-family: "Poppins";
font-weight: 500;
font-size: 14px;
line-height: 100%;
letter-spacing: 0px;
vertical-align: middle;

}
.sort-select , .filter-select {
width: 110px;
height: 45px;
margin-top: 79px;
margin-left: 13px;
opacity: 1;
text-align: center;

}

.sort img{

width: 16px;
height: 18px;
}

.invert-logo{
  width: 50px;
  height: 45px;
margin-top: 79px;
margin-left: 13px;
opacity: 1;
background-color: #007DFA;
align-content: center;
text-align: center;
}

.invert-logo img{
width: 23px;
height: 23px;
filter:brightness(0) invert(1);
}
.projects-list {
  
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-left: 221px;
}

.project-card {
  background: #fff;
  border-radius: 9px;
    box-shadow:0 4px 12px rgba(0, 0, 0, 0.08); 
  padding: 28px 32px;
  width: 320px;
  height:202px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  margin-top: 8px;
}
.project-icon {
width: 58px;
height: 58px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;




}
.project-icon img {
  width: 32px;
  height: 32px;
}
.project-info {
  flex: 1;
}
.project-name {
  font-weight: 600;

  width: 141px;
  height: 22px;
  opacity: 1;
  margin-bottom: 10px;
  font-family: "Poppins";
  font-weight: 600;
  font-size: 14.79px;
  line-height: 100%;
  letter-spacing: 1%;


}
.project-desc {
  width: 280px;
  color: #87888C;
  height: 19px;
  opacity: 1;

}
.project-tasks {
  width: 280px;
  height: 19px;
  left: 21px;
  opacity: 1;
}
.project-tasks span{
  color: #87888C;
}
.pagination {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 16px 48px;
  font-size: 0.98rem;
  background: #ffffff;
  border-top: 1px solid #e3e8ef;
  z-index: 100;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}
.page-btn {
  padding: 4px 10px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid #e3e8ef;
  cursor: pointer;
}
.page-btn.active {
  background: #007dfa;
  color: #fff;
  border: 1px solid #007dfa;
}
.left-span, .sort span{
width: 193px;
height: 22px;
opacity: 1;
font-family: "Poppins";
font-weight: 400;
font-size: 14px;
line-height: 22px;
letter-spacing: 0px;
vertical-align: middle;
color: #6C757D;

}
.per-page-select{
  width:15px;
  height:22px;
  font-size: 14px;
  margin-left:10px ;
}


</style>
