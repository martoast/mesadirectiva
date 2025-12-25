<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <NuxtLink
      :to="`/app/admin/events/${route.params.slug}`"
      class="text-primary-600 hover:text-primary-700 font-semibold inline-block"
    >
      &larr; Back to Event
    </NuxtLink>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading tables...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <template v-else>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Tables & Seating</h1>
          <p class="text-gray-600 mt-1">{{ event?.name }}</p>
        </div>
        <UiBaseButton @click="openCreateModal">
          + Add Table
        </UiBaseButton>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-card p-4">
          <p class="text-sm text-gray-500">Total Tables</p>
          <p class="text-2xl font-bold text-gray-900">{{ tables.length }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-card p-4">
          <p class="text-sm text-gray-500">Available</p>
          <p class="text-2xl font-bold text-success-600">{{ availableTables }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-card p-4">
          <p class="text-sm text-gray-500">Total Capacity</p>
          <p class="text-2xl font-bold text-primary-600">{{ totalCapacity }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-card p-4">
          <p class="text-sm text-gray-500">Sold</p>
          <p class="text-2xl font-bold text-gray-900">{{ soldTables }}</p>
        </div>
      </div>

      <!-- Tables List -->
      <div class="bg-white rounded-xl shadow-card p-6">
        <AdminTableList
          :tables="tables"
          :event-slug="route.params.slug"
          @edit="openEditModal"
          @delete="openDeleteModal"
          @manage-seats="goToSeats"
        />
      </div>
    </template>

    <!-- Create/Edit Modal -->
    <div
      v-if="showFormModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeFormModal"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <AdminTableForm
          :table="selectedTable"
          :loading="formLoading"
          :errors="formErrors"
          @submit="handleFormSubmit"
          @cancel="closeFormModal"
        />
      </div>
    </div>

    <!-- Delete Modal -->
    <UiConfirmModal
      :is-open="showDeleteModal"
      title="Delete Table"
      :message="`Are you sure you want to delete '${selectedTable?.name}'? This will also delete all seats for this table.`"
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
const router = useRouter()
const { getEvent } = useEvents()
const { getTables, createTable, updateTable, deleteTable } = useTables()

const event = ref(null)
const tables = ref([])
const loading = ref(true)
const error = ref('')

const showFormModal = ref(false)
const showDeleteModal = ref(false)
const selectedTable = ref(null)
const formLoading = ref(false)
const formErrors = ref({})

const availableTables = computed(() => tables.value.filter(t => t.status === 'available').length)
const soldTables = computed(() => tables.value.filter(t => t.status === 'sold').length)
const totalCapacity = computed(() => tables.value.reduce((sum, t) => sum + (t.capacity || 0), 0))

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

    // Redirect if not a seated event
    if (event.value?.seating_type === 'general_admission') {
      navigateTo(`/app/admin/events/${route.params.slug}/tiers`)
    }
  } catch (e) {
    error.value = e.message || 'Failed to load data'
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  selectedTable.value = null
  formErrors.value = {}
  showFormModal.value = true
}

const openEditModal = (table) => {
  selectedTable.value = table
  formErrors.value = {}
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  selectedTable.value = null
  formErrors.value = {}
}

const handleFormSubmit = async (data) => {
  formLoading.value = true
  formErrors.value = {}

  try {
    if (selectedTable.value) {
      await updateTable(route.params.slug, selectedTable.value.id, data)
    } else {
      await createTable(route.params.slug, data)
    }

    closeFormModal()
    await fetchData()
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

const openDeleteModal = (table) => {
  selectedTable.value = table
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await deleteTable(route.params.slug, selectedTable.value.id)
    showDeleteModal.value = false
    selectedTable.value = null
    await fetchData()
  } catch (e) {
    error.value = e.message || 'Failed to delete table'
    showDeleteModal.value = false
  }
}

const goToSeats = (table) => {
  router.push(`/app/admin/events/${route.params.slug}/tables/${table.id}/seats`)
}

onMounted(() => {
  fetchData()
})
</script>
