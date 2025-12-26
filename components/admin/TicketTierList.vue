<template>
  <div class="tier-list">
    <!-- Empty State -->
    <div v-if="tiers.length === 0" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
      <p class="empty-title">No ticket tiers yet</p>
      <p class="empty-subtitle">Add your first tier to start selling tickets</p>
    </div>

    <!-- Tier List -->
    <div
      v-for="tier in sortedTiers"
      :key="tier.id"
      :class="['tier-card', { inactive: !tier.is_active || tier.is_hidden }]"
    >
      <div class="tier-main">
        <!-- Header -->
        <div class="tier-header">
          <h4 class="tier-name">{{ tier.name }}</h4>
          <div class="tier-badges">
            <span
              :class="['status-badge', `status-${getStatus(tier)}`]"
            >
              <span class="status-dot"></span>
              {{ getStatusLabel(tier) }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p v-if="tier.description && tier.show_description" class="tier-description">
          {{ tier.description }}
        </p>

        <!-- Stats Row -->
        <div class="tier-stats">
          <div class="stat-item price">
            <span class="stat-value">${{ formatPrice(tier.price) }}</span>
          </div>

          <div class="stat-divider"></div>

          <div class="stat-item">
            <span class="stat-label">Sold</span>
            <span class="stat-value">{{ tier.sold || 0 }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Available</span>
            <span :class="['stat-value', { 'text-danger': tier.available === 0 }]">
              {{ tier.available ?? 'Unlimited' }}
            </span>
          </div>

          <div v-if="tier.quantity" class="stat-item">
            <span class="stat-label">Total</span>
            <span class="stat-value">{{ tier.quantity }}</span>
          </div>
        </div>

        <!-- Sales Window Info -->
        <div v-if="tier.sales_start || tier.sales_end" class="tier-info">
          <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span v-if="tier.sales_start && !tier.sales_end">
            Sales start {{ formatDate(tier.sales_start) }}
          </span>
          <span v-else-if="!tier.sales_start && tier.sales_end">
            Sales end {{ formatDate(tier.sales_end) }}
          </span>
          <span v-else>
            {{ formatDate(tier.sales_start) }} – {{ formatDate(tier.sales_end) }}
          </span>
        </div>

        <!-- Order Limits Info -->
        <div v-if="hasOrderLimits(tier)" class="tier-info">
          <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{{ getOrderLimitsText(tier) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="tier-actions">
        <button
          type="button"
          @click="$emit('edit', tier)"
          class="action-btn"
          title="Edit"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <button
          type="button"
          @click="$emit('delete', tier)"
          class="action-btn delete"
          title="Delete"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  getSalesStatusLabel,
  getSalesStatusColors,
  calculateSalesStatus,
  getQuantityConstraintsText
} from '~/utils/salesStatus'
import { formatDateTime } from '~/utils/dateTime'

const props = defineProps({
  tiers: {
    type: Array,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const sortedTiers = computed(() => {
  return [...props.tiers].sort((a, b) => {
    return (a.sort_order || 0) - (b.sort_order || 0)
  })
})

const getStatus = (tier) => {
  return tier.sales_status || calculateSalesStatus(tier)
}

const getStatusLabel = (tier) => {
  const status = getStatus(tier)
  return getSalesStatusLabel(status)
}

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const hasOrderLimits = (tier) => {
  return (tier.min_per_order && tier.min_per_order > 1) ||
         (tier.max_per_order && tier.max_per_order < 10)
}

const getOrderLimitsText = (tier) => {
  return getQuantityConstraintsText(tier)
}
</script>

<style scoped>
.tier-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #9ca3af;
  margin-bottom: 0.75rem;
}

.empty-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #6b7280;
}

.empty-subtitle {
  font-size: 0.8125rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

/* Tier Card */
.tier-card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: box-shadow 0.15s;
}

.tier-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tier-card.inactive {
  opacity: 0.6;
}

.tier-main {
  flex: 1;
  min-width: 0;
}

/* Header */
.tier-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.tier-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
}

.tier-badges {
  display: flex;
  gap: 0.5rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 500;
  border-radius: 9999px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-on_sale {
  background: #d1fae5;
  color: #065f46;
}
.status-on_sale .status-dot {
  background: #10b981;
}

.status-scheduled {
  background: #dbeafe;
  color: #1e40af;
}
.status-scheduled .status-dot {
  background: #3b82f6;
}

.status-ended {
  background: #f3f4f6;
  color: #374151;
}
.status-ended .status-dot {
  background: #9ca3af;
}

.status-sold_out {
  background: #fee2e2;
  color: #991b1b;
}
.status-sold_out .status-dot {
  background: #ef4444;
}

.status-inactive {
  background: #fef3c7;
  color: #92400e;
}
.status-inactive .status-dot {
  background: #f59e0b;
}

.status-hidden {
  background: #ede9fe;
  color: #5b21b6;
}
.status-hidden .status-dot {
  background: #8b5cf6;
}

/* Description */
.tier-description {
  font-size: 0.8125rem;
  color: #6b7280;
  margin-top: 0.375rem;
  line-height: 1.4;
}

/* Stats */
.tier-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-item.price {
  min-width: 70px;
}

.stat-label {
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: #9ca3af;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.stat-value.text-danger {
  color: #dc2626;
}

.stat-divider {
  width: 1px;
  height: 28px;
  background: #e5e7eb;
}

/* Info rows */
.tier-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.info-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Actions */
.tier-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.15s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.action-btn.delete:hover {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 640px) {
  .tier-stats {
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .stat-divider {
    display: none;
  }
}
</style>
