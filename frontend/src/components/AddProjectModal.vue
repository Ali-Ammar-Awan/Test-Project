<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h2>Add new Project</h2>
      <form @submit.prevent="submitForm" enctype="multipart/form-data">
        <div class="flex-name">
          <div class="input-group">
            <div class="form-group">
              <div class="flex-class">
                <label>Project name</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Enter project name"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <div class="flex-class">
                <label>Short details</label>
                <input
                  v-model="form.details"
                  type="text"
                  placeholder="Enter details here"
                  required
                />
              </div>
            </div>
          </div>
          <div class="form-group image-upload">
            <label class="upload-label">
              <input
                type="file"
                @change="onFileChange"
                accept="image/*"
                hidden
              />
              <div class="upload-box">
                <img v-if="previewUrl" :src="previewUrl" class="preview-img" />
                <span v-else>Upload project photo</span>
              </div>
            </label>
          </div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="add-btn"><span>Add</span></button>
          <button type="button" class="cancel-btn" @click="$emit('close')">
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AddProjectModal",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        name: "",
        details: "",
        image: null,
      },
      previewUrl: null,
      loading: false,
    };
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.form.image = file;
      if (file) {
        this.previewUrl = URL.createObjectURL(file);
      }
    },
    async submitForm() {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('name', this.form.name);
        formData.append('details', this.form.details);
        if (this.form.image) {
          formData.append('image', this.form.image);
        }

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        await axios.post('http://localhost:5000/projects', formData, {
          headers: { 
            'Authorization': `Bearer ${token}`,
          }
        });

        this.form = {
          name: "",
          details: "",
          image: null,
        };
        this.previewUrl = null;
        
        this.$emit('project-added');
        this.$emit('close');
      } catch (err) {
        console.error('Error creating project:', err);
        alert('Failed to add project: ' + (err.response?.data?.message || err.message));
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.flex-name {
  display: flex;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  margin-top: 341px;
  margin-left: 50px;
  padding: 32px 40px;
  width: 823px;
  height: 465px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
h2 {
  width: 200px;
  height: 31px;
  top: 33px;
  left: 33px;
  opacity: 1;
  font-family: "Poppins";
  font-weight: 500;
  font-style: Medium;
  font-size: 21px;
  line-height: 100%;
  letter-spacing: 0%;
  margin-bottom: 72px;
}
.form-group {
  margin-bottom: 18px;
  width: 100%;
}

.flex-class {
  display: flex;
  flex-direction: column;
}
.form-group label {
  width: 109px;
  height: 24px;
  font-family: "Poppins";
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;

  opacity: 1;
}
input[type="text"] {
  width: 446px;
  height: 54px;
  border-radius: 5px;
  opacity: 1;
  padding: 16px;
  border: 1.02px solid #f4f4f5;
}

.image-upload {
  display: flex;
  text-align: center;
  margin-left: 10px;
}
.upload-box {
  width: 191px;
  height: 188px;
  opacity: 1;

  border: 2px dashed #bfc9d9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafbfc;
}
.upload-box span {
  width: 138px;
  height: 48px;
  opacity: 1;
  font-family: "Manrope";
  font-weight: 500;
  font-size: 18px;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  color: #4c535f;
}
.preview-img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}
.modal-actions {
  display: flex;
  gap: 16px;
  margin-top: 18px;
}
button span{
width: 36px;
height: 22px;
opacity: 1;

 font-family: "Inter";
font-weight: 400;
font-size: 18px;
line-height: 100%;
letter-spacing: 0%;


}
.add-btn {
  background: #007dfa;
  border: none;
  padding: 10px 28px;
  color: #fff;
  width: 203px;
  height: 56px;
  border-radius: 5px;

  opacity: 1;
  gap: 8.14px;
  padding: 16.28px;
}
.cancel-btn {
 




width: 203px;
height: 56px;
text-align: center;
border-radius: 5px;
opacity: 1;
border-width: 1.02px;
border: 1.02px solid #D4D4D8

}


</style>
