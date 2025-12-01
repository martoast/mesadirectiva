<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <NuxtLink
      :to="`/app/admin/events/${route.params.slug}`"
      class="text-primary-600 hover:text-primary-700 font-semibold inline-block"
    >
      ← Back to Event
    </NuxtLink>

    <!-- Header -->
    <div v-if="event">
      <h1 class="text-3xl font-bold text-gray-900">Edit Event</h1>
      <p class="text-gray-600 mt-2">{{ event.name }}</p>
    </div>

    <!-- Form -->
    <div v-if="event">
      <AdminEventForm
        :initial-data="event"
        :is-multi-step="false"
        @publish="handlePublish"
        @draft="handleDraft"
      />
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-12">
      <p class="text-gray-600">Loading event...</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMockEvents } from '~/composables/useMockEvents'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const { getEventBySlug, updateEvent } = useMockEvents()
const event = computed(() => getEventBySlug(route.params.slug))

const handlePublish = (eventData) => {
  updateEvent(route.params.slug, eventData)
  navigateTo(`/app/admin/events/${route.params.slug}`)
}

const handleDraft = (eventData) => {
  updateEvent(route.params.slug, eventData)
  navigateTo(`/app/admin/events/${route.params.slug}`)
}
</script>
