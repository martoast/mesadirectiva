<!-- components/admin/EventTicketsStep.vue -->
<!-- Tickets step: handles both GA (tiers) and seated (tables) events -->
<template>
  <div class="tickets-step">
    <!-- General Admission: Ticket Tiers -->
    <template v-if="seatingType === 'general_admission'">
      <div class="section-header">
        <div>
          <h3>Ticket Tiers</h3>
          <p class="section-description">Create different ticket options with varying prices and quantities</p>
        </div>
        <button
          v-if="!showTierForm && tiers.length > 0"
          type="button"
          class="btn-add"
          @click="openTierForm()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Tier
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>Loading tiers...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button type="button" @click="fetchTiers" class="retry-btn">Retry</button>
      </div>

      <!-- Tier List -->
      <template v-else>
        <AdminTicketTierList
          v-if="tiers.length > 0 && !showTierForm"
          :tiers="tiers"
          @edit="openTierForm"
          @delete="confirmDeleteTier"
        />

        <!-- Empty state with inline form -->
        <div v-if="tiers.length === 0 && !showTierForm" class="empty-prompt">
          <div class="empty-icon">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h4>No ticket tiers yet</h4>
          <p>Add at least one ticket tier to allow attendees to register</p>
          <button type="button" class="btn-primary" @click="openTierForm()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create First Tier
          </button>
        </div>

        <!-- Inline Tier Form -->
        <div v-if="showTierForm" class="inline-form">
          <AdminTicketTierForm
            :tier="editingTier"
            :loading="formLoading"
            :errors="formErrors"
            @submit="handleTierSubmit"
            @cancel="closeTierForm"
          />
        </div>
      </template>
    </template>

    <!-- Seated Event: Tables -->
    <template v-else>
      <div class="section-header">
        <div>
          <h3>Tables & Seating</h3>
          <p class="section-description">Add tables and set pricing for your seated event</p>
        </div>
        <button
          v-if="!showTableForm && tables.length > 0"
          type="button"
          class="btn-add"
          @click="openTableForm()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Table
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>Loading tables...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button type="button" @click="fetchTables" class="retry-btn">Retry</button>
      </div>

      <!-- Table List -->
      <template v-else>
        <AdminSimpleTableList
          v-if="tables.length > 0 && !showTableForm"
          :tables="tables"
          @edit="openTableForm"
          @delete="confirmDeleteTable"
        />

        <!-- Empty state -->
        <div v-if="tables.length === 0 && !showTableForm" class="empty-prompt">
          <div class="empty-icon">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h4>No tables yet</h4>
          <p>Add tables to allow attendees to select seating</p>
          <button type="button" class="btn-primary" @click="openTableForm()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add First Table
          </button>
        </div>

        <!-- Inline Table Form -->
        <div v-if="showTableForm" class="inline-form">
          <AdminSimpleTableForm
            :table="editingTable"
            :loading="formLoading"
            :errors="formErrors"
            @submit="handleTableSubmit"
            @cancel="closeTableForm"
          />
        </div>

        <!-- Floor Plan Editor Link -->
        <div v-if="tables.length > 0 && eventSlug" class="floor-plan-cta">
          <div class="cta-content">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <div>
              <strong>Arrange your floor plan visually</strong>
              <p>Position tables and customize your venue layout</p>
            </div>
          </div>
          <NuxtLink
            :to="`/app/admin/events/${eventSlug}/floor-plan`"
            class="cta-link"
          >
            Open Floor Plan Editor
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NuxtLink>
        </div>
      </template>
    </template>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-backdrop" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <h4>{{ seatingType === 'general_admission' ? 'Delete Tier' : 'Delete Table' }}</h4>
        <p>
          Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong>?
          This action cannot be undone.
        </p>
        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="showDeleteModal = false">Cancel</button>
          <button type="button" class="btn-delete" @click="executeDelete" :disabled="formLoading">
            {{ formLoading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  eventSlug: {
    type: String,
    default: ''
  },
  seatingType: {
    type: String,
    default: 'general_admission'
  }
})

const emit = defineEmits(['update:tiers', 'update:tables'])

const { getTicketTiers, createTicketTier, updateTicketTier, deleteTicketTier } = useTicketTiers()
const { getTables, createTable, updateTable, deleteTable } = useTables()

// State
const loading = ref(false)
const error = ref('')
const formLoading = ref(false)
const formErrors = ref({})

// Tiers (GA)
const tiers = ref([])
const showTierForm = ref(false)
const editingTier = ref(null)

// Tables (Seated)
const tables = ref([])
const showTableForm = ref(false)
const editingTable = ref(null)

// Delete modal
const showDeleteModal = ref(false)
const deleteTarget = ref(null)
const deleteType = ref('')

// Fetch tiers for GA events
const fetchTiers = async () => {
  if (!props.eventSlug || props.seatingType !== 'general_admission') return

  loading.value = true
  error.value = ''

  try {
    const response = await getTicketTiers(props.eventSlug)
    tiers.value = response.tiers || []
    emit('update:tiers', tiers.value)
  } catch (e) {
    error.value = e.message || 'Failed to load tiers'
  } finally {
    loading.value = false
  }
}

// Fetch tables for seated events
const fetchTables = async () => {
  if (!props.eventSlug || props.seatingType !== 'seated') return

  loading.value = true
  error.value = ''

  try {
    const response = await getTables(props.eventSlug)
    tables.value = response.tables || []
    emit('update:tables', tables.value)
  } catch (e) {
    error.value = e.message || 'Failed to load tables'
  } finally {
    loading.value = false
  }
}

// Tier form handlers
const openTierForm = (tier = null) => {
  editingTier.value = tier
  formErrors.value = {}
  showTierForm.value = true
}

const closeTierForm = () => {
  showTierForm.value = false
  editingTier.value = null
  formErrors.value = {}
}

const handleTierSubmit = async (data) => {
  if (!props.eventSlug) return

  formLoading.value = true
  formErrors.value = {}

  try {
    if (editingTier.value) {
      await updateTicketTier(props.eventSlug, editingTier.value.id, data)
    } else {
      await createTicketTier(props.eventSlug, data)
    }
    closeTierForm()
    await fetchTiers()
  } catch (e) {
    if (e.errors) {
      formErrors.value = e.errors
    } else {
      error.value = e.message || 'Failed to save tier'
    }
  } finally {
    formLoading.value = false
  }
}

// Table form handlers
const openTableForm = (table = null) => {
  editingTable.value = table
  formErrors.value = {}
  showTableForm.value = true
}

const closeTableForm = () => {
  showTableForm.value = false
  editingTable.value = null
  formErrors.value = {}
}

const handleTableSubmit = async (data) => {
  if (!props.eventSlug) return

  formLoading.value = true
  formErrors.value = {}

  try {
    if (editingTable.value) {
      await updateTable(props.eventSlug, editingTable.value.id, data)
    } else {
      await createTable(props.eventSlug, data)
    }
    closeTableForm()
    await fetchTables()
  } catch (e) {
    if (e.errors) {
      formErrors.value = e.errors
    } else {
      error.value = e.message || 'Failed to save table'
    }
  } finally {
    formLoading.value = false
  }
}

// Delete handlers
const confirmDeleteTier = (tier) => {
  deleteTarget.value = tier
  deleteType.value = 'tier'
  showDeleteModal.value = true
}

const confirmDeleteTable = (table) => {
  deleteTarget.value = table
  deleteType.value = 'table'
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!props.eventSlug || !deleteTarget.value) return

  formLoading.value = true

  try {
    if (deleteType.value === 'tier') {
      await deleteTicketTier(props.eventSlug, deleteTarget.value.id)
      await fetchTiers()
    } else {
      await deleteTable(props.eventSlug, deleteTarget.value.id)
      await fetchTables()
    }
    showDeleteModal.value = false
    deleteTarget.value = null
  } catch (e) {
    error.value = e.message || 'Failed to delete'
  } finally {
    formLoading.value = false
  }
}

// Watch for eventSlug changes
watch(() => props.eventSlug, (newSlug) => {
  if (newSlug) {
    if (props.seatingType === 'general_admission') {
      fetchTiers()
    } else {
      fetchTables()
    }
  }
}, { immediate: true })

// Watch for seating type changes
watch(() => props.seatingType, (newType) => {
  if (props.eventSlug) {
    if (newType === 'general_admission') {
      fetchTiers()
    } else {
      fetchTables()
    }
  }
})

// Expose for parent
defineExpose({
  tiers,
  tables,
  fetchTiers,
  fetchTables
})
</script>

<style scoped>
.tickets-step {
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-success: #10b981;
  --color-border: #e5e7eb;
  --color-bg-subtle: #f9fafb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-error: #ef4444;
  --radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.section-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.section-description {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.08);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover {
  background: rgba(99, 102, 241, 0.12);
}

/* Loading */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: var(--color-text-muted);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.error-state {
  padding: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius);
  text-align: center;
}

.error-state p {
  color: var(--color-error);
  margin-bottom: 0.75rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-error);
  background: white;
  border: 1px solid var(--color-error);
  border-radius: 6px;
  cursor: pointer;
}

/* Empty Prompt */
.empty-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 1.5rem;
  background: var(--color-bg-subtle);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  text-align: center;
}

.empty-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.empty-prompt h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.empty-prompt p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

/* Inline Form */
.inline-form {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

/* Floor Plan CTA */
.floor-plan-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0.08) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: var(--radius);
}

.cta-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.cta-content svg {
  flex-shrink: 0;
  color: var(--color-primary);
  margin-top: 2px;
}

.cta-content strong {
  display: block;
  font-size: 0.9375rem;
  color: var(--color-text);
  margin-bottom: 0.125rem;
}

.cta-content p {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.cta-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border-radius: 6px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s;
}

.cta-link:hover {
  background: var(--color-primary-hover);
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 400px;
  padding: 1.5rem;
  background: white;
  border-radius: var(--radius);
}

.modal-content h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.modal-content p {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
}

.btn-delete {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background: var(--color-error);
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .section-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .floor-plan-cta {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .cta-content {
    flex-direction: column;
    align-items: center;
  }

  .cta-link {
    justify-content: center;
  }
}
</style>
