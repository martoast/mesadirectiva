<template>
  <div class="event-table">
    <table>
      <thead>
        <tr>
          <th class="col-name">Event</th>
          <th class="col-group">Group</th>
          <th class="col-date">Date</th>
          <th class="col-price">Price</th>
          <th class="col-status">Status</th>
          <th class="col-tickets">Tickets</th>
          <th class="col-actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(event, index) in events" :key="event.id" :style="{ '--row-index': index }">
          <td class="col-name">
            <NuxtLink :to="`/app/admin/events/${event.slug}`" class="event-name-link">
              <span class="event-name">{{ event.name }}</span>
              <span class="event-location" v-if="event.location">{{ event.location }}</span>
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
              <span class="date-day">{{ formatDay(event.date) }}</span>
              <span class="date-full">{{ formatDate(event.date) }}</span>
            </div>
          </td>
          <td class="col-price">
            <span class="price-text">${{ formatPrice(event.price) }}</span>
          </td>
          <td class="col-status">
            <span :class="['status-badge', event.status]">
              <span class="status-indicator"></span>
              {{ statusLabel(event.status) }}
            </span>
          </td>
          <td class="col-tickets">
            <div class="tickets-cell">
              <div class="tickets-numbers">
                <span class="tickets-sold">{{ event.tickets_sold }}</span>
                <span class="tickets-separator">/</span>
                <span class="tickets-total">{{ event.max_tickets }}</span>
              </div>
              <div class="tickets-progress">
                <div class="tickets-bar" :style="{ width: ticketPercent(event) + '%' }"></div>
              </div>
              <span class="tickets-percent">{{ ticketPercent(event) }}%</span>
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
  const date = new Date(dateStr)
  return date.getDate()
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  })
}

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2)
}

const statusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    live: 'Live',
    closed: 'Closed'
  }
  return labels[status] || status
}

const ticketPercent = (event) => {
  if (!event.max_tickets) return 0
  return Math.min(100, Math.round((event.tickets_sold / event.max_tickets) * 100))
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.event-table {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Colors */
  --color-text: #09090b;
  --color-text-secondary: #3f3f46;
  --color-text-tertiary: #71717a;
  --color-text-muted: #a1a1aa;
  --color-border: #e4e4e7;
  --color-border-subtle: #f4f4f5;
  --color-hover: rgba(0, 0, 0, 0.02);
  --color-hover-strong: rgba(0, 0, 0, 0.04);

  /* Accent */
  --color-accent: #6366f1;
  --color-accent-subtle: rgba(99, 102, 241, 0.08);

  /* Status */
  --color-success: #22c55e;
  --color-success-bg: rgba(34, 197, 94, 0.1);
  --color-warning: #f59e0b;
  --color-warning-bg: rgba(245, 158, 11, 0.1);
  --color-danger: #ef4444;
  --color-danger-bg: rgba(239, 68, 68, 0.1);

  font-family: var(--font-sans);
  overflow-x: auto;
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

th:first-child {
  padding-left: 20px;
}

th:last-child {
  padding-right: 20px;
}

/* Body rows */
tbody tr {
  transition: background 0.15s ease;
  animation: fadeIn 0.3s ease forwards;
  animation-delay: calc(var(--row-index, 0) * 0.03s);
  opacity: 0;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

tbody tr:hover {
  background: var(--color-hover-strong);
}

tbody tr:not(:last-child) {
  border-bottom: 1px solid var(--color-border-subtle);
}

td {
  padding: 16px;
  font-size: 13px;
  color: var(--color-text-secondary);
  vertical-align: middle;
}

td:first-child {
  padding-left: 20px;
}

td:last-child {
  padding-right: 20px;
}

/* Event Name Column */
.event-name-link {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-decoration: none;
  transition: all 0.15s ease;
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

.event-location {
  font-size: 12px;
  color: var(--color-text-muted);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

/* Price */
.price-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
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

.status-badge.draft {
  color: #b45309;
  background: var(--color-warning-bg);
}

.status-badge.draft .status-indicator {
  background: var(--color-warning);
}

.status-badge.live {
  color: #16a34a;
  background: var(--color-success-bg);
}

.status-badge.live .status-indicator {
  background: var(--color-success);
  animation: pulse 2s infinite;
}

.status-badge.closed {
  color: var(--color-text-tertiary);
  background: var(--color-border-subtle);
}

.status-badge.closed .status-indicator {
  background: var(--color-text-muted);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* Tickets */
.tickets-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 100px;
}

.tickets-numbers {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.tickets-sold {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.tickets-separator {
  color: var(--color-text-muted);
  font-size: 12px;
}

.tickets-total {
  font-size: 12px;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

.tickets-progress {
  width: 100%;
  height: 4px;
  background: var(--color-border-subtle);
  border-radius: 2px;
  overflow: hidden;
}

.tickets-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent) 0%, #818cf8 100%);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.tickets-percent {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
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
.col-name { min-width: 220px; }
.col-group { min-width: 130px; }
.col-date { min-width: 80px; }
.col-price { min-width: 80px; }
.col-status { min-width: 100px; }
.col-tickets { min-width: 120px; }
.col-actions { min-width: 150px; }
</style>
