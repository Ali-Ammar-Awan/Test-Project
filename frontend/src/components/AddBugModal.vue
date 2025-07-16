<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-second-header">
        <h2>Add new bug</h2>
        <p><v-icon>mdi-dots-horizontal</v-icon></p>
      </div>

      <form @submit.prevent="submitForm" enctype="multipart/form-data">
        <div class="form-row">
          <div class="form-group">
            <label>Assign to</label>
            <div class="assignee-icons" style="position: relative">
              <div
                @click="showDropdown = !showDropdown"
                class="avatar-dropdown-trigger"
              >
                <img
                  :src="require('@/assets/group.png')"
                  alt="Avatar"
                  class="avatar"
                />
              </div>

              <div v-if="showDropdown" class="dropdown-menu">
                <div
                  v-for="dev in developers"
                  :key="dev.id"
                  class="dropdown-item"
                  @click="selectDeveloper(dev)"
                >
                  {{ dev.name }}
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="due-date">
              <label class="due-date-label">Add due date</label>
            </div>
            <div class="custom-date-wrapper" @click="openDatePicker">
              <img
                :src="require('@/assets/date.png')"
                alt="calendar"
                class="date-icon"
              />
              <input
                ref="dateInput"
                type="date"
                v-model="form.deadline"
                class="hidden-date-input"
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <input
            v-model="form.title"
            type="text"
            placeholder="Add title here"
            required
          />
        </div>

        <div class="form-group">
          <div class="text-area">
            <label> Bug details</label>
            <textarea
              v-model="form.description"
              placeholder="Add Here"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="form-group file-upload">
          <label class="upload-label">
            <input
              type="file"
              @change="onFileChange"
              accept="image/png,image/gif"
              hidden
            />
            <div class="upload-box">
              <img v-if="previewUrl" :src="previewUrl" class="preview-img" />
              <span v-else>
                <img :src="require('@/assets/upload.png')" alt="" />
                Drop any file here or <span class="browse">browse</span>
              </span>
            </div>
          </label>
        </div>

        <div class="modal-actions">
          <button type="submit" class="add-btn">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AddBugModal",
  props: {
    visible: Boolean,
    users: Array,
    projectId: [String, Number],
  },
  data() {
    return {
      form: {
        title: "",
        description: "",
        deadline: "",
        type: "bug",
        status: "new",

        developer_id: "",
        screenshot: null,
      },
      showDropdown: false,
      previewUrl: null,
      loading: false,
      defaultAvatar: "https://www.gravatar.com/avatar?d=mp",
    };
  },
  computed: {
    developers() {
      return this.users.filter((u) => u.user_type === "developer");
    },
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.form.screenshot = file;
      if (file) {
        this.previewUrl = URL.createObjectURL(file);
      }
    },

    openDatePicker() {
      this.$refs.dateInput.click();
    },

    selectDeveloper(dev) {
      this.form.developer_id = dev.id;
      this.showDropdown = false;
    },

    async submitForm() {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append("title", this.form.title);
        formData.append("description", this.form.description);
        formData.append("deadline", this.form.deadline);
        formData.append("type", this.form.type);
        formData.append("status", this.form.status);
        formData.append("developer_id", this.form.developer_id);
        if (this.form.screenshot) {
          formData.append("screenshot", this.form.screenshot);
        }
        if (this.projectId) {
          formData.append("project_id", this.projectId);
        }

        const token = localStorage.getItem("token");
        console.log(token);
        console.log(formData);
        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
        await axios.post("http://localhost:5000/bugs", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        this.$emit("bug-added");
        this.$emit("close");
      } catch (err) {
        alert(
          "Failed to add bug: " + (err.response?.data?.message || err.message)
        );
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Modal Layout */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  width: 786px;
  height: 795px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.modal-header {
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 2px 15px 16px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f5f6f8;
}

.custom-date-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 82px;
  height: 44px;
  margin-top: 20px;
}

.date-icon {
  width: 100%;
  height: auto;
}

.hidden-date-input {
  opacity: 0;
  position: absolute;
  pointer-events: none;
}

.close-btn {
  width: 40px;
  height: 32px;
  margin-top: 15px;
  margin-left: 729px;
  border-radius: 5px;
  opacity: 1;
  gap: 9px;
  padding-top: 5px;
  padding-right: 9px;
  padding-bottom: 3px;
  padding-left: 9px;
  color: white;
  background-color: #000000;
}

.modal-second-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 32px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-second-header h2 {
  width: 430px;
  height: 41px;
  margin-top: 25px;
  margin-left: -10px;
  opacity: 1;
  font-family: "Poppins";
  font-weight: 500;
  font-size: 28px;
  line-height: 100%;
  letter-spacing: 0%;
}

.modal-second-header p {
  width: 7px;
  height: 27px;
  margin-top: 10px;
  margin-left: -10px;
  opacity: 1;
  color: #3a35418a;
}
/* Form Layout */
form {
  padding: 0 32px 24px;
}
.form-row {
  display: flex;
  gap: 20px;
  margin-top: 16px;
}
.form-group {
  display: flex;
  width: auto;
margin-right:60px;
  margin-bottom: 16px;
}
.due-date-label {
  margin-top: 17px; /* or any value you prefer */
  display: inline-block;
}
label {
  width: auto;
  height: 24px;
  margin-top: 17px;
  margin-left: 0px;
  margin-right:15px;
  opacity: 1;
  font-family: "Poppins";
  font-weight: 400;
  font-size: 16.28px;
  line-height: 100%;
  letter-spacing: 0%;
}

.large {
  width: 232px;
  height: 52px;
  top: 282px;
  left: 33px;
  opacity: 1;
}

.form-group img {
  width: 82px;
  height: 44px;
  margin-top: -13px;
  margin-left: 0px;
  opacity: 1;
}
/* Inputs */
input[type="text"],
select,
input[type="date"] {
  border: none;
  border-radius: 10px;
  margin-left: -20px;
  padding: 10px 14px;
  font-size: 15px;
  color: #dfdee0;
  font-weight: 500;
  font-family: "Poppins";
  outline: none;
  height: 44px;
  margin-top: 23px;
}
input[type="text"]::placeholder {
  font-family: "Poppins";
  font-weight: 500;
  font-size: 34.45px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #dfdee0;
}

textarea {
  resize: vertical;
  width: 716px;
  height: 53.56296157836914px;
  border: 1.02px solid #f4f4f5;
  border-radius: 5.09px;
  border-width: 1.02px;
  opacity: 1;
  padding: 14.2px;
  margin-left: -2px;
}

.text-area::placeholder {
  color: #a1a1aa;
}

input[type="text"] {
  width: 260px;
  height: 70px;
  opacity: 1;
}
input::placeholder {
  color: #b0b4c2;

  font: 1.25rem/3 sans-serif;
  width: 232px;
  height: 52px;
  opacity: 1;
  font-family: "Poppins";
  font-weight: 500;
  font-style: Medium;
  font-size: 34.45px;
  line-height: 100%;
  letter-spacing: 0%;
}

/* Assignee Avatars */
.assignee-icons {
  display: flex;
  gap: 8px;
  align-items: center;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s;
}
.avatar:hover {
  transform: scale(1.05);
}
.avatar.selected {
  outline: 2px solid #007dfa;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* File Upload */
.file-upload {
  margin-top: 16px;
}
.upload-box {
  width: 265px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a5b3;
  font-size: 15px;
  text-align: center;
  margin-left: 230px;
  cursor: pointer;
  margin-top: 40px;
}
.upload-box img {
  width: 31px;
  height: 31px;
  opacity: 1;
}
.upload-box:hover {
  background-color: #f0f3f8;
}
.browse {
  color: #007dfa;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}
.preview-img {
  max-width: 120px;
  max-height: 80px;
  border-radius: 10px;
}

/* Submit Button */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
  width: 783px;
  height: 86px;
  transform: rotate(-180deg);
  opacity: 1;
  position: absolute;
  top: 792px;
  left: 528.5px;
  background: #ffffff;
  box-shadow: 0px 7px 28px 0px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
}
.add-btn {
  display: flex;
  position: absolute;
  justify-content: center;
  text-align: center;
  width: 133px;
  height: 40px;
  background: #007dfa;
  left: 17px;
  top: 20px;
  color: #fff;
  transform: rotate(-180deg);
  padding: 10px 26px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.text-area {
  display: flex;
  flex-direction: column;
}

.text-area label {
  width: 95px;
  height: 24px;
  opacity: 1;
  font-family: "Poppins";
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;
  margin-left: -2px;
}
.custom-date-wrapper img {
  width: 36px;
  margin-left: 10px;
  height: 36px;
  margin-top: -35px;
}


</style>
