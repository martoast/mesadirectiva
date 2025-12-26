<!-- components/admin/EventMediaStep.vue -->
<!-- Media step for event form: main image, gallery, and YouTube video -->
<template>
  <div class="media-step">
    <!-- Main Event Image -->
    <div class="media-section">
      <div class="section-header">
        <h3>Main Event Image</h3>
        <span class="badge required">Required</span>
      </div>
      <p class="section-description">
        This is the primary image shown on your event page and in listings. Use a high-quality image that represents your event.
      </p>
      <AdminEventImageUpload
        v-model="mainImage"
        :existing-url="existingImageUrl"
        :uploading="uploading"
        :upload-progress="uploadProgress"
        @file-selected="handleMainImageFile"
        @url-selected="handleMainImageUrl"
        @clear="handleClearMainImage"
      />
    </div>

    <!-- Gallery Images -->
    <div class="media-section">
      <div class="section-header">
        <h3>Gallery Images</h3>
        <span class="badge optional">Optional</span>
      </div>
      <p class="section-description">
        Add additional images to showcase your venue, past events, or what attendees can expect.
      </p>

      <div class="gallery-grid">
        <div
          v-for="(image, index) in galleryImages"
          :key="index"
          class="gallery-item"
        >
          <img :src="getImagePreview(image)" alt="Gallery image" />
          <button type="button" class="remove-gallery-btn" @click="removeGalleryImage(index)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button
          v-if="galleryImages.length < 6"
          type="button"
          class="add-gallery-btn"
          @click="triggerGalleryInput"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Image</span>
        </button>
      </div>

      <input
        ref="galleryInput"
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        class="hidden-input"
        multiple
        @change="handleGallerySelect"
      />
      <p class="hint">Up to 6 images. PNG, JPG, or WEBP (max 5MB each)</p>
    </div>

    <!-- YouTube Video -->
    <div class="media-section">
      <div class="section-header">
        <h3>Video</h3>
        <span class="badge optional">Optional</span>
      </div>
      <p class="section-description">
        Add a YouTube video to give attendees a preview of what to expect.
      </p>

      <div class="video-input-wrapper">
        <div class="input-icon">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <input
          v-model="videoUrl"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          class="video-input"
          @blur="validateVideoUrl"
        />
      </div>

      <div v-if="videoEmbedId" class="video-preview">
        <div class="video-embed">
          <iframe
            :src="`https://www.youtube.com/embed/${videoEmbedId}`"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <button type="button" class="remove-video-btn" @click="clearVideo">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove video
        </button>
      </div>

      <p v-if="videoError" class="error-message">{{ videoError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  eventSlug: {
    type: String,
    default: ''
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:media', 'upload-main-image', 'upload-gallery-image'])

// State
const mainImage = ref(null)
const existingImageUrl = ref('')
const galleryImages = ref([])
const videoUrl = ref('')
const videoError = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const galleryInput = ref(null)

// Initialize with existing data
watch(() => props.initialData, (data) => {
  if (data.image_url) {
    existingImageUrl.value = data.image_url
  }
  if (data.gallery) {
    galleryImages.value = data.gallery.map(g => ({ type: 'url', url: g.url, id: g.id }))
  }
  if (data.video_url) {
    videoUrl.value = data.video_url
  }
}, { immediate: true })

// Extract YouTube video ID
const videoEmbedId = computed(() => {
  if (!videoUrl.value) return null

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ]

  for (const pattern of patterns) {
    const match = videoUrl.value.match(pattern)
    if (match) return match[1]
  }

  return null
})

// Get preview URL for gallery images
const getImagePreview = (image) => {
  if (image.type === 'file') {
    return URL.createObjectURL(image.file)
  }
  return image.url
}

// Main image handlers
const handleMainImageFile = (file) => {
  emit('upload-main-image', { type: 'file', file })
  emitUpdate()
}

const handleMainImageUrl = (url) => {
  emit('upload-main-image', { type: 'url', url })
  emitUpdate()
}

const handleClearMainImage = () => {
  mainImage.value = null
  existingImageUrl.value = ''
  emitUpdate()
}

// Gallery handlers
const triggerGalleryInput = () => {
  galleryInput.value?.click()
}

const handleGallerySelect = (event) => {
  const files = Array.from(event.target.files || [])
  const remaining = 6 - galleryImages.value.length

  files.slice(0, remaining).forEach(file => {
    if (validateGalleryFile(file)) {
      galleryImages.value.push({ type: 'file', file })
      emit('upload-gallery-image', { type: 'file', file })
    }
  })

  // Reset input
  if (galleryInput.value) {
    galleryInput.value.value = ''
  }

  emitUpdate()
}

const validateGalleryFile = (file) => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  const maxSize = 5 * 1024 * 1024

  return validTypes.includes(file.type) && file.size <= maxSize
}

const removeGalleryImage = (index) => {
  galleryImages.value.splice(index, 1)
  emitUpdate()
}

// Video handlers
const validateVideoUrl = () => {
  if (!videoUrl.value) {
    videoError.value = ''
    return
  }

  if (!videoEmbedId.value) {
    videoError.value = 'Please enter a valid YouTube URL'
  } else {
    videoError.value = ''
    emitUpdate()
  }
}

const clearVideo = () => {
  videoUrl.value = ''
  videoError.value = ''
  emitUpdate()
}

// Emit consolidated update
const emitUpdate = () => {
  emit('update:media', {
    mainImage: mainImage.value,
    mainImageUrl: existingImageUrl.value,
    gallery: galleryImages.value,
    videoUrl: videoUrl.value
  })
}

// Expose for parent
defineExpose({
  mainImage,
  galleryImages,
  videoUrl,
  videoEmbedId
})
</script>

<style scoped>
.media-step {
  --color-primary: #6366f1;
  --color-border: #e5e7eb;
  --color-bg-subtle: #f9fafb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-error: #ef4444;
  --radius: 8px;
}

.media-section {
  margin-bottom: 2.5rem;
}

.media-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.section-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.badge {
  padding: 0.25rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border-radius: 4px;
}

.badge.required {
  background: #fef2f2;
  color: #dc2626;
}

.badge.optional {
  background: var(--color-bg-subtle);
  color: var(--color-text-muted);
}

.section-description {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
  line-height: 1.5;
}

/* Gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius);
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-gallery-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.gallery-item:hover .remove-gallery-btn {
  opacity: 1;
}

.add-gallery-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  aspect-ratio: 1;
  background: var(--color-bg-subtle);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.add-gallery-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.04);
}

.add-gallery-btn span {
  font-size: 0.75rem;
  font-weight: 500;
}

.hidden-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.75rem;
}

/* Video */
.video-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.input-icon {
  flex-shrink: 0;
  color: #ff0000;
}

.video-input {
  flex: 1;
  padding: 0;
  font-size: 0.9375rem;
  background: transparent;
  border: none;
  color: var(--color-text);
}

.video-input:focus {
  outline: none;
}

.video-input::placeholder {
  color: var(--color-text-muted);
}

.video-preview {
  margin-top: 1rem;
}

.video-embed {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: var(--radius);
}

.video-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.remove-video-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
  padding: 0;
  background: none;
  border: none;
  font-size: 0.8125rem;
  color: var(--color-error);
  cursor: pointer;
}

.remove-video-btn:hover {
  text-decoration: underline;
}

.error-message {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-error);
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
