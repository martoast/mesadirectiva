<template>
  <div class="floor-plan-page">
    <!-- Header Bar -->
    <header class="editor-header">
      <div class="header-left">
        <NuxtLink :to="`/app/admin/events/${route.params.slug}`" class="back-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </NuxtLink>
        <div class="header-title">
          <h1>{{ event?.name || 'Floor Plan' }}</h1>
          <span class="subtitle">Click tables to manage, drag to arrange</span>
        </div>
      </div>

      <div class="header-stats">
        <div class="stat-chip">
          <span class="stat-num">{{ tables.length }}</span>
          <span class="stat-label">Tables</span>
        </div>
        <div class="stat-chip">
          <span class="stat-num">{{ totalSeats }}</span>
          <span class="stat-label">Seats</span>
        </div>
        <div class="stat-chip success">
          <span class="stat-num">{{ availableSeats }}</span>
          <span class="stat-label">Available</span>
        </div>
      </div>

      <div class="header-actions">
        <button @click="openCreateTable" class="action-btn ghost">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span class="btn-text">Add Table</span>
        </button>
        <button
          @click="saveAllPositions"
          :disabled="savingPositions || !hasUnsavedChanges"
          :class="['action-btn primary', { 'has-changes': hasUnsavedChanges }]"
        >
          <svg v-if="!savingPositions" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else class="spinner"></span>
          <span class="btn-text">{{ savingPositions ? 'Saving...' : 'Save Layout' }}</span>
        </button>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loader"></div>
      <p>Loading floor plan...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container error">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p>{{ error }}</p>
      <button @click="fetchData" class="retry-btn">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="tables.length === 0 && !selectedTable" class="state-container empty">
      <div class="empty-icon">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      </div>
      <h3>No tables yet</h3>
      <p>Create tables to start designing your floor plan</p>
      <button @click="openCreateTable" class="create-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add First Table
      </button>
    </div>

    <!-- Editor -->
    <div v-else class="editor-wrapper">
      <!-- Left Toolbar -->
      <div class="toolbar-left">
        <div class="tool-section">
          <button @click="zoomIn" class="tool-btn" :disabled="zoom >= 2" title="Zoom In">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
          <span class="zoom-value">{{ Math.round(zoom * 100) }}%</span>
          <button @click="zoomOut" class="tool-btn" :disabled="zoom <= 0.3" title="Zoom Out">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
        </div>

        <div class="tool-divider"></div>

        <div class="tool-section">
          <button @click="fitToView" class="tool-btn" title="Fit to View">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button @click="resetView" class="tool-btn" title="Reset View">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div class="tool-divider"></div>

        <div class="tool-section">
          <button
            @click="gridSnap = !gridSnap"
            :class="['tool-btn', { active: gridSnap }]"
            title="Snap to Grid"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Canvas -->
      <div
        ref="canvasContainer"
        class="canvas"
        :class="{ 'is-panning': isPanning, 'is-dragging': draggingTable, 'panel-open': selectedTable }"
        @mousedown="startPan"
        @mousemove="onPan"
        @mouseup="endPan"
        @mouseleave="endPan"
        @wheel.prevent="onWheel"
      >
        <div
          class="canvas-content"
          :style="{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }"
        >
          <!-- Grid -->
          <div class="grid"></div>

          <!-- Stage -->
          <div class="stage">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>STAGE</span>
          </div>

          <!-- Tables -->
          <div
            v-for="table in tables"
            :key="table.id"
            :class="[
              'table-item',
              { 'vip': table.sell_as_whole },
              { 'dragging': draggingTable?.id === table.id },
              { 'selected': selectedTable?.id === table.id },
              { 'sold': table.status === 'sold' },
              { 'reserved': table.status === 'reserved' }
            ]"
            :style="{
              left: `${table.position_x}px`,
              top: `${table.position_y}px`
            }"
            @mousedown.stop="startDrag($event, table)"
          >
            <div class="table-top">
              <span class="table-name">{{ table.name }}</span>
              <span v-if="table.sell_as_whole" class="vip-badge">VIP</span>
            </div>

            <div class="table-middle">
              <template v-if="table.sell_as_whole">
                <div class="vip-content">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ table.capacity }} seats</span>
                </div>
              </template>
              <template v-else>
                <div class="seats-grid">
                  <div
                    v-for="seat in table.seats?.slice(0, 9)"
                    :key="seat.id"
                    :class="['seat-dot', seat.status]"
                    :title="`${seat.label}: ${seat.status}`"
                  ></div>
                  <div v-if="table.seats?.length > 9" class="seats-more">
                    +{{ table.seats.length - 9 }}
                  </div>
                </div>
              </template>
            </div>

            <div class="table-bottom">
              <span class="table-price">${{ formatPrice(table.price) }}</span>
              <span class="seats-count">{{ table.seats?.length || table.capacity }} seats</span>
            </div>
          </div>
        </div>

        <!-- Position Indicator -->
        <div v-if="draggingTable" class="position-indicator">
          {{ Math.round(draggingTable.position_x) }}, {{ Math.round(draggingTable.position_y) }}
        </div>

        <!-- Instructions Overlay -->
        <Transition name="fade">
          <div v-if="showInstructions" class="instructions-overlay" @click="showInstructions = false">
            <div class="instructions-card">
              <h4>Quick Controls</h4>
              <ul>
                <li><kbd>Scroll</kbd> Zoom in/out</li>
                <li><kbd>Drag canvas</kbd> Pan around</li>
                <li><kbd>Click table</kbd> Open details</li>
                <li><kbd>Drag table</kbd> Move table</li>
              </ul>
              <button class="got-it-btn" @click.stop="showInstructions = false">Got it</button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Side Panel -->
      <Transition name="slide">
        <div v-if="selectedTable" class="side-panel">
          <div class="panel-header">
            <div class="panel-title-row">
              <h2>{{ isCreatingTable ? 'New Table' : selectedTable.name }}</h2>
              <button @click="closePanel" class="close-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <!-- Tabs -->
            <div v-if="!isCreatingTable" class="panel-tabs">
              <button
                :class="['tab-btn', { active: panelTab === 'info' }]"
                @click="panelTab = 'info'"
              >
                Table Info
              </button>
              <button
                v-if="!selectedTable.sell_as_whole"
                :class="['tab-btn', { active: panelTab === 'seats' }]"
                @click="panelTab = 'seats'"
              >
                Seats ({{ selectedTable.seats?.length || 0 }})
              </button>
            </div>
          </div>

          <div class="panel-content">
            <!-- Table Form (Create/Edit) -->
            <div v-if="isCreatingTable || panelTab === 'info'" class="panel-section">
              <form @submit.prevent="handleTableSubmit" class="table-form">
                <div class="form-group">
                  <label>Table Name</label>
                  <input
                    v-model="tableForm.name"
                    type="text"
                    placeholder="e.g., Table 1, VIP Table A"
                    required
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Capacity</label>
                    <input
                      v-model="tableForm.capacity"
                      type="number"
                      min="1"
                      placeholder="8"
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>Price</label>
                    <input
                      v-model="tableForm.price"
                      type="number"
                      step="0.01"
                      placeholder="1600.00"
                    />
                  </div>
                </div>

                <div class="form-toggle">
                  <input
                    id="sell-as-whole"
                    v-model="tableForm.sell_as_whole"
                    type="checkbox"
                  />
                  <label for="sell-as-whole">
                    <span class="toggle-title">Sell as whole table</span>
                    <span class="toggle-desc">
                      {{ tableForm.sell_as_whole
                        ? 'Customers purchase the entire table'
                        : 'Customers can buy individual seats'
                      }}
                    </span>
                  </label>
                </div>

                <div class="form-toggle">
                  <input
                    id="is-active"
                    v-model="tableForm.is_active"
                    type="checkbox"
                  />
                  <label for="is-active">
                    <span class="toggle-title">Active</span>
                    <span class="toggle-desc">Table is available for booking</span>
                  </label>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn-primary" :disabled="tableFormLoading">
                    {{ tableFormLoading ? 'Saving...' : (isCreatingTable ? 'Create Table' : 'Save Changes') }}
                  </button>
                  <button
                    v-if="!isCreatingTable"
                    type="button"
                    class="btn-danger"
                    @click="confirmDeleteTable"
                  >
                    Delete Table
                  </button>
                </div>
              </form>
            </div>

            <!-- Seats Tab -->
            <div v-else-if="panelTab === 'seats'" class="panel-section">
              <!-- Seats Header -->
              <div class="seats-header">
                <div class="seats-stats">
                  <span class="stat available">{{ tableAvailableSeats }} available</span>
                  <span class="stat sold">{{ tableSoldSeats }} sold</span>
                </div>
                <div class="seats-actions">
                  <button @click="openBulkCreate" class="btn-ghost">Bulk Create</button>
                  <button @click="openAddSeat" class="btn-secondary">+ Add Seat</button>
                </div>
              </div>

              <!-- Seats List -->
              <div v-if="selectedTable.seats?.length > 0" class="seats-list">
                <div
                  v-for="seat in selectedTable.seats"
                  :key="seat.id"
                  :class="['seat-item', seat.status]"
                >
                  <div class="seat-info">
                    <span class="seat-label">{{ seat.label }}</span>
                    <span :class="['seat-status', seat.status]">{{ seat.status }}</span>
                  </div>
                  <div class="seat-price">${{ formatPrice(seat.price) }}</div>
                  <div class="seat-actions">
                    <button @click="openEditSeat(seat)" class="icon-btn" title="Edit">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="confirmDeleteSeat(seat)" class="icon-btn danger" title="Delete">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Empty Seats -->
              <div v-else class="empty-seats">
                <p>No seats created yet</p>
                <button @click="openBulkCreate" class="btn-primary">Create Seats</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Seat Form Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showSeatModal"
          class="floor-plan-modal-overlay"
          @click.self="closeSeatModal"
        >
          <div class="floor-plan-modal-content">
            <h3>{{ editingSeat ? 'Edit Seat' : 'Add Seat' }}</h3>
            <form @submit.prevent="handleSeatSubmit">
              <div class="form-group">
                <label>Seat Label</label>
                <input
                  v-model="seatForm.label"
                  type="text"
                  placeholder="e.g., A1, B2"
                  required
                />
              </div>
              <div class="form-group">
                <label>Price</label>
                <input
                  v-model="seatForm.price"
                  type="number"
                  step="0.01"
                  placeholder="200.00"
                  required
                />
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-ghost" @click="closeSeatModal">Cancel</button>
                <button type="submit" class="btn-primary" :disabled="seatFormLoading">
                  {{ seatFormLoading ? 'Saving...' : (editingSeat ? 'Save' : 'Add Seat') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Bulk Create Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showBulkModal"
          class="floor-plan-modal-overlay"
          @click.self="showBulkModal = false"
        >
          <div class="floor-plan-modal-content">
            <h3>Bulk Create Seats</h3>
            <form @submit.prevent="handleBulkSubmit">
              <div class="form-row">
                <div class="form-group">
                  <label>Label Prefix</label>
                  <input
                    v-model="bulkForm.prefix"
                    type="text"
                    placeholder="e.g., A, Seat-"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Number of Seats</label>
                  <input
                    v-model="bulkForm.count"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="8"
                    required
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Start Number</label>
                  <input
                    v-model="bulkForm.start_number"
                    type="number"
                    placeholder="1"
                  />
                </div>
                <div class="form-group">
                  <label>Price Each</label>
                  <input
                    v-model="bulkForm.price"
                    type="number"
                    step="0.01"
                    placeholder="200.00"
                    required
                  />
                </div>
              </div>
              <!-- Preview -->
              <div v-if="bulkPreview.length > 0" class="bulk-preview">
                <span class="preview-label">Preview:</span>
                <div class="preview-chips">
                  <span v-for="label in bulkPreview.slice(0, 10)" :key="label" class="preview-chip">{{ label }}</span>
                  <span v-if="bulkPreview.length > 10" class="preview-more">+{{ bulkPreview.length - 10 }} more</span>
                </div>
              </div>
              <div class="modal-actions">
                <button type="button" class="btn-ghost" @click="showBulkModal = false">Cancel</button>
                <button type="submit" class="btn-primary" :disabled="bulkLoading || bulkPreview.length === 0">
                  {{ bulkLoading ? 'Creating...' : `Create ${bulkPreview.length} Seats` }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <UiConfirmModal
      :is-open="showDeleteTableModal"
      title="Delete Table"
      :message="`Are you sure you want to delete '${selectedTable?.name}'? This will also delete all seats.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleDeleteTable"
      @cancel="showDeleteTableModal = false"
    />

    <UiConfirmModal
      :is-open="showDeleteSeatModal"
      title="Delete Seat"
      :message="`Are you sure you want to delete seat '${deletingSeat?.label}'?`"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleDeleteSeat"
      @cancel="showDeleteSeatModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

definePageMeta({
  layout: 'admin-fullscreen',
  middleware: ['auth', 'admin']
})

const route = useRoute()
const { getEvent } = useEvents()
const { getTables, createTable, updateTable, deleteTable } = useTables()
const { getSeats, createSeat, createSeatsBulk, updateSeat, deleteSeat } = useSeats()

const event = ref(null)
const tables = ref([])
const loading = ref(true)
const error = ref('')
const savingPositions = ref(false)
const hasUnsavedChanges = ref(false)
const showInstructions = ref(true)

// Canvas state
const canvasContainer = ref(null)
const zoom = ref(0.7)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const panStartX = ref(0)
const panStartY = ref(0)
const gridSnap = ref(true)
const gridSize = 25

// Drag state
const draggingTable = ref(null)
const dragStartX = ref(0)
const dragStartY = ref(0)
const tableStartX = ref(0)
const tableStartY = ref(0)
const hasDragged = ref(false)

// Panel state
const selectedTable = ref(null)
const isCreatingTable = ref(false)
const panelTab = ref('info')

// Table form
const tableForm = ref({
  name: '',
  capacity: 8,
  price: '',
  sell_as_whole: true,
  is_active: true
})
const tableFormLoading = ref(false)

// Seat form
const showSeatModal = ref(false)
const editingSeat = ref(null)
const seatForm = ref({ label: '', price: '' })
const seatFormLoading = ref(false)

// Bulk create
const showBulkModal = ref(false)
const bulkForm = ref({ prefix: '', count: 8, start_number: 1, price: '' })
const bulkLoading = ref(false)

// Delete modals
const showDeleteTableModal = ref(false)
const showDeleteSeatModal = ref(false)
const deletingSeat = ref(null)

// Computed
const totalSeats = computed(() => {
  return tables.value.reduce((total, table) => {
    if (table.sell_as_whole) return total + table.capacity
    return total + (table.seats?.length || 0)
  }, 0)
})

const availableSeats = computed(() => {
  return tables.value.reduce((total, table) => {
    if (table.sell_as_whole) {
      return total + (table.status === 'available' ? table.capacity : 0)
    }
    return total + (table.seats?.filter(s => s.status === 'available').length || 0)
  }, 0)
})

const tableAvailableSeats = computed(() => {
  return selectedTable.value?.seats?.filter(s => s.status === 'available').length || 0
})

const tableSoldSeats = computed(() => {
  return selectedTable.value?.seats?.filter(s => s.status === 'sold').length || 0
})

const bulkPreview = computed(() => {
  if (!bulkForm.value.prefix || !bulkForm.value.count) return []
  const labels = []
  const count = Math.min(parseInt(bulkForm.value.count) || 0, 50)
  const start = parseInt(bulkForm.value.start_number) || 1
  for (let i = 0; i < count; i++) {
    labels.push(`${bulkForm.value.prefix}${start + i}`)
  }
  return labels
})

const formatPrice = (price) => Number(price || 0).toFixed(0)

// Data fetching
const fetchData = async () => {
  loading.value = true
  error.value = ''

  try {
    const [eventRes, tablesRes] = await Promise.all([
      getEvent(route.params.slug),
      getTables(route.params.slug)
    ])

    event.value = eventRes.event
    tables.value = tablesRes.tables || []

    if (event.value?.seating_type !== 'seated') {
      navigateTo(`/app/admin/events/${route.params.slug}`)
    }

    // Center view on content after data loads
    nextTick(() => {
      setTimeout(() => centerOnContent(), 100)
    })
  } catch (e) {
    error.value = e.message || 'Failed to load floor plan'
  } finally {
    loading.value = false
  }
}

const fetchTableSeats = async (tableId) => {
  try {
    const res = await getSeats(route.params.slug, tableId)
    const table = tables.value.find(t => t.id === tableId)
    if (table) {
      table.seats = res.seats || []
    }
    if (selectedTable.value?.id === tableId) {
      selectedTable.value = { ...table }
    }
  } catch (e) {
    console.error('Failed to fetch seats:', e)
  }
}

// Panel functions
const openCreateTable = () => {
  isCreatingTable.value = true
  selectedTable.value = { id: 'new' }
  panelTab.value = 'info'
  tableForm.value = {
    name: `Table ${tables.value.length + 1}`,
    capacity: 8,
    price: '',
    sell_as_whole: true,
    is_active: true
  }
}

const closePanel = () => {
  selectedTable.value = null
  isCreatingTable.value = false
  panelTab.value = 'info'
}

const selectTable = (table) => {
  if (isCreatingTable.value) return
  selectedTable.value = { ...table }
  panelTab.value = 'info'
  tableForm.value = {
    name: table.name || '',
    capacity: table.capacity || 8,
    price: table.price || '',
    sell_as_whole: table.sell_as_whole !== false,
    is_active: table.is_active !== false
  }
  // Fetch seats if not VIP table
  if (!table.sell_as_whole) {
    fetchTableSeats(table.id)
  }
}

// Table CRUD
const handleTableSubmit = async () => {
  tableFormLoading.value = true
  try {
    const data = {
      name: tableForm.value.name,
      capacity: parseInt(tableForm.value.capacity) || 8,
      price: parseFloat(tableForm.value.price) || 0,
      sell_as_whole: tableForm.value.sell_as_whole,
      is_active: tableForm.value.is_active,
      position_x: isCreatingTable.value ? Math.round(200 + Math.random() * 400) : Math.round(selectedTable.value.position_x),
      position_y: isCreatingTable.value ? Math.round(150 + Math.random() * 300) : Math.round(selectedTable.value.position_y)
    }

    if (isCreatingTable.value) {
      await createTable(route.params.slug, data)
      isCreatingTable.value = false
      closePanel()
    } else {
      await updateTable(route.params.slug, selectedTable.value.id, data)
    }
    await fetchData()
    if (!isCreatingTable.value && selectedTable.value) {
      const updated = tables.value.find(t => t.id === selectedTable.value.id)
      if (updated) selectTable(updated)
    }
  } catch (e) {
    error.value = e.message || 'Failed to save table'
  } finally {
    tableFormLoading.value = false
  }
}

const confirmDeleteTable = () => {
  showDeleteTableModal.value = true
}

const handleDeleteTable = async () => {
  try {
    await deleteTable(route.params.slug, selectedTable.value.id)
    showDeleteTableModal.value = false
    closePanel()
    await fetchData()
  } catch (e) {
    error.value = e.message || 'Failed to delete table'
    showDeleteTableModal.value = false
  }
}

// Seat CRUD
const openAddSeat = () => {
  editingSeat.value = null
  seatForm.value = { label: '', price: '' }
  showSeatModal.value = true
}

const openEditSeat = (seat) => {
  editingSeat.value = seat
  seatForm.value = { label: seat.label, price: seat.price }
  showSeatModal.value = true
}

const closeSeatModal = () => {
  showSeatModal.value = false
  editingSeat.value = null
}

const handleSeatSubmit = async () => {
  seatFormLoading.value = true
  try {
    const data = {
      label: seatForm.value.label,
      price: parseFloat(seatForm.value.price) || 0,
      is_active: true
    }

    if (editingSeat.value) {
      await updateSeat(route.params.slug, editingSeat.value.id, data)
    } else {
      await createSeat(route.params.slug, selectedTable.value.id, data)
    }
    closeSeatModal()
    await fetchTableSeats(selectedTable.value.id)
  } catch (e) {
    error.value = e.message || 'Failed to save seat'
  } finally {
    seatFormLoading.value = false
  }
}

const openBulkCreate = () => {
  bulkForm.value = { prefix: '', count: 8, start_number: 1, price: '' }
  showBulkModal.value = true
}

const handleBulkSubmit = async () => {
  bulkLoading.value = true
  try {
    const seats = bulkPreview.value.map(label => ({
      label,
      price: parseFloat(bulkForm.value.price) || 0,
      is_active: true
    }))
    await createSeatsBulk(route.params.slug, selectedTable.value.id, seats)
    showBulkModal.value = false
    await fetchTableSeats(selectedTable.value.id)
  } catch (e) {
    error.value = e.message || 'Failed to create seats'
  } finally {
    bulkLoading.value = false
  }
}

const confirmDeleteSeat = (seat) => {
  deletingSeat.value = seat
  showDeleteSeatModal.value = true
}

const handleDeleteSeat = async () => {
  try {
    await deleteSeat(route.params.slug, deletingSeat.value.id)
    showDeleteSeatModal.value = false
    deletingSeat.value = null
    await fetchTableSeats(selectedTable.value.id)
  } catch (e) {
    error.value = e.message || 'Failed to delete seat'
    showDeleteSeatModal.value = false
  }
}

// Drag functions
const startDrag = (e, table) => {
  draggingTable.value = table
  dragStartX.value = e.clientX
  dragStartY.value = e.clientY
  tableStartX.value = table.position_x
  tableStartY.value = table.position_y
  hasDragged.value = false

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', endDrag)
}

const onDrag = (e) => {
  if (!draggingTable.value) return

  const deltaX = (e.clientX - dragStartX.value) / zoom.value
  const deltaY = (e.clientY - dragStartY.value) / zoom.value

  // Check if we've moved enough to consider it a drag
  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
    hasDragged.value = true
  }

  let newX = tableStartX.value + deltaX
  let newY = tableStartY.value + deltaY

  if (gridSnap.value) {
    newX = Math.round(newX / gridSize) * gridSize
    newY = Math.round(newY / gridSize) * gridSize
  }

  draggingTable.value.position_x = Math.max(0, newX)
  draggingTable.value.position_y = Math.max(100, newY)

  hasUnsavedChanges.value = true
}

const endDrag = () => {
  if (draggingTable.value && !hasDragged.value) {
    // It was a click, not a drag - select the table
    selectTable(draggingTable.value)
  }
  draggingTable.value = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
}

// Pan functions
const startPan = (e) => {
  if (draggingTable.value) return
  isPanning.value = true
  panStartX.value = e.clientX - panX.value
  panStartY.value = e.clientY - panY.value
}

const onPan = (e) => {
  if (!isPanning.value || draggingTable.value) return
  panX.value = e.clientX - panStartX.value
  panY.value = e.clientY - panStartY.value
}

const endPan = () => {
  isPanning.value = false
}

// Zoom towards cursor
const onWheel = (e) => {
  const container = canvasContainer.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const cursorX = e.clientX - rect.left
  const cursorY = e.clientY - rect.top

  const delta = e.deltaY > 0 ? -0.08 : 0.08
  const oldZoom = zoom.value
  const newZoom = Math.min(2, Math.max(0.3, oldZoom + delta))

  if (newZoom === oldZoom) return

  const contentX = (cursorX - panX.value) / oldZoom
  const contentY = (cursorY - panY.value) / oldZoom

  zoom.value = newZoom

  panX.value = cursorX - contentX * newZoom
  panY.value = cursorY - contentY * newZoom
}

const zoomIn = () => zoom.value = Math.min(2, zoom.value + 0.15)
const zoomOut = () => zoom.value = Math.max(0.3, zoom.value - 0.15)

// Center view on content
const centerOnContent = (targetZoom = null) => {
  const container = canvasContainer.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const containerWidth = rect.width
  const containerHeight = rect.height

  // If we have tables, center on them
  if (tables.value.length > 0) {
    // Find bounding box of all tables
    const tableWidth = 130
    const tableHeight = 100
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    tables.value.forEach(table => {
      minX = Math.min(minX, table.position_x)
      minY = Math.min(minY, table.position_y)
      maxX = Math.max(maxX, table.position_x + tableWidth)
      maxY = Math.max(maxY, table.position_y + tableHeight)
    })

    // Include stage area (roughly at top)
    minY = Math.min(minY, 10)
    maxY = Math.max(maxY, 70)

    // Calculate content center
    const contentCenterX = (minX + maxX) / 2
    const contentCenterY = (minY + maxY) / 2

    // Calculate zoom to fit content with padding
    const contentWidth = maxX - minX + 100
    const contentHeight = maxY - minY + 100
    const fitZoomX = containerWidth / contentWidth
    const fitZoomY = containerHeight / contentHeight
    const fitZoom = Math.min(fitZoomX, fitZoomY, 1) * 0.85

    zoom.value = targetZoom ?? fitZoom
    panX.value = (containerWidth / 2) - (contentCenterX * zoom.value)
    panY.value = (containerHeight / 2) - (contentCenterY * zoom.value)
  } else {
    // No tables - center on a default area for new floor plans
    zoom.value = targetZoom ?? 0.7
    panX.value = (containerWidth / 2) - (700 * zoom.value)
    panY.value = (containerHeight / 2) - (300 * zoom.value)
  }
}

const resetView = () => {
  centerOnContent(0.7)
}

const fitToView = () => {
  centerOnContent()
}

// Save positions
const saveAllPositions = async () => {
  if (!hasUnsavedChanges.value) return
  savingPositions.value = true

  try {
    for (const table of tables.value) {
      await updateTable(route.params.slug, table.id, {
        position_x: Math.round(table.position_x),
        position_y: Math.round(table.position_y)
      })
    }
    hasUnsavedChanges.value = false
  } catch (e) {
    error.value = e.message || 'Failed to save'
  } finally {
    savingPositions.value = false
  }
}

// Lifecycle
const handleBeforeUnload = (e) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  fetchData()
  window.addEventListener('beforeunload', handleBeforeUnload)

  setTimeout(() => {
    showInstructions.value = false
  }, 5000)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.floor-plan-page {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --header-h: 56px;
  --panel-w: 360px;

  --c-bg: #09090b;
  --c-surface: #18181b;
  --c-surface-elevated: #27272a;
  --c-border: rgba(255,255,255,0.08);
  --c-border-strong: rgba(255,255,255,0.15);
  --c-text: #fafafa;
  --c-text-secondary: #a1a1aa;
  --c-text-muted: #71717a;
  --c-primary: #6366f1;
  --c-primary-hover: #818cf8;
  --c-success: #22c55e;
  --c-warning: #f59e0b;
  --c-danger: #ef4444;

  font-family: var(--font-sans);
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--c-bg);
  -webkit-font-smoothing: antialiased;
}

/* Header */
.editor-header {
  height: var(--header-h);
  background: var(--c-surface);
  border-bottom: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  gap: 16px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  border-radius: 8px;
  color: var(--c-text-secondary);
  transition: all 0.15s;
  flex-shrink: 0;
}

.back-btn:hover {
  background: rgba(255,255,255,0.1);
  color: var(--c-text);
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.header-title h1 {
  font-size: 15px;
  font-weight: 600;
  color: var(--c-text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-title .subtitle {
  font-size: 12px;
  color: var(--c-text-muted);
  display: none;
}

@media (min-width: 640px) {
  .header-title .subtitle { display: block; }
}

.header-stats {
  display: none;
  align-items: center;
  gap: 20px;
}

@media (min-width: 900px) {
  .header-stats { display: flex; }
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-num {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
}

.stat-label {
  font-size: 11px;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.stat-chip.success .stat-num {
  color: var(--c-success);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s;
}

.action-btn svg { width: 16px; height: 16px; }

.action-btn .btn-text { display: none; }

@media (min-width: 480px) {
  .action-btn .btn-text { display: inline; }
}

.action-btn.ghost {
  color: var(--c-text-secondary);
  background: rgba(255,255,255,0.06);
}

.action-btn.ghost:hover {
  background: rgba(255,255,255,0.1);
  color: var(--c-text);
}

.action-btn.primary {
  color: var(--c-text-muted);
  background: rgba(255,255,255,0.06);
}

.action-btn.primary.has-changes {
  color: white;
  background: var(--c-success);
}

.action-btn.primary.has-changes:hover {
  background: #16a34a;
}

.action-btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* States */
.state-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 20px;
}

.state-container svg {
  width: 48px;
  height: 48px;
  color: var(--c-text-muted);
}

.state-container.error svg { color: var(--c-danger); }

.state-container p, .state-container h3 {
  font-size: 14px;
  color: var(--c-text-secondary);
  margin: 0;
}

.state-container h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--c-text);
}

.loader {
  width: 32px;
  height: 32px;
  border: 3px solid var(--c-border);
  border-top-color: var(--c-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.retry-btn, .create-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 12px 24px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: var(--c-primary);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  text-decoration: none;
}

.create-btn svg { width: 18px; height: 18px; }

.empty-icon {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.03);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.empty-icon svg { width: 36px; height: 36px; }

/* Editor */
.editor-wrapper {
  flex: 1;
  display: flex;
  position: relative;
  overflow: hidden;
}

/* Toolbar */
.toolbar-left {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
}

.tool-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.tool-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.tool-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.08);
  color: var(--c-text);
}

.tool-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.tool-btn.active { background: var(--c-primary); color: white; }
.tool-btn svg { width: 18px; height: 18px; }

.zoom-value {
  font-size: 10px;
  color: var(--c-text-muted);
  padding: 4px 0;
}

.tool-divider {
  width: 24px;
  height: 1px;
  background: var(--c-border);
  margin: 4px 0;
}

/* Canvas */
.canvas {
  flex: 1;
  overflow: hidden;
  cursor: grab;
  position: relative;
  background: radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.06) 0%, transparent 50%);
  transition: margin-right 0.3s ease;
}

.canvas.panel-open {
  margin-right: var(--panel-w);
}

@media (max-width: 900px) {
  .canvas.panel-open { margin-right: 0; }
}

.canvas.is-panning { cursor: grabbing; }
.canvas.is-dragging { cursor: move; }

.canvas-content {
  position: relative;
  width: 1400px;
  height: 1000px;
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 25px 25px;
}

/* Stage */
.stage {
  position: absolute;
  top: 10px;
  left: 100px;
  right: 100px;
  height: 60px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: rgba(255,255,255,0.6);
}

.stage svg { width: 20px; height: 20px; }
.stage span { font-size: 12px; font-weight: 600; letter-spacing: 0.15em; }

/* Tables */
.table-item {
  position: absolute;
  width: 130px;
  background: #fafafa;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  transition: box-shadow 0.15s, transform 0.1s;
  user-select: none;
}

.table-item:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.4);
}

.table-item.dragging {
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5);
  z-index: 100;
  transform: scale(1.02);
}

.table-item.selected {
  box-shadow: 0 0 0 3px var(--c-primary), 0 8px 30px rgba(99, 102, 241, 0.4);
}

.table-item.vip { border: 2px solid var(--c-warning); }
.table-item.sold { opacity: 0.5; }

.table-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #18181b;
}

.table-item.vip .table-top {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.table-name {
  font-size: 11px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vip-badge {
  font-size: 8px;
  font-weight: 700;
  color: var(--c-warning);
  background: rgba(245, 158, 11, 0.2);
  padding: 2px 5px;
  border-radius: 4px;
}

.table-item.vip .vip-badge {
  color: white;
  background: rgba(255,255,255,0.25);
}

.table-middle {
  padding: 10px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vip-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #525252;
}

.vip-content svg { width: 22px; height: 22px; }
.vip-content span { font-size: 10px; font-weight: 500; }

.seats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.seat-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.seat-dot.available { background: #d1fae5; }
.seat-dot.reserved { background: #fef3c7; }
.seat-dot.sold { background: #e5e5e5; }

.seats-more {
  font-size: 8px;
  font-weight: 600;
  color: #a1a1aa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background: #f4f4f5;
  border-top: 1px solid #e4e4e7;
}

.table-price {
  font-size: 11px;
  font-weight: 600;
  color: #0a0a0a;
}

.seats-count {
  font-size: 10px;
  color: #71717a;
}

/* Position Indicator */
.position-indicator {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  font-size: 11px;
  color: var(--c-text);
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 6px;
}

/* Instructions */
.instructions-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.instructions-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  max-width: 300px;
}

.instructions-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
  margin: 0 0 16px 0;
}

.instructions-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.instructions-card li {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 13px;
  color: var(--c-text-secondary);
}

.instructions-card kbd {
  display: inline-block;
  padding: 3px 8px;
  font-size: 11px;
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
  color: var(--c-text);
}

.got-it-btn {
  width: 100%;
  padding: 12px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: var(--c-primary);
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

/* Side Panel */
.side-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: var(--panel-w);
  height: 100%;
  background: var(--c-surface);
  border-left: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  z-index: 15;
}

@media (max-width: 900px) {
  .side-panel {
    width: 100%;
    max-width: 400px;
    box-shadow: -10px 0 40px rgba(0,0,0,0.5);
  }
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid var(--c-border);
  flex-shrink: 0;
}

.panel-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.panel-title-row h2 {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.close-btn:hover {
  background: rgba(255,255,255,0.08);
  color: var(--c-text);
}

.close-btn svg { width: 18px; height: 18px; }

.panel-tabs {
  display: flex;
  gap: 4px;
}

.tab-btn {
  flex: 1;
  padding: 8px 12px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--c-text-muted);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.tab-btn:hover { color: var(--c-text-secondary); }
.tab-btn.active {
  background: rgba(255,255,255,0.08);
  color: var(--c-text);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Forms */
.table-form, .modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text-secondary);
}

.form-group input {
  padding: 10px 12px;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--c-text);
  background: var(--c-surface-elevated);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  transition: all 0.15s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.form-group input::placeholder {
  color: var(--c-text-muted);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-toggle {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--c-border);
  border-radius: 8px;
}

.form-toggle input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: var(--c-primary);
}

.form-toggle label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
}

.toggle-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--c-text);
}

.toggle-desc {
  font-size: 12px;
  color: var(--c-text-muted);
}

.form-actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
}

.btn-primary, .btn-secondary, .btn-ghost, .btn-danger {
  padding: 10px 16px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-primary {
  flex: 1;
  color: white;
  background: var(--c-primary);
}

.btn-primary:hover { background: var(--c-primary-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary {
  color: var(--c-text);
  background: var(--c-surface-elevated);
}

.btn-secondary:hover { background: rgba(255,255,255,0.15); }

.btn-ghost {
  color: var(--c-text-secondary);
  background: transparent;
}

.btn-ghost:hover { background: rgba(255,255,255,0.06); }

.btn-danger {
  color: var(--c-danger);
  background: rgba(239, 68, 68, 0.1);
}

.btn-danger:hover { background: rgba(239, 68, 68, 0.2); }

/* Seats Section */
.seats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--c-border);
}

.seats-stats {
  display: flex;
  gap: 12px;
}

.seats-stats .stat {
  font-size: 12px;
  font-weight: 500;
}

.seats-stats .stat.available { color: var(--c-success); }
.seats-stats .stat.sold { color: var(--c-text-muted); }

.seats-actions {
  display: flex;
  gap: 8px;
}

.seats-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.seat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--c-border);
  border-radius: 8px;
}

.seat-item.sold {
  opacity: 0.6;
}

.seat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.seat-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--c-text);
}

.seat-status {
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
}

.seat-status.available { color: var(--c-success); }
.seat-status.reserved { color: var(--c-warning); }
.seat-status.sold { color: var(--c-text-muted); }

.seat-price {
  font-size: 13px;
  font-weight: 500;
  color: var(--c-text-secondary);
}

.seat-actions {
  display: flex;
  gap: 4px;
}

.icon-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.icon-btn svg { width: 14px; height: 14px; }

.icon-btn:hover {
  background: rgba(255,255,255,0.08);
  color: var(--c-text);
}

.icon-btn.danger:hover {
  background: rgba(239, 68, 68, 0.15);
  color: var(--c-danger);
}

.empty-seats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
  text-align: center;
}

.empty-seats p {
  font-size: 14px;
  color: var(--c-text-muted);
  margin: 0;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}

/* Mobile */
@media (max-width: 640px) {
  .toolbar-left {
    left: 8px;
    padding: 6px;
  }
  .tool-btn {
    width: 32px;
    height: 32px;
  }
}
</style>

<!-- Non-scoped styles for teleported modals -->
<style>
.floor-plan-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.floor-plan-modal-content {
  width: 100%;
  max-width: 420px;
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.floor-plan-modal-content h3 {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #fafafa;
  margin: 0 0 20px 0;
}

.floor-plan-modal-content .form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.floor-plan-modal-content .form-group label {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #a1a1aa;
}

.floor-plan-modal-content .form-group input {
  padding: 10px 12px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  color: #fafafa;
  background: #27272a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.15s;
}

.floor-plan-modal-content .form-group input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.floor-plan-modal-content .form-group input::placeholder {
  color: #71717a;
}

.floor-plan-modal-content .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.floor-plan-modal-content .form-row .form-group {
  margin-bottom: 0;
}

.floor-plan-modal-content .modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.floor-plan-modal-content .btn-ghost {
  padding: 10px 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #a1a1aa;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.floor-plan-modal-content .btn-ghost:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fafafa;
}

.floor-plan-modal-content .btn-primary {
  padding: 10px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: #6366f1;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.floor-plan-modal-content .btn-primary:hover {
  background: #818cf8;
}

.floor-plan-modal-content .btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.floor-plan-modal-content .bulk-preview {
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  margin-top: 16px;
}

.floor-plan-modal-content .preview-label {
  display: block;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #a1a1aa;
  margin-bottom: 8px;
}

.floor-plan-modal-content .preview-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.floor-plan-modal-content .preview-chip {
  padding: 4px 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  color: #fafafa;
  background: #27272a;
  border-radius: 4px;
}

.floor-plan-modal-content .preview-more {
  padding: 4px 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  color: #71717a;
}
</style>
