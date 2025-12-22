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

    <form @submit.prevent="handleSubmit" class="max-w-4xl space-y-6">
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

      <!-- Hero Section -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Hero Section</h2>
        <p class="text-sm text-gray-600">The main banner that appears at the top of your event page.</p>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hero Title *</label>
          <input
            v-model="form.hero_title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="The main headline for your event"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle *</label>
          <input
            v-model="form.hero_subtitle"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="A compelling tagline"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
          <input
            v-model="form.hero_cta_text"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Buy Tickets (default)"
          />
        </div>

        <!-- Hero Image -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
          <div class="flex gap-4 mb-3">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="imageType" type="radio" value="url" class="w-4 h-4 text-primary-600" />
              <span class="text-sm text-gray-700">Image URL</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="imageType" type="radio" value="file" class="w-4 h-4 text-primary-600" />
              <span class="text-sm text-gray-700">Upload File</span>
            </label>
          </div>

          <div v-if="imageType === 'url'">
            <input
              v-model="form.hero_image"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/image.jpg"
            />
            <div v-if="form.hero_image" class="mt-3">
              <img :src="form.hero_image" alt="Preview" class="max-h-48 rounded-lg" @error="imageLoadError = true" @load="imageLoadError = false" />
              <p v-if="imageLoadError" class="text-sm text-red-600 mt-1">Unable to load image</p>
            </div>
          </div>

          <div v-else>
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 cursor-pointer"
              @click="$refs.fileInput.click()"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
              <div v-if="!imageFile && !imagePreview">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="mt-2 text-sm text-gray-600">Click or drag and drop an image</p>
              </div>
              <div v-else class="relative">
                <img :src="imagePreview" alt="Preview" class="max-h-48 mx-auto rounded-lg" />
                <button type="button" @click.stop="clearImage" class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">About Section</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">About Title</label>
          <input
            v-model="form.about_title"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., A Night to Remember"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">About (Plain Text) *</label>
          <textarea
            v-model="form.about"
            rows="4"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Brief description of your event"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">About Content (Rich HTML)</label>
          <textarea
            v-model="form.about_content"
            rows="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="<p>Detailed event information with <strong>HTML</strong> formatting...</p>"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">HTML is supported. Leave empty to use plain text above.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">About Image URL</label>
            <input
              v-model="form.about_image_url"
              type="url"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/about-image.jpg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Image Position</label>
            <select v-model="form.about_image_position" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
              <option value="right">Right (default)</option>
              <option value="left">Left</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Highlights Section -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Highlights</h2>
            <p class="text-sm text-gray-600">Feature cards showcasing event highlights (max 10)</p>
          </div>
          <button
            v-if="form.highlights.length < 10"
            type="button"
            @click="addHighlight"
            class="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 text-sm font-medium"
          >
            + Add Highlight
          </button>
        </div>

        <div v-for="(highlight, index) in form.highlights" :key="index" class="p-4 bg-gray-50 rounded-lg space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Highlight {{ index + 1 }}</span>
            <button type="button" @click="removeHighlight(index)" class="text-red-600 hover:text-red-700 text-sm">Remove</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input v-model="highlight.icon" type="text" placeholder="Icon (e.g., utensils)" class="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input v-model="highlight.title" type="text" placeholder="Title *" required class="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input v-model="highlight.description" type="text" placeholder="Description" class="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      <!-- Schedule Section -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Schedule</h2>
            <p class="text-sm text-gray-600">Timeline of activities (max 20)</p>
          </div>
          <button
            v-if="form.schedule.length < 20"
            type="button"
            @click="addScheduleItem"
            class="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 text-sm font-medium"
          >
            + Add Item
          </button>
        </div>

        <div v-for="(item, index) in form.schedule" :key="index" class="p-4 bg-gray-50 rounded-lg space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">Item {{ index + 1 }}</span>
            <button type="button" @click="removeScheduleItem(index)" class="text-red-600 hover:text-red-700 text-sm">Remove</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input v-model="item.time" type="text" placeholder="Time (e.g., 6:00 PM) *" required class="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input v-model="item.title" type="text" placeholder="Title *" required class="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <input v-model="item.description" type="text" placeholder="Description" class="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>
      </div>

      <!-- Gallery Section -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Gallery</h2>
            <p class="text-sm text-gray-600">Image gallery for your event (max 20)</p>
          </div>
          <button
            v-if="form.gallery_images.length < 20"
            type="button"
            @click="addGalleryImage"
            class="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 text-sm font-medium"
          >
            + Add Image
          </button>
        </div>

        <div v-for="(_, index) in form.gallery_images" :key="index" class="flex gap-3 items-center">
          <input
            v-model="form.gallery_images[index]"
            type="url"
            placeholder="Image URL"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button type="button" @click="removeGalleryImage(index)" class="text-red-600 hover:text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">FAQ</h2>
            <p class="text-sm text-gray-600">Frequently asked questions (max 20)</p>
          </div>
          <button
            v-if="form.faq_items.length < 20"
            type="button"
            @click="addFaqItem"
            class="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 text-sm font-medium"
          >
            + Add FAQ
          </button>
        </div>

        <div v-for="(faq, index) in form.faq_items" :key="index" class="p-4 bg-gray-50 rounded-lg space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-700">FAQ {{ index + 1 }}</span>
            <button type="button" @click="removeFaqItem(index)" class="text-red-600 hover:text-red-700 text-sm">Remove</button>
          </div>
          <input v-model="faq.question" type="text" placeholder="Question *" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          <textarea v-model="faq.answer" rows="2" placeholder="Answer *" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"></textarea>
        </div>
      </div>

      <!-- Venue & Contact Section -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">Venue & Contact</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
            <input
              v-model="form.venue_name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Grand Ballroom at Hotel Marriott"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Venue Address</label>
            <input
              v-model="form.venue_address"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="123 Main Street, City, ST 12345"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
          <input
            v-model="form.venue_map_url"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="https://maps.google.com/?q=..."
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              v-model="form.contact_email"
              type="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="events@school.edu"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              v-model="form.contact_phone"
              type="tel"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>
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
  // Basic info
  name: '',
  category_id: null,
  date: '',
  time: '',
  location: '',
  price: null,
  max_tickets: null,
  registration_deadline: '',

  // Hero section
  hero_title: '',
  hero_subtitle: '',
  hero_image: '',
  hero_cta_text: '',

  // About section
  about: '',
  about_title: '',
  about_content: '',
  about_image_url: '',
  about_image_position: 'right',

  // Highlights
  highlights: [],

  // Schedule
  schedule: [],

  // Gallery
  gallery_images: [],

  // FAQ
  faq_items: [],

  // Venue & Contact
  venue_name: '',
  venue_address: '',
  venue_map_url: '',
  contact_email: '',
  contact_phone: ''
})

// Array helpers
const addHighlight = () => {
  form.highlights.push({ icon: '', title: '', description: '' })
}
const removeHighlight = (index) => {
  form.highlights.splice(index, 1)
}

const addScheduleItem = () => {
  form.schedule.push({ time: '', title: '', description: '' })
}
const removeScheduleItem = (index) => {
  form.schedule.splice(index, 1)
}

const addGalleryImage = () => {
  form.gallery_images.push('')
}
const removeGalleryImage = (index) => {
  form.gallery_images.splice(index, 1)
}

const addFaqItem = () => {
  form.faq_items.push({ question: '', answer: '' })
}
const removeFaqItem = (index) => {
  form.faq_items.splice(index, 1)
}

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
  if (file) processFile(file)
}

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) processFile(file)
}

const processFile = (file) => {
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Image file must be less than 5MB'
    return
  }
  imageFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => { imagePreview.value = e.target.result }
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
  const response = await fetch(`${config.public.apiUrl}/events/${slug}/hero-image`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    body: formData
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || 'Failed to upload image')
  }
  return response.json()
}

const prepareEventData = () => {
  const eventData = { ...form }

  // Handle hero image
  if (imageType.value === 'url' && form.hero_image) {
    eventData.hero_image = form.hero_image
  } else {
    delete eventData.hero_image
  }

  // Filter out empty array items
  eventData.highlights = form.highlights.filter(h => h.title)
  eventData.schedule = form.schedule.filter(s => s.time && s.title)
  eventData.gallery_images = form.gallery_images.filter(url => url)
  eventData.faq_items = form.faq_items.filter(f => f.question && f.answer)

  // Set empty arrays to null if empty
  if (eventData.highlights.length === 0) eventData.highlights = null
  if (eventData.schedule.length === 0) eventData.schedule = null
  if (eventData.gallery_images.length === 0) eventData.gallery_images = null
  if (eventData.faq_items.length === 0) eventData.faq_items = null

  return eventData
}

const handleSaveDraft = async () => {
  submitting.value = true
  error.value = ''

  try {
    const eventData = prepareEventData()
    const response = await createEvent(eventData)

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
    const eventData = prepareEventData()
    const response = await createEvent(eventData)

    if (imageType.value === 'file' && imageFile.value) {
      await uploadHeroImage(response.event.slug)
    }

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
