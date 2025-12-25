<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      {{ table ? 'Edit Table' : 'Add Table' }}
    </h3>

    <UiBaseInput
      id="table-name"
      v-model="form.name"
      label="Table Name"
      placeholder="e.g., Table 1, VIP Table A"
      required
      :error="errors.name"
    />

    <div class="grid grid-cols-2 gap-4">
      <UiBaseInput
        id="table-capacity"
        v-model="form.capacity"
        type="number"
        label="Capacity (seats)"
        placeholder="8"
        required
        :error="errors.capacity"
      />

      <UiBaseInput
        id="table-price"
        v-model="form.price"
        type="number"
        label="Table Price"
        placeholder="1600.00"
        :required="form.sell_as_whole"
        :error="errors.price"
      />
    </div>

    <!-- Sell as whole toggle -->
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center gap-2 mb-2">
        <input
          id="table-sell-as-whole"
          v-model="form.sell_as_whole"
          type="checkbox"
          class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label for="table-sell-as-whole" class="text-sm font-medium text-gray-700">
          Sell as whole table
        </label>
      </div>
      <p class="text-sm text-gray-500 ml-6">
        {{ form.sell_as_whole
          ? 'Customers purchase the entire table at the table price.'
          : 'Customers can purchase individual seats. You\'ll need to set up seats after creating the table.'
        }}
      </p>
    </div>

    <!-- Position (optional) -->
    <div class="border-t pt-4">
      <p class="text-sm font-medium text-gray-700 mb-3">Position (for layout)</p>
      <div class="grid grid-cols-2 gap-4">
        <UiBaseInput
          id="table-position-x"
          v-model="form.position_x"
          type="number"
          label="X Position"
          placeholder="0"
        />
        <UiBaseInput
          id="table-position-y"
          v-model="form.position_y"
          type="number"
          label="Y Position"
          placeholder="0"
        />
      </div>
    </div>

    <div class="flex items-center gap-2">
      <input
        id="table-is-active"
        v-model="form.is_active"
        type="checkbox"
        class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
      />
      <label for="table-is-active" class="text-sm font-medium text-gray-700">
        Active
      </label>
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t">
      <UiBaseButton type="button" variant="secondary" @click="$emit('cancel')">
        Cancel
      </UiBaseButton>
      <UiBaseButton type="submit" :disabled="loading">
        {{ loading ? 'Saving...' : (table ? 'Update Table' : 'Create Table') }}
      </UiBaseButton>
    </div>
  </form>
</template>

<script setup>
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
  sell_as_whole: true,
  position_x: 0,
  position_y: 0,
  is_active: true
})

const resetForm = () => {
  form.value = {
    name: '',
    capacity: 8,
    price: '',
    sell_as_whole: true,
    position_x: 0,
    position_y: 0,
    is_active: true
  }
}

// Initialize form with table data if editing
watch(() => props.table, (newTable) => {
  if (newTable) {
    form.value = {
      name: newTable.name || '',
      capacity: newTable.capacity || 8,
      price: newTable.price || '',
      sell_as_whole: newTable.sell_as_whole !== false,
      position_x: newTable.position_x || 0,
      position_y: newTable.position_y || 0,
      is_active: newTable.is_active !== false
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = () => {
  const data = {
    name: form.value.name,
    capacity: parseInt(form.value.capacity) || 8,
    price: parseFloat(form.value.price) || 0,
    sell_as_whole: form.value.sell_as_whole,
    position_x: parseInt(form.value.position_x) || 0,
    position_y: parseInt(form.value.position_y) || 0,
    is_active: form.value.is_active
  }

  emit('submit', data)
}
</script>
