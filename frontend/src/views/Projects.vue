<template>
  <div class="projects-page">
    <NavBar></NavBar>
    <div class="line"></div>
    <div class="projects-header">
      <div class="projects-title">
        <div class="green-line"></div>
        <span class="projects-label">Projects</span>
        <span class="projects-welcome"
          >Hi {{ userName }}, welcome to ManageBug</span
        >
      </div>
      <div class="projects-actions">
        <div class="input-group">
          <img src="../assets/search.png" alt="search logo" />
          <input class="search-bar" placeholder="Search for Projects here" />
        </div>
        <button class="add-btn" @click="showAddModal = true">
          + Add New Project
        </button>
        <div class="sort">
          <select class="sort-select">
            <option>Sort by</option>
          </select>
          <img src="../assets/filter.png" alt="" />
        </div>
        <div class="sort">
          <select class="filter-select">
            <option>My project&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>

          </select>
          <img src="../assets/filter.png" alt="" />
        </div>
        <div class="invert-logo">
          <img src="../assets/navbar.png" alt="website logo" />
        </div>
      </div>
    </div>
    <div class="line2"></div>
    <div class="three-row">
      <div class="projects-list">
        <div
          v-for="project in paginatedProjects"
          :key="project.id"
          class="project-card"
          @click="goToProjectBugs(project)"
        >
          <div class="project-icon" :style="{ background: project.iconBg }">
            <img :src="project.imageUrl" />
          </div>
          <div class="project-info">
            <div class="project-name">{{ project.name }}</div>
            <div class="project-desc">{{ project.details }}</div>
            <div class="project-tasks">
              <span>Task Done:</span> {{ project.resolvedBugs }}/{{
                project.totalBugs
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pag-background">
      <div class="pagination">
        <span class="left-span"
          >Showing {{ startEntry }} to {{ endEntry }} of
          {{ totalProjects }} entries</span
        >

        <div class="right-pagination">
           <div class="right-pag">
          <div class="visible-projects">
<div class="display-control">
  <span class="display-label">Display</span>
  <div class="display-box">
    <select v-model.number="perPage" class="per-page-select">
      <option :value="10">10</option>
    </select>
    <span class="arrow">&#9662;</span> <!-- ▼ symbol -->
  </div>
</div>

          </div>
          <div class="pagination-controls">
            <button @click="prevPage" :disabled="page === 1">&lt;</button>
            <span
              v-for="n in totalPages"
              :key="n"
              :class="['page-btn', { active: n === page }]"
              @click="goToPage(n)"
              >{{ n }}</span
            >
            <button @click="nextPage" :disabled="page === totalPages">
              &gt;
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
    <AddProjectModal
      :visible="showAddModal"
      @close="showAddModal = false"
      @project-added="handleProjectAdded"
    />
  </div>
</template>

<script>

import AddProjectModal from "@/components/AddProjectModal.vue";
import NavBar from "@/components/NavBar.vue";
import projectService from "../services/projectService";

import managerIcon from "@/assets/manager.png";
import developerIcon from "@/assets/Developer.png";
import qaIcon from "@/assets/QA.png";

export default {
  name: "Projects",
  components: {
    AddProjectModal,
    NavBar,
  },
  data() {
    return {
      userName: "DevVinsnext",
      projects: [],
      page: 1,
      perPage: 10,
      showAddModal: false,
      icons: [managerIcon, developerIcon, qaIcon],
      iconBgs: [
        "#7de2d1",
        "#e6e97d",
        "#f7c6c7",
        "#b6a6f7",
        "#f7d6b6",
        "#b6d6f7",
      ],
    };
  },
  computed: {
    paginatedProjects() {
      const start = (this.page - 1) * this.perPage;
      return this.projects.slice(start, start + this.perPage);
    },
    totalProjects() {
      return this.projects.length;
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
        this.projects = await projectService.getProjectsWithStats(
          this.icons,
          this.iconBgs
        );
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        alert(
          "Failed to fetch projects: " +
            (err.response?.data?.message || err.message)
        );
      }
    },
    handleProjectAdded() {
      // Close the modal and refresh the project list
      this.showAddModal = false;
      this.fetchProjects();
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
      this.$router.push({
        name: "ProjectBugs",
        params: { id: project.id, name: project.name },
      });
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

.green-line {
  width: 4px;
  height: 72px;
  margin-top: 65px;
  margin-left: 221px;
  opacity: 1;
  background-color: #50a885;
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
  margin-top: -57px;
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
  color: #aeaeae;
}

.projects-actions {
  display: flex;
}

.input-group {
  position: relative;
  margin-top: -65px;
}
.input-group img {
  width: 15px;
  height: 14px;
  position: absolute;
  top: 81%;
  left: 47px;
  transform: translateY(-50%);
  opacity: 1;
}

.input-group input {
  width: 385px;
  height: 45px;
  padding-left: 48px;
  border: 3px solid #f1f1f1;
  font-family: "Poppins";
  background-color: #f1f1f1;
  font-size: 18px;
  font-weight: 400;
}
.search-bar {
  margin-top: 79px;
  margin-left: 26px;
  color: #6e6f72;
  opacity: 1;
  border-radius: 5px;
}
.add-btn {
  width: 163px;
  height: 45px;
  margin-top: 14px;
  margin-left: 22px;
  border-radius: 5px;
  opacity: 1;
  background-color: #007dfa;
  color: #ffffff;
  font-family: "Poppins";
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0px;
  vertical-align: middle;
}
.sort-select,
.filter-select {
  width: 110px;
  height: 45px;
  margin-top: 15px;
  margin-left: -8px;
  opacity: 1;
  text-align: center;
  
}

.sort img {
  width: 16px;
  height: 18px;
  margin-left:-15px;
  margin-right: 51px;
}

.invert-logo {
  width: 50px;
  height: 45px;
  margin-top: 13px;
  margin-left: -15px;
  opacity: 1;
  background-color: #007dfa;
  align-content: center;
  text-align: center;
}

.invert-logo img {
  width: 23px;
  height: 23px;
  filter: brightness(0) invert(1);
}
.projects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 46px;
  margin-left: 221px;
}

.three-row {
  width: 1500px;
}

.project-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 20px 18px;
  width: 385px;
  height: 202px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}
.project-icon {
  width: 58px;
  height: 58px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  margin-bottom: 12px;
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

  width: 180px;
  height: 22px;
  opacity: 1;
  margin-bottom: 4px;
  font-family: "Poppins";
  font-weight: 600;
  font-size: 14.79px;
  line-height: 100%;
  letter-spacing: 1%;
}
.project-desc {
  width: 280px;
  color: #87888c;
  font-family: "Poppins";
  height: 21px;
  margin-bottom: 4px;
  opacity: 1;

  font-weight: 400;

  font-size: 12px;

  line-height: 100%;
  letter-spacing: 1%;
}
.project-tasks {
  width: 280px;
  font-family: "Poppins";
  height: 19px;
  left: 21px;
  opacity: 1;

  font-weight: 400;

  font-size: 12px;

  line-height: 100%;
  letter-spacing: 1%;
}
.project-tasks span {
  color: #87888c;
}


.pagination {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 220px;
    background: #ffffff;
  border-top: 1px solid #e3e8ef;
  font-size: 0.98rem;
  z-index: 100;
  width: 100vw;
}

.right-pag{
  display: flex;
  gap:10px;
}
.right-pagination {
  transform: translateX(-126px); /* move it 50px to the left */
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
.left-span,
.sort span {
  width: 193px;
  height: 22px;
  opacity: 1;
  font-family: "Poppins";
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0px;
  vertical-align: middle;
  color: #6c757d;
}
.per-page-select {
  width: 15px;
  height: 22px;
  font-size: 14px;
  margin-left: 10px;
}

.line,
.line2 {
  width: 1245px;
  height: 0px;
  margin-top: 80px;
  margin-left: 221px;
  opacity: 1;
  border-width: 1px;
  border: 1px solid #ececee;
}

.line2 {
  margin-top: 1px;
  margin-bottom: 71px;
}

.display-control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 0px;
}

.display-label {
  font-family: "Poppins";
  font-size: 14px;
  color: #6c757d;
}

.display-box {
  position: relative;
  width: 60px;
  height: 30px;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.per-page-select {
  appearance: none;
  border: none;
  background: transparent;
  font-family: "Poppins";
  font-size: 14px;
  color: #333;
  width: 100%;
  padding: 0 20px 0 10px;
  cursor: pointer;
}

.arrow {
  position: absolute;
  right: 8px;
  pointer-events: none;
  font-size: 12px;
  color: #666;
}

</style>
