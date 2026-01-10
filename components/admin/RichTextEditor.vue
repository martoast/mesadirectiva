<template>
  <div class="rich-text-editor">
    <!-- Toolbar -->
    <div class="editor-toolbar">
      <button
        type="button"
        :class="['toolbar-btn', { active: isActive('bold') }]"
        @click="exec('bold')"
        :title="t.bold"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
        </svg>
      </button>

      <button
        type="button"
        :class="['toolbar-btn', { active: isActive('italic') }]"
        @click="exec('italic')"
        :title="t.italic"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
        </svg>
      </button>

      <button
        type="button"
        :class="['toolbar-btn', { active: isActive('underline') }]"
        @click="exec('underline')"
        :title="t.underline"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
        </svg>
      </button>

      <span class="toolbar-divider"></span>

      <button
        type="button"
        :class="['toolbar-btn', { active: isActive('insertUnorderedList') }]"
        @click="exec('insertUnorderedList')"
        :title="t.bulletList"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
        </svg>
      </button>

      <button
        type="button"
        :class="['toolbar-btn', { active: isActive('insertOrderedList') }]"
        @click="exec('insertOrderedList')"
        :title="t.numberedList"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
        </svg>
      </button>

      <span class="toolbar-divider"></span>

      <button
        type="button"
        class="toolbar-btn"
        @click="insertLink"
        :title="t.link"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
        </svg>
      </button>

      <span class="toolbar-divider"></span>

      <button
        type="button"
        class="toolbar-btn"
        @click="clearFormatting"
        :title="t.clearFormatting"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.66L16.73 21 18 19.73 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6z"/>
        </svg>
      </button>
    </div>

    <!-- Editor Area -->
    <div
      ref="editorRef"
      class="editor-content"
      contenteditable="true"
      :placeholder="placeholder"
      @input="handleInput"
      @focus="onFocus"
      @blur="onBlur"
      @paste="handlePaste"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { sanitizeHtml } from '~/utils/html'

const { t: createT } = useLanguage()

const translations = {
  bold: { es: 'Negrita', en: 'Bold' },
  italic: { es: 'Cursiva', en: 'Italic' },
  underline: { es: 'Subrayado', en: 'Underline' },
  bulletList: { es: 'Lista con viñetas', en: 'Bullet list' },
  numberedList: { es: 'Lista numerada', en: 'Numbered list' },
  link: { es: 'Enlace', en: 'Link' },
  clearFormatting: { es: 'Limpiar formato', en: 'Clear formatting' },
  enterUrl: { es: 'Ingresa la URL:', en: 'Enter URL:' }
}

const t = createT(translations)

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const editorRef = ref(null)
const isFocused = ref(false)

// Initialize editor content
onMounted(() => {
  if (editorRef.value && props.modelValue) {
    editorRef.value.innerHTML = sanitizeHtml(props.modelValue)
  }
})

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && editorRef.value.innerHTML !== newValue) {
    editorRef.value.innerHTML = sanitizeHtml(newValue || '')
  }
})

// Execute formatting command (client-side only)
const exec = (command, value = null) => {
  if (typeof document === 'undefined') return
  document.execCommand(command, false, value)
  editorRef.value?.focus()
  emitValue()
}

// Check if a format is active (client-side only)
const isActive = (command) => {
  if (typeof document === 'undefined') return false
  try {
    return document.queryCommandState(command)
  } catch {
    return false
  }
}

// Handle input
const handleInput = () => {
  emitValue()
}

// Emit current value
const emitValue = () => {
  if (editorRef.value) {
    let html = editorRef.value.innerHTML
    // Clean up empty content
    if (html === '<br>' || html === '<div><br></div>') {
      html = ''
    }
    emit('update:modelValue', html)
  }
}

// Handle paste - strip unwanted formatting
const handlePaste = (e) => {
  e.preventDefault()

  // Get plain text or HTML from clipboard
  const html = e.clipboardData.getData('text/html')
  const text = e.clipboardData.getData('text/plain')

  if (html) {
    // Sanitize the HTML
    const sanitized = sanitizeHtml(html)
    document.execCommand('insertHTML', false, sanitized)
  } else if (text) {
    // Convert plain text line breaks to <br>
    const htmlText = text.replace(/\n/g, '<br>')
    document.execCommand('insertHTML', false, htmlText)
  }

  emitValue()
}

// Insert link (client-side only)
const insertLink = () => {
  if (typeof window === 'undefined') return
  const url = prompt(t.enterUrl, 'https://')
  if (url) {
    exec('createLink', url)
  }
}

// Clear all formatting (client-side only)
const clearFormatting = () => {
  if (typeof window === 'undefined') return
  exec('removeFormat')
  // Also remove list formatting
  const selection = window.getSelection()
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const container = range.commonAncestorContainer

    // Find parent list
    let parent = container.nodeType === 3 ? container.parentNode : container
    while (parent && parent !== editorRef.value) {
      if (parent.tagName === 'UL' || parent.tagName === 'OL') {
        // Convert list items to paragraphs
        const items = parent.querySelectorAll('li')
        const fragment = document.createDocumentFragment()
        items.forEach(li => {
          const p = document.createElement('p')
          p.innerHTML = li.innerHTML
          fragment.appendChild(p)
        })
        parent.parentNode.replaceChild(fragment, parent)
        break
      }
      parent = parent.parentNode
    }
  }
  emitValue()
}

// Focus/blur handlers
const onFocus = () => {
  isFocused.value = true
  emit('focus')
}

const onBlur = () => {
  isFocused.value = false
  emit('blur')
}
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f9fafb;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  flex-wrap: wrap;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.toolbar-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.toolbar-btn.active {
  background: #e0e7ff;
  color: #4f46e5;
}

.toolbar-btn svg {
  width: 18px;
  height: 18px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: #e5e7eb;
  margin: 0 4px;
}

.editor-content {
  min-height: 150px;
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
  font-size: 15px;
  line-height: 1.6;
  color: #111827;
  outline: none;
}

.editor-content:empty::before {
  content: attr(placeholder);
  color: #9ca3af;
  pointer-events: none;
}

/* Style the content inside the editor */
.editor-content :deep(p) {
  margin: 0 0 1em 0;
}

.editor-content :deep(p:last-child) {
  margin-bottom: 0;
}

/* List styles - override Tailwind's Preflight reset */
.editor-content :deep(ul) {
  list-style: disc outside !important;
  margin: 0.5em 0 1em 0 !important;
  padding-left: 2em !important;
}

.editor-content :deep(ol) {
  list-style: decimal outside !important;
  margin: 0.5em 0 1em 0 !important;
  padding-left: 2em !important;
}

.editor-content :deep(li) {
  display: list-item !important;
  margin-bottom: 0.35em;
}

.editor-content :deep(li)::marker {
  color: #374151;
}

/* Nested list styles */
.editor-content :deep(ul ul) {
  list-style-type: circle !important;
  margin-top: 0.5em !important;
  margin-bottom: 0.5em !important;
}

.editor-content :deep(ul ul ul) {
  list-style-type: square !important;
}

.editor-content :deep(ol ol) {
  list-style-type: lower-alpha !important;
  margin-top: 0.5em !important;
  margin-bottom: 0.5em !important;
}

.editor-content :deep(a) {
  color: #4f46e5;
  text-decoration: underline;
}

.editor-content :deep(strong),
.editor-content :deep(b) {
  font-weight: 600;
}

.editor-content :deep(em),
.editor-content :deep(i) {
  font-style: italic;
}

/* Focus state */
.rich-text-editor:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Responsive */
@media (max-width: 640px) {
  .toolbar-btn {
    width: 36px;
    height: 36px;
  }

  .toolbar-btn svg {
    width: 20px;
    height: 20px;
  }
}
</style>

<style>
/* Global styles for editor content - not scoped to ensure they apply to dynamic content */
.rich-text-editor .editor-content ul {
  list-style: disc outside !important;
  margin: 0.5em 0 1em 0 !important;
  padding-left: 2em !important;
}

.rich-text-editor .editor-content ol {
  list-style: decimal outside !important;
  margin: 0.5em 0 1em 0 !important;
  padding-left: 2em !important;
}

.rich-text-editor .editor-content li {
  display: list-item !important;
  margin-bottom: 0.35em;
}
</style>
