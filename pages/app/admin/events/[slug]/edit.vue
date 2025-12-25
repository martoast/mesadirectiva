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
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <select
              v-model="form.group_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option :value="null">No group</option>
              <option v-for="group in groups" :key="group.id" :value="group.id">
                {{ group.name }}
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

        <!-- Hero Section -->
        <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
          <h2 class="text-xl font-bold text-gray-900">Hero Section</h2>
          <p class="text-sm text-gray-600">The main banner that appears at the top of your event page.</p>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
            <input
              v-model="form.hero_title"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="The main headline for your event"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
            <input
              v-model="form.hero_subtitle"
              type="text"
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

            <!-- Current Image Preview -->
            <div v-if="currentHeroImage && !imageFile && imageType === 'url' && !form.hero_image" class="mb-4">
              <p class="text-sm text-gray-500 mb-2">Current image:</p>
              <img :src="currentHeroImage" alt="Current hero" class="max-h-48 rounded-lg" />
            </div>

            <!-- Image Type Selection -->
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

            <!-- URL Input -->
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

            <!-- File Upload -->
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
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Description (Short)</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Brief event description"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">About (Plain Text)</label>
            <textarea
              v-model="form.about"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Detailed event information"
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
              <input v-model="highlight.title" type="text" placeholder="Title *" class="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
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
              <input v-model="item.time" type="text" placeholder="Time (e.g., 6:00 PM) *" class="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              <input v-model="item.title" type="text" placeholder="Title *" class="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
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
            <input v-model="faq.question" type="text" placeholder="Question *" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            <textarea v-model="faq.answer" rows="2" placeholder="Answer *" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"></textarea>
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
const { getGroups } = useGroups()

const event = ref(null)
const groups = ref([])
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
  // Basic info
  name: '',
  group_id: null,
  date: '',
  time: '',
  location: '',
  price: 0,
  max_tickets: 0,
  registration_deadline: '',
  registration_open: true,

  // Hero section
  hero_title: '',
  hero_subtitle: '',
  hero_image: '',
  hero_cta_text: '',

  // About section
  description: '',
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

const fetchEvent = async () => {
  loading.value = true
  error.value = ''

  try {
    const [eventResponse, groupsResponse] = await Promise.all([
      getEvent(route.params.slug),
      getGroups()
    ])

    event.value = eventResponse.event
    groups.value = groupsResponse.groups || []

    // Populate form with event data
    const e = eventResponse.event

    // Basic info
    form.name = e.name || ''
    form.group_id = e.group?.id || null
    form.date = e.date || ''
    form.time = e.time?.substring(0, 5) || ''
    form.location = e.location || ''
    form.price = e.price || 0
    form.max_tickets = e.max_tickets || 0
    form.registration_deadline = e.registration_deadline ? e.registration_deadline.substring(0, 16) : ''
    form.registration_open = e.registration_open ?? true

    // Hero section
    form.hero_title = e.hero_title || ''
    form.hero_subtitle = e.hero_subtitle || ''
    form.hero_cta_text = e.hero_cta_text || ''

    // About section
    form.description = e.description || ''
    form.about = e.about || ''
    form.about_title = e.about_title || ''
    form.about_content = e.about_content || ''
    form.about_image_url = e.about_image_url || ''
    form.about_image_position = e.about_image_position || 'right'

    // Highlights
    form.highlights = e.highlights?.length ? [...e.highlights] : []

    // Schedule
    form.schedule = e.schedule?.length ? [...e.schedule] : []

    // Gallery
    form.gallery_images = e.gallery_images?.length ? [...e.gallery_images] : []

    // FAQ
    form.faq_items = e.faq_items?.length ? [...e.faq_items] : []

    // Venue & Contact
    form.venue_name = e.venue_name || ''
    form.venue_address = e.venue_address || ''
    form.venue_map_url = e.venue_map_url || ''
    form.contact_email = e.contact_email || ''
    form.contact_phone = e.contact_phone || ''

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
  if (file) processFile(file)
}

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) processFile(file)
}

const processFile = (file) => {
  if (file.size > 5 * 1024 * 1024) {
    formError.value = 'Image file must be less than 5MB'
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

const handleSubmit = async () => {
  submitting.value = true
  formError.value = ''

  try {
    const eventData = prepareEventData()
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
    const eventData = prepareEventData()

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
