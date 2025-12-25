<template>
  <div class="event-builder">
    <!-- Phase 1: Quick Setup -->
    <Transition name="fade-slide">
      <div v-if="phase === 'setup'" class="setup-phase">
        <div class="setup-container">
          <!-- Header -->
          <div class="setup-header">
            <NuxtLink to="/app/admin/events" class="back-link">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </NuxtLink>
            <div class="setup-title">
              <span class="title-badge">New Event</span>
              <h1>Let's create something amazing</h1>
              <p>Start with the basics, then customize your event page visually.</p>
            </div>
          </div>

          <!-- Setup Form -->
          <form @submit.prevent="proceedToBuilder" class="setup-form">
            <div class="form-group">
              <label for="event-name">What's your event called?</label>
              <input
                id="event-name"
                v-model="form.name"
                type="text"
                placeholder="Annual Gala 2025"
                required
                class="input-large"
                @input="generateSlug"
              />
              <span class="input-hint" v-if="form.name">
                URL: /events/{{ generatedSlug }}
              </span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="event-date">When is it?</label>
                <input
                  id="event-date"
                  v-model="form.date"
                  type="date"
                  required
                  class="input-standard"
                />
              </div>
              <div class="form-group">
                <label for="event-time">What time?</label>
                <input
                  id="event-time"
                  v-model="form.time"
                  type="time"
                  required
                  class="input-standard"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="event-location">Where will it happen?</label>
              <input
                id="event-location"
                v-model="form.location"
                type="text"
                placeholder="Grand Ballroom, Hotel Marriott"
                required
                class="input-standard"
              />
            </div>

            <div class="form-group">
              <label for="event-group">Group</label>
              <select id="event-group" v-model="form.group_id" class="input-standard">
                <option :value="null">Select a group</option>
                <option v-for="g in groups" :key="g.id" :value="g.id">
                  {{ g.name }}
                </option>
              </select>
            </div>

            <!-- Event Type Selection -->
            <div class="form-group">
              <label>How will people attend?</label>
              <div class="type-selector">
                <button
                  type="button"
                  :class="['type-option', form.seating_type === 'general_admission' && 'active']"
                  @click="form.seating_type = 'general_admission'"
                >
                  <div class="type-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div class="type-content">
                    <strong>General Admission</strong>
                    <span>Ticket tiers with different pricing</span>
                  </div>
                  <div class="type-check" v-if="form.seating_type === 'general_admission'">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </div>
                </button>
                <button
                  type="button"
                  :class="['type-option', form.seating_type === 'seated' && 'active']"
                  @click="form.seating_type = 'seated'"
                >
                  <div class="type-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div class="type-content">
                    <strong>Seated Event</strong>
                    <span>Tables and seat selection</span>
                  </div>
                  <div class="type-check" v-if="form.seating_type === 'seated'">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Conditional fields -->
            <div v-if="form.seating_type === 'general_admission'" class="form-row">
              <div class="form-group">
                <label for="base-price">Base ticket price</label>
                <div class="input-with-prefix">
                  <span class="prefix">$</span>
                  <input
                    id="base-price"
                    v-model.number="form.price"
                    type="number"
                    placeholder="150"
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="max-tickets">Maximum tickets</label>
                <input
                  id="max-tickets"
                  v-model.number="form.max_tickets"
                  type="number"
                  placeholder="200"
                  required
                  class="input-standard"
                />
              </div>
            </div>

            <button type="submit" class="btn-continue" :disabled="!canProceed">
              <span>Continue to Page Builder</span>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Phase 2: Visual Builder -->
    <Transition name="fade-slide">
      <div v-if="phase === 'builder'" class="builder-phase">
        <!-- Builder Header -->
        <header class="builder-header">
          <div class="header-left">
            <button @click="phase = 'setup'" class="back-btn">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="event-meta">
              <span class="event-name">{{ form.name || 'Untitled Event' }}</span>
              <span class="event-status">Draft</span>
            </div>
          </div>
          <div class="header-center">
            <div class="view-toggle">
              <button :class="['toggle-btn', previewMode === 'desktop' && 'active']" @click="previewMode = 'desktop'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button :class="['toggle-btn', previewMode === 'mobile' && 'active']" @click="previewMode = 'mobile'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div class="header-right">
            <button @click="handleSaveDraft" class="btn-secondary" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save Draft' }}
            </button>
            <button @click="handlePublish" class="btn-primary" :disabled="submitting">
              {{ submitting ? 'Publishing...' : 'Publish' }}
            </button>
          </div>
        </header>

        <!-- Builder Content -->
        <div class="builder-content">
          <!-- Sections Sidebar -->
          <aside class="sections-sidebar">
            <div class="sidebar-header">
              <h3>Sections</h3>
              <span class="section-count">{{ enabledSectionsCount }}/{{ sections.length }}</span>
            </div>
            <div class="sections-list">
              <div
                v-for="section in sections"
                :key="section.id"
                :class="['section-item', activeSection === section.id && 'active', section.enabled && 'enabled']"
                @click="selectSection(section.id)"
              >
                <button
                  type="button"
                  class="section-toggle"
                  @click.stop="toggleSection(section.id)"
                  :title="section.enabled ? 'Disable section' : 'Enable section'"
                >
                  <div :class="['toggle-track', section.enabled && 'on']">
                    <div class="toggle-thumb"></div>
                  </div>
                </button>
                <div class="section-info">
                  <span class="section-name">{{ section.name }}</span>
                  <span class="section-desc">{{ section.description }}</span>
                </div>
                <div class="section-status" v-if="section.enabled">
                  <svg v-if="isSectionComplete(section.id)" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </aside>

          <!-- Preview Area -->
          <div class="preview-area">
            <div :class="['preview-frame', previewMode]">
              <div class="preview-scroll" ref="previewScroll">
                <!-- Hero Section Preview -->
                <div
                  v-if="getSectionById('hero').enabled"
                  :class="['preview-section', activeSection === 'hero' && 'active']"
                  @click="selectSection('hero')"
                >
                  <div class="section-overlay">
                    <span class="overlay-label">Hero</span>
                  </div>
                  <div class="hero-preview" :style="heroStyle">
                    <div class="hero-content">
                      <h1>{{ form.hero_title || 'Your Event Title' }}</h1>
                      <p>{{ form.hero_subtitle || 'A compelling subtitle for your event' }}</p>
                      <button class="hero-cta">{{ form.hero_cta_text || 'Get Tickets' }}</button>
                    </div>
                  </div>
                </div>

                <!-- About Section Preview -->
                <div
                  v-if="getSectionById('about').enabled"
                  :class="['preview-section', activeSection === 'about' && 'active']"
                  @click="selectSection('about')"
                >
                  <div class="section-overlay">
                    <span class="overlay-label">About</span>
                  </div>
                  <div class="about-preview">
                    <div class="about-content">
                      <h2>{{ form.about_title || 'About the Event' }}</h2>
                      <p>{{ form.about || 'Tell your audience what makes this event special...' }}</p>
                    </div>
                    <div v-if="form.about_image_url" class="about-image">
                      <img :src="form.about_image_url" alt="About" />
                    </div>
                  </div>
                </div>

                <!-- Highlights Section Preview -->
                <div
                  v-if="getSectionById('highlights').enabled"
                  :class="['preview-section', activeSection === 'highlights' && 'active']"
                  @click="selectSection('highlights')"
                >
                  <div class="section-overlay">
                    <span class="overlay-label">Highlights</span>
                  </div>
                  <div class="highlights-preview">
                    <h2>Event Highlights</h2>
                    <div class="highlights-grid">
                      <div v-for="(h, i) in (form.highlights.length ? form.highlights : placeholderHighlights)" :key="i" class="highlight-card">
                        <div class="highlight-icon">{{ h.icon || '✨' }}</div>
                        <h3>{{ h.title || 'Feature ' + (i + 1) }}</h3>
                        <p>{{ h.description || 'Description here' }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Schedule Section Preview -->
                <div
                  v-if="getSectionById('schedule').enabled"
                  :class="['preview-section', activeSection === 'schedule' && 'active']"
                  @click="selectSection('schedule')"
                >
                  <div class="section-overlay">
                    <span class="overlay-label">Schedule</span>
                  </div>
                  <div class="schedule-preview">
                    <h2>Event Schedule</h2>
                    <div class="schedule-timeline">
                      <div v-for="(item, i) in (form.schedule.length ? form.schedule : placeholderSchedule)" :key="i" class="schedule-item">
                        <div class="schedule-time">{{ item.time || '6:00 PM' }}</div>
                        <div class="schedule-content">
                          <h4>{{ item.title || 'Activity ' + (i + 1) }}</h4>
                          <p>{{ item.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Gallery Section Preview -->
                <div
                  v-if="getSectionById('gallery').enabled"
                  :class="['preview-section', activeSection === 'gallery' && 'active']"
                  @click="selectSection('gallery')"
                >
                  <div class="section-overlay">
                    <span class="overlay-label">Gallery</span>
                  </div>
                  <div class="gallery-preview">
                    <h2>Gallery</h2>
                    <div class="gallery-grid">
                      <div v-for="i in 4" :key="i" class="gallery-placeholder"></div>
                    </div>
                  </div>
                </div>

                <!-- FAQ Section Preview -->
                <div
                  v-if="getSectionById('faq').enabled"
                  :class="['preview-section', activeSection === 'faq' && 'active']"
                  @click="selectSection('faq')"
                >
                  <div class="section-overlay">
                    <span class="overlay-label">FAQ</span>
                  </div>
                  <div class="faq-preview">
                    <h2>Frequently Asked Questions</h2>
                    <div class="faq-list">
                      <div v-for="(faq, i) in (form.faq_items.length ? form.faq_items : placeholderFaq)" :key="i" class="faq-item">
                        <h4>{{ faq.question || 'Question ' + (i + 1) + '?' }}</h4>
                        <p>{{ faq.answer || 'Answer goes here...' }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Venue Section Preview -->
                <div
                  v-if="getSectionById('venue').enabled"
                  :class="['preview-section', activeSection === 'venue' && 'active']"
                  @click="selectSection('venue')"
                >
                  <div class="section-overlay">
                    <span class="overlay-label">Venue</span>
                  </div>
                  <div class="venue-preview">
                    <h2>Venue & Location</h2>
                    <div class="venue-info">
                      <div class="venue-details">
                        <h3>{{ form.venue_name || form.location || 'Venue Name' }}</h3>
                        <p>{{ form.venue_address || 'Address details here' }}</p>
                        <div class="venue-contact" v-if="form.contact_email || form.contact_phone">
                          <span v-if="form.contact_email">{{ form.contact_email }}</span>
                          <span v-if="form.contact_phone">{{ form.contact_phone }}</span>
                        </div>
                      </div>
                      <div class="venue-map"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Editor Panel -->
          <Transition name="slide-left">
            <aside v-if="activeSection" class="editor-panel">
              <div class="editor-header">
                <h3>{{ activeSectionData?.name }}</h3>
                <button @click="activeSection = null" class="close-btn">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="editor-content">
                <!-- Hero Editor -->
                <template v-if="activeSection === 'hero'">
                  <div class="editor-field">
                    <label>Hero Title</label>
                    <input v-model="form.hero_title" type="text" placeholder="The main headline" />
                  </div>
                  <div class="editor-field">
                    <label>Hero Subtitle</label>
                    <input v-model="form.hero_subtitle" type="text" placeholder="A compelling tagline" />
                  </div>
                  <div class="editor-field">
                    <label>Button Text</label>
                    <input v-model="form.hero_cta_text" type="text" placeholder="Get Tickets" />
                  </div>
                  <div class="editor-field">
                    <label>Background Image URL</label>
                    <input v-model="form.hero_image" type="url" placeholder="https://..." />
                    <p class="field-hint">You can also upload an image after saving.</p>
                  </div>
                </template>

                <!-- About Editor -->
                <template v-if="activeSection === 'about'">
                  <div class="editor-field">
                    <label>Section Title</label>
                    <input v-model="form.about_title" type="text" placeholder="About the Event" />
                  </div>
                  <div class="editor-field">
                    <label>Description</label>
                    <textarea v-model="form.about" rows="6" placeholder="Tell your audience what makes this event special..."></textarea>
                  </div>
                  <div class="editor-field">
                    <label>Image URL (optional)</label>
                    <input v-model="form.about_image_url" type="url" placeholder="https://..." />
                  </div>
                  <div class="editor-field">
                    <label>Image Position</label>
                    <div class="radio-group">
                      <label class="radio-option">
                        <input type="radio" v-model="form.about_image_position" value="right" />
                        <span>Right</span>
                      </label>
                      <label class="radio-option">
                        <input type="radio" v-model="form.about_image_position" value="left" />
                        <span>Left</span>
                      </label>
                    </div>
                  </div>
                </template>

                <!-- Highlights Editor -->
                <template v-if="activeSection === 'highlights'">
                  <div class="editor-list">
                    <div v-for="(h, i) in form.highlights" :key="i" class="editor-list-item">
                      <div class="list-item-header">
                        <span>Highlight {{ i + 1 }}</span>
                        <button @click="removeHighlight(i)" class="remove-btn">Remove</button>
                      </div>
                      <input v-model="h.icon" type="text" placeholder="Icon (emoji or name)" />
                      <input v-model="h.title" type="text" placeholder="Title" />
                      <input v-model="h.description" type="text" placeholder="Description" />
                    </div>
                  </div>
                  <button v-if="form.highlights.length < 10" @click="addHighlight" class="add-btn">
                    + Add Highlight
                  </button>
                </template>

                <!-- Schedule Editor -->
                <template v-if="activeSection === 'schedule'">
                  <div class="editor-list">
                    <div v-for="(item, i) in form.schedule" :key="i" class="editor-list-item">
                      <div class="list-item-header">
                        <span>Item {{ i + 1 }}</span>
                        <button @click="removeScheduleItem(i)" class="remove-btn">Remove</button>
                      </div>
                      <input v-model="item.time" type="text" placeholder="Time (e.g., 6:00 PM)" />
                      <input v-model="item.title" type="text" placeholder="Title" />
                      <input v-model="item.description" type="text" placeholder="Description" />
                    </div>
                  </div>
                  <button v-if="form.schedule.length < 20" @click="addScheduleItem" class="add-btn">
                    + Add Schedule Item
                  </button>
                </template>

                <!-- Gallery Editor -->
                <template v-if="activeSection === 'gallery'">
                  <p class="editor-note">Add image URLs for your gallery.</p>
                  <div class="editor-list">
                    <div v-for="(url, i) in form.gallery_images" :key="i" class="gallery-url-item">
                      <input v-model="form.gallery_images[i]" type="url" placeholder="Image URL" />
                      <button @click="removeGalleryImage(i)" class="remove-icon-btn">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button v-if="form.gallery_images.length < 20" @click="addGalleryImage" class="add-btn">
                    + Add Image
                  </button>
                </template>

                <!-- FAQ Editor -->
                <template v-if="activeSection === 'faq'">
                  <div class="editor-list">
                    <div v-for="(faq, i) in form.faq_items" :key="i" class="editor-list-item">
                      <div class="list-item-header">
                        <span>FAQ {{ i + 1 }}</span>
                        <button @click="removeFaqItem(i)" class="remove-btn">Remove</button>
                      </div>
                      <input v-model="faq.question" type="text" placeholder="Question" />
                      <textarea v-model="faq.answer" rows="3" placeholder="Answer"></textarea>
                    </div>
                  </div>
                  <button v-if="form.faq_items.length < 20" @click="addFaqItem" class="add-btn">
                    + Add FAQ
                  </button>
                </template>

                <!-- Venue Editor -->
                <template v-if="activeSection === 'venue'">
                  <div class="editor-field">
                    <label>Venue Name</label>
                    <input v-model="form.venue_name" type="text" placeholder="Grand Ballroom" />
                  </div>
                  <div class="editor-field">
                    <label>Address</label>
                    <input v-model="form.venue_address" type="text" placeholder="123 Main St, City" />
                  </div>
                  <div class="editor-field">
                    <label>Google Maps URL</label>
                    <input v-model="form.venue_map_url" type="url" placeholder="https://maps.google.com/..." />
                  </div>
                  <div class="editor-field">
                    <label>Contact Email</label>
                    <input v-model="form.contact_email" type="email" placeholder="events@example.com" />
                  </div>
                  <div class="editor-field">
                    <label>Contact Phone</label>
                    <input v-model="form.contact_phone" type="tel" placeholder="+1 (555) 123-4567" />
                  </div>
                </template>
              </div>
            </aside>
          </Transition>
        </div>
      </div>
    </Transition>

    <!-- Error Toast -->
    <Transition name="toast">
      <div v-if="error" class="error-toast">
        <span>{{ error }}</span>
        <button @click="error = ''" class="toast-close">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

definePageMeta({
  middleware: ['auth', 'admin']
})

const router = useRouter()
const { createEvent, publishEvent } = useEvents()
const { getGroups } = useGroups()

// State
const phase = ref('setup')
const groups = ref([])
const activeSection = ref(null)
const previewMode = ref('desktop')
const submitting = ref(false)
const error = ref('')
const generatedSlug = ref('')

// Form data
const form = reactive({
  name: '',
  group_id: null,
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
  hero_image: '',
  hero_cta_text: 'Get Tickets',
  about: '',
  about_title: 'About the Event',
  about_content: '',
  about_image_url: '',
  about_image_position: 'right',
  highlights: [],
  schedule: [],
  gallery_images: [],
  faq_items: [],
  venue_name: '',
  venue_address: '',
  venue_map_url: '',
  contact_email: '',
  contact_phone: ''
})

// Sections configuration
const sections = reactive([
  { id: 'hero', name: 'Hero', description: 'Main banner', enabled: true, required: true },
  { id: 'about', name: 'About', description: 'Event description', enabled: true, required: true },
  { id: 'highlights', name: 'Highlights', description: 'Feature cards', enabled: false },
  { id: 'schedule', name: 'Schedule', description: 'Timeline', enabled: false },
  { id: 'gallery', name: 'Gallery', description: 'Image gallery', enabled: false },
  { id: 'faq', name: 'FAQ', description: 'Questions & answers', enabled: false },
  { id: 'venue', name: 'Venue', description: 'Location & contact', enabled: true }
])

// Placeholder data for preview
const placeholderHighlights = [
  { icon: '🎵', title: 'Live Music', description: 'World-class entertainment' },
  { icon: '🍽️', title: 'Gourmet Dining', description: 'Exquisite cuisine' },
  { icon: '🎭', title: 'Entertainment', description: 'Unforgettable performances' }
]

const placeholderSchedule = [
  { time: '6:00 PM', title: 'Doors Open', description: 'Welcome reception' },
  { time: '7:00 PM', title: 'Main Event', description: 'The show begins' },
  { time: '10:00 PM', title: 'Closing', description: 'Thank you for joining' }
]

const placeholderFaq = [
  { question: 'What should I wear?', answer: 'Business casual or formal attire is recommended.' },
  { question: 'Is parking available?', answer: 'Yes, complimentary valet parking is provided.' }
]

// Computed
const canProceed = computed(() => {
  const base = form.name && form.date && form.time && form.location
  if (form.seating_type === 'general_admission') {
    return base && form.price && form.max_tickets
  }
  return base
})

const enabledSectionsCount = computed(() => sections.filter(s => s.enabled).length)

const activeSectionData = computed(() => sections.find(s => s.id === activeSection.value))

const heroStyle = computed(() => {
  if (form.hero_image) {
    return { backgroundImage: `url(${form.hero_image})` }
  }
  return {}
})

// Methods
const generateSlug = () => {
  generatedSlug.value = form.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const getSectionById = (id) => sections.find(s => s.id === id) || { enabled: false }

const selectSection = (id) => {
  const section = getSectionById(id)
  if (section.enabled) {
    activeSection.value = id
  }
}

const toggleSection = (id) => {
  const section = sections.find(s => s.id === id)
  if (section && !section.required) {
    section.enabled = !section.enabled
    if (!section.enabled && activeSection.value === id) {
      activeSection.value = null
    }
  }
}

const isSectionComplete = (id) => {
  switch (id) {
    case 'hero':
      return form.hero_title && form.hero_subtitle
    case 'about':
      return form.about
    case 'highlights':
      return form.highlights.length > 0
    case 'schedule':
      return form.schedule.length > 0
    case 'gallery':
      return form.gallery_images.length > 0
    case 'faq':
      return form.faq_items.length > 0
    case 'venue':
      return form.venue_name || form.venue_address
    default:
      return false
  }
}

// Array helpers
const addHighlight = () => form.highlights.push({ icon: '', title: '', description: '' })
const removeHighlight = (i) => form.highlights.splice(i, 1)
const addScheduleItem = () => form.schedule.push({ time: '', title: '', description: '' })
const removeScheduleItem = (i) => form.schedule.splice(i, 1)
const addGalleryImage = () => form.gallery_images.push('')
const removeGalleryImage = (i) => form.gallery_images.splice(i, 1)
const addFaqItem = () => form.faq_items.push({ question: '', answer: '' })
const removeFaqItem = (i) => form.faq_items.splice(i, 1)

const proceedToBuilder = () => {
  // Pre-fill hero with event name if empty
  if (!form.hero_title) form.hero_title = form.name
  if (!form.hero_subtitle) form.hero_subtitle = `${formatDate(form.date)} • ${form.location}`
  phase.value = 'builder'
  activeSection.value = 'hero'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const prepareEventData = () => {
  const data = {
    name: form.name,
    group_id: form.group_id,
    date: form.date,
    time: form.time,
    location: form.location,
    seating_type: form.seating_type,
    hero_title: form.hero_title,
    hero_subtitle: form.hero_subtitle,
    hero_cta_text: form.hero_cta_text || 'Get Tickets',
    hero_image: form.hero_image || null,
    about: form.about,
    about_title: form.about_title,
    about_content: form.about_content || null,
    about_image_url: form.about_image_url || null,
    about_image_position: form.about_image_position
  }

  if (form.seating_type === 'general_admission') {
    data.price = form.price
    data.max_tickets = form.max_tickets
  } else {
    data.reservation_minutes = form.reservation_minutes || 15
  }

  if (form.registration_deadline) data.registration_deadline = form.registration_deadline

  // Optional sections
  if (getSectionById('highlights').enabled && form.highlights.length > 0) {
    data.highlights = form.highlights.filter(h => h.title)
  }
  if (getSectionById('schedule').enabled && form.schedule.length > 0) {
    data.schedule = form.schedule.filter(s => s.time && s.title)
  }
  if (getSectionById('gallery').enabled && form.gallery_images.length > 0) {
    data.gallery_images = form.gallery_images.filter(url => url)
  }
  if (getSectionById('faq').enabled && form.faq_items.length > 0) {
    data.faq_items = form.faq_items.filter(f => f.question && f.answer)
  }
  if (getSectionById('venue').enabled) {
    if (form.venue_name) data.venue_name = form.venue_name
    if (form.venue_address) data.venue_address = form.venue_address
    if (form.venue_map_url) data.venue_map_url = form.venue_map_url
    if (form.contact_email) data.contact_email = form.contact_email
    if (form.contact_phone) data.contact_phone = form.contact_phone
  }

  return data
}

const handleSaveDraft = async () => {
  submitting.value = true
  error.value = ''
  try {
    const eventData = prepareEventData()
    const response = await createEvent(eventData)
    router.push(`/app/admin/events/${response.event.slug}`)
  } catch (e) {
    error.value = e.message || 'Failed to save event'
  } finally {
    submitting.value = false
  }
}

const handlePublish = async () => {
  submitting.value = true
  error.value = ''
  try {
    const eventData = prepareEventData()
    const response = await createEvent(eventData)
    await publishEvent(response.event.slug)
    router.push(`/app/admin/events/${response.event.slug}`)
  } catch (e) {
    error.value = e.message || 'Failed to publish event'
  } finally {
    submitting.value = false
  }
}

const fetchGroups = async () => {
  try {
    const response = await getGroups()
    groups.value = response.groups || []
  } catch (e) {
    // Optional
  }
}

onMounted(() => {
  fetchGroups()
})
</script>

<style scoped>
/* ========================================
   Event Builder - Premium Visual Editor
   ======================================== */

@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap');

.event-builder {
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --color-surface: #fafafa;
  --color-surface-elevated: #ffffff;
  --color-border: #e5e5e5;
  --color-border-subtle: #f0f0f0;
  --color-text: #171717;
  --color-text-muted: #737373;
  --color-text-subtle: #a3a3a3;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  font-family: var(--font-body);
  min-height: 100vh;
  background: var(--color-surface);
}

/* ========== Transitions ========== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-20px); }

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* ========== Setup Phase ========== */
.setup-phase {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(37, 99, 235, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
    var(--color-surface);
}

.setup-container {
  width: 100%;
  max-width: 560px;
}

.setup-header {
  margin-bottom: 48px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--color-text-muted);
  margin-bottom: 24px;
  transition: color 0.2s;
}
.back-link:hover { color: var(--color-text); }

.setup-title {
  text-align: center;
}

.title-badge {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.setup-title h1 {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.setup-title p {
  color: var(--color-text-muted);
  font-size: 16px;
}

.setup-form {
  background: var(--color-surface-elevated);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border-subtle);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.input-large {
  width: 100%;
  padding: 16px 20px;
  font-size: 18px;
  font-family: var(--font-display);
  font-weight: 500;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  transition: all 0.2s;
}
.input-large:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.input-standard {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  transition: all 0.2s;
}
.input-standard:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-hint {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--color-text-subtle);
}

.input-with-prefix {
  position: relative;
}
.input-with-prefix .prefix {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  font-weight: 500;
}
.input-with-prefix input {
  width: 100%;
  padding: 12px 16px 12px 36px;
  font-size: 15px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  transition: all 0.2s;
}
.input-with-prefix input:focus {
  outline: none;
  border-color: var(--color-accent);
}

/* Type Selector */
.type-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}
.type-option:hover {
  border-color: var(--color-text-subtle);
}
.type-option.active {
  border-color: var(--color-accent);
  background: rgba(37, 99, 235, 0.04);
}

.type-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-elevated);
  border-radius: var(--radius-sm);
}
.type-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-muted);
}
.type-option.active .type-icon svg {
  color: var(--color-accent);
}

.type-content {
  flex: 1;
}
.type-content strong {
  display: block;
  font-size: 15px;
  color: var(--color-text);
  margin-bottom: 2px;
}
.type-content span {
  font-size: 13px;
  color: var(--color-text-muted);
}

.type-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent);
  border-radius: 50%;
  color: white;
}
.type-check svg {
  width: 14px;
  height: 14px;
}

.btn-continue {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}
.btn-continue:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
}
.btn-continue:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-continue svg {
  width: 20px;
  height: 20px;
}

/* ========== Builder Phase ========== */
.builder-phase {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.builder-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}
.back-btn:hover {
  background: rgba(255,255,255,0.15);
}

.event-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.event-name {
  color: white;
  font-weight: 600;
  font-size: 15px;
}

.event-status {
  padding: 4px 10px;
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.view-toggle {
  display: flex;
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  padding: 3px;
}

.toggle-btn {
  padding: 6px 12px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.5);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.toggle-btn.active {
  background: rgba(255,255,255,0.15);
  color: white;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-secondary {
  padding: 8px 16px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-secondary:hover:not(:disabled) {
  background: rgba(255,255,255,0.15);
}
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  padding: 8px 16px;
  background: var(--color-success);
  color: white;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover:not(:disabled) {
  background: #059669;
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Builder Content Layout */
.builder-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sections Sidebar */
.sections-sidebar {
  width: 240px;
  background: var(--color-surface-elevated);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-subtle);
}
.sidebar-header h3 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-muted);
}
.section-count {
  font-size: 12px;
  color: var(--color-text-subtle);
}

.sections-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.section-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.15s;
  opacity: 0.5;
  margin-bottom: 4px;
}
.section-item.enabled {
  opacity: 1;
}
.section-item:hover {
  background: var(--color-surface);
}
.section-item.active {
  background: rgba(37, 99, 235, 0.08);
}

.section-toggle {
  flex-shrink: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
}

.toggle-track {
  width: 32px;
  height: 18px;
  background: #d4d4d4;
  border-radius: 9px;
  position: relative;
  transition: background 0.2s;
}
.toggle-track.on {
  background: var(--color-accent);
}
.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: transform 0.2s;
}
.toggle-track.on .toggle-thumb {
  transform: translateX(14px);
}

.section-info {
  flex: 1;
  min-width: 0;
}
.section-name {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}
.section-desc {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
}

.section-status {
  flex-shrink: 0;
}

/* Preview Area */
.preview-area {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px;
  background: #e5e5e5;
  overflow: hidden;
}

.preview-frame {
  width: 100%;
  max-width: 1000px;
  height: 100%;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  transition: all 0.3s ease;
}
.preview-frame.mobile {
  max-width: 375px;
}

.preview-scroll {
  height: 100%;
  overflow-y: auto;
}

/* Preview Sections */
.preview-section {
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}
.preview-section:hover .section-overlay {
  opacity: 1;
}
.preview-section.active {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}
.preview-section.active .section-overlay {
  opacity: 1;
  background: rgba(37, 99, 235, 0.05);
}

.section-overlay {
  position: absolute;
  inset: 0;
  background: rgba(37, 99, 235, 0.02);
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 12px;
}

.overlay-label {
  padding: 4px 10px;
  background: var(--color-accent);
  color: white;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-radius: 4px;
}

/* Hero Preview */
.hero-preview {
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a5f 0%, #0c1929 100%);
  background-size: cover;
  background-position: center;
  padding: 60px 40px;
  text-align: center;
}

.hero-content h1 {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.hero-content p {
  font-size: 18px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 24px;
}

.hero-cta {
  padding: 14px 32px;
  background: white;
  color: #1e3a5f;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* About Preview */
.about-preview {
  display: flex;
  gap: 40px;
  padding: 60px 40px;
}

.about-content {
  flex: 1;
}
.about-content h2 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 16px;
}
.about-content p {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text-muted);
}

.about-image {
  width: 300px;
  flex-shrink: 0;
}
.about-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: var(--radius-md);
}

/* Highlights Preview */
.highlights-preview {
  padding: 60px 40px;
  background: var(--color-surface);
}
.highlights-preview h2 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 32px;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.highlight-card {
  padding: 24px;
  background: white;
  border-radius: var(--radius-md);
  text-align: center;
  box-shadow: var(--shadow-sm);
}
.highlight-icon {
  font-size: 32px;
  margin-bottom: 12px;
}
.highlight-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}
.highlight-card p {
  font-size: 14px;
  color: var(--color-text-muted);
}

/* Schedule Preview */
.schedule-preview {
  padding: 60px 40px;
}
.schedule-preview h2 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 32px;
}

.schedule-timeline {
  max-width: 500px;
  margin: 0 auto;
}

.schedule-item {
  display: flex;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border-subtle);
}
.schedule-time {
  width: 80px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent);
}
.schedule-content h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}
.schedule-content p {
  font-size: 14px;
  color: var(--color-text-muted);
}

/* Gallery Preview */
.gallery-preview {
  padding: 60px 40px;
  background: var(--color-surface);
}
.gallery-preview h2 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 32px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.gallery-placeholder {
  aspect-ratio: 1;
  background: var(--color-border);
  border-radius: var(--radius-sm);
}

/* FAQ Preview */
.faq-preview {
  padding: 60px 40px;
}
.faq-preview h2 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 32px;
}

.faq-list {
  max-width: 600px;
  margin: 0 auto;
}

.faq-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--color-border-subtle);
}
.faq-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}
.faq-item p {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* Venue Preview */
.venue-preview {
  padding: 60px 40px;
  background: var(--color-surface);
}
.venue-preview h2 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 32px;
}

.venue-info {
  display: flex;
  gap: 40px;
}

.venue-details {
  flex: 1;
}
.venue-details h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}
.venue-details p {
  font-size: 15px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.venue-contact {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: var(--color-text-muted);
}

.venue-map {
  width: 300px;
  height: 180px;
  background: var(--color-border);
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

/* Editor Panel */
.editor-panel {
  width: 360px;
  background: var(--color-surface-elevated);
  border-left: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-subtle);
}
.editor-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text-muted);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.close-btn:hover {
  background: var(--color-surface);
  color: var(--color-text);
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.editor-field {
  margin-bottom: 20px;
}
.editor-field label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  margin-bottom: 6px;
}
.editor-field input,
.editor-field textarea {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  transition: all 0.2s;
  resize: vertical;
}
.editor-field input:focus,
.editor-field textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}

.field-hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-text-subtle);
}

.radio-group {
  display: flex;
  gap: 16px;
}
.radio-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text);
}

.editor-note {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.editor-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.editor-list-item {
  padding: 16px;
  background: var(--color-surface);
  border-radius: var(--radius-sm);
}

.list-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.list-item-header span {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.remove-btn {
  padding: 4px 8px;
  background: none;
  border: none;
  font-size: 12px;
  color: #ef4444;
  cursor: pointer;
}

.editor-list-item input,
.editor-list-item textarea {
  width: 100%;
  padding: 8px 10px;
  font-size: 13px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  margin-bottom: 8px;
  background: white;
}
.editor-list-item input:last-child,
.editor-list-item textarea:last-child {
  margin-bottom: 0;
}

.gallery-url-item {
  display: flex;
  gap: 8px;
}
.gallery-url-item input {
  flex: 1;
  padding: 8px 10px;
  font-size: 13px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
}

.remove-icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-muted);
  cursor: pointer;
  flex-shrink: 0;
}
.remove-icon-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.add-btn {
  width: 100%;
  padding: 12px;
  background: none;
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 12px;
}
.add-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* Error Toast */
.error-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #1a1a1a;
  color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
}

.toast-close {
  padding: 4px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
}
.toast-close:hover {
  color: white;
}
</style>
