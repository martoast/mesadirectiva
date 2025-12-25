<!-- components/admin/EventForm.vue -->
<template>
  <div class="max-w-2xl mx-auto">
    <!-- Step Indicator for multi-step form -->
    <UiStepIndicator
      v-if="isMultiStep"
      :steps="steps"
      :current-step="currentStep"
      class="mb-8"
    />

    <!-- Step 1: Basic Info -->
    <form v-show="!isMultiStep || currentStep === 0" @submit.prevent="handleNext" class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">{{ isMultiStep ? 'Basic Information' : 'Event Details' }}</h2>

      <!-- Group Selection -->
      <div class="flex flex-col gap-1">
        <label for="group" class="text-sm font-medium text-gray-700">
          Group <span class="text-danger-600">*</span>
        </label>
        <select
          id="group"
          v-model="formData.group_id"
          required
          class="px-4 py-2 border rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent border-gray-300"
        >
          <option value="">Select a group</option>
          <option v-for="g in groups" :key="g.id" :value="g.id">
            {{ g.name }}
          </option>
        </select>
      </div>

      <UiBaseInput
        id="eventName"
        v-model="formData.name"
        label="Event Name"
        placeholder="e.g., Summer Music Fest 2025"
        required
        type="text"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UiBaseInput
          id="eventDate"
          v-model="formData.date"
          label="Event Date"
          type="date"
          required
        />
        <UiBaseInput
          id="eventTime"
          v-model="formData.time"
          label="Event Time"
          type="time"
          required
        />
      </div>

      <UiBaseInput
        id="eventLocation"
        v-model="formData.location"
        label="Location"
        placeholder="e.g., Central Park, NYC"
        required
        type="text"
      />

      <!-- Seating Type Selection -->
      <div class="border-t pt-6">
        <label class="text-sm font-medium text-gray-700 mb-3 block">Event Type</label>
        <div class="grid grid-cols-2 gap-4">
          <label
            :class="[
              'flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all',
              formData.seating_type === 'general_admission'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input
              type="radio"
              v-model="formData.seating_type"
              value="general_admission"
              class="sr-only"
            />
            <svg class="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="font-medium text-gray-900">General Admission</span>
            <span class="text-xs text-gray-500 text-center mt-1">Ticket tiers with pricing options</span>
          </label>

          <label
            :class="[
              'flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all',
              formData.seating_type === 'seated'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input
              type="radio"
              v-model="formData.seating_type"
              value="seated"
              class="sr-only"
            />
            <svg class="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span class="font-medium text-gray-900">Seated Event</span>
            <span class="text-xs text-gray-500 text-center mt-1">Tables and seat selection</span>
          </label>
        </div>
      </div>

      <!-- Conditional fields based on seating type -->
      <div v-if="formData.seating_type === 'general_admission'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UiBaseInput
          id="ticketPrice"
          v-model.number="formData.price"
          label="Base Ticket Price ($)"
          type="number"
          placeholder="75"
          required
        />
        <UiBaseInput
          id="maxTickets"
          v-model.number="formData.max_tickets"
          label="Max Tickets"
          type="number"
          placeholder="500"
          required
        />
      </div>

      <div v-if="formData.seating_type === 'seated'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UiBaseInput
          id="reservationMinutes"
          v-model.number="formData.reservation_minutes"
          label="Reservation Hold (minutes)"
          type="number"
          placeholder="15"
        />
        <div class="flex items-end">
          <p class="text-sm text-gray-500 pb-2">
            Time customers have to complete checkout after selecting seats
          </p>
        </div>
      </div>

      <UiBaseInput
        id="registrationDeadline"
        v-model="formData.registration_deadline"
        label="Registration Deadline (optional)"
        type="datetime-local"
      />

      <div v-if="isMultiStep" class="flex gap-4 justify-between pt-6 border-t">
        <div></div>
        <UiBaseButton type="submit" variant="primary">
          Next
        </UiBaseButton>
      </div>
    </form>

    <!-- Step 2: Page Design -->
    <form v-show="!isMultiStep || currentStep === 1" @submit.prevent="handleNext" class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">{{ isMultiStep ? 'Page Design' : 'Hero & Description' }}</h2>

      <UiBaseInput
        id="heroTitle"
        v-model="formData.hero_title"
        label="Hero Title"
        placeholder="The Summer Event of the Year"
        required
        type="text"
      />

      <UiBaseInput
        id="heroSubtitle"
        v-model="formData.hero_subtitle"
        label="Hero Subtitle"
        placeholder="Join us for an unforgettable night"
        required
        type="text"
      />

      <UiBaseInput
        id="heroCtaText"
        v-model="formData.hero_cta_text"
        label="CTA Button Text"
        placeholder="Get Tickets"
        type="text"
      />

      <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p class="text-sm text-gray-600 mb-2">Hero Image</p>
        <p class="text-xs text-gray-500">
          You can upload a hero image after saving the event.
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
        <UiBaseButton type="button" variant="secondary" @click="handleBack">
          Back
        </UiBaseButton>
        <UiBaseButton type="submit" variant="primary">
          Next
        </UiBaseButton>
      </div>
    </form>

    <!-- Step 3: Review & Publish -->
    <div v-show="!isMultiStep || currentStep === 2" class="space-y-6">
      <h2 class="text-2xl font-bold text-gray-900">{{ isMultiStep ? 'Review & Publish' : 'Summary' }}</h2>

      <UiBaseCard>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Event Name</p>
              <p class="text-lg font-semibold text-gray-900">{{ formData.name }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Event Type</p>
              <p class="text-lg font-semibold text-gray-900">
                {{ formData.seating_type === 'seated' ? 'Seated Event' : 'General Admission' }}
              </p>
            </div>
            <div v-if="formData.seating_type === 'general_admission'">
              <p class="text-xs font-semibold text-gray-600 uppercase">Base Price</p>
              <p class="text-lg font-semibold text-gray-900">${{ formData.price }}</p>
            </div>
            <div v-if="formData.seating_type === 'seated'">
              <p class="text-xs font-semibold text-gray-600 uppercase">Reservation Time</p>
              <p class="text-lg font-semibold text-gray-900">{{ formData.reservation_minutes || 15 }} minutes</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Date & Time</p>
              <p class="text-gray-600">{{ formatDate(formData.date) }} at {{ formData.time }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Location</p>
              <p class="text-gray-600">{{ formData.location }}</p>
            </div>
            <div v-if="formData.seating_type === 'general_admission'">
              <p class="text-xs font-semibold text-gray-600 uppercase">Max Tickets</p>
              <p class="text-gray-600">{{ formData.max_tickets }}</p>
            </div>
          </div>
          <div class="pt-4 border-t">
            <p class="text-xs font-semibold text-gray-600 uppercase mb-2">Hero Title</p>
            <p class="text-gray-900">{{ formData.hero_title }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold text-gray-600 uppercase mb-2">Description</p>
            <p class="text-gray-600 whitespace-pre-wrap">{{ formData.about }}</p>
          </div>
        </div>
      </UiBaseCard>

      <!-- Next steps hint -->
      <div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <p class="text-sm text-primary-800">
          <strong>Next steps after saving:</strong>
          <template v-if="formData.seating_type === 'general_admission'">
            You'll be able to create ticket tiers with different pricing options.
          </template>
          <template v-else>
            You'll be able to set up tables and seats for your event.
          </template>
        </p>
      </div>

      <div v-if="isMultiStep" class="flex gap-4 justify-between pt-6 border-t">
        <UiBaseButton type="button" variant="secondary" @click="handleBack">
          Back
        </UiBaseButton>
        <div class="flex gap-3">
          <UiBaseButton
            type="button"
            variant="secondary"
            @click="handleSaveDraft"
            :disabled="isSubmitting"
          >
            Save as Draft
          </UiBaseButton>
          <UiBaseButton
            type="button"
            variant="success"
            @click="handlePublish"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Publishing...' : 'Publish' }}
          </UiBaseButton>
        </div>
      </div>
      <div v-else class="flex gap-3 pt-6 border-t">
        <UiBaseButton
          type="button"
          variant="secondary"
          @click="$emit('draft')"
          :disabled="isSubmitting"
        >
          Save as Draft
        </UiBaseButton>
        <UiBaseButton
          type="button"
          variant="success"
          @click="handlePublish"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Publishing...' : 'Publish' }}
        </UiBaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
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

const { getGroups } = useGroups()

const groups = ref([])
const currentStep = ref(0)
const steps = ['Basic Info', 'Page Design', 'Review & Publish']
const isSubmitting = ref(false)

const defaultFormData = {
  group_id: '',
  name: '',
  date: '',
  time: '',
  location: '',
  price: null,
  max_tickets: null,
  seating_type: 'general_admission',
  reservation_minutes: 15,
  registration_deadline: '',
  hero_title: '',
  hero_subtitle: '',
  hero_cta_text: 'Get Tickets',
  about: '',
  status: 'draft'
}

const formData = reactive(
  props.initialData ? { ...defaultFormData, ...props.initialData } : { ...defaultFormData }
)

const fetchGroups = async () => {
  try {
    const response = await getGroups()
    groups.value = response.groups || []
  } catch (e) {
    console.error('Failed to load groups', e)
  }
}

onMounted(() => {
  fetchGroups()
})

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    const baseValid = formData.name && formData.date && formData.time && formData.location && formData.group_id
    if (formData.seating_type === 'general_admission') {
      return baseValid && formData.price && formData.max_tickets
    }
    return baseValid
  } else if (currentStep.value === 1) {
    return formData.hero_title && formData.hero_subtitle && formData.about
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

const prepareData = () => {
  const data = {
    group_id: formData.group_id,
    name: formData.name,
    date: formData.date,
    time: formData.time,
    location: formData.location,
    seating_type: formData.seating_type,
    hero_title: formData.hero_title,
    hero_subtitle: formData.hero_subtitle,
    hero_cta_text: formData.hero_cta_text || 'Get Tickets',
    about: formData.about,
    description: formData.about
  }

  if (formData.seating_type === 'general_admission') {
    data.price = formData.price
    data.max_tickets = formData.max_tickets
  } else {
    data.reservation_minutes = formData.reservation_minutes || 15
  }

  if (formData.registration_deadline) {
    data.registration_deadline = formData.registration_deadline
  }

  return data
}

const handleSaveDraft = async () => {
  isSubmitting.value = true
  setTimeout(() => {
    emit('draft', prepareData())
    isSubmitting.value = false
  }, 500)
}

const handlePublish = async () => {
  isSubmitting.value = true
  setTimeout(() => {
    emit('publish', prepareData())
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
