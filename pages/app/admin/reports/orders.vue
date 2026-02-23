<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ t.ordersReport }}</h1>
        <p class="text-gray-600 mt-1">{{ t.ordersSubtitle }}</p>
      </div>
      <button
        @click="handleExport"
        :disabled="exporting"
        class="px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors font-semibold disabled:opacity-50"
      >
        {{ exporting ? t.exporting : t.exportToExcel }}
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center bg-white rounded-xl shadow-card p-4">
      <select
        v-model="filterEvent"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">{{ t.allEvents }}</option>
        <option v-for="event in events" :key="event.id" :value="event.id">
          {{ event.name }}
        </option>
      </select>
      <select
        v-model="filterGroup"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">{{ t.allGroups }}</option>
        <option v-for="group in groups" :key="group.id" :value="group.id">
          {{ group.name }}
        </option>
      </select>
      <select
        v-model="filterStatus"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">{{ t.allStatus }}</option>
        <option value="pending">{{ t.pending }}</option>
        <option value="completed">{{ t.completed }}</option>
        <option value="failed">{{ t.failed }}</option>
        <option value="refunded">{{ t.refunded }}</option>
      </select>
      <input
        v-model="dateFrom"
        type="date"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      />
      <input
        v-model="dateTo"
        type="date"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      />
      <input
        v-model="search"
        type="text"
        :placeholder="t.search"
        class="flex-1 min-w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        @input="debouncedSearch"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">{{ t.loadingReport }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Orders Table -->
    <div v-else class="bg-white rounded-xl shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-gray-200">
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ t.orderNumber }}</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ t.customer }}</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ t.event }}</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ t.type }}</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ t.items }}</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ t.total }}</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ t.status }}</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">{{ t.date }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-sm font-mono font-medium text-gray-900">
                {{ order.order_number }}
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-medium text-gray-900">{{ order.customer_name }}</p>
                <p class="text-sm text-gray-500">{{ order.customer_email }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ order.event?.name || '-' }}
              </td>
              <td class="px-6 py-4">
                <span :class="orderTypeClass(order)">
                  {{ getOrderType(order) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                <div v-if="order.tables?.length > 0 || order.seats?.length > 0">
                  <span v-if="order.tables?.length > 0" class="block">{{ order.tables.length }} {{ t.tables }}</span>
                  <span v-if="order.seats?.length > 0" class="block">{{ order.seats.length }} {{ t.seats }}</span>
                </div>
                <div v-else-if="order.tier_items?.length > 0">
                  <span v-for="tier in order.tier_items" :key="tier.tier_id" class="block text-xs">
                    {{ tier.tier_name }}: {{ tier.quantity }}
                  </span>
                </div>
                <span v-else>{{ order.ticket_count }} {{ t.tickets }}</span>
              </td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                ${{ order.total?.toFixed(2) }}
              </td>
              <td class="px-6 py-4">
                <span :class="statusClass(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(order.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="orders.length === 0" class="p-12 text-center">
        <p class="text-gray-600 text-lg">{{ t.noOrdersFound }}</p>
      </div>

      <!-- Pagination -->
      <div v-if="meta.last_page > 1" class="pagination">
        <button
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn page-nav"
          aria-label="Previous page"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="page !== '...' && (currentPage = page)"
            :class="['page-btn', { active: currentPage === page, ellipsis: page === '...' }]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage = Math.min(meta.last_page, currentPage + 1)"
          :disabled="currentPage === meta.last_page"
          class="page-btn page-nav"
          aria-label="Next page"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const { t: createT, language } = useLanguage()

const translations = {
  // Header
  ordersReport: { es: 'Reporte de Órdenes', en: 'Orders Report' },
  ordersSubtitle: { es: 'Reporte detallado de órdenes con exportación', en: 'Detailed orders report with export' },
  exporting: { es: 'Exportando...', en: 'Exporting...' },
  exportToExcel: { es: 'Exportar a Excel', en: 'Export to Excel' },

  // Filters
  allEvents: { es: 'Todos los Eventos', en: 'All Events' },
  allGroups: { es: 'Todos los Grupos', en: 'All Groups' },
  allStatus: { es: 'Todos los Estados', en: 'All Status' },
  pending: { es: 'Pendiente', en: 'Pending' },
  completed: { es: 'Completado', en: 'Completed' },
  failed: { es: 'Fallido', en: 'Failed' },
  refunded: { es: 'Reembolsado', en: 'Refunded' },
  search: { es: 'Buscar...', en: 'Search...' },

  // Loading/Error
  loadingReport: { es: 'Cargando reporte...', en: 'Loading report...' },
  failedToLoad: { es: 'Error al cargar el reporte', en: 'Failed to load report' },
  failedToExport: { es: 'Error al exportar el reporte', en: 'Failed to export report' },

  // Table Headers
  orderNumber: { es: 'Orden #', en: 'Order #' },
  customer: { es: 'Cliente', en: 'Customer' },
  event: { es: 'Evento', en: 'Event' },
  type: { es: 'Tipo', en: 'Type' },
  items: { es: 'Artículos', en: 'Items' },
  total: { es: 'Total', en: 'Total' },
  status: { es: 'Estado', en: 'Status' },
  date: { es: 'Fecha', en: 'Date' },

  // Order Types
  seated: { es: 'Con Asientos', en: 'Seated' },
  tiered: { es: 'Por Niveles', en: 'Tiered' },
  general: { es: 'General', en: 'General' },

  // Items
  tables: { es: 'mesa(s)', en: 'table(s)' },
  seats: { es: 'asiento(s)', en: 'seat(s)' },
  tickets: { es: 'boleto(s)', en: 'ticket(s)' },

  // Empty State
  noOrdersFound: { es: 'No se encontraron órdenes para los filtros seleccionados.', en: 'No orders found for the selected filters.' }
}

const t = createT(translations)

const { getOrdersReport, exportOrders } = useReports()
const { getEvents } = useEvents()
const { getGroups } = useGroups()

const orders = ref([])
const events = ref([])
const groups = ref([])
const loading = ref(true)
const exporting = ref(false)
const error = ref('')
const search = ref('')
const filterEvent = ref('')
const filterGroup = ref('')
const filterStatus = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const currentPage = ref(1)
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 25,
  total: 0
})

let searchTimeout = null

const getFilters = () => {
  const params = {
    per_page: 25,
    page: currentPage.value
  }
  if (search.value) params.search = search.value
  if (filterEvent.value) params.event_id = filterEvent.value
  if (filterGroup.value) params.group_id = filterGroup.value
  if (filterStatus.value) params.status = filterStatus.value
  if (dateFrom.value) params.date_from = dateFrom.value
  if (dateTo.value) params.date_to = dateTo.value
  return params
}

const fetchData = async () => {
  try {
    const [eventsRes, groupsRes] = await Promise.all([
      getEvents({ per_page: 100 }),
      getGroups()
    ])
    events.value = eventsRes.events || []
    groups.value = groupsRes.groups || []
  } catch (e) {
    // Optional data
  }
}

const fetchReport = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getOrdersReport(getFilters())
    orders.value = response.orders || []
    meta.value = response.meta || meta.value
  } catch (e) {
    error.value = e.message || t.failedToLoad
  } finally {
    loading.value = false
  }
}

const handleExport = async () => {
  exporting.value = true
  try {
    await exportOrders(getFilters())
  } catch (e) {
    error.value = e.message || t.failedToExport
  } finally {
    exporting.value = false
  }
}

const visiblePages = computed(() => {
  const total = meta.value.last_page
  const current = currentPage.value
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('...')
    pages.push(total)
  }

  return pages
})

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchReport()
  }, 300)
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const locale = language.value === 'es' ? 'es-MX' : 'en-US'
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const statusClass = (status) => {
  const classes = {
    pending: 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800',
    completed: 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800',
    failed: 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800',
    refunded: 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
  }
  return classes[status] || classes.pending
}

const getStatusLabel = (status) => {
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

const orderTypeClass = (order) => {
  if (order.tables?.length > 0 || order.seats?.length > 0) {
    return 'px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800'
  }
  if (order.tier_items?.length > 0) {
    return 'px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'
  }
  return 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
}

watch([filterEvent, filterGroup, filterStatus, dateFrom, dateTo], () => {
  currentPage.value = 1
  fetchReport()
})

watch(currentPage, () => {
  fetchReport()
})

onMounted(() => {
  fetchData()
  fetchReport()
})
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.page-btn:hover:not(.active):not(.ellipsis):not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.page-btn.active {
  background: #111827;
  color: white;
  font-weight: 600;
}

.page-btn.ellipsis {
  cursor: default;
  color: #9ca3af;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn.page-nav {
  border: 1px solid #d1d5db;
}

.page-btn.page-nav svg {
  width: 14px;
  height: 14px;
}

.page-btn.page-nav:hover:not(:disabled) {
  border-color: #6b7280;
  color: #111827;
}
</style>
