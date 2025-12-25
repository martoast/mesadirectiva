<template>
  <div class="categories-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Categories</h1>
        <p class="page-subtitle">Organize events into categories</p>
      </div>
      <button @click="openCreateModal" class="create-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        Create Category
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loading-spinner"></div>
      <p class="state-text">Loading categories...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container error">
      <svg class="state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="state-text">{{ error }}</p>
      <button @click="fetchCategories" class="retry-btn">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="categories.length === 0" class="state-container">
      <svg class="state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <p class="state-text">No categories yet</p>
      <p class="state-hint">Create your first category to organize events</p>
      <button @click="openCreateModal" class="create-first-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        Create Category
      </button>
    </div>

    <!-- Categories Grid -->
    <div v-else class="categories-grid">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-card"
      >
        <div class="card-header">
          <div class="color-indicator" :style="{ '--cat-color': category.color }"></div>
          <div class="event-count">
            <span class="count-value">{{ category.events_count || 0 }}</span>
            <span class="count-label">events</span>
          </div>
        </div>

        <h3 class="category-name">{{ category.name }}</h3>
        <p class="category-description">{{ category.description || 'No description provided' }}</p>

        <div class="card-actions">
          <button @click="openEditModal(category)" class="action-btn edit">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button @click="handleDelete(category)" class="action-btn delete">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div v-if="modalOpen" class="category-modal-overlay" @click.self="closeModal">
        <div class="category-modal">
          <div class="category-modal-header">
            <h2 class="category-modal-title">
              {{ editingCategory ? 'Edit Category' : 'Create Category' }}
            </h2>
            <button @click="closeModal" class="category-modal-close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="category-modal-form">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="form-input"
                placeholder="e.g. Conferences, Workshops"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea
                v-model="form.description"
                rows="3"
                class="form-textarea"
                placeholder="Brief description of this category"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Color</label>
              <div class="color-picker">
                <div class="color-preview" :style="{ background: form.color }"></div>
                <input
                  v-model="form.color"
                  type="text"
                  class="form-input color-input"
                  placeholder="#3b82f6"
                />
                <input
                  v-model="form.color"
                  type="color"
                  class="color-native"
                />
              </div>
              <div class="color-presets">
                <button
                  v-for="color in presetColors"
                  :key="color"
                  type="button"
                  class="color-preset"
                  :class="{ active: form.color === color }"
                  :style="{ background: color }"
                  @click="form.color = color"
                ></button>
              </div>
            </div>

            <div v-if="formError" class="form-error">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {{ formError }}
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
              <button type="submit" :disabled="submitting" class="btn-primary">
                <span v-if="submitting" class="btn-spinner"></span>
                {{ submitting ? 'Saving...' : (editingCategory ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

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

const presetColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#64748b', '#0a0a0a'
]

const form = ref({
  name: '',
  description: '',
  color: '#6366f1'
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
  form.value = { name: '', description: '', color: '#6366f1' }
  formError.value = ''
  modalOpen.value = true
}

const openEditModal = (category) => {
  editingCategory.value = category
  form.value = {
    name: category.name,
    description: category.description || '',
    color: category.color || '#6366f1'
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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

.categories-page {
  --font-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --color-text: #0a0a0a;
  --color-text-secondary: #525252;
  --color-text-muted: #a1a1aa;
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-border: #e4e4e7;
  --color-border-light: #f4f4f5;
  --color-hover: #f4f4f5;

  --color-primary: #6366f1;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  font-family: var(--font-sans);
  padding: 24px;
  max-width: 1200px;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 4px 0 0 0;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: var(--color-text);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.create-btn:hover {
  background: #262626;
}

.create-btn svg {
  width: 16px;
  height: 16px;
}

/* States */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.state-container.error {
  border-color: #fecaca;
  background: #fef2f2;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state-icon {
  width: 48px;
  height: 48px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.state-container.error .state-icon {
  color: var(--color-danger);
}

.state-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0;
}

.state-hint {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 4px 0 0 0;
}

.retry-btn,
.create-first-btn {
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: var(--color-text);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.retry-btn:hover,
.create-first-btn:hover {
  background: #262626;
}

.create-first-btn svg {
  width: 16px;
  height: 16px;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.category-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 20px;
  transition: border-color 0.15s;
}

.category-card:hover {
  border-color: var(--color-text-muted);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.color-indicator {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: var(--cat-color, var(--color-primary));
}

.event-count {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.count-value {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
}

.count-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 6px 0;
}

.category-description {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

.action-btn.edit {
  color: var(--color-text-secondary);
  background: var(--color-border-light);
}

.action-btn.edit:hover {
  background: var(--color-border);
}

.action-btn.delete {
  color: var(--color-danger);
  background: #fee2e2;
}

.action-btn.delete:hover {
  background: #fecaca;
}

/* Responsive */
@media (max-width: 768px) {
  .categories-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .create-btn {
    justify-content: center;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<!-- Non-scoped styles for teleported modal -->
<style>
.category-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.category-modal {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.category-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f4f4f5;
}

.category-modal-title {
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #0a0a0a;
  margin: 0;
}

.category-modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 6px;
  color: #a1a1aa;
  cursor: pointer;
  transition: all 0.15s;
}

.category-modal-close:hover {
  background: #f4f4f5;
  color: #0a0a0a;
}

.category-modal-close svg {
  width: 18px;
  height: 18px;
}

.category-modal-form {
  padding: 24px;
}

.category-modal-form .form-group {
  margin-bottom: 20px;
}

.category-modal-form .form-label {
  display: block;
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #0a0a0a;
  margin-bottom: 8px;
}

.category-modal-form .form-input,
.category-modal-form .form-textarea {
  width: 100%;
  padding: 10px 12px;
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  color: #0a0a0a;
  background: #fafafa;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.category-modal-form .form-input:focus,
.category-modal-form .form-textarea:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.category-modal-form .form-input::placeholder,
.category-modal-form .form-textarea::placeholder {
  color: #a1a1aa;
}

.category-modal-form .form-textarea {
  resize: vertical;
  min-height: 80px;
}

.category-modal-form .color-picker {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.category-modal-form .color-preview {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid #e4e4e7;
  flex-shrink: 0;
}

.category-modal-form .color-input {
  flex: 1;
}

.category-modal-form .color-native {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid #e4e4e7;
  border-radius: 6px;
  cursor: pointer;
  background: none;
}

.category-modal-form .color-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-modal-form .color-preset {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
}

.category-modal-form .color-preset:hover {
  transform: scale(1.1);
}

.category-modal-form .color-preset.active {
  border-color: #0a0a0a;
}

.category-modal-form .form-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  color: #ef4444;
  background: #fef2f2;
  border-radius: 6px;
  margin-bottom: 20px;
}

.category-modal-form .form-error svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.category-modal-form .modal-actions {
  display: flex;
  gap: 12px;
  padding-top: 4px;
}

.category-modal-form .btn-secondary,
.category-modal-form .btn-primary {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.category-modal-form .btn-secondary {
  color: #525252;
  background: #f4f4f5;
}

.category-modal-form .btn-secondary:hover {
  background: #e4e4e7;
}

.category-modal-form .btn-primary {
  color: white;
  background: #0a0a0a;
}

.category-modal-form .btn-primary:hover:not(:disabled) {
  background: #262626;
}

.category-modal-form .btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.category-modal-form .btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: category-modal-spin 0.8s linear infinite;
}

@keyframes category-modal-spin {
  to { transform: rotate(360deg); }
}
</style>
