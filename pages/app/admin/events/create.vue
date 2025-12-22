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
      <p class="text-gray-600 mt-2">Fill in the details below to create a new event.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="max-w-2xl space-y-6">
      <!-- Basic Info -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Basic Information</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Annual School Gala 2025"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            v-model="form.category_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option :value="null">No category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              v-model="form.date"
              type="date"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Time *</label>
            <input
              v-model="form.time"
              type="time"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <input
            v-model="form.location"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Grand Ballroom, Hotel Marriott"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ticket Price ($) *</label>
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="150"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Max Tickets *</label>
            <input
              v-model.number="form.max_tickets"
              type="number"
              min="1"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="200"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Registration Deadline</label>
          <input
            v-model="form.registration_deadline"
            type="datetime-local"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <!-- Page Design -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Page Design</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
          <input
            v-model="form.hero_title"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="The headline displayed on the event page"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
          <input
            v-model="form.hero_subtitle"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="A short tagline for the event"
          />
        </div>

        <!-- Hero Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>

          <!-- Image Type Selection -->
          <div class="flex gap-4 mb-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="imageType"
                type="radio"
                value="url"
                class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">Image URL</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="imageType"
                type="radio"
                value="file"
                class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">Upload File</span>
            </label>
          </div>

          <!-- URL Input -->
          <div v-if="imageType === 'url'">
            <input
              v-model="form.hero_image"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <!-- File Upload -->
          <div v-else>
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
              @click="$refs.fileInput.click()"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileSelect"
              />
              <div v-if="!imageFile && !imagePreview">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="mt-2 text-sm text-gray-600">Click or drag and drop an image</p>
                <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
              </div>
              <div v-else class="relative">
                <img :src="imagePreview" alt="Preview" class="max-h-48 mx-auto rounded-lg" />
                <button
                  type="button"
                  @click.stop="clearImage"
                  class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- URL Preview -->
          <div v-if="imageType === 'url' && form.hero_image" class="mt-3">
            <img
              :src="form.hero_image"
              alt="Preview"
              class="max-h-48 rounded-lg"
              @error="imageLoadError = true"
              @load="imageLoadError = false"
            />
            <p v-if="imageLoadError" class="text-sm text-red-600 mt-1">Unable to load image from URL</p>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Brief event description"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">About (Detailed Info)</label>
          <textarea
            v-model="form.about"
            rows="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Detailed event information (supports markdown)"
          ></textarea>
        </div>
      </div>

      <!-- Form Error -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="flex gap-4 justify-between">
        <NuxtLink
          to="/app/admin/events"
          class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
        >
          Cancel
        </NuxtLink>
        <div class="flex gap-3">
          <button
            type="button"
            @click="handleSaveDraft"
            :disabled="submitting"
            class="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors font-semibold disabled:opacity-50"
          >
            {{ submitting ? 'Saving...' : 'Save as Draft' }}
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors font-semibold disabled:opacity-50"
          >
            {{ submitting ? 'Creating...' : 'Create & Publish' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const router = useRouter()
const { createEvent, publishEvent } = useEvents()
const { getCategories } = useCategories()

const categories = ref([])
const error = ref('')
const submitting = ref(false)

// Image handling
const imageType = ref('url')
const imageFile = ref(null)
const imagePreview = ref('')
const imageLoadError = ref(false)

const form = reactive({
  name: '',
  category_id: null,
  date: '',
  time: '',
  location: '',
  price: null,
  max_tickets: null,
  registration_deadline: '',
  hero_title: '',
  hero_subtitle: '',
  hero_image: '',
  description: '',
  about: ''
})

const fetchCategories = async () => {
  try {
    const response = await getCategories()
    categories.value = response.categories || []
  } catch (e) {
    // Categories are optional
  }
}

// Image handling functions
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const processFile = (file) => {
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Image file must be less than 5MB'
    return
  }

  imageFile.value = file
  // Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  imageFile.value = null
  imagePreview.value = ''
}

const uploadHeroImage = async (slug) => {
  if (!imageFile.value) return

  const formData = new FormData()
  formData.append('hero_image', imageFile.value)

  const config = useRuntimeConfig()
  const token = localStorage.getItem('auth_token')

  const response = await fetch(`${config.public.apiBase}/events/${slug}/hero-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
    body: formData
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || 'Failed to upload image')
  }

  return response.json()
}

const handleSaveDraft = async () => {
  submitting.value = true
  error.value = ''

  try {
    // Prepare form data
    const eventData = { ...form }

    // If using URL, include it in the form data
    if (imageType.value === 'url' && form.hero_image) {
      eventData.hero_image = form.hero_image
    } else {
      delete eventData.hero_image
    }

    const response = await createEvent(eventData)

    // If using file upload, upload the image after event creation
    if (imageType.value === 'file' && imageFile.value) {
      await uploadHeroImage(response.event.slug)
    }

    router.push(`/app/admin/events/${response.event.slug}`)
  } catch (e) {
    error.value = e.message || 'Failed to create event'
  } finally {
    submitting.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  error.value = ''

  try {
    // Prepare form data
    const eventData = { ...form }

    // If using URL, include it in the form data
    if (imageType.value === 'url' && form.hero_image) {
      eventData.hero_image = form.hero_image
    } else {
      delete eventData.hero_image
    }

    // Create the event first
    const response = await createEvent(eventData)

    // If using file upload, upload the image after event creation
    if (imageType.value === 'file' && imageFile.value) {
      await uploadHeroImage(response.event.slug)
    }

    // Then publish it
    await publishEvent(response.event.slug)
    router.push(`/app/admin/events/${response.event.slug}`)
  } catch (e) {
    error.value = e.message || 'Failed to create event'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
