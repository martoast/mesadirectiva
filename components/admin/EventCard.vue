<template>
  <div class="event-card">
    <!-- Header Row -->
    <div class="card-header">
      <div class="header-left">
        <span :class="['status-badge', event.status]">
          <span class="status-dot"></span>
          {{ statusLabel(event.status) }}
        </span>
        <span v-if="event.category" class="category-tag" :style="{ '--cat-color': event.category.color || '#6366f1' }">
          {{ event.category.name }}
        </span>
      </div>
      <div class="date-badge">
        <span class="date-day">{{ formatDay(event.date) }}</span>
        <span class="date-month">{{ formatMonth(event.date) }}</span>
      </div>
    </div>

    <!-- Event Info -->
    <NuxtLink :to="`/app/admin/events/${event.slug}`" class="card-content">
      <h3 class="event-title">{{ event.name }}</h3>
      <div class="event-meta">
        <div class="meta-item" v-if="event.location">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ event.location }}</span>
        </div>
      </div>
    </NuxtLink>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-label">Price</span>
        <span class="stat-value">${{ formatPrice(event.price) }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-label">Tickets</span>
        <div class="tickets-display">
          <span class="stat-value">{{ event.tickets_sold }}</span>
          <span class="tickets-max">/ {{ event.max_tickets }}</span>
        </div>
      </div>
      <div class="stat-item tickets-progress-container">
        <div class="tickets-progress">
          <div class="tickets-bar" :style="{ width: ticketPercent() + '%' }"></div>
        </div>
        <span class="tickets-percent">{{ ticketPercent() }}%</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="card-actions">
      <NuxtLink :to="`/app/admin/events/${event.slug}`" class="action-btn action-primary">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>View</span>
      </NuxtLink>

      <NuxtLink v-if="canEdit()" :to="`/app/admin/events/${event.slug}/edit`" class="action-btn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>Edit</span>
      </NuxtLink>

      <button v-if="canEdit() && event.status === 'draft'" @click="$emit('publish', event.slug)" class="action-btn action-success">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
        <span>Publish</span>
      </button>

      <button v-if="canManage() && event.status === 'live'" @click="$emit('close', event.slug)" class="action-btn action-warning">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <span>Close</span>
      </button>

      <button v-if="canManage()" @click="$emit('delete', event.slug)" class="action-btn action-danger">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
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

defineEmits(['delete', 'publish', 'close'])

// Permission helpers
const canEdit = () => {
  const categoryId = props.event.category?.id || props.event.category_id
  if (!categoryId) return props.isSuperAdmin
  return props.hasPermission(categoryId, 'edit')
}

const canManage = () => {
  const categoryId = props.event.category?.id || props.event.category_id
  if (!categoryId) return props.isSuperAdmin
  return props.hasPermission(categoryId, 'manage')
}

const formatDay = (dateStr) => {
  const date = new Date(dateStr)
  return date.getDate()
}

const formatMonth = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short' })
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

const ticketPercent = () => {
  if (!props.event.max_tickets) return 0
  return Math.min(100, Math.round((props.event.tickets_sold / props.event.max_tickets) * 100))
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.event-card {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Colors */
  --color-text: #09090b;
  --color-text-secondary: #3f3f46;
  --color-text-tertiary: #71717a;
  --color-text-muted: #a1a1aa;
  --color-bg: #ffffff;
  --color-border: #e4e4e7;
  --color-border-subtle: #f4f4f5;

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
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 16px;
  transition: all 0.2s ease;
  -webkit-font-smoothing: antialiased;
}

.event-card:hover {
  border-color: var(--color-text-muted);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Header */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
}

.header-left {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-badge.draft {
  color: #b45309;
  background: var(--color-warning-bg);
}

.status-badge.draft .status-dot {
  background: var(--color-warning);
}

.status-badge.live {
  color: #16a34a;
  background: var(--color-success-bg);
}

.status-badge.live .status-dot {
  background: var(--color-success);
  animation: pulse 2s infinite;
}

.status-badge.closed {
  color: var(--color-text-tertiary);
  background: var(--color-border-subtle);
}

.status-badge.closed .status-dot {
  background: var(--color-text-muted);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}

/* Category Tag */
.category-tag {
  display: inline-flex;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  color: var(--cat-color, #6366f1);
  background: color-mix(in srgb, var(--cat-color, #6366f1) 10%, transparent);
  border-radius: 6px;
}

/* Date Badge */
.date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  background: var(--color-border-subtle);
  border-radius: 10px;
  min-width: 50px;
}

.date-day {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
}

.date-month {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Content */
.card-content {
  display: block;
  text-decoration: none;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border-subtle);
}

.event-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 8px;
  line-height: 1.3;
  transition: color 0.15s ease;
}

.card-content:hover .event-title {
  color: var(--color-accent);
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.meta-item svg {
  width: 14px;
  height: 14px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

/* Stats Row */
.stats-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  padding: 12px;
  background: var(--color-border-subtle);
  border-radius: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
}

.tickets-display {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.tickets-max {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.tickets-progress-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.tickets-progress {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  overflow: hidden;
}

.tickets-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent) 0%, #818cf8 100%);
  border-radius: 3px;
  transition: width 0.4s ease;
}

.tickets-percent {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-align: right;
}

/* Actions */
.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  font-family: var(--font-sans);
  color: var(--color-text-secondary);
  background: var(--color-border-subtle);
  border: 1px solid transparent;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.action-btn:hover {
  background: var(--color-border);
}

.action-btn.action-primary {
  background: var(--color-text);
  color: white;
  flex: 1;
  min-width: 100px;
}

.action-btn.action-primary:hover {
  background: #27272a;
}

.action-btn.action-success {
  color: #16a34a;
  background: var(--color-success-bg);
}

.action-btn.action-success:hover {
  background: rgba(34, 197, 94, 0.18);
}

.action-btn.action-warning {
  color: #b45309;
  background: var(--color-warning-bg);
}

.action-btn.action-warning:hover {
  background: rgba(245, 158, 11, 0.18);
}

.action-btn.action-danger {
  color: var(--color-danger);
  background: var(--color-danger-bg);
  padding: 10px;
}

.action-btn.action-danger:hover {
  background: rgba(239, 68, 68, 0.18);
}

.action-btn.action-danger span {
  display: none;
}
</style>
