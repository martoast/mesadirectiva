<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
        <p class="text-gray-600 mt-1">Manage event categories</p>
      </div>
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
      >
        + Create Category
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading categories...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-all"
      >
        <div class="flex items-start justify-between mb-4">
          <div
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: category.color }"
          ></div>
          <span class="text-sm text-gray-500">{{ category.events_count || 0 }} events</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ category.name }}</h3>
        <p class="text-gray-600 text-sm mb-4">{{ category.description || 'No description' }}</p>
        <div class="flex gap-2">
          <button
            @click="openEditModal(category)"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Edit
          </button>
          <button
            @click="handleDelete(category)"
            class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="categories.length === 0" class="col-span-full text-center py-12">
        <p class="text-gray-600 text-lg">No categories yet.</p>
        <button
          @click="openCreateModal"
          class="text-primary-600 hover:text-primary-700 font-semibold mt-2"
        >
          Create your first category
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="modalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          {{ editingCategory ? 'Edit Category' : 'Create Category' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Category name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Category description"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div class="flex gap-2">
              <input
                v-model="form.color"
                type="color"
                class="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                v-model="form.color"
                type="text"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div v-if="formError" class="text-red-600 text-sm">{{ formError }}</div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
            >
              {{ submitting ? 'Saving...' : (editingCategory ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UiConfirmModal
      :is-open="deleteModalOpen"
      title="Delete Category"
      :message="`Are you sure you want to delete '${categoryToDelete?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="deleteModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'super-admin']
})

const { getCategories, createCategory, updateCategory, deleteCategory } = useCategories()

const categories = ref([])
const loading = ref(true)
const error = ref('')
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const editingCategory = ref(null)
const categoryToDelete = ref(null)
const submitting = ref(false)
const formError = ref('')

const form = ref({
  name: '',
  description: '',
  color: '#3b82f6'
})

const fetchCategories = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getCategories()
    categories.value = response.categories || []
  } catch (e) {
    error.value = e.message || 'Failed to load categories'
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingCategory.value = null
  form.value = { name: '', description: '', color: '#3b82f6' }
  formError.value = ''
  modalOpen.value = true
}

const openEditModal = (category) => {
  editingCategory.value = category
  form.value = {
    name: category.name,
    description: category.description || '',
    color: category.color || '#3b82f6'
  }
  formError.value = ''
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  editingCategory.value = null
}

const handleSubmit = async () => {
  submitting.value = true
  formError.value = ''

  try {
    if (editingCategory.value) {
      await updateCategory(editingCategory.value.id, form.value)
    } else {
      await createCategory(form.value)
    }
    closeModal()
    fetchCategories()
  } catch (e) {
    formError.value = e.message || 'Failed to save category'
  } finally {
    submitting.value = false
  }
}

const handleDelete = (category) => {
  categoryToDelete.value = category
  deleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (categoryToDelete.value) {
    try {
      await deleteCategory(categoryToDelete.value.id)
      fetchCategories()
    } catch (e) {
      error.value = e.message || 'Failed to delete category'
    }
    deleteModalOpen.value = false
    categoryToDelete.value = null
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
