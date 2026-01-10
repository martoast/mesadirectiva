<template>
  <div class="event-table">
    <table>
      <thead>
        <tr>
          <th class="col-event">{{ t.event }}</th>
          <th class="col-group">{{ t.group }}</th>
          <th class="col-date">{{ t.date }}</th>
          <th class="col-location">{{ t.location }}</th>
          <th class="col-status">{{ t.status }}</th>
          <th class="col-sales">{{ t.sales }}</th>
          <th class="col-actions"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(event, index) in events" :key="event.id" :class="{ 'dropdown-open': openDropdown === event.id }">
          <td class="col-event">
            <NuxtLink :to="`/app/admin/events/${event.slug}`" class="event-link">
              <span class="event-name">{{ event.name }}</span>
              <span class="event-type">
                {{ event.seating_type === 'seated' ? t.seated : t.generalAdmission }}
              </span>
            </NuxtLink>
          </td>
          <td class="col-group">
            <span v-if="event.group" class="group-badge" :style="{ '--group-color': event.group.color || '#264653' }">
              <span class="group-dot"></span>
              {{ event.group.name }}
            </span>
            <span v-else class="no-group">{{ t.noGroup }}</span>
          </td>
          <td class="col-date">
            <div class="date-cell">
              <span class="date-primary">{{ formatDay(event.starts_at) }}</span>
              <span class="date-secondary">{{ formatMonthYear(event.starts_at) }}</span>
              <span class="date-time">{{ formatTime(event.starts_at) }}</span>
            </div>
          </td>
          <td class="col-location">
            <div class="location-cell">
              <svg v-if="event.location_type === 'online'" class="location-icon online" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <svg v-else class="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="location-text">{{ formatLocationShort(event) }}</span>
            </div>
          </td>
          <td class="col-status">
            <span :class="['status-badge', event.status]">
              <span class="status-dot"></span>
              {{ statusLabel(event.status) }}
            </span>
          </td>
          <td class="col-sales">
            <div class="sales-cell">
              <span class="sales-primary">{{ event.tickets_sold || 0 }}</span>
              <span class="sales-secondary">${{ (event.total_revenue || 0).toLocaleString() }}</span>
            </div>
          </td>
          <td class="col-actions">
            <div class="actions-container" :ref="el => setActionRef(event.id, el)">
              <button
                class="actions-trigger"
                @click.stop="toggleDropdown(event.id)"
                :aria-expanded="openDropdown === event.id"
                aria-haspopup="true"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

              <Transition name="dropdown">
                <div v-if="openDropdown === event.id" class="dropdown-menu">
                  <NuxtLink :to="`/app/admin/events/${event.slug}`" class="dropdown-item" @click="closeDropdown">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{{ t.viewEvent }}</span>
                  </NuxtLink>

                  <NuxtLink v-if="canEdit(event)" :to="`/app/admin/events/${event.slug}/edit`" class="dropdown-item" @click="closeDropdown">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>{{ t.editEvent }}</span>
                  </NuxtLink>

                  <div v-if="canEdit(event) && event.status === 'draft'" class="dropdown-divider"></div>

                  <button v-if="canEdit(event) && event.status === 'draft'" @click="handlePublish(event.slug)" class="dropdown-item item-success">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    <span>{{ t.publishEvent }}</span>
                  </button>

                  <button v-if="canManage(event) && event.status === 'live'" @click="handleClose(event.slug)" class="dropdown-item item-warning">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <span>{{ t.closeEvent }}</span>
                  </button>

                  <div v-if="canManage(event)" class="dropdown-divider"></div>

                  <button v-if="canManage(event)" @click="handleDelete(event.slug)" class="dropdown-item item-danger">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>{{ t.deleteEvent }}</span>
                  </button>
                </div>
              </Transition>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getPlatformLabel } from '~/utils/location'

const { t: createT } = useLanguage()

const translations = {
  event: { es: 'Evento', en: 'Event' },
  group: { es: 'Grupo', en: 'Group' },
  date: { es: 'Fecha', en: 'Date' },
  location: { es: 'Ubicación', en: 'Location' },
  status: { es: 'Estado', en: 'Status' },
  sales: { es: 'Ventas', en: 'Sales' },
  seated: { es: 'Con asientos', en: 'Seated' },
  generalAdmission: { es: 'Admisión General', en: 'General Admission' },
  noGroup: { es: 'Sin grupo', en: 'No group' },
  draft: { es: 'Borrador', en: 'Draft' },
  live: { es: 'En vivo', en: 'Live' },
  closed: { es: 'Cerrado', en: 'Closed' },
  viewEvent: { es: 'Ver detalles', en: 'View details' },
  editEvent: { es: 'Editar', en: 'Edit' },
  publishEvent: { es: 'Publicar', en: 'Publish' },
  closeEvent: { es: 'Cerrar evento', en: 'Close event' },
  deleteEvent: { es: 'Eliminar', en: 'Delete' },
  online: { es: 'En línea', en: 'Online' },
  venue: { es: 'Lugar', en: 'Venue' }
}

const t = createT(translations)

const props = defineProps({
  events: {
    type: Array,
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

const openDropdown = ref(null)
const actionRefs = ref({})

const setActionRef = (id, el) => {
  if (el) {
    actionRefs.value[id] = el
  }
}

const toggleDropdown = (eventId) => {
  openDropdown.value = openDropdown.value === eventId ? null : eventId
}

const closeDropdown = () => {
  openDropdown.value = null
}

const handlePublish = (slug) => {
  emit('publish', slug)
  closeDropdown()
}

const handleClose = (slug) => {
  emit('close', slug)
  closeDropdown()
}

const handleDelete = (slug) => {
  emit('delete', slug)
  closeDropdown()
}

// Click outside handler
const handleClickOutside = (event) => {
  if (openDropdown.value !== null) {
    const container = actionRefs.value[openDropdown.value]
    if (container && !container.contains(event.target)) {
      closeDropdown()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Permission helpers
const canEdit = (event) => {
  const groupId = event.group?.id || event.group_id
  if (!groupId) return props.isSuperAdmin
  return props.hasPermission(groupId, 'edit')
}

const canManage = (event) => {
  const groupId = event.group?.id || event.group_id
  if (!groupId) return props.isSuperAdmin
  return props.hasPermission(groupId, 'manage')
}

const formatDay = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.getDate()
}

const formatMonthYear = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const formatLocationShort = (event) => {
  if (event.location_type === 'online') {
    return getPlatformLabel(event.location?.platform) || t.online
  }
  if (event.location?.city) {
    return event.location.state ? `${event.location.city}, ${event.location.state}` : event.location.city
  }
  return event.location?.name || t.venue
}

const statusLabel = (status) => {
  const labels = {
    draft: t.draft,
    live: t.live,
    closed: t.closed
  }
  return labels[status] || status
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;600;700&display=swap');

.event-table {
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
  --color-indigo: #264653;

  --font-display: 'Zen Maru Gothic', 'Noto Sans JP', system-ui, sans-serif;
  --font-body: 'Noto Sans JP', system-ui, sans-serif;

  overflow-x: auto;
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

table {
  width: 100%;
  border-collapse: collapse;
}

/* Header */
thead tr {
  background: var(--color-border-subtle);
}

th {
  padding: 14px 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-ink-muted);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  border-bottom: 1px solid var(--color-border);
}

th:first-child { padding-left: 24px; }
th:last-child { padding-right: 24px; }

/* Body rows */
tbody tr {
  transition: background 0.15s ease;
  position: relative;
}

tbody tr.dropdown-open {
  z-index: 50;
}

tbody tr:hover { background: var(--color-hover); }
tbody tr:not(:last-child) { border-bottom: 1px solid var(--color-border-subtle); }

td {
  padding: 18px 16px;
  font-size: 13px;
  color: var(--color-ink-light);
  vertical-align: middle;
}

td:first-child { padding-left: 24px; }
td:last-child { padding-right: 24px; }

/* Event Name Column */
.event-link {
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-decoration: none;
}

.event-name {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-ink);
  transition: color 0.15s ease;
  line-height: 1.3;
}

.event-link:hover .event-name {
  color: var(--color-indigo);
}

.event-type {
  font-size: 11px;
  color: var(--color-ink-muted);
}

/* Group */
.group-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--group-color, #264653);
  background: color-mix(in srgb, var(--group-color, #264653) 10%, transparent);
  border-radius: 6px;
}

.group-dot {
  width: 6px;
  height: 6px;
  background: var(--group-color, #264653);
  border-radius: 50%;
}

.no-group {
  font-size: 12px;
  color: var(--color-ink-muted);
}

/* Date */
.date-cell {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.date-primary {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1.1;
}

.date-secondary {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.date-time {
  font-size: 11px;
  color: var(--color-ink-lighter);
}

/* Location */
.location-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.location-icon {
  width: 14px;
  height: 14px;
  color: var(--color-ink-muted);
  flex-shrink: 0;
}

.location-icon.online {
  color: var(--color-indigo);
}

.location-text {
  font-size: 13px;
  color: var(--color-ink-light);
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Status */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-badge.draft { color: var(--color-warning); background: var(--color-warning-subtle); }
.status-badge.draft .status-dot { background: var(--color-warning); }

.status-badge.live { color: var(--color-success); background: var(--color-success-subtle); }
.status-badge.live .status-dot { background: var(--color-success); animation: pulse 2s infinite; }

.status-badge.closed { color: var(--color-ink-lighter); background: var(--color-border-subtle); }
.status-badge.closed .status-dot { background: var(--color-ink-muted); }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Sales */
.sales-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sales-primary {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-ink);
  font-variant-numeric: tabular-nums;
}

.sales-secondary {
  font-size: 11px;
  color: var(--color-ink-muted);
  font-variant-numeric: tabular-nums;
}

/* Actions */
.actions-container {
  position: relative;
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
  width: 18px;
  height: 18px;
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
  right: 0;
  min-width: 180px;
  padding: 6px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(26, 26, 26, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  z-index: 100;
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

/* Column widths */
.col-event { min-width: 200px; }
.col-group { min-width: 120px; }
.col-date { min-width: 100px; }
.col-location { min-width: 140px; }
.col-status { min-width: 100px; }
.col-sales { min-width: 80px; }
.col-actions {
  width: 60px;
  position: relative;
  z-index: 10;
}
</style>
