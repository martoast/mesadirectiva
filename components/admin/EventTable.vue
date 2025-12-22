<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b-2 border-gray-200">
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Event Name</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tickets Sold</th>
          <th class="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="event in events" :key="event.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ event.name }}</td>
          <td class="px-6 py-4 text-sm">
            <span
              v-if="event.category"
              class="px-2 py-1 rounded-full text-xs font-semibold text-white"
              :style="{ backgroundColor: event.category.color }"
            >
              {{ event.category.name }}
            </span>
            <span v-else class="text-gray-400">-</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-600">
            {{ formatDate(event.date) }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-900 font-medium">${{ event.price }}</td>
          <td class="px-6 py-4 text-sm">
            <span :class="statusClass(event.status)">
              {{ statusLabel(event.status) }}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">
            {{ event.tickets_sold }} / {{ event.max_tickets }}
          </td>
          <td class="px-6 py-4 text-center">
            <div class="flex items-center justify-center gap-2 flex-wrap">
              <!-- View: always visible -->
              <NuxtLink
                :to="`/app/admin/events/${event.slug}`"
                class="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
              >
                View
              </NuxtLink>
              <!-- Edit: requires 'edit' permission -->
              <NuxtLink
                v-if="canEdit(event)"
                :to="`/app/admin/events/${event.slug}/edit`"
                class="px-3 py-1 text-sm bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
              >
                Edit
              </NuxtLink>
              <!-- Publish: requires 'edit' permission + draft status -->
              <button
                v-if="canEdit(event) && event.status === 'draft'"
                @click="$emit('publish', event.slug)"
                class="px-3 py-1 text-sm bg-success-100 text-success-700 rounded-lg hover:bg-success-200 transition-colors"
              >
                Publish
              </button>
              <!-- Close: requires 'manage' permission + live status -->
              <button
                v-if="canManage(event) && event.status === 'live'"
                @click="$emit('close', event.slug)"
                class="px-3 py-1 text-sm bg-warning-100 text-warning-700 rounded-lg hover:bg-warning-200 transition-colors"
              >
                Close
              </button>
              <!-- Delete: requires 'manage' permission -->
              <button
                v-if="canManage(event)"
                @click="$emit('delete', event.slug)"
                class="px-3 py-1 text-sm bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200 transition-colors"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  events: {
    type: Array,
    required: true
  },
  hasPermission: {
    type: Function,
    required: true
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete', 'publish', 'close'])

// Permission helpers
const canEdit = (event) => {
  const categoryId = event.category?.id || event.category_id
  if (!categoryId) return props.isSuperAdmin // Uncategorized: super_admin only
  return props.hasPermission(categoryId, 'edit')
}

const canManage = (event) => {
  const categoryId = event.category?.id || event.category_id
  if (!categoryId) return props.isSuperAdmin // Uncategorized: super_admin only
  return props.hasPermission(categoryId, 'manage')
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const statusClass = (status) => {
  const classes = {
    draft: 'px-3 py-1 rounded-full text-xs font-semibold bg-warning-100 text-warning-800',
    live: 'px-3 py-1 rounded-full text-xs font-semibold bg-success-100 text-success-800',
    closed: 'px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800'
  }
  return classes[status] || classes.draft
}

const statusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    live: 'Live',
    closed: 'Closed'
  }
  return labels[status] || status
}
</script>
