
import api from '../axios';

export default {
  async getBugs(projectId) {
    let url = '/bugs';
    if (projectId) url += `?project_id=${projectId}`;
    const res = await api.get(url);
    return res.data.bugs;
  },

  async updateBugStatus(id, status) {
    return api.put(`/bugs/${id}`, { status });
  },

  async deleteBug(id) {
    return api.delete(`/bugs/${id}`);
  },
    async createBug(form, projectId) {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("deadline", form.deadline);
    formData.append("type", form.type || "bug");
    formData.append("status", form.status || "new");
    formData.append("developer_id", form.developer_id || "");

    if (form.screenshot) {
      formData.append("screenshot", form.screenshot);
    }

    if (projectId) {
      formData.append("project_id", projectId);
    }

    const response = await api.post("/bugs", formData);
    return response.data;
  },
};
