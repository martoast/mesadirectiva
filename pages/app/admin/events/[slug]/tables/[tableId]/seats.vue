<template>
  <div class="seats-page">
    <!-- Back Button -->
    <NuxtLink :to="`/app/admin/events/${route.params.slug}/tables`" class="back-link">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Tables
    </NuxtLink>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loading-spinner"></div>
      <p class="state-text">Loading seats...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container error">
      <svg class="state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="state-text">{{ error }}</p>
      <button @click="fetchData" class="retry-btn">Try Again</button>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">{{ table?.name }}</h1>
          <div class="header-meta">
            <span class="meta-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Capacity: {{ table?.capacity }}
            </span>
            <span class="meta-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Price: ${{ formatPrice(table?.price) }}
            </span>
          </div>
        </div>
        <div class="header-actions">
          <button @click="openBulkModal" class="action-btn secondary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Bulk Create
          </button>
          <button @click="openCreateModal" class="action-btn primary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
            </svg>
            Add Seat
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ seats.length }}</span>
            <span class="stat-label">Total Seats</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon available">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ availableSeats }}</span>
            <span class="stat-label">Available</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon reserved">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ reservedSeats }}</span>
            <span class="stat-label">Reserved</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon sold">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ soldSeats }}</span>
            <span class="stat-label">Sold</span>
          </div>
        </div>
      </div>

      <!-- Seats List -->
      <div class="seats-container">
        <div v-if="seats.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <p class="empty-text">No seats created yet</p>
          <p class="empty-hint">Add individual seats or use bulk create</p>
          <div class="empty-actions">
            <button @click="openBulkModal" class="action-btn secondary">
              Bulk Create
            </button>
            <button @click="openCreateModal" class="action-btn primary">
              Add Seat
            </button>
          </div>
        </div>

        <div v-else class="seats-grid">
          <div
            v-for="seat in seats"
            :key="seat.id"
            :class="['seat-card', seat.status]"
          >
            <div class="seat-header">
              <span class="seat-label">{{ seat.label }}</span>
              <span :class="['seat-status', seat.status]">
                <span class="status-dot"></span>
                {{ statusLabel(seat.status) }}
              </span>
            </div>

            <div v-if="seat.price" class="seat-price">
              ${{ formatPrice(seat.price) }}
            </div>

            <div class="seat-actions">
              <button @click="openEditModal(seat)" class="seat-btn edit" title="Edit">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="openDeleteModal(seat)" class="seat-btn delete" title="Delete">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showFormModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeFormModal"
      >
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
          <AdminSeatForm
            :seat="selectedSeat"
            :loading="formLoading"
            :errors="formErrors"
            @submit="handleFormSubmit"
            @cancel="closeFormModal"
          />
        </div>
      </div>
    </Teleport>

    <!-- Bulk Create Modal -->
    <Teleport to="body">
      <div
        v-if="showBulkModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="showBulkModal = false"
      >
        <div class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
          <AdminBulkSeatForm
            :loading="bulkLoading"
            @submit="handleBulkSubmit"
            @cancel="showBulkModal = false"
          />
        </div>
      </div>
    </Teleport>

    <!-- Delete Modal -->
    <UiConfirmModal
      :is-open="showDeleteModal"
      title="Delete Seat"
      :message="`Are you sure you want to delete seat '${selectedSeat?.label}'?`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const route = useRoute()
const { getTable } = useTables()
const { getSeats, createSeat, createSeatsBulk, updateSeat, deleteSeat } = useSeats()

const table = ref(null)
const seats = ref([])
const loading = ref(true)
const error = ref('')

const showFormModal = ref(false)
const showBulkModal = ref(false)
const showDeleteModal = ref(false)
const selectedSeat = ref(null)
const formLoading = ref(false)
const bulkLoading = ref(false)
const formErrors = ref({})

const availableSeats = computed(() => seats.value.filter(s => s.status === 'available').length)
const reservedSeats = computed(() => seats.value.filter(s => s.status === 'reserved').length)
const soldSeats = computed(() => seats.value.filter(s => s.status === 'sold').length)

const formatPrice = (price) => {
  return Number(price || 0).toFixed(2)
}

const statusLabel = (status) => {
  const labels = {
    available: 'Available',
    reserved: 'Reserved',
    sold: 'Sold'
  }
  return labels[status] || status
}

const fetchData = async () => {
  loading.value = true
  error.value = ''

  try {
    const [tableRes, seatsRes] = await Promise.all([
      getTable(route.params.slug, route.params.tableId),
      getSeats(route.params.slug, route.params.tableId)
    ])

    table.value = tableRes.table
    seats.value = seatsRes.seats || []
  } catch (e) {
    error.value = e.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  selectedSeat.value = null
  formErrors.value = {}
  showFormModal.value = true
}

const openEditModal = (seat) => {
  selectedSeat.value = seat
  formErrors.value = {}
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  selectedSeat.value = null
  formErrors.value = {}
}

const handleFormSubmit = async (data) => {
  formLoading.value = true
  formErrors.value = {}

  try {
    if (selectedSeat.value) {
      await updateSeat(route.params.slug, selectedSeat.value.id, data)
    } else {
      await createSeat(route.params.slug, route.params.tableId, data)
    }

    closeFormModal()
    await fetchData()
  } catch (e) {
    if (e.errors) {
      formErrors.value = e.errors
    } else {
      error.value = e.message || 'Failed to save seat'
    }
  } finally {
    formLoading.value = false
  }
}

const openBulkModal = () => {
  showBulkModal.value = true
}

const handleBulkSubmit = async (seatsData) => {
  bulkLoading.value = true

  try {
    await createSeatsBulk(route.params.slug, route.params.tableId, seatsData)
    showBulkModal.value = false
    await fetchData()
  } catch (e) {
    error.value = e.message || 'Failed to create seats'
  } finally {
    bulkLoading.value = false
  }
}

const openDeleteModal = (seat) => {
  selectedSeat.value = seat
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await deleteSeat(route.params.slug, selectedSeat.value.id)
    showDeleteModal.value = false
    selectedSeat.value = null
    await fetchData()
  } catch (e) {
    error.value = e.message || 'Failed to delete seat'
    showDeleteModal.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

.seats-page {
  --font-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --color-text: #0a0a0a;
  --color-text-secondary: #525252;
  --color-text-muted: #a1a1aa;
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-border: #e4e4e7;
  --color-border-light: #f4f4f5;

  --color-primary: #6366f1;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  font-family: var(--font-sans);
  padding: 24px;
  max-width: 1200px;
}

/* Back Link */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.15s;
}

.back-link:hover {
  color: var(--color-text);
}

.back-link svg {
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

.retry-btn {
  margin-top: 16px;
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

.retry-btn:hover {
  background: #262626;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.meta-item svg {
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.primary {
  color: white;
  background: var(--color-text);
}

.action-btn.primary:hover {
  background: #262626;
}

.action-btn.secondary {
  color: var(--color-text-secondary);
  background: var(--color-border-light);
}

.action-btn.secondary:hover {
  background: var(--color-border);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.stat-icon svg {
  width: 22px;
  height: 22px;
}

.stat-icon.total {
  background: #eef2ff;
  color: var(--color-primary);
}

.stat-icon.available {
  background: #d1fae5;
  color: var(--color-success);
}

.stat-icon.reserved {
  background: #fef3c7;
  color: var(--color-warning);
}

.stat-icon.sold {
  background: var(--color-border-light);
  color: var(--color-text-secondary);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 24px;
  font-weight: 500;
  color: var(--color-text);
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* Seats Container */
.seats-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 24px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.empty-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin: 0;
}

.empty-hint {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 4px 0 0 0;
}

.empty-actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

/* Seats Grid */
.seats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.seat-card {
  padding: 16px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: border-color 0.15s;
}

.seat-card:hover {
  border-color: var(--color-text-muted);
}

.seat-card.sold {
  background: var(--color-border-light);
}

.seat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.seat-label {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.seat-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 600;
  border-radius: 50px;
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.seat-status.available {
  color: var(--color-success);
  background: #d1fae5;
}

.seat-status.available .status-dot {
  background: var(--color-success);
}

.seat-status.reserved {
  color: var(--color-warning);
  background: #fef3c7;
}

.seat-status.reserved .status-dot {
  background: var(--color-warning);
}

.seat-status.sold {
  color: var(--color-text-muted);
  background: var(--color-border);
}

.seat-status.sold .status-dot {
  background: var(--color-text-muted);
}

.seat-price {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

.seat-actions {
  display: flex;
  gap: 4px;
}

.seat-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 4px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.seat-btn svg {
  width: 14px;
  height: 14px;
}

.seat-btn.edit:hover {
  color: var(--color-primary);
  background: #eef2ff;
}

.seat-btn.delete:hover {
  color: var(--color-danger);
  background: #fee2e2;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .seats-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .stat-card {
    padding: 16px;
  }

  .seats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .seats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
