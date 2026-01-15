<template>
  <form @submit.prevent="handleSubmit" class="ticket-tier-form">
    <h3 class="form-title">
      {{ tier ? t.editTicketTier : t.addTicketTier }}
    </h3>

    <!-- Basic Info -->
    <div class="form-section">
      <div class="form-field">
        <label for="tier-name">{{ t.tierName }} <span class="required">*</span></label>
        <input
          id="tier-name"
          v-model="form.name"
          type="text"
          :placeholder="t.tierNamePlaceholder"
          required
          :class="{ 'has-error': errors.name }"
        />
        <span v-if="errors.name" class="field-error">{{ errors.name[0] }}</span>
      </div>

      <div class="form-field">
        <label for="tier-description">{{ t.description }}</label>
        <textarea
          id="tier-description"
          v-model="form.description"
          rows="2"
          :placeholder="t.descriptionPlaceholder"
        ></textarea>
      </div>
    </div>

    <!-- Pricing & Quantity -->
    <div class="form-section">
      <div class="section-title">{{ t.pricingAndQuantity }}</div>
      <div class="form-row form-row-3">
        <div class="form-field">
          <label for="tier-price">{{ t.price }} <span class="required">*</span></label>
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
          <label for="tier-currency">{{ t.currency }}</label>
          <select id="tier-currency" v-model="form.currency">
            <option value="MXN">MXN (Pesos)</option>
            <option value="USD">USD (Dólares)</option>
          </select>
        </div>

        <div class="form-field">
          <label for="tier-quantity">{{ t.totalQuantity }}</label>
          <input
            id="tier-quantity"
            v-model="form.quantity"
            type="number"
            min="0"
            :placeholder="t.quantityPlaceholder"
            :class="{ 'has-error': errors.quantity }"
          />
          <span v-if="errors.quantity" class="field-error">{{ errors.quantity[0] }}</span>
        </div>
      </div>
    </div>

    <!-- Sales Window -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-title">{{ t.salesWindow }}</div>
        <button
          type="button"
          class="toggle-btn"
          :class="{ active: showSalesWindow }"
          @click="showSalesWindow = !showSalesWindow"
        >
          {{ showSalesWindow ? t.enabled : t.disabled }}
        </button>
      </div>

      <div v-if="showSalesWindow" class="form-row">
        <div class="form-field">
          <label for="tier-sales-start">{{ t.salesStart }}</label>
          <input
            id="tier-sales-start"
            v-model="form.sales_start"
            type="datetime-local"
            :class="{ 'has-error': errors.sales_start }"
          />
          <span class="field-hint">{{ t.salesStartHint }}</span>
        </div>

        <div class="form-field">
          <label for="tier-sales-end">{{ t.salesEnd }}</label>
          <input
            id="tier-sales-end"
            v-model="form.sales_end"
            type="datetime-local"
            :class="{ 'has-error': errors.sales_end }"
          />
          <span class="field-hint">{{ t.salesEndHint }}</span>
        </div>
      </div>
    </div>

    <!-- Order Constraints -->
    <div class="form-section">
      <div class="section-header">
        <div class="section-title">{{ t.orderLimits }}</div>
        <button
          type="button"
          class="toggle-btn"
          :class="{ active: showOrderLimits }"
          @click="showOrderLimits = !showOrderLimits"
        >
          {{ showOrderLimits ? t.enabled : t.default }}
        </button>
      </div>

      <div v-if="showOrderLimits" class="form-row">
        <div class="form-field">
          <label for="tier-min">{{ t.minPerOrder }}</label>
          <input
            id="tier-min"
            v-model="form.min_per_order"
            type="number"
            min="1"
            placeholder="1"
          />
        </div>

        <div class="form-field">
          <label for="tier-max">{{ t.maxPerOrder }}</label>
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
      <div class="section-title">{{ t.options }}</div>
      <div class="form-row">
        <div class="form-field">
          <label for="tier-sort-order">{{ t.sortOrder }}</label>
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
            <span>{{ t.active }}</span>
          </label>
          <label class="checkbox-option">
            <input type="checkbox" v-model="form.is_hidden" />
            <span>{{ t.hidden }}</span>
          </label>
          <label class="checkbox-option">
            <input type="checkbox" v-model="form.show_description" />
            <span>{{ t.showDescription }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button type="button" class="btn-cancel" @click="$emit('cancel')">
        {{ t.cancel }}
      </button>
      <button type="submit" class="btn-submit" :disabled="loading">
        {{ loading ? t.saving : (tier ? t.updateTier : t.createTier) }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { isoToLocal, localToISO } from '~/utils/dateTime'

const { t: createT, language } = useLanguage()

const translations = {
  // Form titles
  editTicketTier: { es: 'Editar Nivel de Boleto', en: 'Edit Ticket Tier' },
  addTicketTier: { es: 'Agregar Nivel de Boleto', en: 'Add Ticket Tier' },
  // Labels
  tierName: { es: 'Nombre del Nivel', en: 'Tier Name' },
  tierNamePlaceholder: { es: 'ej., General, VIP, Premium', en: 'e.g., General, VIP, Premium' },
  description: { es: 'Descripción', en: 'Description' },
  descriptionPlaceholder: { es: 'Describe lo que incluye este nivel', en: 'Describe what\'s included with this tier' },
  // Pricing & Quantity
  pricingAndQuantity: { es: 'Precio y Cantidad', en: 'Pricing & Quantity' },
  price: { es: 'Precio', en: 'Price' },
  currency: { es: 'Moneda', en: 'Currency' },
  totalQuantity: { es: 'Cantidad Total', en: 'Total Quantity' },
  quantityPlaceholder: { es: 'Dejar vacío para ilimitado', en: 'Leave empty for unlimited' },
  // Sales Window
  salesWindow: { es: 'Ventana de Ventas', en: 'Sales Window' },
  enabled: { es: 'Habilitado', en: 'Enabled' },
  disabled: { es: 'Deshabilitado', en: 'Disabled' },
  salesStart: { es: 'Inicio de Ventas', en: 'Sales Start' },
  salesEnd: { es: 'Fin de Ventas', en: 'Sales End' },
  salesStartHint: { es: 'Cuando los boletos estarán disponibles', en: 'When tickets become available' },
  salesEndHint: { es: 'Cuando los boletos dejan de venderse', en: 'When tickets stop selling' },
  // Order Limits
  orderLimits: { es: 'Límites de Orden', en: 'Order Limits' },
  default: { es: 'Por defecto', en: 'Default' },
  minPerOrder: { es: 'Mín. por Orden', en: 'Min per Order' },
  maxPerOrder: { es: 'Máx. por Orden', en: 'Max per Order' },
  // Options
  options: { es: 'Opciones', en: 'Options' },
  sortOrder: { es: 'Orden de Clasificación', en: 'Sort Order' },
  active: { es: 'Activo', en: 'Active' },
  hidden: { es: 'Oculto', en: 'Hidden' },
  showDescription: { es: 'Mostrar Descripción', en: 'Show Description' },
  // Actions
  cancel: { es: 'Cancelar', en: 'Cancel' },
  saving: { es: 'Guardando...', en: 'Saving...' },
  updateTier: { es: 'Actualizar Nivel', en: 'Update Tier' },
  createTier: { es: 'Crear Nivel', en: 'Create Tier' }
}

const t = createT(translations)

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
  currency: 'MXN',
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
    currency: 'MXN',
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
      currency: newTier.currency || 'MXN',
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
    currency: form.value.currency || 'MXN',
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

.form-row.form-row-3 {
  grid-template-columns: repeat(3, 1fr);
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
