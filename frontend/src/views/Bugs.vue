<template>
  <div class="bugs-page">
    <NavBar />
    <div class="line"></div>
    <div class="header-section">
      <div class="breadcrumbs">
        <span class="span1">Projects</span> &gt; <span>{{ projectName }}</span>
      </div>
      <div class="title-row">
        <h1>All bugs listing <span class="bug-badge">Bugs</span></h1>
        <div class="header-actions">
          <div class="rightHeader">
            <button class="settings-btn">
              <img src="../assets/setting.png" alt="" />
            </button>
            <button class="settings-btn">
              <v-icon>mdi-dots-horizontal</v-icon>
            </button>

            <button class="add-btn" @click="showAddModal = true">
              + New Task bug
            </button>
          </div>
        </div>
      </div>
      <div class="line2"></div>
      <div class="filters-row">
        <div class="filter1">
          <div class="input-group">
            <img src="../assets/search.png" alt="search logo" />
            <input class="search-bar" placeholder="Search" />
          </div>
        </div>
        <div class="filter2">
          <select v-model="filterType" class="filter-select">
            <option value="all">Subtasks</option>
          </select>
          <img class="fimg" src="../assets//vector.png" alt="" />
          <select v-model="filterMe" class="filter-select">
            <option value="me">Me</option>
          </select>
          <img class="fimg" src="../assets//vector.png" alt="" />
          <select v-model="filterAssignee" class="filter-select">
            <option value="all">Assignees</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
          <img class="fimg" src="../assets//vector.png" alt="" />
        </div>
        <div class="filter3">
          <div class="view-toggle">
            <button class="icon-btn fst-icon">
              <img src="../assets/img1.png" alt="" />
            </button>
            <button class="icon-btn">
              <img src="../assets//img2.png" alt="" />
            </button>
            <button class="icon-btn scd-icon">
              <img src="../assets//img3.png" alt="" />
            </button>
            <button class="icon-btn">
              <img src="../assets//img4.png" alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="line3"></div>
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
              <input
                type="checkbox"
                class="checkbox1"
                v-model="selectedBugs"
                :value="bug.id"
              />
            </td>
            <td>
              <span
                :class="[
                  'bug-dot',
                  bug.status && bug.status.toLowerCase().replace(/ /g, ''),
                ]"
                style="margin-left: 30px"
              ></span>

              <span
                class="bug-title"
                :title="bug.title"
                style="
                  display: inline-block;
                  max-width: 327px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  vertical-align: middle;
                "
              >
                {{ bug.title }}
              </span>
            </td>
            <td>{{ bug.type.charAt(0).toUpperCase() + bug.type.slice(1) }}</td>
            <td>
              <span
                :class="[
                  'status-badge',
                  bug.status === 'new'
                    ? 'status-badge-pending'
                    : bug.status === 'started'
                    ? 'status-badge-inprogress'
                    : bug.status === 'completed' || bug.status === 'resolved'
                    ? 'status-badge-closed'
                    : '',
                ]"
              >
                {{ bug.statusLabel }}
              </span>
            </td>
            <td>
              <img
                src="../assets/date.png"
                alt=""
                style="width: 21px; height: 21px"
              />
            </td>
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
                  <div class="status-menu-header">
                    <span class="status-menu-title">Change Status</span>
                    <img
                      src="../assets/setting.png"
                      class="status-menu-gear"
                      alt="settings"
                    />
                  </div>
                  <div
                    v-for="status in getStatusOptions(bug.type)"
                    :key="status"
                    @click="updateBugStatus(bug, status)"
                    :class="[
                      'status-option',
                      status === 'new'
                        ? 'status-option-pending'
                        : status === 'started'
                        ? 'status-option-inprogress'
                        : status === 'completed' || status === 'resolved'
                        ? 'status-option-closed'
                        : '',
                    ]"
                  >
                    {{ getStatusLabel(status) }}
                  </div>
                  <div class="delete-option" @click="deleteBug(bug)">
                    <span class="delete-label">Delete</span>
                    <img
                      src="../assets/trash.png"
                      class="delete-icon"
                      alt="delete"
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination-row-custom">
        <div class="pagination-info">
          Showing {{ startEntry }} to {{ endEntry }} of {{ totalBugs }} entries
        </div>
        <div class="pagination-spacer"></div>
        <div class="pagination-controls-custom">
          <span class="rows-label">Rows per page:</span>
          <select v-model.number="perPage" class="per-page-select-custom">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          
          <span class="chevron">&#9662;</span>
          <span class="page-range">{{ startEntry }}-{{ endEntry }} of {{ totalPages }}</span>
          <button class="chevron-btn" @click="prevPage" :disabled="page === 1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6L9 12L15 18" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="chevron-btn" @click="nextPage" :disabled="page === totalPages">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L15 12L9 18" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
  margin-left: 180px;
}
.breadcrumbs span {
  font-family: "Inter";
  font-weight: 400px;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0%;
  color: black;
  margin-left: 4px;
}

.breadcrumbs .span1 {
  margin-right: 4px;
  color: #b0b0b0;
}
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h1 {
  width: auto;
  height: 48px;
  opacity: 1;
  font-family: "Inter";
  font-weight: 700;
  font-size: 36px;
  line-height: 48px;
  color: #252c32;
  margin-left: 181px;
}
.bug-badge {
  background: #fdf2f2;
  color: #ec5962;
  font-family: "Inter";
  font-weight: 500;

  font-size: 13px;

  line-height: 25.45px;
  letter-spacing: 0%;

  margin-left: 8px;
}
.input-group input {
  width: 284px;
  height: 40px;
  padding-left: 48px;
  border: 2px solid #f1f1f1;
  font-family: "Poppins";
  margin-left: 180px;
  font-size: 18px;
  font-weight: 400;
}
.search-bar {
  margin-top: -3px;
  margin-left: 26px;
  opacity: 1;
  border-radius: 5px;
}

.search-bar::placeholder {
  color: #9aa6ac;
  font-family: "Poppins";
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: -0.6%;
}

.filter2 {
  margin-left: 80px;
}

.input-group img {
  width: 15px;
  height: 14px;
  position: absolute;

  top: 31.2%;;
  left: 259px;
  transform: translateY(-50%);
  opacity: 1;
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
  font-family: "Inter";
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: -0.6%;
}
.settings-btn {
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 18px;
  cursor: pointer;
}
.filters-row {
  display: flex;

  align-items: center;
  gap: 16px;
  margin-top: 24px;
}
.search-bar {
  top: 262px;
  left: 253px;

  opacity: 1;
  gap: 16px;

  width: 236px;
  height: 40px;
  opacity: 1;
  border-width: 1px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #dde2e4;
}

.filter-select {
  height: 36px;
  border-radius: 6px;
  margin-left: 10px;
  padding: 0 12px;
  margin-right: 1px;
  font-family: "Poppins";
  font-weight: 400;
  color: #252c32;
  font-size: 14px;

  line-height: 24px;
  letter-spacing: -0.6%;
  text-align: center;
}
.fimg {
  margin-right: 41px;
  margin-bottom: 1.6px;
}

.view-toggle {
  display: flex;
  gap: 4px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  margin-left: 2px;
}

.fst-icon {
  margin-left: 231px;
}
.scd-icon {
  margin-right: -7px;
}
.icon-btn img {
  width: 16px;
  height: 16px;
  opacity: 1;
}
/* --- TABLE RESTYLE --- */
.bugs-table-section {
  margin: 0 64px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 0;
  width: 1244px;
  min-height: 56px;
  opacity: 1;
  margin-left: 221px;
  margin-top: 16px;
}
.bugs-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  font-family: "Poppins", "Inter", sans-serif;
  font-size: 15px;
  color: #23272e;
}
.bugs-table thead tr {
  background: #fafbfc;
  border-bottom: 1.5px solid #ececee;
}
.bugs-table th {
  font-family: "Poppins", "Inter", sans-serif;
  font-weight: 600;
  font-size: 12.36px;
  text-transform: uppercase;
  color: #23272e;
  letter-spacing: 0.5px;
  padding: 18px 0 18px 0;
  text-align: left;
  margin-left: 20px;
  border-bottom: 1.5px solid #ececee;
  background: #fafbfc;

  font-family: Poppins;
  font-weight: 600;
  font-style: SemiBold;
  font-size: 12.36px;
  line-height: 24.72px;
  letter-spacing: 0.18px;
  text-transform: uppercase;
}
.bugs-table th:first-child {
  width: 48px;
  padding-left: 24px;
}
.bugs-table th:last-child {
  text-align: right;
  padding-right: 24px;
}
.bugs-table td {
  font-family: "Poppins", "Inter", sans-serif;
  font-size: 15px;
  color: #23272e;
  padding: 18px 0 18px 0;
  border-bottom: 1.5px solid #ececee;
  background: #fff;
  vertical-align: middle;
}
.bugs-table td:first-child {
  width: 48px;
  padding-left: 24px;
}
.bugs-table td:last-child {
  text-align: right;
  padding-right: 24px;
}
.bugs-table input[type="checkbox"] {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1.5px solid #cfd8dc;
  background: #fff;
  accent-color: #007dfa;
  margin: 0;
  cursor: pointer;
}
.bug-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
}
.bug-dot.new,
.bug-dot.Pending {
  background-color: #e74c3c;
}
.bug-dot.started,
.bug-dot.inprogress {
  background-color: #007dfa;
}
.bug-dot.resolved,
.bug-dot.completed,
.bug-dot.closed {
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
  color: #23272e;
  display: inline-block;
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-size: 15px;
}
.status-badge {
  border-radius: 8px;
  padding: 4px 16px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  min-width: 90px;
  text-align: center;
  letter-spacing: 0.2px;
}
.status-badge-pending {
  background: #fdf2f2;
  color: #e74c3c;
}
.status-badge-inprogress {
  background: #eef3ff;
  color: #007dfa;
}
.status-badge-closed {
  background: #00b89414;
  color: #50a885;
}
.bugs-table td .assignees {
  display: flex;
  align-items: center;
  gap: 0;
}
.avatar {
  width: 56px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 0;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(60, 60, 60, 0.07);
}
.action-menu {
  position: relative;
  display: flex;
  justify-content: flex-end;
}
.action-menu button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 8px;
  font-size: 20px;
  color: #23272e;
}
.status-menu {
  position: absolute;
  right: 0;
  top: 32px;
  background: #fff;
  border: 1px solid #ececee;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(60, 60, 60, 0.08);
  z-index: 10;
  min-width: 150px;
  max-height: 150px;
  padding: 8px 0;
  font-family: "Poppins", "Inter", sans-serif;
}
.status-option {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 9px;
  padding: 10px 24px;
  cursor: pointer;
  
  line-height: 18.33px;
  letter-spacing: 0%;
  color: #23272e;
  transition: background 0.15s;
  border-radius: 6px;
  margin: 2px 8px;
}
.status-option-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
}
.status-option-pending {
  width: 48px;
  height: 18px;
  color: #e74c3c;

  background-color: #fdf2f2;
}
.status-option-inprogress {
   width: 64px;
  height: 18px;
  background-color: #eef3ff;
  color: #007dfa;
}
.status-option-closed {
   width: 48px;
  height: 18px;
  background-color: #00b89414;
  color: #50a885;
}
.status-option:hover {
  background: #f5f5f7;
}
.delete-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #e74c3c;
  padding: 10px 24px;
  cursor: pointer;
  border-top: 1px solid #ececee;
  font-size: 15px;
  margin-top: 4px;
}
.delete-label {
  color: #e74c3c;
  font-family: "Ubuntu";
font-weight: 500;
font-size: 8.94px;

line-height: 15.33px;
letter-spacing: 0%;
vertical-align: middle;

}
.delete-icon {
  width: 18px;
  height: 18px;
  margin-left: 8px;
  opacity: 0.8;
}
.pagination-row {
  display: none;
}
.pagination-row-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: #fff;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-size: 15px;
  color: #6b7280;
  padding: 0 0 0 0;
  margin: 0;
  min-height: 40px;
  border-top: 1px solid #ececee;
  position: relative;
  box-sizing: border-box;
  position: fixed;
      top: 860px;
    left: 132px;
}
.pagination-info {
  margin-left: 90px;
  font-size: 15px;
  color: #6b7280;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-weight: 400;
}
.pagination-spacer {
  flex: 1;
}
.pagination-controls-custom {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 90px;
  
  transform: translateX(-400px); /* move it 50px to the left */

}
.rows-label {
  font-size: 15px;
  color: #6b7280;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-weight: 400;
  margin-right: 4px;
}
.per-page-select-custom {
  border: none;
  background: transparent;
  font-size: 15px;
  color: #6b7280;
  font-family: 'Inter', 'Poppins', sans-serif;
  font-weight: 400;
  outline: none;
  appearance: none;
  padding-right: 16px;
  cursor: pointer;
}
.chevron {
  margin-left: -18px;
  margin-right: 12px;
  font-size: 12px;
  color: #6b7280;
  pointer-events: none;
}
.page-range {
  font-size: 15px;
  color: #6b7280;
  margin-right: 12px;
  font-family: 'Inter', 'Poppins', sans-serif;
}
.chevron-btn {
  background: none;
  border: none;
  padding: 0 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  opacity: 1;
  transition: opacity 0.2s;
}
.chevron-btn:disabled {
  opacity: 0.3;
  cursor: default;
}
.line,
.line2 {
  width: 1245px;
  height: 0px;
  margin-top: 45px;
  margin-left: 221px;
  opacity: 1;
  border-width: 1px;
  border: 1px solid #ececee;
}
.line2 {
  margin-left: 156px;
  margin-top: 15px;
}
.line3 {
  width: 1245px;
  height: 0px;
  margin-top: 17px;
  margin-left: 221px;
  opacity: 1;
  border-width: 1px;
  border: 1px solid #ececee;
}
.rightHeader {
  display: flex;
  gap: 12px;
  transform: translateX(-350px);
}

/* --- Action menu restyle --- */
.status-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 4px 16px;
  font-family: "Poppins", "Inter", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #23272e;
  border-bottom: none;
}
.status-menu-title {
  font-family: "ubuntu";
  color: #000000;
  font-weight: 500;
  font-size: 8.94px;
  line-height: 15.33px;
  letter-spacing: 0%;
  vertical-align: middle;
}
.status-menu-gear {
  width: 15.32773208618164px;
  height: 15.32773208618164px;

  opacity: 1;
}
.status-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 7px;
  cursor: pointer;
  font-size: 9px;
  font-family: "Inter";
  font-weight: 500;
  color: #23272e;
  transition: background 0.15s;
  border-radius: 6px;
  margin: 2px 8px;
}
.status-option-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 2px;
}
.delete-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #e74c3c;
  padding: 10px 18px;
  cursor: pointer;
  border-top: 1px solid #ececee;
  font-size: 15px;
  margin-top: 4px;
}
.delete-label {
  color: #e74c3c;
  font-family: "Ubuntu";
font-weight: 500;
font-size: 8.94px;
line-height: 15.33px;
letter-spacing: 0%;
vertical-align: middle;

}
.delete-icon {
  width: 13px;
  height: 13px;
  margin-left: 8px;
  opacity: 0.8;
}
th:nth-child(2) {
 padding-left: 25px;
}



</style>
