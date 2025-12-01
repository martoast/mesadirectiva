<template>
  <div class="flex items-center justify-center gap-2 mb-8">
    <div v-for="(step, index) in steps" :key="index" class="flex items-center">
      <div
        :class="[
          'flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-200',
          index < currentStep
            ? 'bg-success-600 text-white'
            : index === currentStep
            ? 'bg-primary-600 text-white ring-4 ring-primary-300'
            : 'bg-gray-200 text-gray-600'
        ]"
      >
        {{ index + 1 }}
      </div>
      <span
        :class="[
          'ml-2 text-sm font-medium',
          index <= currentStep ? 'text-gray-900' : 'text-gray-500'
        ]"
      >
        {{ step }}
      </span>
      <div
        v-if="index < steps.length - 1"
        :class="[
          'h-1 w-12 ml-4 transition-all duration-200',
          index < currentStep ? 'bg-success-600' : 'bg-gray-200'
        ]"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value) && value.length > 0
  },
  currentStep: {
    type: Number,
    required: true,
    validator: (value) => value >= 0
  }
})
</script>
