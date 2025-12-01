<!-- components/admin/EventForm.vue -->
<template>
  <div class="max-w-2xl mx-auto">
    <!-- Step Indicator for multi-step form -->
    <StepIndicator
      v-if="isMultiStep"
      :steps="steps"
      :current-step="currentStep"
      class="mb-8"
    />

    <!-- Step 1: Basic Info -->
    <form v-show="!isMultiStep || currentStep === 0" @submit.prevent="handleNext" class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">{{ isMultiStep ? 'Basic Information' : 'Event Details' }}</h2>

      <BaseInput
        id="eventName"
        v-model="formData.name"
        label="Event Name"
        placeholder="e.g., Summer Music Fest 2025"
        required
        type="text"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          id="eventDate"
          v-model="formData.date"
          label="Event Date"
          type="date"
          required
        />
        <BaseInput
          id="eventTime"
          v-model="formData.time"
          label="Event Time"
          type="time"
          required
        />
      </div>

      <BaseInput
        id="eventLocation"
        v-model="formData.location"
        label="Location"
        placeholder="e.g., Central Park, NYC"
        required
        type="text"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          id="ticketPrice"
          v-model.number="formData.price"
          label="Ticket Price ($)"
          type="number"
          placeholder="75"
          required
        />
        <BaseInput
          id="maxTickets"
          v-model.number="formData.maxTickets"
          label="Max Tickets"
          type="number"
          placeholder="500"
          required
        />
      </div>

      <div v-if="isMultiStep" class="flex gap-4 justify-between pt-6 border-t">
        <div></div>
        <BaseButton type="submit" variant="primary">
          Next →
        </BaseButton>
      </div>
    </form>

    <!-- Step 2: Page Design -->
    <form v-show="!isMultiStep || currentStep === 1" @submit.prevent="handleNext" class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">{{ isMultiStep ? 'Page Design' : 'Hero & Description' }}</h2>

      <BaseInput
        id="heroTitle"
        v-model="formData.heroTitle"
        label="Hero Title"
        placeholder="The Summer Event of the Year"
        required
        type="text"
      />

      <BaseInput
        id="heroSubtitle"
        v-model="formData.heroSubtitle"
        label="Hero Subtitle"
        placeholder="Join us for an unforgettable night"
        required
        type="text"
      />

      <div class="p-4 bg-warning-50 rounded-lg border border-warning-200">
        <p class="text-sm text-warning-800">
          🖼️ Hero Image: Placeholder for file upload (URL: /mock/hero-1.png)
        </p>
      </div>

      <BaseTextarea
        id="about"
        v-model="formData.about"
        label="Event Description"
        placeholder="Tell people what this event is about..."
        :rows="6"
        required
      />

      <div v-if="isMultiStep" class="flex gap-4 justify-between pt-6 border-t">
        <BaseButton type="button" variant="secondary" @click="handleBack">
          ← Back
        </BaseButton>
        <BaseButton type="submit" variant="primary">
          Next →
        </BaseButton>
      </div>
    </form>

    <!-- Step 3: Review & Publish -->
    <div v-show="!isMultiStep || currentStep === 2" class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">{{ isMultiStep ? 'Review & Publish' : 'Summary' }}</h2>

      <BaseCard>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Event Name</p>
              <p class="text-lg font-semibold text-gray-900">{{ formData.name }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Price</p>
              <p class="text-lg font-semibold text-gray-900">${{ formData.price }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Date & Time</p>
              <p class="text-gray-600">{{ formatDate(formData.date) }} at {{ formData.time }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Location</p>
              <p class="text-gray-600">{{ formData.location }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Max Tickets</p>
              <p class="text-gray-600">{{ formData.maxTickets }}</p>
            </div>
          </div>
          <div class="pt-4 border-t">
            <p class="text-xs font-semibold text-gray-600 uppercase mb-2">Hero Title</p>
            <p class="text-gray-900">{{ formData.heroTitle }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-600 uppercase mb-2">Description</p>
            <p class="text-gray-600 whitespace-pre-wrap">{{ formData.about }}</p>
          </div>
        </div>
      </BaseCard>

      <div v-if="isMultiStep" class="flex gap-4 justify-between pt-6 border-t">
        <BaseButton type="button" variant="secondary" @click="handleBack">
          ← Back
        </BaseButton>
        <div class="flex gap-3">
          <BaseButton
            type="button"
            variant="secondary"
            @click="handleSaveDraft"
            :disabled="isSubmitting"
          >
            💾 Save as Draft
          </BaseButton>
          <BaseButton
            type="button"
            variant="success"
            @click="handlePublish"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '⏳ Publishing...' : '🚀 Publish' }}
          </BaseButton>
        </div>
      </div>
      <div v-else class="flex gap-3 pt-6 border-t">
        <BaseButton
          type="button"
          variant="secondary"
          @click="$emit('draft')"
          :disabled="isSubmitting"
        >
          💾 Save as Draft
        </BaseButton>
        <BaseButton
          type="button"
          variant="success"
          @click="handlePublish"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '⏳ Publishing...' : '🚀 Publish' }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import BaseButton from '../ui/BaseButton.vue'
import BaseInput from '../ui/BaseInput.vue'
import BaseTextarea from '../ui/BaseTextarea.vue'
import StepIndicator from '../ui/StepIndicator.vue'
import BaseCard from '../ui/BaseCard.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  isMultiStep: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['submit', 'draft', 'publish'])

const currentStep = ref(0)
const steps = ['Basic Info', 'Page Design', 'Review & Publish']
const isSubmitting = ref(false)

const defaultFormData = {
  name: '',
  date: '',
  time: '',
  location: '',
  price: null,
  maxTickets: null,
  heroTitle: '',
  heroSubtitle: '',
  heroImage: '/mock/hero-1.png',
  about: '',
  status: 'draft'
}

const formData = reactive(
  props.initialData ? { ...defaultFormData, ...props.initialData } : { ...defaultFormData }
)

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return formData.name && formData.date && formData.time && formData.location && formData.price && formData.maxTickets
  } else if (currentStep.value === 1) {
    return formData.heroTitle && formData.heroSubtitle && formData.about
  }
  return true
})

const handleNext = () => {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const handleBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleSaveDraft = async () => {
  isSubmitting.value = true
  setTimeout(() => {
    emit('draft', { ...formData, status: 'draft' })
    isSubmitting.value = false
  }, 500)
}

const handlePublish = async () => {
  isSubmitting.value = true
  setTimeout(() => {
    emit('publish', { ...formData, status: 'live' })
    isSubmitting.value = false
  }, 500)
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
