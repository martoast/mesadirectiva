<template>
  <div class="event-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>{{ t.loadingEvent }}</p>
    </div>

    <!-- Event Content -->
    <div v-else-if="event" class="event-content">
      <!-- Banner Image -->
      <section class="banner">
        <div class="banner-container">
          <div class="banner-image">
            <img
              v-if="event.image_url"
              :src="event.image_url"
              :alt="event.name"
              class="banner-img"
              :style="{ objectPosition: `${event.image_focal_x ?? 50}% ${event.image_focal_y ?? 50}%` }"
            />
            <div v-else class="banner-placeholder">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Event Header Info -->
      <section class="event-header">
        <div class="event-header-container">
          <div class="event-header-content">
            <!-- Date Badge -->
            <div class="date-badge">
              <span class="date-badge-month">{{ formattedMonth }}</span>
              <span class="date-badge-day">{{ formattedDay }}</span>
            </div>

            <!-- Event Info -->
            <div class="event-info">
              <h1 class="event-title">{{ event.name }}</h1>

              <div class="event-meta-list">
                <!-- Date & Time -->
                <div class="event-meta-item">
                  <svg class="event-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span class="event-meta-primary">{{ formattedDate }}</span>
                    <span class="event-meta-secondary">{{ formattedTime }}</span>
                  </div>
                </div>

                <!-- Location -->
                <div class="event-meta-item">
                  <svg v-if="event.location_type === 'online'" class="event-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="event-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <span class="event-meta-primary">{{ formattedLocation }}</span>
                    <span v-if="fullAddress && event.location_type === 'venue'" class="event-meta-secondary">{{ fullAddress }}</span>
                  </div>
                </div>

                <!-- Organizer -->
                <div v-if="event.organizer_name" class="event-meta-item">
                  <svg class="event-meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <span class="event-meta-label">{{ t.organizedBy }}</span>
                    <span class="event-meta-primary">{{ event.organizer_name }}</span>
                  </div>
                </div>
              </div>

              <!-- Group Badge -->
              <div v-if="event.group" class="group-badge" :style="{ backgroundColor: event.group.color }">
                {{ event.group.name }}
              </div>
            </div>
          </div>

          <!-- Mobile CTA -->
          <div class="mobile-cta">
            <div class="mobile-cta-price">
              <span class="mobile-cta-label">{{ pricingLabel }}</span>
              <span class="mobile-cta-amount">${{ displayPrice }}</span>
            </div>
            <button v-if="canPurchase" @click="handleCtaClick" class="mobile-cta-button">
              {{ ctaButtonText }}
            </button>
            <span v-else class="mobile-cta-blocked">{{ blockedMessage }}</span>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <main class="main-content">
        <div class="content-wrapper">
          <!-- Left Column -->
          <div class="content-column">
            <!-- About Section -->
            <section class="section about-section">
              <h2 class="section-title">{{ t.aboutThisEvent }}</h2>
              <div class="about-grid">
                <div class="about-text">
                  <div
                    v-if="isHtmlDescription"
                    class="about-html"
                    v-html="sanitizedDescription"
                  ></div>
                  <p v-else class="about-plain">{{ event.description }}</p>
                </div>
                <div v-if="galleryImages.length > 0" class="about-image">
                  <img :src="galleryImages[0]" alt="Event" loading="lazy" />
                </div>
              </div>
            </section>

            <!-- Gallery Section -->
            <section v-if="galleryImages.length > 1" class="section gallery-section">
              <h2 class="section-title centered">{{ t.gallery }}</h2>
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
              <h2 class="section-title centered">{{ t.watch }}</h2>
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
              <h2 class="section-title centered">{{ t.faq }}</h2>
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
              <h2 class="section-title centered">{{ event.location_type === 'online' ? t.eventDetails : t.venue }}</h2>
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
                        {{ t.viewOnMap }}
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
                      <p class="venue-note">{{ t.joinLinkProvided }}</p>
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
                      <h4 class="contact-title">{{ t.organizedBy }}</h4>
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
          <h2 class="section-title">{{ t.youMightAlsoLike }}</h2>
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
      <h1>{{ t.eventNotFound }}</h1>
      <p>{{ t.sorryNotFound }}</p>
      <NuxtLink to="/app/events" class="back-link">{{ t.browseEvents }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { formatDate, formatTime } from '~/utils/dateTime'
import { formatLocation, formatFullAddress, buildMapUrl, getPlatformLabel } from '~/utils/location'
import { isHtml, sanitizeHtml, truncateText as truncateHtmlText } from '~/utils/html'

definePageMeta({
  layout: 'public'
})

const { t: createT, language } = useLanguage()

// Translations
const translations = {
  loadingEvent: { es: 'Cargando evento...', en: 'Loading event...' },
  date: { es: 'Fecha', en: 'Date' },
  time: { es: 'Hora', en: 'Time' },
  platform: { es: 'Plataforma', en: 'Platform' },
  location: { es: 'Ubicación', en: 'Location' },
  aboutThisEvent: { es: 'Sobre Este Evento', en: 'About This Event' },
  gallery: { es: 'Galería', en: 'Gallery' },
  watch: { es: 'Ver', en: 'Watch' },
  faq: { es: 'Preguntas Frecuentes', en: 'Frequently Asked Questions' },
  eventDetails: { es: 'Detalles del Evento', en: 'Event Details' },
  venue: { es: 'Lugar', en: 'Venue' },
  viewOnMap: { es: 'Ver en Mapa', en: 'View on Map' },
  joinLinkProvided: { es: 'El enlace se proporcionará después del registro', en: 'Join link will be provided after registration' },
  organizedBy: { es: 'Organizado por', en: 'Organized by' },
  youMightAlsoLike: { es: 'También Te Puede Gustar', en: 'You Might Also Like' },
  eventNotFound: { es: 'Evento No Encontrado', en: 'Event Not Found' },
  sorryNotFound: { es: 'Lo sentimos, no pudimos encontrar este evento.', en: "Sorry, we couldn't find this event." },
  browseEvents: { es: 'Ver Eventos', en: 'Browse Events' },
  tablesFrom: { es: 'Mesas desde', en: 'Tables from' },
  from: { es: 'Desde', en: 'From' },
  perTicket: { es: 'Por boleto', en: 'Per ticket' },
  chooseTable: { es: 'Elegir Mesa', en: 'Choose a Table' },
  getTickets: { es: 'Obtener Boletos', en: 'Get Tickets' },
  comingSoon: { es: 'Próximamente', en: 'Coming Soon' },
  registrationClosed: { es: 'Registro Cerrado', en: 'Registration Closed' },
  registrationEnded: { es: 'Registro Finalizado', en: 'Registration Ended' },
  soldOut: { es: 'Agotado', en: 'Sold Out' },
  noTablesAvailable: { es: 'Sin Mesas Disponibles', en: 'No Tables Available' },
  noTicketsAvailable: { es: 'Sin Boletos Disponibles', en: 'No Tickets Available' },
  notAvailable: { es: 'No Disponible', en: 'Not Available' },
  onlineEvent: { es: 'Evento en Línea', en: 'Online Event' }
}

const t = createT(translations)

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

const bannerBackground = computed(() => {
  if (event.value?.image_url) {
    return { backgroundImage: `url('${event.value.image_url}')` }
  }
  return {}
})

const formattedMonth = computed(() => {
  if (!event.value?.starts_at) return ''
  const date = new Date(event.value.starts_at)
  return date.toLocaleDateString(language.value === 'es' ? 'es-MX' : 'en-US', { month: 'short' }).toUpperCase()
})

const formattedDay = computed(() => {
  if (!event.value?.starts_at) return ''
  const date = new Date(event.value.starts_at)
  return date.getDate()
})

const truncatedDescription = computed(() => {
  if (!event.value?.description) return ''
  return truncateHtmlText(event.value.description, 200)
})

// Check if description contains HTML
const isHtmlDescription = computed(() => {
  return isHtml(event.value?.description)
})

// Sanitized HTML for safe rendering
const sanitizedDescription = computed(() => {
  return sanitizeHtml(event.value?.description || '')
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
  return formatLocation(event.value?.location, event.value?.location_type)
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
  if (isSeatedEvent.value) return hasTables.value ? t.tablesFrom : t.from
  if (activeTiers.value.length > 1) return t.from
  return t.perTicket
})

const ctaButtonText = computed(() => {
  if (isSeatedEvent.value) return t.chooseTable
  return t.getTickets
})

const canPurchase = computed(() => {
  return availability.value?.can_purchase ?? event.value?.can_purchase ?? true
})

const blockedMessage = computed(() => {
  const reason = availability.value?.blocked_reason || event.value?.purchase_blocked_reason
  const messages = {
    not_live: t.comingSoon,
    registration_closed: t.registrationClosed,
    deadline_passed: t.registrationEnded,
    sold_out: t.soldOut,
    no_available_tickets: isSeatedEvent.value ? t.noTablesAvailable : t.noTicketsAvailable
  }
  return messages[reason] || t.notAvailable
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
  if (!event.value?.location?.platform) return t.onlineEvent
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

/* Banner Section */
.banner {
  background: var(--color-bg-alt);
}

.banner-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

.banner-image {
  width: 100%;
  min-height: 200px;
  max-height: 500px;
  background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
}

.banner-placeholder {
  color: rgba(255,255,255,0.3);
}

.banner-placeholder svg {
  width: 64px;
  height: 64px;
}

/* Event Header */
.event-header {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.event-header-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 20px;
}

.event-header-content {
  display: flex;
  gap: 20px;
}

.date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: var(--color-primary);
  border-radius: var(--radius);
  flex-shrink: 0;
}

.date-badge-month {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-badge-day {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.event-info {
  flex: 1;
  min-width: 0;
}

.event-title {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
  margin-bottom: 16px;
}

.event-meta-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.event-meta-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.event-meta-icon {
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
  flex-shrink: 0;
  margin-top: 2px;
}

.event-meta-label {
  display: block;
  font-size: 12px;
  color: var(--color-text-muted);
}

.event-meta-primary {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.event-meta-secondary {
  display: block;
  font-size: 13px;
  color: var(--color-text-light);
}

.group-badge {
  display: inline-block;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #fff;
  border-radius: 20px;
}

/* Mobile CTA */
.mobile-cta {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-cta-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.mobile-cta-label {
  font-size: 13px;
  color: var(--color-text-light);
}

.mobile-cta-amount {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
}

.mobile-cta-button {
  width: 100%;
  padding: 14px 24px;
  background: var(--color-success);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.2s;
}

.mobile-cta-button:hover {
  background: #059669;
}

.mobile-cta-blocked {
  display: block;
  text-align: center;
  padding: 14px 24px;
  background: var(--color-bg-alt);
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--radius);
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

/* HTML Description Styles */
.about-html {
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-text-light);
}

.about-html :deep(p) {
  margin: 0 0 1em 0;
}

.about-html :deep(p:last-child) {
  margin-bottom: 0;
}

.about-html :deep(ul),
.about-html :deep(ol) {
  margin: 1em 0;
  padding-left: 1.5em;
}

.about-html :deep(ul) {
  list-style-type: disc;
}

.about-html :deep(ol) {
  list-style-type: decimal;
}

.about-html :deep(li) {
  margin-bottom: 0.5em;
}

.about-html :deep(strong),
.about-html :deep(b) {
  font-weight: 600;
  color: var(--color-text);
}

.about-html :deep(em),
.about-html :deep(i) {
  font-style: italic;
}

.about-html :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
}

.about-html :deep(a:hover) {
  opacity: 0.8;
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
  .banner-container {
    padding: 24px;
  }

  .banner-image {
    border-radius: var(--radius);
    max-height: 450px;
  }

  .banner-img {
    max-height: 450px;
  }

  .event-header-container {
    padding: 32px;
  }

  .event-title {
    font-size: 28px;
  }

  .event-meta-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24px;
  }

  .mobile-cta {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .mobile-cta-button {
    width: auto;
    padding: 14px 32px;
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
  .banner-container {
    padding: 32px 40px;
  }

  .banner-image {
    max-height: 550px;
  }

  .banner-img {
    max-height: 550px;
  }

  .event-header-container {
    padding: 40px;
  }

  .date-badge {
    width: 70px;
    height: 70px;
  }

  .date-badge-month {
    font-size: 12px;
  }

  .date-badge-day {
    font-size: 26px;
  }

  .event-title {
    font-size: 32px;
  }

  .mobile-cta {
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
