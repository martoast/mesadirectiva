<template>
  <div class="bg-white rounded-xl shadow-card p-4 hover:shadow-card-hover transition-all duration-200">
    <div class="mb-4">
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-900 flex-1">{{ event.name }}</h3>
        <span
          :class="[
            'px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2',
            event.status === 'live'
              ? 'bg-success-100 text-success-800'
              : 'bg-warning-100 text-warning-800'
          ]"
        >
          {{ event.status === 'live' ? '🔴 Live' : '📝 Draft' }}
        </span>
      </div>
      <p class="text-sm text-gray-600">
        📅 {{ formatDate(event.date) }} at {{ event.time }}
      </p>
      <p class="text-sm text-gray-600">
        📍 {{ event.location }}
      </p>
    </div>

    <div class="mb-4 pb-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <span class="text-2xl font-bold text-primary-600">${{ event.price }}</span>
        <span class="text-sm text-gray-600">
          {{ event.ticketsSold }} / {{ event.maxTickets }} sold
        </span>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <NuxtLink
        :to="`/app/admin/events/${event.slug}`"
        class="px-3 py-2 text-center text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
      >
        👁️ View
      </NuxtLink>
      <NuxtLink
        :to="`/app/admin/events/${event.slug}/edit`"
        class="px-3 py-2 text-center text-sm bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
      >
        ✏️ Edit
      </NuxtLink>
      <button
        @click="$emit('delete', event.slug)"
        class="px-3 py-2 text-center text-sm bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200 transition-colors"
      >
        🗑️ Delete
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
