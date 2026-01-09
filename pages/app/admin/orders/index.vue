<template>
  <div class="orders-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t.pageTitle }}</h1>
        <p class="page-subtitle">{{ t.pageSubtitle }}</p>
      </div>
      <div class="header-stats">
        <div class="mini-stat">
          <span class="mini-stat-value">{{ summary.total_orders || 0 }}</span>
          <span class="mini-stat-label">{{ t.total }}</span>
        </div>
        <div class="mini-stat">
          <span class="mini-stat-value">${{ formatCurrency(summary.total_revenue || 0) }}</span>
          <span class="mini-stat-label">{{ t.revenue }}</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
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

      <div class="filter-group">
        <label class="filter-label">{{ t.event }}</label>
        <select v-model="filterEvent" class="filter-select">
          <option value="">{{ t.allEvents }}</option>
          <option v-for="event in events" :key="event.id" :value="event.id">
            {{ event.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">{{ t.status }}</label>
        <select v-model="filterStatus" class="filter-select">
          <option value="">{{ t.allStatus }}</option>
          <option value="pending">{{ t.pending }}</option>
          <option value="completed">{{ t.completed }}</option>
          <option value="failed">{{ t.failed }}</option>
          <option value="refunded">{{ t.refunded }}</option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">{{ t.from }}</label>
        <input v-model="dateFrom" type="date" class="filter-input" />
      </div>

      <div class="filter-group">
        <label class="filter-label">{{ t.to }}</label>
        <input v-model="dateTo" type="date" class="filter-input" />
      </div>

      <button v-if="hasActiveFilters" @click="clearFilters" class="clear-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {{ t.clear }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="loading-spinner"></div>
      <p class="state-text">{{ t.loadingOrders }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container error">
      <svg class="state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="state-text">{{ error }}</p>
      <button @click="fetchOrders" class="retry-btn">{{ t.tryAgain }}</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="state-container">
      <svg class="state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="state-text">{{ t.noOrdersFound }}</p>
      <p class="state-hint">{{ t.tryAdjustingFilters }}</p>
    </div>

    <!-- Orders Table -->
    <div v-else class="table-container">
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
            <th class="col-actions">{{ t.actions }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td class="col-order">
              <span class="order-number">{{ order.order_number }}</span>
            </td>
            <td class="col-customer">
              <span class="customer-name">{{ order.customer_name }}</span>
              <span class="customer-email">{{ order.customer_email }}</span>
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
              <NuxtLink :to="`/app/admin/orders/${order.order_number}`" class="action-btn view" title="View Details">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div v-if="!loading && !error && orders.length > 0" class="mobile-cards">
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
  searchPlaceholder: { es: 'Buscar por nombre, correo o # de orden', en: 'Search by name, email, or order #' },
  event: { es: 'Evento', en: 'Event' },
  allEvents: { es: 'Todos los Eventos', en: 'All Events' },
  status: { es: 'Estado', en: 'Status' },
  allStatus: { es: 'Todos los Estados', en: 'All Status' },
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
  viewDetails: { es: 'Ver Detalles', en: 'View Details' }
}

const t = createT(translations)

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

let searchTimeout = null

const hasActiveFilters = computed(() => {
  return search.value || filterEvent.value || filterStatus.value || dateFrom.value || dateTo.value
})

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
  if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'k'
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
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');

.orders-page {
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
  max-width: 1400px;
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

.header-stats {
  display: flex;
  gap: 24px;
}

.mini-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.mini-stat-value {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 500;
  color: var(--color-text);
}

.mini-stat-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Filters */
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  margin-bottom: 20px;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 240px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-select,
.filter-input {
  padding: 10px 12px;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  outline: none;
  min-width: 120px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.filter-select:focus,
.filter-input:focus {
  border-color: var(--color-primary);
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.clear-btn:hover {
  color: var(--color-danger);
  border-color: var(--color-danger);
  background: #fef2f2;
}

.clear-btn svg {
  width: 14px;
  height: 14px;
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

/* Table */
.table-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
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
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.orders-table tbody tr {
  border-bottom: 1px solid var(--color-border-light);
  transition: background 0.1s;
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
  color: var(--color-text-secondary);
  vertical-align: middle;
}

/* Order Number */
.order-number {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text);
  background: var(--color-border-light);
  padding: 4px 8px;
  border-radius: 4px;
}

/* Customer */
.col-customer {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-name {
  font-weight: 500;
  color: var(--color-text);
}

.customer-email {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* Event */
.event-name {
  color: var(--color-text-secondary);
}

/* Type Badge */
.type-badge {
  display: inline-flex;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 50px;
}

.type-badge.seated {
  color: #7c3aed;
  background: #ede9fe;
}

.type-badge.tiered {
  color: #2563eb;
  background: #dbeafe;
}

.type-badge.general {
  color: var(--color-text-muted);
  background: var(--color-border-light);
}

/* Items */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
}

.items-count {
  font-family: var(--font-mono);
  font-size: 12px;
}

/* Total */
.total-amount {
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--color-text);
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 50px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.pending {
  color: var(--color-warning);
  background: #fef3c7;
}

.status-badge.pending .status-dot {
  background: var(--color-warning);
}

.status-badge.completed {
  color: var(--color-success);
  background: #d1fae5;
}

.status-badge.completed .status-dot {
  background: var(--color-success);
}

.status-badge.failed {
  color: var(--color-danger);
  background: #fee2e2;
}

.status-badge.failed .status-dot {
  background: var(--color-danger);
}

.status-badge.refunded {
  color: var(--color-text-muted);
  background: var(--color-border-light);
}

.status-badge.refunded .status-dot {
  background: var(--color-text-muted);
}

/* Date */
.date-text {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* Actions */
.action-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.view:hover {
  color: var(--color-primary);
  background: #eef2ff;
}

/* Mobile Cards */
.mobile-cards {
  display: none;
}

.order-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-customer {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border-light);
}

.card-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.detail-value.total {
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--color-text);
}

.card-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  font-size: 13px;
  font-weight: 500;
  color: white;
  background: var(--color-text);
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.15s;
}

.card-action:hover {
  background: #262626;
}

.card-action svg {
  width: 16px;
  height: 16px;
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
.col-actions { min-width: 60px; }

/* Responsive */
@media (max-width: 1024px) {
  .table-container {
    display: none;
  }

  .mobile-cards {
    display: block;
  }
}

@media (max-width: 768px) {
  .orders-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-stats {
    width: 100%;
    justify-content: flex-start;
  }

  .filters-bar {
    padding: 12px;
  }

  .search-wrapper {
    min-width: 100%;
  }

  .filter-group {
    flex: 1;
    min-width: calc(50% - 6px);
  }

  .card-details {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
