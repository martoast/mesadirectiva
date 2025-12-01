<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="border-b-2 border-gray-200">
          <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Event Name</th>
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
          <td class="px-6 py-4 text-sm text-gray-600">
            {{ formatDate(event.date) }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-900 font-medium">${{ event.price }}</td>
          <td class="px-6 py-4 text-sm">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                event.status === 'live'
                  ? 'bg-success-100 text-success-800'
                  : 'bg-warning-100 text-warning-800'
              ]"
            >
              {{ event.status === 'live' ? '🔴 Live' : '📝 Draft' }}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">
            {{ event.ticketsSold }} / {{ event.maxTickets }}
          </td>
          <td class="px-6 py-4 text-center">
            <div class="flex items-center justify-center gap-2">
              <NuxtLink
                :to="`/app/admin/events/${event.slug}`"
                class="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
              >
                👁️ View
              </NuxtLink>
              <NuxtLink
                :to="`/app/admin/events/${event.slug}/edit`"
                class="px-3 py-1 text-sm bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
              >
                ✏️ Edit
              </NuxtLink>
              <button
                @click="$emit('delete', event.slug)"
                class="px-3 py-1 text-sm bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200 transition-colors"
              >
                🗑️ Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  events: {
    type: Array,
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
