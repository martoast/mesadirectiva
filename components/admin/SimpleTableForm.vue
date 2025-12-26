<!-- components/admin/SimpleTableForm.vue -->
<!-- Compact inline table form for event wizard -->
<template>
  <div class="simple-table-form">
    <div class="form-header">
      <h4>{{ table ? 'Edit Table' : 'Add Table' }}</h4>
    </div>

    <div class="form-body">
      <div class="form-row">
        <div class="form-field">
          <label for="table-name">Name <span class="required">*</span></label>
          <input
            id="table-name"
            v-model="form.name"
            type="text"
            placeholder="e.g., Table 1, VIP Table"
            required
          />
          <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
        </div>
      </div>

      <div class="form-row two-col">
        <div class="form-field">
          <label for="table-capacity">Seats <span class="required">*</span></label>
          <input
            id="table-capacity"
            v-model.number="form.capacity"
            type="number"
            min="1"
            max="50"
            placeholder="8"
            required
          />
        </div>

        <div class="form-field">
          <label for="table-price">Price ($) <span class="required">*</span></label>
          <input
            id="table-price"
            v-model="form.price"
            type="number"
            min="0"
            step="0.01"
            placeholder="200.00"
            required
          />
        </div>
      </div>

      <div class="checkbox-field">
        <input
          id="table-sell-as-whole"
          v-model="form.sell_as_whole"
          type="checkbox"
        />
        <label for="table-sell-as-whole">
          <strong>Sell as whole table</strong>
          <span>{{ form.sell_as_whole ? 'Customers buy entire table' : 'Customers can buy individual seats' }}</span>
        </label>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn-cancel" @click="handleCancel">Cancel</button>
      <button type="button" class="btn-save" @click="handleSubmit" :disabled="!isValid || loading">
        {{ loading ? 'Saving...' : (table ? 'Update' : 'Add Table') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  table: {
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

const form = ref({
  name: '',
  capacity: 8,
  price: '',
  sell_as_whole: true
})

// Initialize form
watch(() => props.table, (newTable) => {
  if (newTable) {
    form.value = {
      name: newTable.name || '',
      capacity: newTable.capacity || 8,
      price: newTable.price || '',
      sell_as_whole: newTable.sell_as_whole !== false
    }
  } else {
    form.value = {
      name: '',
      capacity: 8,
      price: '',
      sell_as_whole: true
    }
  }
}, { immediate: true })

const isValid = computed(() => {
  return form.value.name && form.value.capacity > 0 && form.value.price !== ''
})

const handleSubmit = () => {
  if (!isValid.value) return

  emit('submit', {
    name: form.value.name,
    capacity: parseInt(form.value.capacity) || 8,
    price: parseFloat(form.value.price) || 0,
    sell_as_whole: form.value.sell_as_whole,
    is_active: true
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.simple-table-form {
  --color-primary: #6366f1;
  --color-border: #e5e7eb;
  --color-bg-subtle: #f9fafb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-error: #ef4444;
  --radius: 8px;

  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.form-header {
  padding: 0.875rem 1rem;
  background: white;
  border-bottom: 1px solid var(--color-border);
}

.form-header h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
}

.form-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  gap: 1rem;
}

.form-row.two-col {
  grid-template-columns: 1fr 1fr;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.375rem;
}

.form-field label .required {
  color: var(--color-error);
}

.form-field input {
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: white;
}

.form-field input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.field-error {
  font-size: 0.75rem;
  color: var(--color-error);
  margin-top: 0.25rem;
}

.checkbox-field {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

.checkbox-field input {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  accent-color: var(--color-primary);
}

.checkbox-field label {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.checkbox-field label strong {
  font-size: 0.875rem;
  color: var(--color-text);
}

.checkbox-field label span {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: white;
  border-top: 1px solid var(--color-border);
}

.btn-cancel,
.btn-save {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.btn-cancel:hover {
  background: var(--color-bg-subtle);
  color: var(--color-text);
}

.btn-save {
  background: var(--color-primary);
  border: none;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #4f46e5;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .form-row.two-col {
    grid-template-columns: 1fr;
  }
}
</style>
