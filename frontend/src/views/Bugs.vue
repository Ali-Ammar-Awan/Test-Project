<template>
  <div class="bugs-page">
    <NavBar />
    <div class="header-section">
      <div class="breadcrumbs">
        Projects &gt; <span>{{ projectName }}</span>
      </div>
      <div class="title-row">
        <h1>All bugs listing <span class="bug-badge">Bugs</span></h1>
        <div class="header-actions">
          <button class="settings-btn"><v-icon>mdi-cog</v-icon></button>
          <button class="add-btn" @click="showAddModal = true">
            + New Task bug
          </button>
        </div>
      </div>
      <div class="filters-row">
        <div class="filter1">
          <input v-model="search" class="search-bar" placeholder="Search" />
        </div>
        <div class="filter2">
          <select v-model="filterType" class="filter-select">
            <option value="all">Subtasks</option>
          </select>
          <select v-model="filterMe" class="filter-select">
            <option value="me">Me</option>
          </select>
          <select v-model="filterAssignee" class="filter-select">
            <option value="all">Assignees</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
        <div class="filter3">
          <div class="view-toggle">
            <button class="icon-btn"><v-icon>mdi-view-list</v-icon></button>
            <button class="icon-btn"><v-icon>mdi-view-grid</v-icon></button>
          </div>
        </div>
      </div>
    </div>
    <div class="bugs-table-section">
      <table class="bugs-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                v-model="selectAll"
                @change="toggleSelectAll"
              />
            </th>
            <th>BUG DETAILS</th>
            <th>STATE</th>
            <th>STATUS</th>
            <th>DUE DATE</th>
            <th>ASSIGNED TO</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bug in paginatedBugs" :key="bug.id">
            <td>
              <input type="checkbox" v-model="selectedBugs" :value="bug.id" />
            </td>
            <td>
              <span :class="['bug-dot', bug.status]"></span>

              <span class="bug-title">{{ bug.title }}</span>
            </td>
            <td>{{ bug.type.charAt(0).toUpperCase() + bug.type.slice(1) }}</td>
            <td>
              <span :class="['status-badge', bug.status]">{{
                bug.statusLabel
              }}</span>
            </td>
            <td>{{ bug.deadline ? formatDate(bug.deadline) : "" }}</td>
            <td>
              <div class="assignees">
                <img
                  v-if="bug.developer"
                  :src="getUserAvatar(bug.developer)"
                  :alt="bug.developer.name"
                  class="avatar"
                />
                <!-- <span v-if="bug.developer" class="assignee-name">{{ bug.developer.name }}</span> -->
              </div>
            </td>
            <td>
              <div class="action-menu">
                <button @click="openStatusMenu(bug)">
                  <v-icon>mdi-dots-vertical</v-icon>
                </button>
                <div v-if="bug.showStatusMenu" class="status-menu">
                  <div
                    v-for="status in getStatusOptions(bug.type)"
                    :key="status"
                    @click="updateBugStatus(bug, status)"
                    :class="['status-option', status]"
                  >
                    {{ status }}
                  </div>
                  <div class="delete-option" @click="deleteBug(bug)">
                    Delete
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination-row">
        <span
          >Showing {{ startEntry }} to {{ endEntry }} of
          {{ totalBugs }} entries</span
        >
        <select v-model.number="perPage" class="per-page-select">
          <option :value="10">10</option>
        </select>
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
    <AddBugModal
      v-if="showAddModal"
      :visible="showAddModal"
      :users="projectDevelopers"
      :project-id="projectId"
      @close="showAddModal = false"
      @bug-added="fetchBugs"
    />
  </div>
</template>

<script>
import axios from "axios";
import AddBugModal from "@/components/AddBugModal.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "Bugs",
  components: { AddBugModal, NavBar },
  props: ["id", "name"],
  data() {
    return {
      bugs: [],
      users: [],
      projectDevelopers: [],
      search: "",
      filterType: "all",
      filterMe: "me",
      filterAssignee: "all",
      page: 1,
      perPage: 10,
      showAddModal: false,
      selectedBugs: [],
      selectAll: false,
      projectId: this.id,
      projectName: this.name,
    };
  },
  computed: {
    filteredBugs() {
      let filtered = this.bugs;
      if (this.search) {
        filtered = filtered.filter((b) =>
          b.title.toLowerCase().includes(this.search.toLowerCase())
        );
      }
      if (this.filterAssignee !== "all") {
        filtered = filtered.filter(
          (b) => b.developer && b.developer.id === this.filterAssignee
        );
      }
      return filtered;
    },
    paginatedBugs() {
      const start = (this.page - 1) * this.perPage;
      return this.filteredBugs.slice(start, start + this.perPage);
    },
    totalBugs() {
      return this.filteredBugs.length;
    },
    totalPages() {
      return Math.ceil(this.totalBugs / this.perPage) || 1;
    },
    startEntry() {
      return (this.page - 1) * this.perPage + 1;
    },
    endEntry() {
      return Math.min(this.page * this.perPage, this.totalBugs);
    },
  },
  methods: {
    async fetchBugs() {
      try {
        const token = localStorage.getItem("token");
        let url = "http://localhost:5000/bugs";
        if (this.projectId) {
          url += `?project_id=${this.projectId}`;
        }
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.bugs = res.data.bugs.map((bug) => ({
          ...bug,
          statusLabel: this.getStatusLabel(bug.status),
          showStatusMenu: false,
        }));
      } catch (err) {
        alert(
          "Failed to fetch bugs: " +
            (err.response?.data?.message || err.message)
        );
      }
    },
    async fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.users = res.data.users;
      } catch (err) {}
    },
    async fetchProjectDevelopers() {
      if (!this.projectId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/projects/${this.projectId}/assignees`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        this.projectDevelopers = res.data.assignees
          .filter((a) => a.role === "developer")
          .map((a) => a.user);
      } catch (err) {
        this.projectDevelopers = [];
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getUserAvatar(user) {
      return require("@/assets/avatar.png");
    },
    openStatusMenu(bug) {
      this.bugs.forEach((b) => (b.showStatusMenu = false));
      bug.showStatusMenu = true;
    },
    getStatusOptions(type) {
      if (type === "feature") return ["new", "started", "completed"];
      if (type === "bug") return ["new", "started", "resolved"];
      return [];
    },
    getStatusLabel(status) {
      if (status === "new") return "Pending";
      if (status === "started") return "In progress";
      if (status === "completed" || status === "resolved") return "Closed";
      return status;
    },
    async updateBugStatus(bug, status) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:5000/bugs/${bug.id}`,
          { status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.fetchBugs();
      } catch (err) {
        alert(
          "Failed to update bug status: " +
            (err.response?.data?.message || err.message)
        );
      }
    },
    async deleteBug(bug) {
      if (!confirm("Are you sure you want to delete this bug?")) return;
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/bugs/${bug.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.fetchBugs();
      } catch (err) {
        alert(
          "Failed to delete bug: " +
            (err.response?.data?.message || err.message)
        );
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
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedBugs = this.paginatedBugs.map((b) => b.id);
      } else {
        this.selectedBugs = [];
      }
    },
  },
  mounted() {
    this.fetchBugs();
    this.fetchUsers();
    this.fetchProjectDevelopers();
  },
  watch: {
    "$route.params.id"(newId) {
      this.projectId = newId;
      this.fetchBugs();
      this.fetchProjectDevelopers();
    },
  },
};
</script>

<style scoped>
.bugs-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
  padding: 0 0 32px 0;
}
.header-section {
  margin: 32px 64px 0 64px;
}
.breadcrumbs {
  color: #b0b0b0;
  font-size: 14px;
  margin-bottom: 8px;
}
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h1 {
  height: 48px;
  opacity: 1;
  font-family: "Inter";
  font-weight: 700;
  font-size: 36px;
  line-height: 48px;
  color: #252c32;
}
.bug-badge {
  background: #f7d6d6;
  color: #e74c3c;
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 14px;
  margin-left: 8px;
}
.header-actions {
  display: flex;
  gap: 12px;
}
.add-btn {
  background: #007dfa;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 16px;
  cursor: pointer;
}
.settings-btn {
  background: #f5f5f7;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 18px;
  cursor: pointer;
}
.filters-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
}
.search-bar {
  width: 284px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  padding: 0 12px;

  top: 262px;
  left: 253px;

  opacity: 1;
  gap: 16px;
}

.filter-select {
  height: 36px;
  border-radius: 6px;
  margin-left: 10px;
  border: 1px solid #e0e0e0;
  padding: 0 12px;
}
.view-toggle {
  display: flex;
  gap: 4px;
}
.icon-btn {
  background: #f5f5f7;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 18px;
  cursor: pointer;
}
.bugs-table-section {
  margin: 0 64px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 24px 0;
}
.bugs-table {
  width: 100%;
  border-collapse: collapse;
}
.bugs-table th,
.bugs-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}
.bug-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.bug-dot.new {
  background-color: #e74c3c;
}

.bug-dot.started {
  background-color: #007dfa;
}

.bug-dot.resolved,
.bug-dot.completed {
  background-color: #50a885;
}

.bug-dot.bug {
  background: #e74c3c;
}
.bug-dot.feature {
  background: #50a885;
}
.bug-title {
  font-weight: 500;
  color: #2f3367;
}
.status-badge {
  border-radius: 8px;
  padding: 2px 10px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
}
.status-badge.Pending {
  background: #f7d6d6;
  color: #e74c3c;
}
.status-badge.In-progress {
  background: #d6e6f7;
  color: #007dfa;
}
.status-badge.Closed {
  background: #d6f7e6;
  color: #50a885;
}
.assignees {
  display: flex;
  gap: 4px;
}

.avatar {
  width: 60px;
  height: 32px;
  border-radius: 50%;
  -o-object-fit: cover;
  object-fit: cover;
  margin-left: 20px;
}
.assignee-name {
  margin-left: 8px;
  font-weight: 500;
  color: #2f3367;
}
.action-menu {
  position: relative;
}
.status-menu {
  position: absolute;
  right: 0;
  top: 32px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px #f0f1f2;
  z-index: 10;
  min-width: 120px;
}
.status-option {
  padding: 8px 16px;
  cursor: pointer;
}
.status-option:hover {
  background: #f5f5f7;
}
.delete-option {
  color: #e74c3c;
  padding: 8px 16px;
  cursor: pointer;
  border-top: 1px solid #f0f0f0;
}
.delete-option:hover {
  background: #f7d6d6;
}
.pagination-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  padding: 32px 48px 0 48px;
  margin-top: auto;
  bottom: 0px;
  font-size: 0.98rem;
  background: #ffffff;
}
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}
.page-btn {
  background: #f5f5f7;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 16px;
  cursor: pointer;
}
.page-btn.active {
  background: #007dfa;
  color: #fff;
}
.per-page-select {
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  padding: 0 8px;
  margin-left: 12px;
}
</style>
