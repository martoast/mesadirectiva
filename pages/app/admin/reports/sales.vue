<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Sales Report</h1>
        <p class="text-gray-600 mt-1">View sales data and export to Excel</p>
      </div>
      <button
        @click="handleExport"
        :disabled="exporting"
        class="px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors font-semibold disabled:opacity-50"
      >
        {{ exporting ? 'Exporting...' : 'Export to Excel' }}
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center bg-white rounded-xl shadow-card p-4">
      <select
        v-model="filterEvent"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Events</option>
        <option v-for="event in events" :key="event.id" :value="event.id">
          {{ event.name }}
        </option>
      </select>
      <select
        v-model="filterCategory"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
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
        placeholder="Search..."
        class="flex-1 min-w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        @input="debouncedSearch"
      />
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-6 bg-white rounded-xl shadow-card">
        <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Total Orders</p>
        <p class="text-4xl font-bold text-gray-900">{{ summary.total_orders }}</p>
      </div>
      <div class="p-6 bg-white rounded-xl shadow-card">
        <p class="text-sm font-semibold text-gray-600 uppercase mb-2">Total Revenue</p>
        <p class="text-4xl font-bold text-success-600">${{ summary.total_revenue?.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading report...</p>
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
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order #</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Event</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tickets</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
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
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ order.ticket_count }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-success-600">
                ${{ order.total?.toFixed(2) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(order.paid_at || order.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="orders.length === 0" class="p-12 text-center">
        <p class="text-gray-600 text-lg">No sales found for the selected filters.</p>
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

const { getSalesReport, exportSales } = useReports()
const { getEvents } = useEvents()
const { getCategories } = useCategories()

const orders = ref([])
const events = ref([])
const categories = ref([])
const summary = ref({ total_orders: 0, total_revenue: 0 })
const loading = ref(true)
const exporting = ref(false)
const error = ref('')
const search = ref('')
const filterEvent = ref('')
const filterCategory = ref('')
const dateFrom = ref('')
const dateTo = ref('')

let searchTimeout = null

const getFilters = () => {
  const params = {}
  if (search.value) params.search = search.value
  if (filterEvent.value) params.event_id = filterEvent.value
  if (filterCategory.value) params.category_id = filterCategory.value
  if (dateFrom.value) params.date_from = dateFrom.value
  if (dateTo.value) params.date_to = dateTo.value
  return params
}

const fetchData = async () => {
  try {
    const [eventsRes, categoriesRes] = await Promise.all([
      getEvents({ per_page: 100 }),
      getCategories()
    ])
    events.value = eventsRes.events || []
    categories.value = categoriesRes.categories || []
  } catch (e) {
    // Optional data
  }
}

const fetchReport = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await getSalesReport(getFilters())
    orders.value = response.orders || []
    summary.value = response.summary || { total_orders: 0, total_revenue: 0 }
  } catch (e) {
    error.value = e.message || 'Failed to load report'
  } finally {
    loading.value = false
  }
}

const handleExport = async () => {
  exporting.value = true
  try {
    await exportSales(getFilters())
  } catch (e) {
    error.value = e.message || 'Failed to export report'
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
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

watch([filterEvent, filterCategory, dateFrom, dateTo], () => {
  fetchReport()
})

onMounted(() => {
  fetchData()
  fetchReport()
})
</script>
