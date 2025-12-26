<!-- components/admin/SimpleTableList.vue -->
<!-- Compact table list for event wizard -->
<template>
  <div class="simple-table-list">
    <!-- Empty State -->
    <div v-if="tables.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </div>
      <p class="empty-title">No tables yet</p>
      <p class="empty-subtitle">Add tables and set their pricing for your seated event</p>
    </div>

    <!-- Tables List -->
    <div v-else class="table-items">
      <div
        v-for="table in tables"
        :key="table.id"
        class="table-item"
      >
        <div class="table-main">
          <div class="table-info">
            <span class="table-name">{{ table.name }}</span>
            <span class="table-meta">
              {{ table.capacity }} seats
              <span v-if="table.sell_as_whole" class="badge">Whole table</span>
            </span>
          </div>
          <span class="table-price">${{ formatPrice(table.price) }}</span>
        </div>

        <div class="table-actions">
          <button type="button" class="action-btn" @click="$emit('edit', table)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button type="button" class="action-btn delete" @click="$emit('delete', table)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div v-if="tables.length > 0" class="list-summary">
      <div class="stat">
        <span class="stat-value">{{ tables.length }}</span>
        <span class="stat-label">{{ tables.length === 1 ? 'Table' : 'Tables' }}</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ totalSeats }}</span>
        <span class="stat-label">Total Seats</span>
      </div>
      <div class="stat">
        <span class="stat-value">${{ formatPrice(totalValue) }}</span>
        <span class="stat-label">Total Value</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tables: {
    type: Array,
    default: () => []
  }
})

defineEmits(['edit', 'delete'])

const totalSeats = computed(() => {
  return props.tables.reduce((sum, t) => sum + (t.capacity || 0), 0)
})

const totalValue = computed(() => {
  return props.tables.reduce((sum, t) => sum + (parseFloat(t.price) || 0), 0)
})

const formatPrice = (price) => {
  return Number(price || 0).toFixed(2)
}
</script>

<style scoped>
.simple-table-list {
  --color-primary: #6366f1;
  --color-border: #e5e7eb;
  --color-bg-subtle: #f9fafb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-error: #ef4444;
  --radius: 8px;
}

/* Empty State */
.empty-state {
  padding: 2.5rem 1.5rem;
  text-align: center;
  background: var(--color-bg-subtle);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  color: var(--color-text-muted);
}

.empty-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.empty-subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

/* Table Items */
.table-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.table-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  transition: border-color 0.2s;
}

.table-item:hover {
  border-color: #d1d5db;
}

.table-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
}

.table-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.table-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.badge {
  padding: 0.125rem 0.375rem;
  font-size: 0.6875rem;
  font-weight: 600;
  background: var(--color-bg-subtle);
  border-radius: 4px;
  text-transform: uppercase;
}

.table-price {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  flex-shrink: 0;
}

.table-actions {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--color-bg-subtle);
  color: var(--color-text);
}

.action-btn.delete:hover {
  background: #fef2f2;
  color: var(--color-error);
}

/* Summary */
.list-summary {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  margin-top: 0.75rem;
  background: var(--color-bg-subtle);
  border-radius: var(--radius);
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
