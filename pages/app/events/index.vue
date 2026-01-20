<template>
  <div class="events-page">
    <!-- Header & Filters -->
    <header class="page-header">
      <div class="header-inner">
        <!-- Search -->
        <div class="search-wrapper">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t.searchPlaceholder"
            class="search-input"
            @input="handleSearch"
          />
          <button v-if="searchQuery" @click="clearSearch" class="search-clear" aria-label="Clear search">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Filter Pills -->
        <div class="filters-row">
          <div class="filter-pills">
            <button
              :class="['pill', { active: selectedGroup === null }]"
              @click="selectGroup(null)"
            >
              {{ t.all }}
            </button>
            <button
              v-for="group in groups"
              :key="group.id"
              :class="['pill', { active: selectedGroup === group.slug }]"
              :style="selectedGroup === group.slug ? { backgroundColor: group.color, borderColor: group.color } : {}"
              @click="selectGroup(group.slug)"
            >
              {{ group.name }}
            </button>
          </div>
          <span class="results-count">{{ meta.total || 0 }} {{ meta.total === 1 ? t.event : t.events }}</span>
        </div>
      </div>
    </header>

    <!-- Events Grid -->
    <main class="events-main">
      <div class="events-container">
        <!-- Loading Skeletons -->
        <div v-if="loading" class="events-grid">
          <div v-for="i in 6" :key="i" class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-body">
              <div class="skeleton-line lg"></div>
              <div class="skeleton-line md"></div>
              <div class="skeleton-line sm"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="state-message">
          <div class="state-icon error">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2>{{ t.somethingWrong }}</h2>
          <p>{{ error }}</p>
          <button @click="fetchEvents" class="btn-primary">{{ t.tryAgain }}</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="events.length === 0" class="state-message">
          <div class="state-icon empty">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2>{{ t.noEventsFound }}</h2>
          <p>{{ t.checkBackSoon }}</p>
        </div>

        <!-- Events Grid -->
        <div v-else class="events-grid">
          <NuxtLink
            v-for="event in events"
            :key="event.id"
            :to="`/app/events/${event.slug}`"
            class="event-card"
          >
            <!-- Image -->
            <div class="card-image">
              <img
                v-if="event.image_url"
                :src="event.image_url"
                :alt="event.name"
                loading="lazy"
              />
              <div v-else class="card-placeholder">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <!-- Group Badge -->
              <span
                v-if="event.group"
                class="card-badge"
                :style="{ backgroundColor: event.group.color }"
              >
                {{ event.group.name }}
              </span>
            </div>

            <!-- Content -->
            <div class="card-body">
              <!-- Date -->
              <div class="card-date">
                <span class="date-month">{{ formatMonth(event.starts_at) }}</span>
                <span class="date-day">{{ formatDay(event.starts_at) }}</span>
              </div>

              <!-- Info -->
              <div class="card-info">
                <h3 class="card-title">{{ event.name }}</h3>
                <p class="card-location">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="event.location_type === 'online'" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{{ getLocationDisplay(event) }}</span>
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <nav v-if="meta.last_page > 1" class="pagination" aria-label="Pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="currentPage = currentPage - 1"
            aria-label="Previous page"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="page-info">{{ currentPage }} / {{ meta.last_page }}</span>
          <button
            class="page-btn"
            :disabled="currentPage === meta.last_page"
            @click="currentPage = currentPage + 1"
            aria-label="Next page"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { formatLocation } from '~/utils/location'

definePageMeta({
  layout: 'public'
})

const { t: createT, language } = useLanguage()

const translations = {
  searchPlaceholder: { es: 'Buscar eventos...', en: 'Search events...' },
  event: { es: 'evento', en: 'event' },
  events: { es: 'eventos', en: 'events' },
  all: { es: 'Todos', en: 'All' },
  online: { es: 'En línea', en: 'Online' },
  somethingWrong: { es: 'Algo salió mal', en: 'Something went wrong' },
  tryAgain: { es: 'Intentar de nuevo', en: 'Try again' },
  noEventsFound: { es: 'No hay eventos', en: 'No events found' },
  checkBackSoon: { es: 'Vuelve pronto para ver próximos eventos', en: 'Check back soon for upcoming events' }
}

const t = createT(translations)

const { getPublicEvents } = useEvents()
const { getGroups } = useGroups()

const events = ref([])
const groups = ref([])
const loading = ref(true)
const error = ref('')
const selectedGroup = ref(null)
const searchQuery = ref('')
const searchTimeout = ref(null)
const currentPage = ref(1)
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 12,
  total: 0
})

const fetchGroups = async () => {
  try {
    const response = await getGroups()
    groups.value = response.groups || []
  } catch (e) {}
}

const fetchEvents = async () => {
  loading.value = true
  error.value = ''
  try {
    const params = { per_page: 12, page: currentPage.value }
    if (selectedGroup.value) params.group = selectedGroup.value
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()
    const response = await getPublicEvents(params)
    events.value = response.events || []
    meta.value = response.meta || meta.value
  } catch (e) {
    error.value = e.message || 'Failed to load events'
  } finally {
    loading.value = false
  }
}

const selectGroup = (slug) => {
  selectedGroup.value = slug
  currentPage.value = 1
}

const handleSearch = () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 1
    fetchEvents()
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  fetchEvents()
}

watch([selectedGroup, currentPage], fetchEvents)

onMounted(() => {
  fetchGroups()
  fetchEvents()
})

const formatMonth = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(language.value === 'es' ? 'es-MX' : 'en-US', { month: 'short' }).toUpperCase()
}

const formatDay = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).getDate()
}

const getLocationDisplay = (event) => {
  return formatLocation(event.location, event.location_type)
}
</script>

<style scoped>
.events-page {
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-border: #e5e7eb;
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;

  min-height: 100vh;
  background: var(--color-bg-secondary);
}

/* Header */
.page-header {
  position: sticky;
  top: 56px;
  z-index: 40;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Search */
.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 44px;
  font-size: 16px;
  font-family: inherit;
  color: var(--color-text);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  -webkit-appearance: none;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background 0.15s, color 0.15s;
}

.search-clear:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text);
}

.search-clear svg {
  width: 18px;
  height: 18px;
}

/* Filters */
.filters-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filter-pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-bottom: -4px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  flex: 1;
}

.filter-pills::-webkit-scrollbar {
  display: none;
}

.pill {
  flex-shrink: 0;
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  color: var(--color-text-secondary);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.pill:hover {
  border-color: var(--color-text-muted);
  color: var(--color-text);
}

.pill.active {
  background: var(--color-text);
  color: #fff;
  border-color: var(--color-text);
}

.results-count {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

/* Main */
.events-main {
  padding: 20px 16px 40px;
}

.events-container {
  max-width: 1280px;
  margin: 0 auto;
}

/* Grid */
.events-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Skeleton */
.skeleton-card {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-line.lg { width: 80%; height: 16px; }
.skeleton-line.md { width: 60%; }
.skeleton-line.sm { width: 40%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* State Messages */
.state-message {
  text-align: center;
  padding: 60px 20px;
}

.state-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.state-icon svg {
  width: 32px;
  height: 32px;
}

.state-icon.error {
  background: #fef2f2;
  color: #dc2626;
}

.state-icon.empty {
  background: var(--color-bg);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.state-message h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
}

.state-message p {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  color: #fff;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

/* Event Card - Vertical Cards */
.event-card {
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  overflow: hidden;
  text-decoration: none;
  border: 1px solid var(--color-border);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.event-card:hover {
  border-color: var(--color-text-muted);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.event-card:active {
  transform: scale(0.99);
}

/* Card Image */
.card-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  overflow: hidden;
}

.card-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.card-placeholder svg {
  width: 48px;
  height: 48px;
}

.card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  max-width: calc(100% - 24px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Card Body */
.card-body {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
}

/* Date Block */
.card-date {
  flex-shrink: 0;
  width: 48px;
  text-align: center;
  padding-top: 2px;
}

.date-month {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  letter-spacing: 0.02em;
  line-height: 1;
  margin-bottom: 2px;
}

.date-day {
  display: block;
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
}

/* Card Info */
.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.35;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.card-location svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.card-location span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

.page-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-text-muted);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn svg {
  width: 20px;
  height: 20px;
}

.page-info {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  min-width: 60px;
  text-align: center;
}

/* Tablet - 2 columns */
@media (min-width: 640px) {
  .page-header {
    top: 64px;
  }

  .header-inner {
    padding: 20px 24px;
  }

  .events-main {
    padding: 24px;
  }

  .events-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

/* Desktop - 3 columns */
@media (min-width: 1024px) {
  .header-inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px 32px;
  }

  .search-wrapper {
    max-width: 320px;
  }

  .filters-row {
    flex: 1;
    justify-content: flex-end;
  }

  .filter-pills {
    flex: none;
  }

  .events-main {
    padding: 32px;
  }

  .events-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .event-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }
}

/* Large Desktop - 4 columns */
@media (min-width: 1280px) {
  .events-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
