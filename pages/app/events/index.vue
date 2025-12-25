<template>
  <div class="events-page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1>Discover Events</h1>
        <p>Find your next unforgettable experience</p>
      </div>
    </section>

    <!-- Filters -->
    <section class="filters">
      <div class="filters-inner">
        <span class="results-count">{{ meta.total || 0 }} events</span>
        <div class="filter-pills">
          <button
            :class="['pill', selectedGroup === null && 'active']"
            @click="selectGroup(null)"
          >
            All
          </button>
          <button
            v-for="group in groups"
            :key="group.id"
            :class="['pill', selectedGroup === group.slug && 'active']"
            @click="selectGroup(group.slug)"
          >
            {{ group.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- Events Grid -->
    <section class="events-section">
      <div class="events-container">
        <!-- Loading -->
        <div v-if="loading" class="events-grid">
          <div v-for="i in 6" :key="i" class="event-skeleton">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-line title"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line short"></div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="empty-state">
          <h2>Something went wrong</h2>
          <p>{{ error }}</p>
          <button @click="fetchEvents" class="retry-btn">Try Again</button>
        </div>

        <!-- Empty -->
        <div v-else-if="events.length === 0" class="empty-state">
          <h2>No events found</h2>
          <p>Check back soon for upcoming events</p>
        </div>

        <!-- Grid -->
        <div v-else class="events-grid">
          <NuxtLink
            v-for="event in events"
            :key="event.id"
            :to="`/app/events/${event.slug}`"
            class="event-card"
          >
            <div class="card-image" :style="getImageStyle(event)">
              <span v-if="event.group" class="card-badge" :style="{ backgroundColor: event.group.color }">
                {{ event.group.name }}
              </span>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ event.name }}</h3>
              <div class="card-meta">
                <div class="meta-row">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDate(event.date) }}</span>
                </div>
                <div class="meta-row">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ event.location }}</span>
                </div>
              </div>
              <div class="card-footer">
                <div class="card-price">
                  <span class="price-label">From</span>
                  <span class="price-value">${{ event.price }}</span>
                </div>
                <div class="card-availability">
                  <div class="availability-bar">
                    <div class="availability-fill" :style="{ width: `${getSoldPercent(event)}%` }"></div>
                  </div>
                  <span class="availability-text">{{ event.tickets_available }} left</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <div v-if="meta.last_page > 1" class="pagination">
          <button
            v-for="page in meta.last_page"
            :key="page"
            :class="['page-btn', currentPage === page && 'active']"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

definePageMeta({
  layout: 'public'
})

const { getPublicEvents } = useEvents()
const { getGroups } = useGroups()

const events = ref([])
const groups = ref([])
const loading = ref(true)
const error = ref('')
const selectedGroup = ref(null)
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

watch([selectedGroup, currentPage], fetchEvents)

onMounted(() => {
  fetchGroups()
  fetchEvents()
})

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const getImageStyle = (event) => {
  if (event.hero_image_url) {
    return { backgroundImage: `url('${event.hero_image_url}')` }
  }
  return {}
}

const getSoldPercent = (event) => {
  if (!event.max_tickets) return 0
  return Math.round((event.tickets_sold / event.max_tickets) * 100)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

.events-page {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --color-text: #1a1a1a;
  --color-text-light: #666;
  --color-text-muted: #999;
  --color-bg: #fff;
  --color-bg-alt: #f8f8f8;
  --color-border: #eee;
  --color-primary: #2563eb;
  --radius: 12px;

  font-family: var(--font-body);
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
  padding: 48px 20px;
  text-align: center;
}

.hero-content h1 {
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.hero-content p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
}

/* Filters */
.filters {
  position: sticky;
  top: 60px;
  z-index: 30;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: 16px 20px;
}

.filters-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.results-count {
  font-size: 13px;
  color: var(--color-text-muted);
}

.filter-pills {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
}

.filter-pills::-webkit-scrollbar {
  display: none;
}

.pill {
  flex-shrink: 0;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-light);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
}

.pill:hover {
  border-color: var(--color-text-muted);
}

.pill.active {
  background: var(--color-text);
  color: #fff;
  border-color: var(--color-text);
}

/* Events Section */
.events-section {
  background: var(--color-bg-alt);
  padding: 32px 20px 64px;
  min-height: 60vh;
}

.events-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Grid */
.events-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* Skeleton */
.event-skeleton {
  background: var(--color-bg);
  border-radius: var(--radius);
  overflow: hidden;
}

.skeleton-image {
  height: 180px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  padding: 20px;
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-line.title {
  height: 20px;
  width: 70%;
}

.skeleton-line.short {
  width: 40%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Event Card */
.event-card {
  display: block;
  background: var(--color-bg);
  border-radius: var(--radius);
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.card-image {
  height: 180px;
  background: linear-gradient(135deg, var(--color-primary), #1e40af);
  background-size: cover;
  background-position: center;
  position: relative;
}

.card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.card-content {
  padding: 20px;
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 12px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-light);
}

.meta-row svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.card-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.card-price {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.price-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary);
}

.card-availability {
  text-align: right;
}

.availability-bar {
  width: 60px;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  margin-bottom: 4px;
  margin-left: auto;
}

.availability-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
}

.availability-text {
  font-size: 11px;
  color: var(--color-text-muted);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state h2 {
  font-family: var(--font-heading);
  font-size: 24px;
  color: var(--color-text);
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--color-text-light);
  margin-bottom: 24px;
}

.retry-btn {
  padding: 12px 24px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
}

.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover {
  border-color: var(--color-text-muted);
}

.page-btn.active {
  background: var(--color-text);
  color: #fff;
  border-color: var(--color-text);
}

/* Tablet */
@media (min-width: 640px) {
  .hero {
    padding: 64px 40px;
  }

  .hero-content h1 {
    font-size: 42px;
  }

  .filters {
    top: 68px;
    padding: 20px 40px;
  }

  .filters-inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .events-section {
    padding: 40px;
  }

  .events-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .card-image {
    height: 200px;
  }
}
</style>
