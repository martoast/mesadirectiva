<template>
  <div class="groups-page">
    <!-- Floating Action Button (Mobile) -->
    <button @click="openCreateModal" class="fab-create" aria-label="Create new group">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-title-row">
          <h1>{{ t.pageTitle }}</h1>
          <span class="group-count">{{ groups.length }}</span>
        </div>
        <p class="header-description">{{ t.pageSubtitle }}</p>
      </div>
      <button @click="openCreateModal" class="btn-create">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
        </svg>
        <span>{{ t.createGroup }}</span>
      </button>
    </header>

    <!-- Stats Overview -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ groups.length }}</span>
        <span class="stat-label">{{ t.totalGroups }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ totalEvents }}</span>
        <span class="stat-label">{{ t.totalEvents }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loading-state">
        <div class="loader"></div>
        <span>{{ t.loadingGroups }}</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container error">
      <div class="error-state">
        <div class="error-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3>{{ t.errorTitle }}</h3>
        <p>{{ error }}</p>
        <button @click="fetchGroups" class="btn-retry">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t.tryAgain }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="groups.length === 0" class="state-container">
      <div class="empty-state">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h3>{{ t.noGroupsYet }}</h3>
        <p>{{ t.createFirstHint }}</p>
        <button @click="openCreateModal" class="btn-create-first">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ t.createGroup }}
        </button>
      </div>
    </div>

    <!-- Groups Grid -->
    <div v-else class="groups-grid">
      <div
        v-for="group in groups"
        :key="group.id"
        class="group-card"
      >
        <div class="card-header">
          <div class="color-indicator" :style="{ '--group-color': group.color }"></div>
          <div class="card-actions-wrapper">
            <div class="event-count">
              <span class="count-value">{{ group.events_count || 0 }}</span>
              <span class="count-label">{{ t.events }}</span>
            </div>
            <!-- Three-dot menu -->
            <div class="actions-dropdown" v-click-outside="() => closeDropdown(group.id)">
              <button
                class="dropdown-trigger"
                @click="toggleDropdown(group.id)"
                :aria-expanded="openDropdownId === group.id"
                aria-label="Actions"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              <Transition name="dropdown">
                <div v-if="openDropdownId === group.id" class="dropdown-menu">
                  <button @click="openEditModal(group)" class="dropdown-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {{ t.edit }}
                  </button>
                  <button @click="handleDelete(group)" class="dropdown-item danger">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {{ t.delete }}
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <h3 class="group-name">{{ group.name }}</h3>
        <p class="group-description">{{ group.description || t.noDescription }}</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modalOpen" class="group-modal-overlay" @click.self="closeModal">
          <div class="group-modal">
            <div class="group-modal-header">
              <h2 class="group-modal-title">
                {{ editingGroup ? t.editGroup : t.createGroup }}
              </h2>
              <button @click="closeModal" class="group-modal-close">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="group-modal-form">
              <div class="form-group">
                <label class="form-label">{{ t.name }}</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="form-input"
                  :placeholder="t.namePlaceholder"
                />
              </div>

              <div class="form-group">
                <label class="form-label">{{ t.description }}</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="form-textarea"
                  :placeholder="t.descriptionPlaceholder"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">{{ t.color }}</label>
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
                  {{ t.cancel }}
                </button>
                <button type="submit" :disabled="submitting" class="btn-primary">
                  <span v-if="submitting" class="btn-spinner"></span>
                  {{ submitting ? t.saving : (editingGroup ? t.update : t.create) }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <UiConfirmModal
      :is-open="deleteModalOpen"
      :title="t.deleteGroup"
      :message="`${t.deleteConfirm} '${groupToDelete?.name}'? ${t.cannotBeUndone}`"
      :confirm-text="t.delete"
      :cancel-text="t.cancel"
      @confirm="confirmDelete"
      @cancel="deleteModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'super-admin']
})

const { t: createT } = useLanguage()

// Translations
const translations = {
  pageTitle: { es: 'Grupos', en: 'Groups' },
  pageSubtitle: { es: 'Organiza eventos en grupos', en: 'Organize events into groups' },
  createGroup: { es: 'Crear Grupo', en: 'Create Group' },
  loadingGroups: { es: 'Cargando grupos...', en: 'Loading groups...' },
  noGroupsYet: { es: 'Aún no hay grupos', en: 'No groups yet' },
  createFirstHint: { es: 'Crea tu primer grupo para organizar eventos', en: 'Create your first group to organize events' },
  events: { es: 'eventos', en: 'events' },
  noDescription: { es: 'Sin descripción', en: 'No description provided' },
  edit: { es: 'Editar', en: 'Edit' },
  delete: { es: 'Eliminar', en: 'Delete' },
  editGroup: { es: 'Editar Grupo', en: 'Edit Group' },
  name: { es: 'Nombre', en: 'Name' },
  namePlaceholder: { es: 'ej. Conferencias, Talleres', en: 'e.g. Conferences, Workshops' },
  description: { es: 'Descripción', en: 'Description' },
  descriptionPlaceholder: { es: 'Breve descripción de este grupo', en: 'Brief description of this group' },
  color: { es: 'Color', en: 'Color' },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  saving: { es: 'Guardando...', en: 'Saving...' },
  update: { es: 'Actualizar', en: 'Update' },
  create: { es: 'Crear', en: 'Create' },
  tryAgain: { es: 'Intentar de Nuevo', en: 'Try Again' },
  deleteGroup: { es: 'Eliminar Grupo', en: 'Delete Group' },
  deleteConfirm: { es: '¿Estás seguro de que deseas eliminar', en: 'Are you sure you want to delete' },
  cannotBeUndone: { es: 'Esta acción no se puede deshacer.', en: 'This action cannot be undone.' },
  totalGroups: { es: 'Grupos', en: 'Groups' },
  totalEvents: { es: 'Eventos', en: 'Events' },
  errorTitle: { es: 'Error al cargar', en: 'Failed to load' }
}

const t = createT(translations)

const { getGroups, createGroup, updateGroup, deleteGroup } = useGroups()

const groups = ref([])
const loading = ref(true)
const error = ref('')
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const editingGroup = ref(null)
const groupToDelete = ref(null)
const submitting = ref(false)
const formError = ref('')
const openDropdownId = ref(null)

// Computed
const totalEvents = computed(() => groups.value.reduce((sum, g) => sum + (g.events_count || 0), 0))

const presetColors = [
  '#264653', '#2a9d8f', '#2d5a27', '#457b9d',
  '#6366f1', '#8b5cf6', '#ec4899', '#c73e1d',
  '#f97316', '#eab308', '#64748b', '#1a1a1a'
]

const form = ref({
  name: '',
  description: '',
  color: '#264653'
})

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}

const toggleDropdown = (id) => {
  openDropdownId.value = openDropdownId.value === id ? null : id
}

const closeDropdown = (id) => {
  if (openDropdownId.value === id) {
    openDropdownId.value = null
  }
}

const fetchGroups = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getGroups()
    groups.value = response.groups || []
  } catch (e) {
    error.value = e.message || 'Failed to load groups'
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingGroup.value = null
  form.value = { name: '', description: '', color: '#264653' }
  formError.value = ''
  modalOpen.value = true
}

const openEditModal = (group) => {
  openDropdownId.value = null
  editingGroup.value = group
  form.value = {
    name: group.name,
    description: group.description || '',
    color: group.color || '#264653'
  }
  formError.value = ''
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  editingGroup.value = null
}

const handleSubmit = async () => {
  submitting.value = true
  formError.value = ''

  try {
    if (editingGroup.value) {
      await updateGroup(editingGroup.value.id, form.value)
    } else {
      await createGroup(form.value)
    }
    closeModal()
    fetchGroups()
  } catch (e) {
    formError.value = e.message || 'Failed to save group'
  } finally {
    submitting.value = false
  }
}

const handleDelete = (group) => {
  openDropdownId.value = null
  groupToDelete.value = group
  deleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (groupToDelete.value) {
    try {
      await deleteGroup(groupToDelete.value.id)
      fetchGroups()
    } catch (e) {
      error.value = e.message || 'Failed to delete group'
    }
    deleteModalOpen.value = false
    groupToDelete.value = null
  }
}

onMounted(() => {
  fetchGroups()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

/* Global box-sizing */
.groups-page,
.groups-page *,
.groups-page *::before,
.groups-page *::after {
  box-sizing: border-box;
}

.groups-page {
  /* Japanese-inspired palette */
  --color-paper: #faf9f7;
  --color-ink: #1a1a1a;
  --color-ink-light: #4a4a4a;
  --color-ink-lighter: #7a7a7a;
  --color-ink-muted: #a8a8a8;
  --color-stone: #e8e6e3;
  --color-stone-dark: #d4d2cf;
  --color-bamboo: #2d5a27;
  --color-vermillion: #c73e1d;
  --color-indigo: #264653;

  /* Semantic colors */
  --color-surface: #ffffff;
  --color-border: #e8e6e3;
  --color-border-subtle: #f2f1ef;
  --color-hover: rgba(26, 26, 26, 0.03);
  --color-danger: #c73e1d;
  --color-danger-subtle: rgba(199, 62, 29, 0.08);

  /* Typography */
  --font-display: 'Zen Maru Gothic', 'Noto Sans JP', system-ui, sans-serif;
  --font-body: 'Noto Sans JP', system-ui, sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(26, 26, 26, 0.04);
  --shadow-md: 0 2px 8px rgba(26, 26, 26, 0.06);
  --shadow-lg: 0 4px 16px rgba(26, 26, 26, 0.08);

  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  width: 100%;
  max-width: 100%;
  padding-bottom: 80px;
}

/* ========================================
   Floating Action Button (Mobile)
   ======================================== */
.fab-create {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: var(--color-ink);
  color: white;
  border: none;
  border-radius: 16px;
  box-shadow: var(--shadow-lg), 0 0 0 1px rgba(26, 26, 26, 0.1);
  z-index: 100;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.fab-create svg {
  width: 24px;
  height: 24px;
}

.fab-create:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg), 0 8px 24px rgba(26, 26, 26, 0.15);
}

.fab-create:active {
  transform: scale(0.98);
}

@media (min-width: 640px) {
  .fab-create {
    display: none;
  }
}

/* ========================================
   Header
   ======================================== */
.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.header-title-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
}

.header-title-row h1 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.group-count {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink-muted);
  padding: 2px 10px;
  background: var(--color-border-subtle);
  border-radius: 20px;
}

.header-description {
  font-size: 14px;
  color: var(--color-ink-lighter);
  line-height: 1.5;
}

.btn-create {
  display: none;
  align-items: center;
  gap: var(--space-sm);
  padding: 12px 20px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: var(--color-ink);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: var(--shadow-sm);
}

.btn-create svg {
  width: 18px;
  height: 18px;
}

.btn-create:hover {
  background: var(--color-ink-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

@media (min-width: 640px) {
  .page-header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .btn-create {
    display: inline-flex;
  }
}

@media (min-width: 768px) {
  .header-title-row h1 {
    font-size: 32px;
  }
}

/* ========================================
   Stats Row
   ======================================== */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-lg);
  padding: var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  margin-bottom: var(--space-lg);
  width: 100%;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-ink-muted);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .stats-row {
    gap: var(--space-xl);
    padding: var(--space-lg) var(--space-xl);
  }

  .stat-value {
    font-size: 28px;
  }
}

/* ========================================
   State Containers
   ======================================== */
.state-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 60px var(--space-md);
  width: 100%;
}

.state-container.error {
  border-color: rgba(199, 62, 29, 0.2);
  background: rgba(199, 62, 29, 0.02);
}

@media (min-width: 480px) {
  .state-container {
    padding: 80px var(--space-xl);
  }
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
}

.loader {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-ink);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state span {
  font-size: 14px;
  color: var(--color-ink-lighter);
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.error-icon {
  width: 48px;
  height: 48px;
  background: var(--color-danger-subtle);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-md);
}

.error-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-danger);
}

.error-state h3 {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-ink);
  margin-bottom: var(--space-xs);
}

.error-state p {
  font-size: 14px;
  color: var(--color-ink-lighter);
  margin-bottom: var(--space-lg);
  max-width: 280px;
}

.btn-retry {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px 16px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-retry svg {
  width: 14px;
  height: 14px;
}

.btn-retry:hover {
  background: var(--color-hover);
  border-color: var(--color-stone-dark);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: var(--color-border-subtle);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-lg);
}

.empty-icon svg {
  width: 28px;
  height: 28px;
  color: var(--color-ink-muted);
}

.empty-state h3 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  color: var(--color-ink);
  margin-bottom: var(--space-sm);
}

.empty-state p {
  font-size: 14px;
  color: var(--color-ink-lighter);
  margin-bottom: var(--space-xl);
  max-width: 280px;
  line-height: 1.5;
}

.btn-create-first {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 14px 24px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: var(--color-ink);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: var(--shadow-sm);
}

.btn-create-first svg {
  width: 18px;
  height: 18px;
}

.btn-create-first:hover {
  background: var(--color-ink-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* ========================================
   Groups Grid
   ======================================== */
.groups-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  width: 100%;
}

@media (min-width: 600px) {
  .groups-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .groups-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.group-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: var(--space-lg);
  transition: all 0.2s ease;
}

.group-card:hover {
  border-color: var(--color-stone-dark);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
}

.color-indicator {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--group-color, var(--color-indigo));
}

.card-actions-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.event-count {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.count-value {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-ink);
}

.count-label {
  font-size: 12px;
  color: var(--color-ink-muted);
}

.group-name {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  color: var(--color-ink);
  margin: 0 0 var(--space-sm) 0;
  line-height: 1.3;
}

.group-description {
  font-size: 13px;
  color: var(--color-ink-lighter);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ========================================
   Actions Dropdown
   ======================================== */
.actions-dropdown {
  position: relative;
}

.dropdown-trigger {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-ink-lighter);
  transition: all 0.15s ease;
}

.dropdown-trigger:hover {
  background: var(--color-hover);
  color: var(--color-ink);
}

.dropdown-trigger svg {
  width: 18px;
  height: 18px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 140px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: var(--shadow-lg);
  z-index: 50;
  overflow: hidden;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 10px 14px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink-light);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dropdown-item:hover {
  background: var(--color-hover);
  color: var(--color-ink);
}

.dropdown-item.danger {
  color: var(--color-danger);
}

.dropdown-item.danger:hover {
  background: var(--color-danger-subtle);
}

.dropdown-item svg {
  width: 16px;
  height: 16px;
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

<!-- Non-scoped styles for teleported modal -->
<style>
.group-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 26, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.group-modal {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(26, 26, 26, 0.25);
}

.group-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e6e3;
}

.group-modal-title {
  font-family: 'Zen Maru Gothic', 'Noto Sans JP', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.group-modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 8px;
  color: #a8a8a8;
  cursor: pointer;
  transition: all 0.15s;
}

.group-modal-close:hover {
  background: #f2f1ef;
  color: #1a1a1a;
}

.group-modal-close svg {
  width: 18px;
  height: 18px;
}

.group-modal-form {
  padding: 24px;
}

.group-modal-form .form-group {
  margin-bottom: 20px;
}

.group-modal-form .form-label {
  display: block;
  font-family: 'Noto Sans JP', system-ui, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.group-modal-form .form-input,
.group-modal-form .form-textarea {
  width: 100%;
  padding: 12px 14px;
  font-family: 'Noto Sans JP', system-ui, sans-serif;
  font-size: 14px;
  color: #1a1a1a;
  background: #faf9f7;
  border: 1px solid #e8e6e3;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.group-modal-form .form-input:focus,
.group-modal-form .form-textarea:focus {
  border-color: #1a1a1a;
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
}

.group-modal-form .form-input::placeholder,
.group-modal-form .form-textarea::placeholder {
  color: #a8a8a8;
}

.group-modal-form .form-textarea {
  resize: vertical;
  min-height: 80px;
}

.group-modal-form .color-picker {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.group-modal-form .color-preview {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid #e8e6e3;
  flex-shrink: 0;
}

.group-modal-form .color-input {
  flex: 1;
}

.group-modal-form .color-native {
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid #e8e6e3;
  border-radius: 10px;
  cursor: pointer;
  background: none;
}

.group-modal-form .color-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.group-modal-form .color-preset {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
}

.group-modal-form .color-preset:hover {
  transform: scale(1.15);
}

.group-modal-form .color-preset.active {
  border-color: #1a1a1a;
}

.group-modal-form .form-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  font-family: 'Noto Sans JP', system-ui, sans-serif;
  font-size: 13px;
  color: #c73e1d;
  background: rgba(199, 62, 29, 0.06);
  border-radius: 10px;
  margin-bottom: 20px;
}

.group-modal-form .form-error svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.group-modal-form .modal-actions {
  display: flex;
  gap: 12px;
  padding-top: 4px;
}

.group-modal-form .btn-secondary,
.group-modal-form .btn-primary {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  font-family: 'Noto Sans JP', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
}

.group-modal-form .btn-secondary {
  color: #4a4a4a;
  background: #f2f1ef;
}

.group-modal-form .btn-secondary:hover {
  background: #e8e6e3;
}

.group-modal-form .btn-primary {
  color: white;
  background: #1a1a1a;
}

.group-modal-form .btn-primary:hover:not(:disabled) {
  background: #4a4a4a;
}

.group-modal-form .btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.group-modal-form .btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: group-modal-spin 0.8s linear infinite;
}

@keyframes group-modal-spin {
  to { transform: rotate(360deg); }
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .group-modal,
.modal-leave-to .group-modal {
  transform: scale(0.95) translateY(10px);
}
</style>
