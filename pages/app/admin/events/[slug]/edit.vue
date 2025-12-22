<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <NuxtLink
      :to="`/app/admin/events/${route.params.slug}`"
      class="text-primary-600 hover:text-primary-700 font-semibold inline-block"
    >
      ← Back to Event
    </NuxtLink>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">Loading event...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <!-- Edit Form -->
    <template v-else-if="event">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Edit Event</h1>
        <p class="text-gray-600 mt-2">{{ event.name }}</p>
        <span
          :class="[
            'inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2',
            event.status === 'live' ? 'bg-success-100 text-success-800' :
            event.status === 'closed' ? 'bg-gray-100 text-gray-800' :
            'bg-warning-100 text-warning-800'
          ]"
        >
          {{ event.status }}
        </span>
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

          <div class="flex items-center gap-2">
            <input
              v-model="form.registration_open"
              type="checkbox"
              id="registration_open"
              class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label for="registration_open" class="text-sm font-medium text-gray-700">Registration Open</label>
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
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <input
              v-model="form.hero_subtitle"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <!-- Hero Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>

            <!-- Current Image Preview -->
            <div v-if="currentHeroImage && !imageFile && imageType === 'url' && !form.hero_image" class="mb-4">
              <p class="text-sm text-gray-500 mb-2">Current image:</p>
              <img :src="currentHeroImage" alt="Current hero" class="max-h-48 rounded-lg" />
            </div>

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
              rows="5"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Event description (supports markdown)"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">About (Detailed Info)</label>
            <textarea
              v-model="form.about"
              rows="8"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Detailed event information (supports markdown)"
            ></textarea>
          </div>
        </div>

        <!-- Form Error -->
        <div v-if="formError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ formError }}
        </div>

        <!-- Actions -->
        <div class="flex gap-4 justify-between">
          <NuxtLink
            :to="`/app/admin/events/${route.params.slug}`"
            class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
          >
            Cancel
          </NuxtLink>
          <div class="flex gap-3">
            <button
              v-if="event.status === 'draft'"
              type="button"
              @click="handlePublish"
              :disabled="submitting"
              class="px-6 py-3 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors font-semibold disabled:opacity-50"
            >
              {{ submitting ? 'Saving...' : 'Save & Publish' }}
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
            >
              {{ submitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const route = useRoute()
const router = useRouter()
const { getEvent, updateEvent, publishEvent } = useEvents()
const { getCategories } = useCategories()

const event = ref(null)
const categories = ref([])
const loading = ref(true)
const error = ref('')
const formError = ref('')
const submitting = ref(false)

// Image handling
const imageType = ref('url')
const imageFile = ref(null)
const imagePreview = ref('')
const imageLoadError = ref(false)
const currentHeroImage = ref('')

const form = reactive({
  name: '',
  category_id: null,
  date: '',
  time: '',
  location: '',
  price: 0,
  max_tickets: 0,
  registration_deadline: '',
  registration_open: true,
  hero_title: '',
  hero_subtitle: '',
  hero_image: '',
  description: '',
  about: ''
})

const fetchEvent = async () => {
  loading.value = true
  error.value = ''

  try {
    const [eventResponse, categoriesResponse] = await Promise.all([
      getEvent(route.params.slug),
      getCategories()
    ])

    event.value = eventResponse.event
    categories.value = categoriesResponse.categories || []

    // Populate form with event data
    const e = eventResponse.event
    form.name = e.name || ''
    form.category_id = e.category?.id || null
    form.date = e.date || ''
    form.time = e.time?.substring(0, 5) || '' // Format HH:MM
    form.location = e.location || ''
    form.price = e.price || 0
    form.max_tickets = e.max_tickets || 0
    form.registration_deadline = e.registration_deadline ? e.registration_deadline.substring(0, 16) : ''
    form.registration_open = e.registration_open ?? true
    form.hero_title = e.hero_title || ''
    form.hero_subtitle = e.hero_subtitle || ''
    form.description = e.description || ''
    form.about = e.about || ''

    // Store current hero image URL for display
    currentHeroImage.value = e.hero_image_url || ''
  } catch (e) {
    error.value = e.message || 'Failed to load event'
  } finally {
    loading.value = false
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
    formError.value = 'Image file must be less than 5MB'
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

const handleSubmit = async () => {
  submitting.value = true
  formError.value = ''

  try {
    // Prepare form data
    const eventData = { ...form }

    // If using URL, include it in the form data
    if (imageType.value === 'url' && form.hero_image) {
      eventData.hero_image = form.hero_image
    } else {
      delete eventData.hero_image
    }

    await updateEvent(route.params.slug, eventData)

    // If using file upload, upload the image after update
    if (imageType.value === 'file' && imageFile.value) {
      await uploadHeroImage(route.params.slug)
    }

    router.push(`/app/admin/events/${route.params.slug}`)
  } catch (e) {
    formError.value = e.message || 'Failed to update event'
  } finally {
    submitting.value = false
  }
}

const handlePublish = async () => {
  submitting.value = true
  formError.value = ''

  try {
    // Prepare form data
    const eventData = { ...form }

    // If using URL, include it in the form data
    if (imageType.value === 'url' && form.hero_image) {
      eventData.hero_image = form.hero_image
    } else {
      delete eventData.hero_image
    }

    // Save first
    await updateEvent(route.params.slug, eventData)

    // If using file upload, upload the image after update
    if (imageType.value === 'file' && imageFile.value) {
      await uploadHeroImage(route.params.slug)
    }

    // Then publish
    await publishEvent(route.params.slug)
    router.push(`/app/admin/events/${route.params.slug}`)
  } catch (e) {
    formError.value = e.message || 'Failed to publish event'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchEvent()
})
</script>
