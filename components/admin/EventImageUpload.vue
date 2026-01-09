<!-- components/admin/EventImageUpload.vue -->
<!-- Drag-drop image upload with URL paste option -->
<template>
  <div class="image-upload">
    <div v-if="previewUrl" class="preview-container">
      <img :src="previewUrl" alt="Event image preview" class="preview-image" />
      <div class="preview-overlay">
        <button type="button" class="overlay-btn" @click="clearImage">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {{ t.remove }}
        </button>
        <button type="button" class="overlay-btn" @click="triggerFileInput">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ t.replace }}
        </button>
      </div>
    </div>

    <div
      v-else
      :class="['dropzone', { dragging: isDragging }]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <div class="dropzone-content">
        <div class="dropzone-icon">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="dropzone-text">
          <span class="text-primary">{{ t.clickToUpload }}</span> {{ t.orDragDrop }}
        </p>
        <p class="dropzone-hint">{{ t.fileHint }}</p>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/jpg,image/webp"
      class="hidden-input"
      @change="handleFileSelect"
    />

    <!-- URL Input Toggle -->
    <div class="url-section">
      <button type="button" class="url-toggle" @click="showUrlInput = !showUrlInput">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        {{ showUrlInput ? t.hideUrlInput : t.orUseImageUrl }}
      </button>

      <div v-if="showUrlInput" class="url-input-wrapper">
        <input
          v-model="urlInput"
          type="url"
          placeholder="https://example.com/image.jpg"
          class="url-input"
          @blur="handleUrlInput"
          @keyup.enter="handleUrlInput"
        />
        <button type="button" class="url-apply-btn" @click="handleUrlInput" :disabled="!urlInput">
          {{ t.apply }}
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <!-- Upload Progress -->
    <div v-if="uploading" class="upload-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
      <span class="progress-text">{{ t.uploading }} {{ uploadProgress }}%</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const { t: createT } = useLanguage()

const translations = {
  remove: { es: 'Eliminar', en: 'Remove' },
  replace: { es: 'Reemplazar', en: 'Replace' },
  clickToUpload: { es: 'Haz clic para subir', en: 'Click to upload' },
  orDragDrop: { es: 'o arrastra y suelta', en: 'or drag and drop' },
  fileHint: { es: 'PNG, JPG o WEBP (máx 5MB)', en: 'PNG, JPG, or WEBP (max 5MB)' },
  hideUrlInput: { es: 'Ocultar entrada de URL', en: 'Hide URL input' },
  orUseImageUrl: { es: 'O usa URL de imagen', en: 'Or use image URL' },
  apply: { es: 'Aplicar', en: 'Apply' },
  invalidImageType: { es: 'Por favor sube una imagen PNG, JPG o WEBP', en: 'Please upload a PNG, JPG, or WEBP image' },
  imageTooLarge: { es: 'La imagen debe ser menor a 5MB', en: 'Image must be less than 5MB' },
  invalidUrl: { es: 'Por favor ingresa una URL válida', en: 'Please enter a valid URL' },
  uploading: { es: 'Subiendo...', en: 'Uploading...' }
}

const t = createT(translations)

const props = defineProps({
  modelValue: {
    type: [File, String, null],
    default: null
  },
  existingUrl: {
    type: String,
    default: ''
  },
  uploading: {
    type: Boolean,
    default: false
  },
  uploadProgress: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'file-selected', 'url-selected', 'clear'])

const fileInput = ref(null)
const isDragging = ref(false)
const showUrlInput = ref(false)
const urlInput = ref('')
const errorMessage = ref('')
const localFile = ref(null)
const localUrl = ref('')

// Initialize with existing URL
watch(() => props.existingUrl, (newUrl) => {
  if (newUrl && !localFile.value) {
    localUrl.value = newUrl
  }
}, { immediate: true })

// Preview URL
const previewUrl = computed(() => {
  if (localFile.value) {
    return URL.createObjectURL(localFile.value)
  }
  if (localUrl.value) {
    return localUrl.value
  }
  return null
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const validateFile = (file) => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    return t.invalidImageType
  }
  if (file.size > maxSize) {
    return t.imageTooLarge
  }
  return null
}

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const error = validateFile(file)
  if (error) {
    errorMessage.value = error
    return
  }

  errorMessage.value = ''
  localFile.value = file
  localUrl.value = ''
  emit('update:modelValue', file)
  emit('file-selected', file)
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (!file) return

  const error = validateFile(file)
  if (error) {
    errorMessage.value = error
    return
  }

  errorMessage.value = ''
  localFile.value = file
  localUrl.value = ''
  emit('update:modelValue', file)
  emit('file-selected', file)
}

const handleUrlInput = () => {
  if (!urlInput.value) return

  // Basic URL validation
  try {
    new URL(urlInput.value)
  } catch {
    errorMessage.value = t.invalidUrl
    return
  }

  errorMessage.value = ''
  localUrl.value = urlInput.value
  localFile.value = null
  emit('update:modelValue', urlInput.value)
  emit('url-selected', urlInput.value)
  showUrlInput.value = false
}

const clearImage = () => {
  localFile.value = null
  localUrl.value = ''
  urlInput.value = ''
  errorMessage.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('update:modelValue', null)
  emit('clear')
}
</script>

<style scoped>
.image-upload {
  --color-primary: #6366f1;
  --color-border: #e5e7eb;
  --color-bg-subtle: #f9fafb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-error: #ef4444;
  --radius: 12px;
}

.preview-container {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: #000;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.preview-container:hover .preview-overlay {
  opacity: 1;
}

.overlay-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.2s;
}

.overlay-btn:hover {
  background: white;
}

.dropzone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--color-bg-subtle);
}

.dropzone:hover {
  border-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.04);
}

.dropzone.dragging {
  border-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.08);
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.dropzone-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  color: var(--color-text-muted);
}

.dropzone-text {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

.dropzone-text .text-primary {
  color: var(--color-primary);
  font-weight: 500;
}

.dropzone-hint {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  opacity: 0.8;
}

.hidden-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.url-section {
  margin-top: 1rem;
}

.url-toggle {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0;
  background: none;
  border: none;
  font-size: 0.8125rem;
  color: var(--color-primary);
  cursor: pointer;
}

.url-toggle:hover {
  text-decoration: underline;
}

.url-input-wrapper {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.url-input {
  flex: 1;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: white;
}

.url-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.url-apply-btn {
  padding: 0.625rem 1rem;
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.url-apply-btn:hover:not(:disabled) {
  background: #4f46e5;
}

.url-apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-error);
}

.upload-progress {
  margin-top: 1rem;
}

.progress-bar {
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s;
}

.progress-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  text-align: center;
}
</style>
