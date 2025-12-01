<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="id" class="text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-danger-600">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="[
        'px-4 py-2 border rounded-lg font-medium transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        disabled && 'bg-gray-100 text-gray-500 cursor-not-allowed',
        error ? 'border-danger-500' : 'border-gray-300'
      ]"
    />
    <span v-if="error" class="text-sm text-danger-600">{{ error }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'number', 'password', 'date', 'time', 'tel', 'url'].includes(value)
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: String,
  placeholder: String,
  error: String,
  required: Boolean,
  disabled: Boolean
})

defineEmits(['update:modelValue'])
</script>
