<template>
  <div class="event-card">
    <NuxtLink :to="`/app/admin/events/${event.slug}`" class="card-main">
      <!-- Date Badge -->
      <div class="date-badge">
        <span class="date-day">{{ formatDay(event.starts_at) }}</span>
        <span class="date-month">{{ formatMonth(event.starts_at) }}</span>
      </div>

      <!-- Event Info -->
      <div class="event-info">
        <div class="event-header">
          <h3 class="event-name">{{ event.name }}</h3>
          <div class="event-badges">
            <span :class="['status-badge', event.status]">
              <span class="status-dot"></span>
              {{ statusLabel(event.status) }}
            </span>
            <span v-if="event.group" class="group-badge" :style="{ '--group-color': event.group.color || '#264653' }">
              {{ event.group.name }}
            </span>
          </div>
        </div>

        <div class="event-meta">
          <div class="meta-item">
            <svg v-if="event.location_type === 'online'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{{ formatLocationShort() }}</span>
          </div>
          <span class="meta-separator"></span>
          <div class="meta-item">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ formatTime(event.starts_at) }}</span>
          </div>
        </div>

        <div class="event-stats">
          <div class="stat">
            <span class="stat-value">{{ event.tickets_sold || 0 }}</span>
            <span class="stat-label">{{ event.seating_type === 'seated' ? t.seats : t.tickets }}</span>
          </div>
          <div class="stat">
            <span class="stat-value">${{ (event.total_revenue || 0).toLocaleString() }}</span>
            <span class="stat-label">{{ t.revenue }}</span>
          </div>
        </div>
      </div>
    </NuxtLink>

    <!-- Actions Dropdown -->
    <div class="actions-container">
      <button
        class="actions-trigger"
        @click.stop="toggleDropdown"
        :aria-expanded="dropdownOpen"
        aria-haspopup="true"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      <Transition name="dropdown">
        <div v-if="dropdownOpen" class="dropdown-menu" v-click-outside="closeDropdown">
          <NuxtLink :to="`/app/admin/events/${event.slug}`" class="dropdown-item" @click="closeDropdown">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{{ t.view }}</span>
          </NuxtLink>

          <NuxtLink v-if="canEdit()" :to="`/app/admin/events/${event.slug}/edit`" class="dropdown-item" @click="closeDropdown">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>{{ t.edit }}</span>
          </NuxtLink>

          <div v-if="canEdit() && event.status === 'draft'" class="dropdown-divider"></div>

          <button v-if="canEdit() && event.status === 'draft'" @click="handlePublish" class="dropdown-item item-success">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <span>{{ t.publish }}</span>
          </button>

          <button v-if="canManage() && event.status === 'live'" @click="handleClose" class="dropdown-item item-warning">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span>{{ t.close }}</span>
          </button>

          <div v-if="canManage()" class="dropdown-divider"></div>

          <button v-if="canManage()" @click="handleDelete" class="dropdown-item item-danger">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>{{ t.delete }}</span>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getPlatformLabel } from '~/utils/location'

const { t: createT } = useLanguage()

const translations = {
  seats: { es: 'asientos', en: 'seats' },
  tickets: { es: 'boletos', en: 'tickets' },
  revenue: { es: 'ingresos', en: 'revenue' },
  view: { es: 'Ver detalles', en: 'View details' },
  edit: { es: 'Editar', en: 'Edit' },
  publish: { es: 'Publicar', en: 'Publish' },
  close: { es: 'Cerrar evento', en: 'Close event' },
  delete: { es: 'Eliminar', en: 'Delete' },
  draft: { es: 'Borrador', en: 'Draft' },
  live: { es: 'En vivo', en: 'Live' },
  closed: { es: 'Cerrado', en: 'Closed' },
  online: { es: 'En línea', en: 'Online' },
  venue: { es: 'Lugar', en: 'Venue' }
}

const t = createT(translations)

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  hasPermission: {
    type: Function,
    required: true
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete', 'publish', 'close'])

const dropdownOpen = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handlePublish = () => {
  emit('publish', props.event.slug)
  closeDropdown()
}

const handleClose = () => {
  emit('close', props.event.slug)
  closeDropdown()
}

const handleDelete = () => {
  emit('delete', props.event.slug)
  closeDropdown()
}

// Permission helpers
const canEdit = () => {
  const groupId = props.event.group?.id || props.event.group_id
  if (!groupId) return props.isSuperAdmin
  return props.hasPermission(groupId, 'edit')
}

const canManage = () => {
  const groupId = props.event.group?.id || props.event.group_id
  if (!groupId) return props.isSuperAdmin
  return props.hasPermission(groupId, 'manage')
}

const formatDay = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.getDate()
}

const formatMonth = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

const formatTime = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const formatLocationShort = () => {
  const e = props.event
  if (e.location_type === 'online') {
    return getPlatformLabel(e.location?.platform) || t.online
  }
  if (e.location?.city) {
    return e.location.state ? `${e.location.city}, ${e.location.state}` : e.location.city
  }
  return e.location?.name || t.venue
}

const statusLabel = (status) => {
  const labels = {
    draft: t.draft,
    live: t.live,
    closed: t.closed
  }
  return labels[status] || status
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

.event-card {
  --color-ink: #1a1a1a;
  --color-ink-light: #4a4a4a;
  --color-ink-lighter: #7a7a7a;
  --color-ink-muted: #a8a8a8;
  --color-surface: #ffffff;
  --color-border: #e8e6e3;
  --color-border-subtle: #f2f1ef;
  --color-hover: rgba(26, 26, 26, 0.03);
  --color-success: #2d5a27;
  --color-success-subtle: rgba(45, 90, 39, 0.08);
  --color-warning: #b45309;
  --color-warning-subtle: rgba(180, 83, 9, 0.08);
  --color-danger: #c73e1d;
  --color-danger-subtle: rgba(199, 62, 29, 0.08);

  --font-display: 'Zen Maru Gothic', 'Noto Sans JP', system-ui, sans-serif;
  --font-body: 'Noto Sans JP', system-ui, sans-serif;

  display: flex;
  align-items: stretch;
  background: var(--color-surface);
  position: relative;
}

/* Main Card Link */
.card-main {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
  padding: 20px;
  text-decoration: none;
  transition: background 0.15s ease;
}

.card-main:hover {
  background: var(--color-hover);
}

/* Date Badge */
.date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  padding: 10px 8px;
  background: var(--color-border-subtle);
  border-radius: 10px;
  flex-shrink: 0;
}

.date-day {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1;
}

.date-month {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-ink-muted);
  letter-spacing: 0.05em;
  margin-top: 2px;
}

/* Event Info */
.event-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-ink);
  line-height: 1.3;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 600;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.status-badge.draft {
  color: var(--color-warning);
  background: var(--color-warning-subtle);
}

.status-badge.draft .status-dot {
  background: var(--color-warning);
}

.status-badge.live {
  color: var(--color-success);
  background: var(--color-success-subtle);
}

.status-badge.live .status-dot {
  background: var(--color-success);
  animation: pulse 2s infinite;
}

.status-badge.closed {
  color: var(--color-ink-lighter);
  background: var(--color-border-subtle);
}

.status-badge.closed .status-dot {
  background: var(--color-ink-muted);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Group Badge */
.group-badge {
  display: inline-flex;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 500;
  color: var(--group-color, #264653);
  background: color-mix(in srgb, var(--group-color, #264653) 10%, transparent);
  border-radius: 5px;
}

/* Event Meta */
.event-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--color-ink-lighter);
}

.meta-item svg {
  width: 13px;
  height: 13px;
  color: var(--color-ink-muted);
  flex-shrink: 0;
}

.meta-separator {
  width: 3px;
  height: 3px;
  background: var(--color-ink-muted);
  border-radius: 50%;
}

/* Event Stats */
.event-stats {
  display: flex;
  gap: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-subtle);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-ink);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Actions Container */
.actions-container {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 20px 16px 20px 0;
}

.actions-trigger {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--color-ink-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.actions-trigger svg {
  width: 20px;
  height: 20px;
}

.actions-trigger:hover {
  background: var(--color-border-subtle);
  border-color: var(--color-border);
  color: var(--color-ink-light);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 16px;
  min-width: 180px;
  padding: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(26, 26, 26, 0.12);
  z-index: 50;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-ink-light);
  background: transparent;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.1s ease;
  text-align: left;
}

.dropdown-item svg {
  width: 16px;
  height: 16px;
  color: var(--color-ink-muted);
  flex-shrink: 0;
  transition: color 0.1s ease;
}

.dropdown-item:hover {
  background: var(--color-hover);
  color: var(--color-ink);
}

.dropdown-item:hover svg {
  color: var(--color-ink-light);
}

.dropdown-item.item-success:hover {
  background: var(--color-success-subtle);
  color: var(--color-success);
}

.dropdown-item.item-success:hover svg {
  color: var(--color-success);
}

.dropdown-item.item-warning:hover {
  background: var(--color-warning-subtle);
  color: var(--color-warning);
}

.dropdown-item.item-warning:hover svg {
  color: var(--color-warning);
}

.dropdown-item.item-danger:hover {
  background: var(--color-danger-subtle);
  color: var(--color-danger);
}

.dropdown-item.item-danger:hover svg {
  color: var(--color-danger);
}

.dropdown-divider {
  height: 1px;
  margin: 6px 0;
  background: var(--color-border-subtle);
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
