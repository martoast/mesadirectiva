<template>
  <div class="space-y-6">
    <div class="mb-8">
      <NuxtLink
        to="/app/admin/events"
        class="text-primary-600 hover:text-primary-700 font-semibold mb-4 inline-block"
      >
        ← Back to Events
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">Create New Event</h1>
      <p class="text-gray-600 mt-2">Follow the steps below to create and publish a new event.</p>
    </div>

    <AdminEventForm
      :is-multi-step="true"
      @publish="handlePublish"
      @draft="handleDraft"
    />
  </div>
</template>

<script setup>
import { useMockEvents } from '~/composables/useMockEvents'

definePageMeta({
  layout: 'admin'
})

const { createEvent } = useMockEvents()

const handlePublish = (eventData) => {
  createEvent(eventData)
  navigateTo('/app/admin/events')
}

const handleDraft = (eventData) => {
  createEvent(eventData)
  navigateTo('/app/admin/events')
}
</script>
