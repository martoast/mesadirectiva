<template>
  <div class="orders-page">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-title-row">
          <h1>{{ t.pageTitle }}</h1>
          <span class="order-count">{{ summary.total_orders || 0 }}</span>
        </div>
        <p class="header-description">{{ t.pageSubtitle }}</p>
      </div>
    </header>

    <!-- Stats Overview -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ summary.total_orders || 0 }}</span>
        <span class="stat-label">{{ t.totalOrders }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value stat-revenue">${{ formatCurrency(summary.total_revenue || 0) }}</span>
        <span class="stat-label">{{ t.revenue }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ completedCount }}</span>
        <span class="stat-label">{{ t.completed }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-value">{{ pendingCount }}</span>
        <span class="stat-label">{{ t.pending }}</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="filter-group-row">
        <div class="search-wrapper">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="search"
            type="text"
            :placeholder="t.searchPlaceholder"
            class="search-input"
            @input="debouncedSearch"
          />
        </div>

        <div class="filter-item">
          <label>{{ t.event }}</label>
          <div class="select-wrapper">
            <select v-model="filterEvent">
              <option value="">{{ t.allEvents }}</option>
              <option v-for="event in events" :key="event.id" :value="event.id">
                {{ event.name }}
              </option>
            </select>
            <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="filter-item">
          <label>{{ t.status }}</label>
          <div class="select-wrapper">
            <select v-model="filterStatus">
              <option value="">{{ t.allStatus }}</option>
              <option value="pending">{{ t.pending }}</option>
              <option value="completed">{{ t.completed }}</option>
              <option value="failed">{{ t.failed }}</option>
              <option value="refunded">{{ t.refunded }}</option>
            </select>
            <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div class="filter-item date-filter">
          <label>{{ t.from }}</label>
          <input v-model="dateFrom" type="date" class="date-input" />
        </div>

        <div class="filter-item date-filter">
          <label>{{ t.to }}</label>
          <input v-model="dateTo" type="date" class="date-input" />
        </div>

        <button v-if="hasActiveFilters" @click="clearFilters" class="clear-btn">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ t.clear }}
        </button>
      </div>
      <span class="results-text">{{ orders.length }} {{ ordersLabel }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loading-state">
        <div class="loader"></div>
        <span>{{ t.loadingOrders }}</span>
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
        <button @click="fetchOrders" class="btn-retry">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ t.tryAgain }}
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="state-container">
      <div class="empty-state">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3>{{ t.noOrdersFound }}</h3>
        <p>{{ t.tryAdjustingFilters }}</p>
      </div>
    </div>

    <!-- Orders Content -->
    <div v-else class="orders-content">
      <!-- Desktop Table View -->
      <div class="table-view">
        <table class="orders-table">
          <thead>
            <tr>
              <th class="col-order">{{ t.orderNumber }}</th>
              <th class="col-customer">{{ t.customer }}</th>
              <th class="col-event">{{ t.event }}</th>
              <th class="col-type">{{ t.type }}</th>
              <th class="col-items">{{ t.items }}</th>
              <th class="col-total">{{ t.total }}</th>
              <th class="col-status">{{ t.status }}</th>
              <th class="col-date">{{ t.date }}</th>
              <th class="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td class="col-order">
                <span class="order-number">{{ order.order_number }}</span>
              </td>
              <td class="col-customer">
                <div class="customer-info">
                  <span class="customer-name">{{ order.customer_name }}</span>
                  <span class="customer-email">{{ order.customer_email }}</span>
                </div>
              </td>
              <td class="col-event">
                <span class="event-name">{{ order.event?.name || '—' }}</span>
              </td>
              <td class="col-type">
                <span :class="['type-badge', getOrderTypeClass(order)]">
                  {{ getOrderType(order) }}
                </span>
              </td>
              <td class="col-items">
                <div v-if="order.tables?.length > 0 || order.seats?.length > 0" class="items-list">
                  <span v-if="order.tables?.length > 0">{{ order.tables.length }} {{ t.tables }}</span>
                  <span v-if="order.seats?.length > 0">{{ order.seats.length }} {{ t.seats }}</span>
                </div>
                <div v-else-if="order.tier_items?.length > 0" class="items-list">
                  <span v-for="tier in order.tier_items" :key="tier.tier_id">
                    {{ tier.tier_name }}: {{ tier.quantity }}
                  </span>
                </div>
                <span v-else class="items-count">{{ order.ticket_count }} {{ t.tickets }}</span>
              </td>
              <td class="col-total">
                <span class="total-amount">${{ order.total?.toFixed(2) }}</span>
              </td>
              <td class="col-status">
                <span :class="['status-badge', order.status]">
                  <span class="status-dot"></span>
                  {{ statusLabel(order.status) }}
                </span>
              </td>
              <td class="col-date">
                <span class="date-text">{{ formatDate(order.created_at) }}</span>
              </td>
              <td class="col-actions">
                <div class="actions-dropdown" v-click-outside="() => closeDropdown(order.id)">
                  <button
                    class="dropdown-trigger"
                    @click="toggleDropdown(order.id)"
                    :aria-expanded="openDropdownId === order.id"
                    aria-label="Actions"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  <Transition name="dropdown">
                    <div v-if="openDropdownId === order.id" class="dropdown-menu">
                      <NuxtLink :to="`/app/admin/orders/${order.order_number}`" class="dropdown-item">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {{ t.viewDetails }}
                      </NuxtLink>
                    </div>
                  </Transition>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards View -->
      <div class="cards-view">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="card-header">
            <span class="order-number">{{ order.order_number }}</span>
            <span :class="['status-badge', order.status]">
              <span class="status-dot"></span>
              {{ statusLabel(order.status) }}
            </span>
          </div>

          <div class="card-customer">
            <span class="customer-name">{{ order.customer_name }}</span>
            <span class="customer-email">{{ order.customer_email }}</span>
          </div>

          <div class="card-details">
            <div class="detail-item">
              <span class="detail-label">{{ t.event }}</span>
              <span class="detail-value">{{ order.event?.name || '—' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t.total }}</span>
              <span class="detail-value total">${{ order.total?.toFixed(2) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ t.date }}</span>
              <span class="detail-value">{{ formatDate(order.created_at) }}</span>
            </div>
          </div>

          <NuxtLink :to="`/app/admin/orders/${order.order_number}`" class="card-action">
            {{ t.viewDetails }}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { t: createT, language } = useLanguage()

// Translations
const translations = {
  pageTitle: { es: 'Órdenes', en: 'Orders' },
  pageSubtitle: { es: 'Ver y gestionar todas las órdenes de boletos', en: 'View and manage all ticket orders' },
  total: { es: 'Total', en: 'Total' },
  revenue: { es: 'Ingresos', en: 'Revenue' },
  totalOrders: { es: 'Órdenes', en: 'Orders' },
  searchPlaceholder: { es: 'Buscar por nombre, correo o # de orden', en: 'Search by name, email, or order #' },
  event: { es: 'Evento', en: 'Event' },
  allEvents: { es: 'Todos', en: 'All' },
  status: { es: 'Estado', en: 'Status' },
  allStatus: { es: 'Todos', en: 'All' },
  pending: { es: 'Pendiente', en: 'Pending' },
  completed: { es: 'Completada', en: 'Completed' },
  failed: { es: 'Fallida', en: 'Failed' },
  refunded: { es: 'Reembolsada', en: 'Refunded' },
  from: { es: 'Desde', en: 'From' },
  to: { es: 'Hasta', en: 'To' },
  clear: { es: 'Limpiar', en: 'Clear' },
  loadingOrders: { es: 'Cargando órdenes...', en: 'Loading orders...' },
  noOrdersFound: { es: 'No se encontraron órdenes', en: 'No orders found' },
  tryAdjustingFilters: { es: 'Intenta ajustar tus filtros', en: 'Try adjusting your filters' },
  tryAgain: { es: 'Intentar de Nuevo', en: 'Try Again' },
  orderNumber: { es: 'Orden #', en: 'Order #' },
  customer: { es: 'Cliente', en: 'Customer' },
  type: { es: 'Tipo', en: 'Type' },
  items: { es: 'Artículos', en: 'Items' },
  date: { es: 'Fecha', en: 'Date' },
  actions: { es: 'Acciones', en: 'Actions' },
  seated: { es: 'Con Asientos', en: 'Seated' },
  tiered: { es: 'Por Niveles', en: 'Tiered' },
  general: { es: 'General', en: 'General' },
  tables: { es: 'mesa(s)', en: 'table(s)' },
  seats: { es: 'asiento(s)', en: 'seat(s)' },
  tickets: { es: 'boleto(s)', en: 'ticket(s)' },
  viewDetails: { es: 'Ver Detalles', en: 'View Details' },
  errorTitle: { es: 'Error al cargar', en: 'Failed to load' }
}

const t = createT(translations)

const ordersLabel = computed(() => {
  if (language.value === 'es') {
    return orders.value.length === 1 ? 'orden' : 'órdenes'
  }
  return orders.value.length === 1 ? 'order' : 'orders'
})

const { getOrdersReport } = useReports()
const { getEvents } = useEvents()

const orders = ref([])
const events = ref([])
const loading = ref(true)
const error = ref('')
const search = ref('')
const filterEvent = ref('')
const filterStatus = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const summary = ref({ total_orders: 0, total_revenue: 0 })
const openDropdownId = ref(null)

let searchTimeout = null

// Computed stats
const completedCount = computed(() => orders.value.filter(o => o.status === 'completed').length)
const pendingCount = computed(() => orders.value.filter(o => o.status === 'pending').length)

const hasActiveFilters = computed(() => {
  return search.value || filterEvent.value || filterStatus.value || dateFrom.value || dateTo.value
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

const clearFilters = () => {
  search.value = ''
  filterEvent.value = ''
  filterStatus.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  fetchOrders()
}

const fetchEvents = async () => {
  try {
    const response = await getEvents({ per_page: 100 })
    events.value = response.events || []
  } catch (e) {
    // Events are optional for filtering
  }
}

const fetchOrders = async () => {
  loading.value = true
  error.value = ''

  try {
    const params = {}

    if (search.value) params.search = search.value
    if (filterEvent.value) params.event_id = filterEvent.value
    if (filterStatus.value) params.status = filterStatus.value
    if (dateFrom.value) params.date_from = dateFrom.value
    if (dateTo.value) params.date_to = dateTo.value

    const response = await getOrdersReport(params)
    orders.value = response.orders || []
    summary.value = response.summary || { total_orders: orders.value.length, total_revenue: orders.value.reduce((sum, o) => sum + (o.total || 0), 0) }
  } catch (e) {
    error.value = e.message || 'Failed to load orders'
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchOrders()
  }, 300)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M'
  }
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'K'
  }
  return amount.toFixed(2)
}

const statusLabel = (status) => {
  const labels = {
    pending: t.pending,
    completed: t.completed,
    failed: t.failed,
    refunded: t.refunded
  }
  return labels[status] || status
}

const getOrderType = (order) => {
  if (order.tables?.length > 0 || order.seats?.length > 0) return t.seated
  if (order.tier_items?.length > 0) return t.tiered
  return t.general
}

const getOrderTypeClass = (order) => {
  if (order.tables?.length > 0 || order.seats?.length > 0) return 'seated'
  if (order.tier_items?.length > 0) return 'tiered'
  return 'general'
}

watch([filterEvent, filterStatus, dateFrom, dateTo], () => {
  fetchOrders()
})

onMounted(() => {
  fetchEvents()
  fetchOrders()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

/* Global box-sizing */
.orders-page,
.orders-page *,
.orders-page *::before,
.orders-page *::after {
  box-sizing: border-box;
}

.orders-page {
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
  --color-success: #2d5a27;
  --color-success-subtle: rgba(45, 90, 39, 0.08);
  --color-warning: #b45309;
  --color-warning-subtle: rgba(180, 83, 9, 0.08);
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

.order-count {
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
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  margin-bottom: var(--space-lg);
  width: 100%;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 50px;
  flex: 1;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-value.stat-revenue {
  color: var(--color-success);
}

.stat-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-ink-muted);
  white-space: nowrap;
}

.stat-divider {
  width: 1px;
  height: 28px;
  background: var(--color-border);
  flex-shrink: 0;
}

@media (min-width: 480px) {
  .stats-row {
    gap: var(--space-lg);
    padding: var(--space-lg);
    flex-wrap: nowrap;
  }

  .stat-item {
    flex: none;
    min-width: 60px;
  }

  .stat-value {
    font-size: 24px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stat-divider {
    height: 32px;
  }
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
   Filters Bar
   ======================================== */
.filters-bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  width: 100%;
}

.filter-group-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  align-items: flex-end;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-ink-muted);
}

.search-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  outline: none;
  transition: all 0.15s ease;
}

.search-input:focus {
  border-color: var(--color-ink-light);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
}

.search-input::placeholder {
  color: var(--color-ink-muted);
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-item label {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  padding: 12px 36px 12px 14px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  appearance: none;
  min-width: 100px;
  transition: all 0.15s ease;
}

.select-wrapper select:hover {
  border-color: var(--color-stone-dark);
}

.select-wrapper select:focus {
  outline: none;
  border-color: var(--color-ink-light);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
}

.select-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--color-ink-muted);
  pointer-events: none;
}

.date-input {
  padding: 12px 14px;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  outline: none;
  min-width: 130px;
  transition: all 0.15s ease;
}

.date-input:focus {
  border-color: var(--color-ink-light);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.06);
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 14px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink-lighter);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.clear-btn:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
  background: var(--color-danger-subtle);
}

.clear-btn svg {
  width: 14px;
  height: 14px;
}

.results-text {
  font-size: 13px;
  color: var(--color-ink-lighter);
}

@media (min-width: 768px) {
  .filters-bar {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .search-wrapper {
    min-width: 100%;
  }

  .filter-item {
    flex: 1;
    min-width: calc(50% - 4px);
  }

  .date-filter {
    min-width: calc(50% - 4px);
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
  max-width: 280px;
  line-height: 1.5;
}

/* ========================================
   Orders Content
   ======================================== */
.orders-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
}

/* Table View (Desktop) */
.table-view {
  display: none;
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table thead tr {
  border-bottom: 1px solid var(--color-border);
}

.orders-table th {
  padding: 14px 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-ink-muted);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.orders-table tbody tr {
  border-bottom: 1px solid var(--color-border-subtle);
  transition: background 0.1s ease;
}

.orders-table tbody tr:last-child {
  border-bottom: none;
}

.orders-table tbody tr:hover {
  background: var(--color-hover);
}

.orders-table td {
  padding: 14px 16px;
  font-size: 13px;
  color: var(--color-ink-light);
  vertical-align: middle;
}

/* Order Number */
.order-number {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-ink);
  background: var(--color-border-subtle);
  padding: 4px 10px;
  border-radius: 6px;
}

/* Customer */
.customer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-name {
  font-weight: 600;
  color: var(--color-ink);
}

.customer-email {
  font-size: 12px;
  color: var(--color-ink-muted);
}

/* Event */
.event-name {
  color: var(--color-ink-light);
}

/* Type Badge */
.type-badge {
  display: inline-flex;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
}

.type-badge.seated {
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.1);
}

.type-badge.tiered {
  color: var(--color-indigo);
  background: rgba(38, 70, 83, 0.1);
}

.type-badge.general {
  color: var(--color-ink-muted);
  background: var(--color-border-subtle);
}

/* Items */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
}

.items-count {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 500;
}

/* Total */
.total-amount {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-ink);
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.pending {
  color: var(--color-warning);
  background: var(--color-warning-subtle);
}

.status-badge.pending .status-dot {
  background: var(--color-warning);
}

.status-badge.completed {
  color: var(--color-success);
  background: var(--color-success-subtle);
}

.status-badge.completed .status-dot {
  background: var(--color-success);
}

.status-badge.failed {
  color: var(--color-danger);
  background: var(--color-danger-subtle);
}

.status-badge.failed .status-dot {
  background: var(--color-danger);
}

.status-badge.refunded {
  color: var(--color-ink-muted);
  background: var(--color-border-subtle);
}

.status-badge.refunded .status-dot {
  background: var(--color-ink-muted);
}

/* Date */
.date-text {
  font-size: 12px;
  color: var(--color-ink-lighter);
}

/* Actions Dropdown */
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
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dropdown-item:hover {
  background: var(--color-hover);
  color: var(--color-ink);
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

/* Cards View (Mobile) */
.cards-view {
  display: flex;
  flex-direction: column;
}

.order-card {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border-subtle);
}

.order-card:last-child {
  border-bottom: none;
}

.order-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.card-customer {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border-subtle);
}

.card-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 13px;
  color: var(--color-ink-light);
}

.detail-value.total {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-ink);
}

.card-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: 14px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: var(--color-ink);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s ease;
}

.card-action:hover {
  background: var(--color-ink-light);
}

.card-action svg {
  width: 16px;
  height: 16px;
}

@media (min-width: 768px) {
  .table-view {
    display: block;
  }

  .cards-view {
    display: none;
  }
}

@media (max-width: 480px) {
  .card-details {
    grid-template-columns: 1fr 1fr;
  }
}

/* Column widths */
.col-order { min-width: 120px; }
.col-customer { min-width: 180px; }
.col-event { min-width: 140px; }
.col-type { min-width: 90px; }
.col-items { min-width: 120px; }
.col-total { min-width: 80px; }
.col-status { min-width: 110px; }
.col-date { min-width: 100px; }
.col-actions { width: 60px; }
</style>
