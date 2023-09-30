<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import NameCard from "@/components/NameCard.vue";
import { useStore } from "vuex";
import { formatDateFromTimestamp, getBlogImageUrl } from "@/util";
import PageTitle from "@/components/PageTitle.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const store = useStore();
const tab = ref("site");

const blogs = computed(() => store.state.blog.blogs);
const categories = computed(() => store.state.category.categories);
const foundUsers = computed(() => store.state.cuser.foundUsers);

const initAbout = computed(() => store.state.page.about);
const initPrivacy = computed(() => store.state.page.privacy);
const initTerms = computed(() => store.state.page.terms);

const newCategoryDialog = ref(false);
const editCategoryDialog = ref(false);
const newBlogDialog = ref(false);
const editBlogDialog = ref(false);

const searchingUser = ref(null);
let updatingAboutText = ref(null);
const updatingTermsText = ref(null);
const updatingPrivacyText = ref(null);

const newCategoryTitle = ref(null);

const addCategoryForm = ref(null);
const isAddCategoryFormValid = ref(true);

const addCategory = async () => {
  await addCategoryForm.value.validate();
  if (!isAddCategoryFormValid.value) return;

  const newCategory = { name: newCategoryTitle.value };
  store
    .dispatch("category/addCategory", newCategory)
    .then((res) => {
      newCategoryDialog.value = false;
    })
    .catch((err) => {});
};

let editingCategory = reactive({ id: null, name: null });

const openEditCategoryDialog = (item) => {
  Object.assign(editingCategory, item);
};

const editCategoryForm = ref(null);
const isEditCategoryFormValid = ref(true);

const editCategory = async (item, index) => {
  // await editCategoryForm?.value?.[index].validate();
  // if (!isEditCategoryFormValid.value) return;
  if (!item.name) {
    isEditCategoryFormValid.value = false;
    return;
  }
  store
    .dispatch("category/editCategory", item)
    .then((res) => {
      editCategoryDialog.value = false;
      editingCategory = { id: null, name: null };
    })
    .catch((err) => {});
};

const newBlog = reactive({ title: null, description: null, image: null });

const handleBlogImageChange = (files) => {
  newBlog.image = files;
};

const addBlogForm = ref(null);
const isAddBlogFormValid = ref(true);

const addBlog = async () => {
  await addBlogForm.value.validate();
  if (!isAddBlogFormValid.value) return;

  const formData = new FormData();
  formData.append("title", newBlog.title);
  formData.append("description", newBlog.description);
  formData.append("file", newBlog.image?.[0]);
  store
    .dispatch("blog/addBlog", formData)
    .then((res) => {
      newBlogDialog.value = false;
    })
    .catch((err) => {});
};

let editingBlog = reactive({
  id: null,
  title: null,
  description: null,
  image: null,
});

const openEditBlogDialog = (item) => {
  Object.assign(editingBlog, item);
};
const handleEditBlogImageChange = (files) => {
  editingBlog.image = files;
};

const editBlogForm = ref(null);
const isEditBlogFormValid = ref(true);

const editBlog = async () => {
  // await editBlogForm.value.validate();
  // if (!isEditBlogFormValid.value) return;

  if (!editingBlog.title || !editingBlog.description) {
    isEditBlogFormValid.value = false;
    return;
  }

  const formData = new FormData();
  formData.append("id", editingBlog.id);
  formData.append("title", editingBlog.title);
  formData.append("description", editingBlog.description);
  formData.append("file", editingBlog.image?.[0]);
  store
    .dispatch("blog/editBlog", formData)
    .then((res) => {
      editBlogDialog.value = false;
    })
    .catch((err) => {});
};

const deleteBlog = (blogId) => {
  store.dispatch("blog/deleteBlog", blogId);
};

const deleteCategory = (categoryId) => {
  store.dispatch("category/deleteCategory", categoryId);
};

const searchUser = () => {
  store.dispatch("cuser/searchUser", searchingUser.value);
};

const deleteUser = (id) => {
  store.dispatch("cuser/deleteUser", id);
};

const updateAbout = () => {
  store.dispatch("page/updateAbout", {
    description: updatingAboutText.value,
  });
};

const updateTerms = () => {
  store.dispatch("page/updateTerms", {
    description: updatingTermsText.value,
  });
};

const updatePrivacy = () => {
  store.dispatch("page/updatePrivacy", {
    description: updatingPrivacyText.value,
  });
};

onMounted(() => {
  store.commit("cuser/removeFoundUsers");
  store.dispatch("category/setCategories");
  store.dispatch("blog/setBlogs");
  store.dispatch("page/setAbout").then((res) => {
    updatingAboutText.value = initAbout.value.description;
  });
  store.dispatch("page/setTerms").then((res) => {
    updatingTermsText.value = initTerms.value.description;
  });
  store.dispatch("page/setPrivacy").then((res) => {
    updatingPrivacyText.value = initPrivacy.value.description;
  });
});
</script>

<template>
  <page-title title="Admin Panel"></page-title>

  <v-row justify="center">
    <v-col cols="12" md="6">
      <v-tabs v-model="tab" bg-color="primary" density="comfortable">
        <v-tab value="site">Site</v-tab>
        <v-tab value="blog">Blog</v-tab>
        <v-tab value="pages">Pages</v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="site">
          <div class="d-flex justify-space-between align-center mt-5">
            <h3>Manage Category</h3>

            <v-dialog v-model="newCategoryDialog" width="400">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="mobile"
                  color="primary"
                  density="compact"
                  icon="mdi-plus-circle-outline"
                  v-bind="props"
                  variant="text"
                >
                </v-btn>
                <v-btn v-else color="primary" v-bind="props" variant="text">
                  New Category
                </v-btn>
              </template>

              <v-card>
                <v-card-title>
                  <span>Create Category</span>
                </v-card-title>
                <v-card-text>
                  <v-form
                    ref="addCategoryForm"
                    v-model="isAddCategoryFormValid"
                    fast-fail
                    @submit.prevent="addCategory"
                  >
                    <v-text-field
                      v-model="newCategoryTitle"
                      :rules="[(v) => !!v || 'Title is required!']"
                      class="mt-2"
                      clearable
                      density="compact"
                      hide-details="auto"
                      label="Category Title"
                      required
                      variant="solo"
                    ></v-text-field>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        :density="mobile ? 'comfortable' : 'default'"
                        color="primary"
                        type="submit"
                        >Submit
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
          <v-divider class="my-1"></v-divider>

          <v-list>
            <v-list-item
              v-for="(item, index) in categories"
              :key="index"
              :title="item.name"
            >
              <template v-slot:append>
                <v-dialog v-model="editCategoryDialog" width="400">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="primary"
                      icon="mdi-pencil"
                      size="small"
                      v-bind="props"
                      variant="text"
                      @click="openEditCategoryDialog(item)"
                    >
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title>
                      <span>Edit Category</span>
                    </v-card-title>
                    <v-card-text>
                      <v-form
                        ref="editCategoryForm"
                        v-model="isEditCategoryFormValid"
                        fast-fail
                        @submit.prevent="editCategory(editingCategory, index)"
                      >
                        <v-text-field
                          v-model="editingCategory.name"
                          :rules="[(v) => !!v || 'Title is required!']"
                          class="mt-2"
                          clearable
                          density="compact"
                          hide-details="auto"
                          label="Category Title"
                          required
                          variant="solo"
                        ></v-text-field>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            :density="mobile ? 'comfortable' : 'default'"
                            color="primary"
                            type="submit"
                            >Submit
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-dialog>

                <v-btn
                  color="primary"
                  icon="mdi-close"
                  size="small"
                  variant="text"
                  @click="deleteCategory(item.id)"
                >
                </v-btn>
              </template>
            </v-list-item>
          </v-list>

          <div class="d-flex justify-space-between align-center mt-5">
            <h3>Manage User</h3>
            <v-spacer v-if="!mobile"></v-spacer>
            <v-text-field
              v-model="searchingUser"
              append-inner-icon="mdi-magnify"
              class="flex-grow-1 ml-5 ml-md-0 pa-0"
              density="compact"
              hide-details="auto"
              label="Search by ID/Name/Email"
              single-line
              variant="solo"
              @click:append-inner="searchUser"
            ></v-text-field>
          </div>
          <v-divider class="my-2"></v-divider>

          <v-list v-if="foundUsers.length > 0">
            <v-list-item
              v-for="(item, index) in foundUsers"
              :key="index"
              link
              @click="$router.push({ name: 'wall', params: { id: item.id } })"
            >
              <div class="d-flex justify-space-between align-center">
                <name-card
                  :img-size="60"
                  :profile="item"
                  container-class="clickable"
                  img-class="rounded-circle"
                ></name-card>
                <v-btn
                  :density="mobile ? 'comfortable' : 'default'"
                  color="primary"
                  size="small"
                  variant="flat"
                  @click.stop="deleteUser(item.id)"
                  >Remove
                </v-btn>
              </div>
            </v-list-item>
          </v-list>
          <h4 v-else class="py-5 text-center">No users in search list!</h4>
        </v-window-item>

        <v-window-item value="blog">
          <div class="d-flex justify-space-between align-center mt-5">
            <h3>Manage Blog</h3>
            <v-dialog v-model="newBlogDialog" width="800">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-if="mobile"
                  color="primary"
                  density="compact"
                  icon="mdi-plus-circle-outline"
                  v-bind="props"
                  variant="text"
                >
                </v-btn>
                <v-btn v-else color="primary" v-bind="props" variant="text">
                  New Blog
                </v-btn>
              </template>

              <v-card>
                <v-card-title>
                  <span>Create Blog</span>
                </v-card-title>
                <v-card-text>
                  <v-form
                    ref="addBlogForm"
                    v-model="isAddBlogFormValid"
                    fast-fail
                    @submit.prevent="addBlog"
                  >
                    <v-text-field
                      v-model="newBlog.title"
                      :rules="[(v) => !!v || 'Title is required!']"
                      class="mt-2"
                      clearable
                      density="compact"
                      hide-details="auto"
                      label="Blog Title"
                      required
                      variant="solo"
                    ></v-text-field>

                    <v-textarea
                      v-model="newBlog.description"
                      :rules="[(v) => !!v || 'Description is required!']"
                      class="mt-2"
                      clearable
                      hide-details="auto"
                      label="Description"
                      variant="solo"
                    ></v-textarea>

                    <v-file-input
                      v-model="newBlog.image"
                      accept="image/*"
                      class="mt-2"
                      clearable
                      density="compact"
                      label="Upload Image"
                      prepend-icon=""
                      prepend-inner-icon="mdi-camera"
                      variant="solo"
                      @update:modelValue="handleBlogImageChange"
                    >
                      <template v-slot:selection="{ fileNames }">
                        <template v-for="fileName in fileNames" :key="fileName">
                          <v-chip
                            class="me-2"
                            color="primary"
                            label
                            size="small"
                          >
                            {{ fileName }}
                          </v-chip>
                        </template>
                      </template>
                    </v-file-input>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        :density="mobile ? 'comfortable' : 'default'"
                        color="primary"
                        type="submit"
                        >Submit
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </v-card-text>
              </v-card>
            </v-dialog>
          </div>
          <v-divider class="my-1"></v-divider>

          <v-list v-if="blogs.length > 0">
            <v-list-item
              v-for="(item, index) in blogs"
              :key="index"
              :subtitle="formatDateFromTimestamp(item.created_at)"
              :title="item.title"
              class="pb-3"
            >
              <template v-slot:append>
                <v-dialog v-model="editBlogDialog" width="800">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="primary"
                      icon="mdi-pencil"
                      size="small"
                      v-bind="props"
                      variant="text"
                      @click="openEditBlogDialog(item)"
                    >
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title>
                      <span>Edit Blog</span>
                    </v-card-title>
                    <v-card-text>
                      <v-form
                        ref="editBlogForm"
                        v-model="isEditBlogFormValid"
                        fast-fail
                        @submit.prevent="editBlog"
                      >
                        <v-text-field
                          v-model="editingBlog.title"
                          :rules="[(v) => !!v || 'Title is required!']"
                          class="mt-2"
                          clearable
                          density="compact"
                          hide-details="auto"
                          label="Blog Title"
                          required
                          variant="solo"
                        ></v-text-field>

                        <v-textarea
                          v-model="editingBlog.description"
                          :rules="[(v) => !!v || 'Description is required!']"
                          class="mt-2"
                          clearable
                          hide-details="auto"
                          label="Description"
                          variant="solo"
                        ></v-textarea>

                        <div class="d-flex align-center mt-3">
                          <v-avatar
                            :image="getBlogImageUrl(editingBlog?.image)"
                            rounded="0"
                            size="x-large"
                          ></v-avatar>
                          <v-file-input
                            v-model="editingBlog.file"
                            accept="image/*"
                            class="ml-2"
                            clearable
                            density="compact"
                            hide-details="auto"
                            label="Upload image"
                            prepend-icon=""
                            prepend-inner-icon="mdi-camera"
                            show-size
                            variant="solo"
                            @update:modelValue="handleEditBlogImageChange"
                          ></v-file-input>
                        </div>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            :density="mobile ? 'comfortable' : 'default'"
                            color="primary"
                            type="submit"
                            >Submit
                          </v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-dialog>

                <v-btn
                  color="primary"
                  icon="mdi-close"
                  size="small"
                  variant="text"
                  @click="deleteBlog(item.id)"
                >
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
          <h4 v-else class="text-center py-5">No blogs listed!</h4>
        </v-window-item>

        <v-window-item value="pages">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>About Us</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-textarea
                  v-model="updatingAboutText"
                  label="Edit About Us"
                  variant="solo"
                ></v-textarea>
                <div class="d-flex justify-end mb-1">
                  <v-btn
                    :density="mobile ? 'comfortable' : 'default'"
                    color="primary"
                    variant="text"
                    @click="updateAbout"
                    >Update
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title
                >Terms & Conditions
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-textarea
                  v-model="updatingTermsText"
                  label="Edit Terms & Conditions"
                  variant="solo"
                ></v-textarea>
                <div class="d-flex justify-end mb-1">
                  <v-btn
                    :density="mobile ? 'comfortable' : 'default'"
                    color="primary"
                    variant="text"
                    @click="updateTerms"
                    >Update
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>Privacy Policy</v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-textarea
                  v-model="updatingPrivacyText"
                  clearable
                  label="Edit Privacy Policy"
                  variant="solo"
                ></v-textarea>
                <div class="d-flex justify-end mb-1">
                  <v-btn
                    :density="mobile ? 'comfortable' : 'default'"
                    color="primary"
                    variant="text"
                    @click="updatePrivacy"
                    >Update
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-window-item>
      </v-window>
    </v-col>
  </v-row>
</template>

<style scoped></style>
