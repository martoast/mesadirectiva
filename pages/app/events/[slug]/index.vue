<template>
  <div class="event-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading event...</p>
    </div>

    <!-- Event Content -->
    <div v-else-if="event" class="event-content">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg" :style="heroBackground"></div>
        <div class="hero-overlay"></div>
        <div class="hero-inner">
          <div class="hero-content">
            <div v-if="event.group" class="hero-badge" :style="{ backgroundColor: event.group.color }">
              {{ event.group.name }}
            </div>
            <h1 class="hero-title">{{ event.name }}</h1>
            <p v-if="truncatedDescription" class="hero-subtitle">{{ truncatedDescription }}</p>

            <div class="hero-meta">
              <div class="meta-item">
                <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <span class="meta-label">Date</span>
                  <span class="meta-value">{{ formattedDate }}</span>
                </div>
              </div>
              <div class="meta-item">
                <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span class="meta-label">Time</span>
                  <span class="meta-value">{{ formattedTime }}</span>
                </div>
              </div>
              <div class="meta-item">
                <svg v-if="event.location_type === 'online'" class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <svg v-else class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <span class="meta-label">{{ event.location_type === 'online' ? 'Platform' : 'Location' }}</span>
                  <span class="meta-value">{{ formattedLocation }}</span>
                </div>
              </div>
            </div>

            <!-- Mobile CTA -->
            <div class="hero-cta-mobile">
              <div class="price-tag">
                <span class="price-label">{{ pricingLabel }}</span>
                <span class="price-amount">${{ displayPrice }}</span>
              </div>
              <button v-if="canPurchase" @click="handleCtaClick" class="cta-button">
                {{ ctaButtonText }}
              </button>
              <span v-else class="cta-blocked">{{ blockedMessage }}</span>
            </div>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="scroll-hint">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-wrapper">
          <!-- Left Column -->
          <div class="content-column">
            <!-- About Section -->
            <section class="section about-section">
              <h2 class="section-title">About This Event</h2>
              <div class="about-grid">
                <div class="about-text">
                  <p class="about-plain">{{ event.description }}</p>
                </div>
                <div v-if="galleryImages.length > 0" class="about-image">
                  <img :src="galleryImages[0]" alt="Event" loading="lazy" />
                </div>
              </div>
            </section>

            <!-- Gallery Section -->
            <section v-if="galleryImages.length > 1" class="section gallery-section">
              <h2 class="section-title centered">Gallery</h2>
              <div class="gallery-grid">
                <button
                  v-for="(img, i) in galleryImages"
                  :key="i"
                  class="gallery-item"
                  @click="openGallery(i)"
                >
                  <img :src="img" :alt="`Gallery ${i + 1}`" loading="lazy" />
                </button>
              </div>
            </section>

            <!-- YouTube Video -->
            <section v-if="youtubeEmbedUrl" class="section video-section">
              <h2 class="section-title centered">Watch</h2>
              <div class="video-wrapper">
                <iframe
                  :src="youtubeEmbedUrl"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </section>

            <!-- FAQ Section -->
            <section v-if="event.faq_items?.length" class="section faq-section">
              <h2 class="section-title centered">Frequently Asked Questions</h2>
              <div class="faq-list">
                <div v-for="(faq, i) in event.faq_items" :key="i" class="faq-item">
                  <button class="faq-question" @click="toggleFaq(i)">
                    <span>{{ faq.question }}</span>
                    <svg :class="['faq-chevron', openFaqs.includes(i) && 'open']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-show="openFaqs.includes(i)" class="faq-answer">
                    <p>{{ faq.answer }}</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Venue/Online Section -->
            <section v-if="hasLocationInfo" class="section venue-section">
              <h2 class="section-title centered">{{ event.location_type === 'online' ? 'Event Details' : 'Venue' }}</h2>
              <div class="venue-card">
                <div class="venue-grid">
                  <!-- Venue Location -->
                  <div v-if="event.location_type === 'venue'" class="venue-info">
                    <div class="venue-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="venue-name">{{ event.location?.name || 'Venue' }}</h4>
                      <p v-if="fullAddress" class="venue-address">{{ fullAddress }}</p>
                      <a v-if="mapUrl" :href="mapUrl" target="_blank" rel="noopener" class="venue-map-link">
                        View on Map
                      </a>
                    </div>
                  </div>

                  <!-- Online Event -->
                  <div v-else-if="event.location_type === 'online'" class="venue-info">
                    <div class="venue-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="venue-name">{{ platformLabel }}</h4>
                      <p v-if="event.location?.instructions" class="venue-address">{{ event.location.instructions }}</p>
                      <p class="venue-note">Join link will be provided after registration</p>
                    </div>
                  </div>

                  <!-- Organizer Info -->
                  <div v-if="event.organizer_name" class="venue-contact">
                    <div class="venue-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="contact-title">Organized by</h4>
                      <p class="organizer-name">{{ event.organizer_name }}</p>
                      <p v-if="event.organizer_description" class="organizer-desc">{{ event.organizer_description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column: Sticky CTA (Desktop) -->
          <aside class="sidebar">
            <PublicTicketCTA :event="event" :availability="availability" />
          </aside>
        </div>
      </main>

      <!-- Related Events -->
      <section v-if="relatedEvents.length" class="related-section">
        <div class="related-wrapper">
          <h2 class="section-title">You Might Also Like</h2>
          <div class="related-grid">
            <NuxtLink
              v-for="re in relatedEvents"
              :key="re.id"
              :to="`/app/events/${re.slug}`"
              class="related-card"
            >
              <div class="related-image" :style="re.image_url ? { backgroundImage: `url('${re.image_url}')` } : {}"></div>
              <div class="related-content">
                <h3 class="related-title">{{ re.name }}</h3>
                <p class="related-date">{{ formatRelatedDate(re.starts_at) }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Gallery Modal -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="galleryOpen" class="gallery-modal" @click.self="galleryOpen = false">
            <button class="modal-close" @click="galleryOpen = false">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button v-if="galleryIndex > 0" class="modal-nav prev" @click="galleryIndex--">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <img :src="galleryImages[galleryIndex]" alt="Gallery" class="modal-image" />
            <button v-if="galleryIndex < galleryImages.length - 1" class="modal-nav next" @click="galleryIndex++">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div class="modal-counter">{{ galleryIndex + 1 }} / {{ galleryImages.length }}</div>
          </div>
        </Transition>
      </Teleport>
    </div>

    <!-- Not Found -->
    <div v-else-if="notFound" class="not-found">
      <h1>Event Not Found</h1>
      <p>Sorry, we couldn't find this event.</p>
      <NuxtLink to="/app/events" class="back-link">Browse Events</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatDate, formatTime } from '~/utils/dateTime'
import { formatLocation, formatFullAddress, buildMapUrl, getPlatformLabel } from '~/utils/location'

definePageMeta({
  layout: 'public'
})

const route = useRoute()
const { getPublicEvent, checkAvailability, getPublicEvents } = useEvents()
const { getPublicTicketTiers } = useTicketTiers()
const { getPublicTables } = useTables()

const event = ref(null)
const availability = ref(null)
const relatedEvents = ref([])
const tiers = ref([])
const tables = ref([])
const loading = ref(true)
const notFound = ref(false)
const openFaqs = ref([])
const galleryOpen = ref(false)
const galleryIndex = ref(0)

// Computed
const isSeatedEvent = computed(() => event.value?.seating_type === 'seated')
const hasTiers = computed(() => tiers.value.length > 0)
const activeTables = computed(() => tables.value.filter(t => t.is_active && t.status !== 'sold'))
const hasTables = computed(() => activeTables.value.length > 0)

const heroBackground = computed(() => {
  if (event.value?.image_url) {
    return { backgroundImage: `url('${event.value.image_url}')` }
  }
  return {}
})

const truncatedDescription = computed(() => {
  if (!event.value?.description) return ''
  const maxLength = 200
  if (event.value.description.length <= maxLength) return event.value.description
  return event.value.description.substring(0, maxLength).trim() + '...'
})

const formattedDate = computed(() => {
  if (!event.value?.starts_at) return ''
  return formatDate(event.value.starts_at, event.value.timezone)
})

const formattedTime = computed(() => {
  if (!event.value?.starts_at) return ''
  return formatTime(event.value.starts_at, event.value.timezone)
})

const formattedLocation = computed(() => {
  return formatLocation(event.value?.location_type, event.value?.location)
})

const galleryImages = computed(() => {
  const images = []
  if (event.value?.image_url) {
    images.push(event.value.image_url)
  }
  if (event.value?.media?.images?.length) {
    // Extract URL from each image object
    images.push(...event.value.media.images.map(img => img.url))
  }
  return images
})

const youtubeEmbedUrl = computed(() => {
  // Get first video from media.videos array
  const video = event.value?.media?.videos?.[0]
  if (!video?.url) return ''

  const url = video.url

  // Extract video ID from various YouTube URL formats
  let videoId = ''
  if (url.includes('youtube.com/watch')) {
    try {
      const urlParams = new URL(url).searchParams
      videoId = urlParams.get('v')
    } catch (e) {
      // Invalid URL, try regex
    }
  }
  if (!videoId && url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0]
  }
  if (!videoId && url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1]?.split('?')[0]
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
})

const activeTiers = computed(() => {
  return tiers.value.filter(t => t.is_active && !t.is_hidden)
})

const lowestTierPrice = computed(() => {
  if (!activeTiers.value.length) return null
  return Math.min(...activeTiers.value.map(t => Number(t.price)))
})

const lowestTablePrice = computed(() => {
  if (!activeTables.value.length) return null
  return Math.min(...activeTables.value.map(t => Number(t.price || 0)))
})

const displayPrice = computed(() => {
  // For seated events, show table pricing
  if (isSeatedEvent.value) {
    if (lowestTablePrice.value !== null && lowestTablePrice.value > 0) {
      return lowestTablePrice.value.toFixed(2)
    }
    return '0.00'
  }
  // For GA events, show tier pricing
  if (lowestTierPrice.value !== null) return lowestTierPrice.value.toFixed(2)
  return '0.00'
})

const pricingLabel = computed(() => {
  if (isSeatedEvent.value) return hasTables.value ? 'Tables from' : 'From'
  if (activeTiers.value.length > 1) return 'From'
  return 'Per ticket'
})

const ctaButtonText = computed(() => {
  if (isSeatedEvent.value) return 'Choose a Table'
  return 'Get Tickets'
})

const canPurchase = computed(() => {
  return availability.value?.can_purchase ?? event.value?.can_purchase ?? true
})

const blockedMessage = computed(() => {
  const reason = availability.value?.blocked_reason || event.value?.purchase_blocked_reason
  const messages = {
    not_live: 'Coming Soon',
    registration_closed: 'Registration Closed',
    deadline_passed: 'Registration Ended',
    sold_out: 'Sold Out',
    no_available_tickets: isSeatedEvent.value ? 'No Tables Available' : 'No Tickets Available'
  }
  return messages[reason] || 'Not Available'
})

const hasLocationInfo = computed(() => {
  return event.value?.location || event.value?.organizer_name
})

const fullAddress = computed(() => {
  if (!event.value?.location) return ''
  return formatFullAddress(event.value.location)
})

const mapUrl = computed(() => {
  if (!event.value?.location) return ''
  return buildMapUrl(event.value.location)
})

const platformLabel = computed(() => {
  if (!event.value?.location?.platform) return 'Online Event'
  return getPlatformLabel(event.value.location.platform)
})

// Methods
const handleCtaClick = () => {
  const path = isSeatedEvent.value
    ? `/app/events/${event.value.slug}/select-seats`
    : `/app/events/${event.value.slug}/checkout`
  navigateTo(path)
}

const toggleFaq = (index) => {
  const idx = openFaqs.value.indexOf(index)
  if (idx === -1) {
    openFaqs.value.push(index)
  } else {
    openFaqs.value.splice(idx, 1)
  }
}

const openGallery = (index) => {
  galleryIndex.value = index
  galleryOpen.value = true
}

const formatRelatedDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

// Data fetching
const fetchEvent = async () => {
  loading.value = true
  notFound.value = false
  try {
    const [eventRes, availRes] = await Promise.all([
      getPublicEvent(route.params.slug),
      checkAvailability(route.params.slug)
    ])
    event.value = eventRes.event
    availability.value = availRes
    // Fetch tiers for GA events, tables for seated events
    if (event.value?.seating_type === 'seated') {
      fetchTables()
    } else {
      fetchTiers()
    }
    fetchRelatedEvents()
  } catch (e) {
    if (e.status === 404) notFound.value = true
  } finally {
    loading.value = false
  }
}

const fetchTiers = async () => {
  try {
    const res = await getPublicTicketTiers(route.params.slug)
    tiers.value = res.tiers || []
  } catch (e) {}
}

const fetchTables = async () => {
  try {
    const res = await getPublicTables(route.params.slug)
    tables.value = res.tables || []
  } catch (e) {
    console.error('Failed to fetch tables:', e)
  }
}

const fetchRelatedEvents = async () => {
  try {
    const res = await getPublicEvents({ per_page: 4, group: event.value?.group?.slug })
    relatedEvents.value = (res.events || []).filter(e => e.slug !== route.params.slug).slice(0, 3)
  } catch (e) {}
}

onMounted(fetchEvent)
</script>

<style scoped>
/* ============================================
   Event Landing Page - Clean Mobile-First
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

.event-page {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --color-text: #1a1a1a;
  --color-text-light: #666;
  --color-text-muted: #999;
  --color-bg: #fff;
  --color-bg-alt: #f8f8f8;
  --color-border: #eee;
  --color-primary: #2563eb;
  --color-success: #10b981;
  --radius: 12px;
  --shadow: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);

  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}

/* Loading State */
.loading-state {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--color-text-light);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
}

.hero-inner {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 80px 20px 100px;
}

.hero-content {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  padding: 6px 14px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
  border-radius: 20px;
  margin-bottom: 16px;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 12px;
}

.hero-subtitle {
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  line-height: 1.5;
  margin-bottom: 32px;
}

.hero-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.meta-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #fff;
}

.meta-icon {
  width: 20px;
  height: 20px;
  opacity: 0.7;
  flex-shrink: 0;
}

.meta-item > div {
  text-align: left;
}

.meta-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.meta-value {
  display: block;
  font-size: 14px;
  font-weight: 500;
}

/* Mobile CTA in Hero */
.hero-cta-mobile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.price-tag {
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: #fff;
}

.price-label {
  font-size: 13px;
  opacity: 0.8;
}

.price-amount {
  font-size: 36px;
  font-weight: 700;
}

.cta-button {
  width: 100%;
  max-width: 280px;
  padding: 16px 32px;
  background: var(--color-success);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta-button:active {
  transform: scale(0.98);
}

.cta-blocked {
  padding: 12px 24px;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.8);
  font-size: 14px;
  font-weight: 500;
  border-radius: 50px;
}

.scroll-hint {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.5);
  animation: bounce 2s infinite;
}

.scroll-hint svg {
  width: 24px;
  height: 24px;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

/* Main Content */
.main-content {
  padding: 48px 20px;
}

.content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}

.content-column {
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.sidebar {
  display: none;
}

/* Section Styles */
.section {
  scroll-margin-top: 80px;
}

.section-title {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 24px;
}

.section-title.centered {
  text-align: center;
}

/* About Section */
.about-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.about-text {
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-text-light);
}

.about-plain {
  white-space: pre-wrap;
}

.about-image img {
  width: 100%;
  border-radius: var(--radius);
}

/* Video Section */
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: var(--radius);
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.gallery-item {
  aspect-ratio: 1;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  border: none;
  padding: 0;
  background: var(--color-bg-alt);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

/* FAQ */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-item {
  background: var(--color-bg-alt);
  border-radius: var(--radius);
  overflow: hidden;
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: none;
  border: none;
  text-align: left;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
}

.faq-chevron {
  width: 20px;
  height: 20px;
  color: var(--color-text-muted);
  transition: transform 0.2s;
  flex-shrink: 0;
}

.faq-chevron.open {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 20px 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-light);
}

/* Venue */
.venue-card {
  background: var(--color-bg-alt);
  border-radius: var(--radius);
  padding: 24px;
}

.venue-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.venue-info,
.venue-contact {
  display: flex;
  gap: 16px;
}

.venue-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 10px;
  flex-shrink: 0;
}

.venue-icon svg {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
}

.venue-name,
.contact-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.venue-address {
  font-size: 14px;
  color: var(--color-text-light);
  margin-bottom: 8px;
}

.venue-note {
  font-size: 13px;
  color: var(--color-text-muted);
  font-style: italic;
}

.venue-map-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
}

.organizer-name {
  font-size: 14px;
  color: var(--color-text);
  margin-bottom: 4px;
}

.organizer-desc {
  font-size: 13px;
  color: var(--color-text-light);
}

/* Related Events */
.related-section {
  background: var(--color-bg-alt);
  padding: 48px 20px;
  margin-top: 48px;
}

.related-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}

.related-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.related-card {
  display: flex;
  gap: 16px;
  background: #fff;
  border-radius: var(--radius);
  overflow: hidden;
  text-decoration: none;
  transition: box-shadow 0.2s;
}

.related-card:hover {
  box-shadow: var(--shadow);
}

.related-image {
  width: 100px;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--color-primary), #1e40af);
  background-size: cover;
  background-position: center;
}

.related-content {
  padding: 16px 16px 16px 0;
  flex: 1;
  min-width: 0;
}

.related-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-date {
  font-size: 13px;
  color: var(--color-text-light);
}

/* Gallery Modal */
.gallery-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
}

.modal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
}

.modal-nav.prev { left: 16px; }
.modal-nav.next { right: 16px; }

.modal-nav svg,
.modal-close svg {
  width: 24px;
  height: 24px;
}

.modal-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
}

.modal-counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  color: rgba(255,255,255,0.7);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Not Found */
.not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}

.not-found h1 {
  font-family: var(--font-heading);
  font-size: 28px;
  margin-bottom: 12px;
}

.not-found p {
  color: var(--color-text-light);
  margin-bottom: 24px;
}

.back-link {
  padding: 12px 24px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  border-radius: 50px;
  text-decoration: none;
}

/* ============================================
   Tablet (640px+)
   ============================================ */
@media (min-width: 640px) {
  .hero-title {
    font-size: 42px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .hero-meta {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 24px;
  }

  .meta-item {
    min-width: auto;
  }

  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .related-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .related-card {
    flex-direction: column;
  }

  .related-image {
    width: 100%;
    height: 140px;
  }

  .related-content {
    padding: 16px;
  }
}

/* ============================================
   Desktop (1024px+)
   ============================================ */
@media (min-width: 1024px) {
  .hero-inner {
    padding: 120px 40px;
  }

  .hero-title {
    font-size: 52px;
  }

  .hero-cta-mobile {
    display: none;
  }

  .scroll-hint {
    display: none;
  }

  .main-content {
    padding: 64px 40px;
  }

  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 48px;
  }

  .sidebar {
    display: block;
  }

  .section-title {
    font-size: 28px;
  }

  .about-grid {
    flex-direction: row;
    gap: 48px;
  }

  .about-text {
    flex: 1;
  }

  .about-image {
    width: 320px;
    flex-shrink: 0;
  }

  .venue-grid {
    flex-direction: row;
    gap: 48px;
  }

  .venue-info,
  .venue-contact {
    flex: 1;
  }

  .related-section {
    padding: 64px 40px;
  }
}
</style>
