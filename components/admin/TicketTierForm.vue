<template>
  <form @submit.prevent="handleSubmit" class="ticket-tier-form">
    <h3 class="form-title">
      {{ tier ? 'Edit Ticket Tier' : 'Add Ticket Tier' }}
    </h3>

    <!-- Basic Info -->
    <div class="form-section">
      <div class="form-field">
        <label for="tier-name">Tier Name <span class="required">*</span></label>
        <input
          id="tier-name"
          v-model="form.name"
          type="text"
          placeholder="e.g., General, VIP, Premium"
          required
          :class="{ 'has-error': errors.name }"
        />
        <span v-if="errors.name" class="field-error">{{ errors.name[0] }}</span>
      </div>

      <div class="form-field">
        <label for="tier-description">Description</label>
        <textarea
          id="tier-description"
          v-model="form.description"
          rows="2"
          placeholder="Describe what's included with this tier"
        ></textarea>
      </div>
    </div>

    <!-- Pricing & Quantity -->
    <div class="form-section">
      <div class="section-title">Pricing & Quantity</div>
      <div class="form-row">
        <div class="form-field">
          <label for="tier-price">Price <span class="required">*</span></label>
          <div class="input-with-prefix">
            <span class="prefix">$</span>
            <input
              id="tier-price"
              v-model="form.price"
              type="number"
              step="0.01"
              min="0"
              placeholder="100.00"
              required
              :class="{ 'has-error': errors.price }"
            />
          </div>
          <span v-if="errors.price" class="field-error">{{ errors.price[0] }}</span>
        </div>

        <div class="form-field">
          <label for="tier-quantity">Total Quantity</label>
          <input
            id="tier-quantity"
            v-model="form.quantity"
            type="number"
            min="0"
            placeholder="Leave empty for unlimited"
            :class="{ 'has-error': errors.quantity }"
          />
          <span v-if="errors.quantity" class="field-error">{{ errors.quantity[0] }}</span>
        </div>
      </div>
    </div>

    <!-- Sales Window -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-title">Sales Window</div>
        <button
          type="button"
          class="toggle-btn"
          :class="{ active: showSalesWindow }"
          @click="showSalesWindow = !showSalesWindow"
        >
          {{ showSalesWindow ? 'Enabled' : 'Disabled' }}
        </button>
      </div>

      <div v-if="showSalesWindow" class="form-row">
        <div class="form-field">
          <label for="tier-sales-start">Sales Start</label>
          <input
            id="tier-sales-start"
            v-model="form.sales_start"
            type="datetime-local"
            :class="{ 'has-error': errors.sales_start }"
          />
          <span class="field-hint">When tickets become available</span>
        </div>

        <div class="form-field">
          <label for="tier-sales-end">Sales End</label>
          <input
            id="tier-sales-end"
            v-model="form.sales_end"
            type="datetime-local"
            :class="{ 'has-error': errors.sales_end }"
          />
          <span class="field-hint">When tickets stop selling</span>
        </div>
      </div>
    </div>

    <!-- Order Constraints -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-title">Order Limits</div>
        <button
          type="button"
          class="toggle-btn"
          :class="{ active: showOrderLimits }"
          @click="showOrderLimits = !showOrderLimits"
        >
          {{ showOrderLimits ? 'Enabled' : 'Default' }}
        </button>
      </div>

      <div v-if="showOrderLimits" class="form-row">
        <div class="form-field">
          <label for="tier-min">Min per Order</label>
          <input
            id="tier-min"
            v-model="form.min_per_order"
            type="number"
            min="1"
            placeholder="1"
          />
        </div>

        <div class="form-field">
          <label for="tier-max">Max per Order</label>
          <input
            id="tier-max"
            v-model="form.max_per_order"
            type="number"
            min="1"
            placeholder="10"
          />
        </div>
      </div>
    </div>

    <!-- Options -->
    <div class="form-section">
      <div class="section-title">Options</div>
      <div class="form-row">
        <div class="form-field">
          <label for="tier-sort-order">Sort Order</label>
          <input
            id="tier-sort-order"
            v-model="form.sort_order"
            type="number"
            min="0"
            placeholder="0"
          />
        </div>

        <div class="form-field checkbox-group">
          <label class="checkbox-option">
            <input type="checkbox" v-model="form.is_active" />
            <span>Active</span>
          </label>
          <label class="checkbox-option">
            <input type="checkbox" v-model="form.is_hidden" />
            <span>Hidden</span>
          </label>
          <label class="checkbox-option">
            <input type="checkbox" v-model="form.show_description" />
            <span>Show Description</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button type="button" class="btn-cancel" @click="$emit('cancel')">
        Cancel
      </button>
      <button type="submit" class="btn-submit" :disabled="loading">
        {{ loading ? 'Saving...' : (tier ? 'Update Tier' : 'Create Tier') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { isoToLocal, localToISO } from '~/utils/dateTime'

const props = defineProps({
  tier: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const showSalesWindow = ref(false)
const showOrderLimits = ref(false)

const form = ref({
  name: '',
  description: '',
  price: '',
  quantity: '',
  sales_start: '',
  sales_end: '',
  min_per_order: '',
  max_per_order: '',
  sort_order: 0,
  is_active: true,
  is_hidden: false,
  show_description: true
})

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    price: '',
    quantity: '',
    sales_start: '',
    sales_end: '',
    min_per_order: '',
    max_per_order: '',
    sort_order: 0,
    is_active: true,
    is_hidden: false,
    show_description: true
  }
  showSalesWindow.value = false
  showOrderLimits.value = false
}

// Initialize form with tier data if editing
watch(() => props.tier, (newTier) => {
  if (newTier) {
    form.value = {
      name: newTier.name || '',
      description: newTier.description || '',
      price: newTier.price || '',
      quantity: newTier.quantity || '',
      sales_start: newTier.sales_start ? isoToLocal(newTier.sales_start) : '',
      sales_end: newTier.sales_end ? isoToLocal(newTier.sales_end) : '',
      min_per_order: newTier.min_per_order || '',
      max_per_order: newTier.max_per_order || '',
      sort_order: newTier.sort_order || 0,
      is_active: newTier.is_active !== false,
      is_hidden: newTier.is_hidden || false,
      show_description: newTier.show_description !== false
    }
    showSalesWindow.value = !!(newTier.sales_start || newTier.sales_end)
    showOrderLimits.value = !!(newTier.min_per_order !== 1 || newTier.max_per_order !== 10)
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = () => {
  const data = {
    name: form.value.name,
    description: form.value.description || null,
    price: parseFloat(form.value.price) || 0,
    quantity: form.value.quantity ? parseInt(form.value.quantity) : null,
    sort_order: parseInt(form.value.sort_order) || 0,
    is_active: form.value.is_active,
    is_hidden: form.value.is_hidden,
    show_description: form.value.show_description
  }

  // Sales window
  if (showSalesWindow.value) {
    data.sales_start = form.value.sales_start ? localToISO(form.value.sales_start) : null
    data.sales_end = form.value.sales_end ? localToISO(form.value.sales_end) : null
  } else {
    data.sales_start = null
    data.sales_end = null
  }

  // Order limits
  if (showOrderLimits.value) {
    data.min_per_order = form.value.min_per_order ? parseInt(form.value.min_per_order) : 1
    data.max_per_order = form.value.max_per_order ? parseInt(form.value.max_per_order) : 10
  } else {
    data.min_per_order = 1
    data.max_per_order = 10
  }

  emit('submit', data)
}
</script>

<style scoped>
.ticket-tier-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: #6b7280;
}

.toggle-btn {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  background: #f3f4f6;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s;
}

.toggle-btn.active {
  color: #059669;
  background: #d1fae5;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-field label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-field input,
.form-field textarea,
.form-field select {
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-field input.has-error,
.form-field textarea.has-error {
  border-color: #ef4444;
}

.input-with-prefix {
  position: relative;
}

.input-with-prefix .prefix {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 0.875rem;
}

.input-with-prefix input {
  padding-left: 1.75rem;
}

.field-hint {
  font-size: 0.6875rem;
  color: #9ca3af;
}

.field-error {
  font-size: 0.75rem;
  color: #ef4444;
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 0.5rem;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.checkbox-option input {
  width: 16px;
  height: 16px;
  accent-color: #6366f1;
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel {
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-submit {
  background: #6366f1;
  border: none;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #4f46e5;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
