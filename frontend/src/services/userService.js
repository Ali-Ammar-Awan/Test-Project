import api from '../axios';

export default {
  async getUsers() {
    const res = await api.get('/users');
    return res.data.users;
  },
};