<template>
  <div class="event-table">
    <table>
      <thead>
        <tr>
          <th class="col-name">Event</th>
          <th class="col-group">Group</th>
          <th class="col-date">Date</th>
          <th class="col-location">Location</th>
          <th class="col-status">Status</th>
          <th class="col-sales">Sales</th>
          <th class="col-actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(event, index) in events" :key="event.id" :style="{ '--row-index': index }">
          <td class="col-name">
            <NuxtLink :to="`/app/admin/events/${event.slug}`" class="event-name-link">
              <span class="event-name">{{ event.name }}</span>
              <span class="event-type">
                {{ event.seating_type === 'seated' ? 'Seated' : 'General Admission' }}
              </span>
            </NuxtLink>
          </td>
          <td class="col-group">
            <span v-if="event.group" class="group-badge" :style="{ '--group-color': event.group.color || '#6366f1' }">
              <span class="group-dot"></span>
              {{ event.group.name }}
            </span>
            <span v-else class="no-group">No group</span>
          </td>
          <td class="col-date">
            <div class="date-cell">
              <span class="date-day">{{ formatDay(event.starts_at) }}</span>
              <span class="date-full">{{ formatMonthYear(event.starts_at) }}</span>
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
              <span class="status-indicator"></span>
              {{ statusLabel(event.status) }}
            </span>
          </td>
          <td class="col-sales">
            <div class="sales-cell">
              <span class="sales-count">{{ event.tickets_sold || 0 }}</span>
              <span class="sales-revenue">${{ (event.total_revenue || 0).toLocaleString() }}</span>
            </div>
          </td>
          <td class="col-actions">
            <div class="actions-group">
              <NuxtLink :to="`/app/admin/events/${event.slug}`" class="action-btn" title="View event">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </NuxtLink>
              <NuxtLink v-if="canEdit(event)" :to="`/app/admin/events/${event.slug}/edit`" class="action-btn" title="Edit event">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </NuxtLink>
              <button v-if="canEdit(event) && event.status === 'draft'" @click="$emit('publish', event.slug)" class="action-btn action-publish" title="Publish event">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
              <button v-if="canManage(event) && event.status === 'live'" @click="$emit('close', event.slug)" class="action-btn action-close" title="Close event">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </button>
              <button v-if="canManage(event)" @click="$emit('delete', event.slug)" class="action-btn action-delete" title="Delete event">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { getPlatformLabel } from '~/utils/location'

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

defineEmits(['delete', 'publish', 'close'])

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
    return getPlatformLabel(event.location?.platform) || 'Online'
  }
  if (event.location?.city) {
    return event.location.state ? `${event.location.city}, ${event.location.state}` : event.location.city
  }
  return event.location?.name || 'Venue'
}

const statusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    live: 'Live',
    closed: 'Closed'
  }
  return labels[status] || status
}
</script>

<style scoped>
.event-table {
  --color-text: #09090b;
  --color-text-secondary: #3f3f46;
  --color-text-tertiary: #71717a;
  --color-text-muted: #a1a1aa;
  --color-border: #e4e4e7;
  --color-border-subtle: #f4f4f5;
  --color-hover: rgba(0, 0, 0, 0.02);
  --color-hover-strong: rgba(0, 0, 0, 0.04);
  --color-accent: #6366f1;
  --color-success: #22c55e;
  --color-success-bg: rgba(34, 197, 94, 0.1);
  --color-warning: #f59e0b;
  --color-warning-bg: rgba(245, 158, 11, 0.1);
  --color-danger: #ef4444;
  --color-danger-bg: rgba(239, 68, 68, 0.1);

  overflow-x: auto;
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
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  border-bottom: 1px solid var(--color-border);
}

th:first-child { padding-left: 20px; }
th:last-child { padding-right: 20px; }

/* Body rows */
tbody tr {
  transition: background 0.15s ease;
  animation: fadeIn 0.3s ease forwards;
  animation-delay: calc(var(--row-index, 0) * 0.03s);
  opacity: 0;
}

@keyframes fadeIn { to { opacity: 1; } }

tbody tr:hover { background: var(--color-hover-strong); }
tbody tr:not(:last-child) { border-bottom: 1px solid var(--color-border-subtle); }

td {
  padding: 16px;
  font-size: 13px;
  color: var(--color-text-secondary);
  vertical-align: middle;
}

td:first-child { padding-left: 20px; }
td:last-child { padding-right: 20px; }

/* Event Name Column */
.event-name-link {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-decoration: none;
}

.event-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  transition: color 0.15s ease;
}

.event-name-link:hover .event-name {
  color: var(--color-accent);
}

.event-type {
  font-size: 11px;
  color: var(--color-text-muted);
}

/* Group */
.group-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 500;
  color: var(--group-color, #6366f1);
  background: color-mix(in srgb, var(--group-color, #6366f1) 10%, transparent);
  border-radius: 6px;
}

.group-dot {
  width: 6px;
  height: 6px;
  background: var(--group-color, #6366f1);
  border-radius: 50%;
}

.no-group {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* Date */
.date-cell {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.date-day {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.1;
}

.date-full {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.date-time {
  font-size: 11px;
  color: var(--color-text-tertiary);
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
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.location-icon.online {
  color: var(--color-accent);
}

.location-text {
  font-size: 13px;
  color: var(--color-text-secondary);
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
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  white-space: nowrap;
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-badge.draft { color: #b45309; background: var(--color-warning-bg); }
.status-badge.draft .status-indicator { background: var(--color-warning); }

.status-badge.live { color: #16a34a; background: var(--color-success-bg); }
.status-badge.live .status-indicator { background: var(--color-success); animation: pulse 2s infinite; }

.status-badge.closed { color: var(--color-text-tertiary); background: var(--color-border-subtle); }
.status-badge.closed .status-indicator { background: var(--color-text-muted); }

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

/* Sales */
.sales-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sales-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.sales-revenue {
  font-size: 11px;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

/* Actions */
.actions-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  text-decoration: none;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn:hover {
  background: var(--color-border-subtle);
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

.action-btn.action-publish:hover {
  background: var(--color-success-bg);
  border-color: rgba(34, 197, 94, 0.2);
  color: var(--color-success);
}

.action-btn.action-close:hover {
  background: var(--color-warning-bg);
  border-color: rgba(245, 158, 11, 0.2);
  color: var(--color-warning);
}

.action-btn.action-delete:hover {
  background: var(--color-danger-bg);
  border-color: rgba(239, 68, 68, 0.2);
  color: var(--color-danger);
}

/* Column widths */
.col-name { min-width: 200px; }
.col-group { min-width: 120px; }
.col-date { min-width: 90px; }
.col-location { min-width: 140px; }
.col-status { min-width: 90px; }
.col-sales { min-width: 80px; }
.col-actions { min-width: 140px; }
</style>
