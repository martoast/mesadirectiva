<template>
  <div class="bg-white rounded-xl shadow-card p-4 hover:shadow-card-hover transition-all duration-200">
    <div class="mb-4">
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-900 flex-1">{{ event.name }}</h3>
        <span :class="statusClass(event.status)">
          {{ statusLabel(event.status) }}
        </span>
      </div>
      <div v-if="event.category" class="mb-2">
        <span
          class="px-2 py-1 rounded-full text-xs font-semibold text-white"
          :style="{ backgroundColor: event.category.color }"
        >
          {{ event.category.name }}
        </span>
      </div>
      <p class="text-sm text-gray-600">
        {{ formatDate(event.date) }} at {{ event.time }}
      </p>
      <p class="text-sm text-gray-600">
        {{ event.location }}
      </p>
    </div>

    <div class="mb-4 pb-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <span class="text-2xl font-bold text-primary-600">${{ event.price }}</span>
        <span class="text-sm text-gray-600">
          {{ event.tickets_sold }} / {{ event.max_tickets }} sold
        </span>
      </div>
    </div>

    <!-- Action buttons grid -->
    <div class="flex flex-wrap gap-2">
      <!-- View: always visible -->
      <NuxtLink
        :to="`/app/admin/events/${event.slug}`"
        class="flex-1 min-w-[calc(50%-4px)] px-3 py-2 text-center text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
      >
        View
      </NuxtLink>
      <!-- Edit: requires 'edit' permission -->
      <NuxtLink
        v-if="canEdit()"
        :to="`/app/admin/events/${event.slug}/edit`"
        class="flex-1 min-w-[calc(50%-4px)] px-3 py-2 text-center text-sm bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
      >
        Edit
      </NuxtLink>
      <!-- Publish: requires 'edit' permission + draft status -->
      <button
        v-if="canEdit() && event.status === 'draft'"
        @click="$emit('publish', event.slug)"
        class="flex-1 min-w-[calc(50%-4px)] px-3 py-2 text-center text-sm bg-success-100 text-success-700 rounded-lg hover:bg-success-200 transition-colors"
      >
        Publish
      </button>
      <!-- Close: requires 'manage' permission + live status -->
      <button
        v-if="canManage() && event.status === 'live'"
        @click="$emit('close', event.slug)"
        class="flex-1 min-w-[calc(50%-4px)] px-3 py-2 text-center text-sm bg-warning-100 text-warning-700 rounded-lg hover:bg-warning-200 transition-colors"
      >
        Close
      </button>
      <!-- Delete: requires 'manage' permission -->
      <button
        v-if="canManage()"
        @click="$emit('delete', event.slug)"
        class="flex-1 min-w-[calc(50%-4px)] px-3 py-2 text-center text-sm bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200 transition-colors"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  event: {
    type: Object,
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
const canEdit = () => {
  const categoryId = props.event.category?.id || props.event.category_id
  if (!categoryId) return props.isSuperAdmin // Uncategorized: super_admin only
  return props.hasPermission(categoryId, 'edit')
}

const canManage = () => {
  const categoryId = props.event.category?.id || props.event.category_id
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
    draft: 'px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 bg-warning-100 text-warning-800',
    live: 'px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 bg-success-100 text-success-800',
    closed: 'px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 bg-gray-100 text-gray-800'
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
