<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
      <p class="text-gray-600 mt-1">View and manage all orders</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 items-center bg-white rounded-xl shadow-card p-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search by name, email, or order #"
        class="flex-1 min-w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        @input="debouncedSearch"
      />
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
        v-model="filterStatus"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
        <option value="refunded">Refunded</option>
      </select>
      <input
        v-model="dateFrom"
        type="date"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        placeholder="From"
      />
      <input
        v-model="dateTo"
        type="date"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
        placeholder="To"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading orders...</p>
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
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
              <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
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
              <td class="px-6 py-4 text-sm font-medium text-gray-900">
                ${{ order.total?.toFixed(2) }}
              </td>
              <td class="px-6 py-4">
                <span :class="statusClass(order.status)">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(order.created_at) }}
              </td>
              <td class="px-6 py-4 text-center">
                <NuxtLink
                  :to="`/app/admin/orders/${order.order_number}`"
                  class="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  View
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="orders.length === 0" class="p-12 text-center">
        <p class="text-gray-600 text-lg">No orders found.</p>
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

let searchTimeout = null

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
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
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

watch([filterEvent, filterStatus, dateFrom, dateTo], () => {
  fetchOrders()
})

onMounted(() => {
  fetchEvents()
  fetchOrders()
})
</script>
