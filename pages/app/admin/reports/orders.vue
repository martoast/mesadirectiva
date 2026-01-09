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
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

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

let searchTimeout = null

const getFilters = () => {
  const params = {}
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

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
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
  fetchReport()
})

onMounted(() => {
  fetchData()
  fetchReport()
})
</script>
