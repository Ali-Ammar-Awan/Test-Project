// src/services/projectService.js
import api from '../axios';

export default {
  async getAssignees(projectId) {
    const res = await api.get(`/projects/${projectId}/assignees`);
    return res.data.data;
  },

  async getProjectsWithStats(iconSet, iconBgSet) {
    const res = await api.get('/projects');
    const projects = res.data.projects;

    const enriched = await Promise.all(
      projects.map(async (p, i) => {
        try {
          const bugRes = await api.get(`/bugs?project_id=${p.id}`);
          const bugs = bugRes.data.bugs || [];
          const totalBugs = bugs.length;
          const resolvedBugs = bugs.filter(
            (bug) => bug.status === 'resolved' || bug.status === 'completed'
          ).length;

          return {
            ...p,
            icon: iconSet[i % iconSet.length],
            iconBg: iconBgSet[i % iconBgSet.length],
            totalBugs,
            resolvedBugs,
            imageUrl: p.image ? `http://localhost:5000/uploads/${p.image}` : null,
          };
        } catch (err) {
          return {
            ...p,
            icon: iconSet[i % iconSet.length],
            iconBg: iconBgSet[i % iconBgSet.length],
            totalBugs: 0,
            resolvedBugs: 0,
            imageUrl: p.image ? `http://localhost:5000/uploads/${p.image}` : null,
          };
        }
      })
    );

    return enriched;
  },

  async createProject(form) {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("details", form.details);
    if (form.image) {
      formData.append("image", form.image);
    }

    const response = await api.post("/projects", formData);
    return response.data;
  },
};
