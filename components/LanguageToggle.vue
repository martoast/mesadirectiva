<template>
  <div class="language-toggle">
    <button
      type="button"
      :class="['lang-btn', { active: language === 'es' }]"
      @click="switchLanguage('es')"
      :title="language === 'es' ? 'Idioma actual: Español' : 'Switch to Spanish'"
    >
      <span class="flag">🇲🇽</span>
      <span v-if="showLabels" class="lang-label">ES</span>
    </button>
    <button
      type="button"
      :class="['lang-btn', { active: language === 'en' }]"
      @click="switchLanguage('en')"
      :title="language === 'en' ? 'Current language: English' : 'Cambiar a Inglés'"
    >
      <span class="flag">🇺🇸</span>
      <span v-if="showLabels" class="lang-label">EN</span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  showLabels: {
    type: Boolean,
    default: false
  }
})

const { language, switchLanguage: doSwitch } = useLanguage()
const { isAuthenticated } = useAuth()
const { updateProfile } = useProfile()

const switchLanguage = async (lang) => {
  doSwitch(lang)

  // If user is logged in, also save preference to their profile
  if (isAuthenticated.value) {
    try {
      await updateProfile({ preferred_language: lang })
    } catch (e) {
      // Silently fail - localStorage will still work
      console.warn('Failed to save language preference to profile:', e)
    }
  }
}
</script>

<style scoped>
.language-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 3px;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.lang-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.lang-btn.active {
  background: #ffffff;
  color: #111827;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.flag {
  font-size: 16px;
  line-height: 1;
}

.lang-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Dark variant for dark backgrounds */
:global(.dark) .language-toggle,
:global([data-theme="dark"]) .language-toggle {
  background: rgba(255, 255, 255, 0.1);
}

:global(.dark) .lang-btn,
:global([data-theme="dark"]) .lang-btn {
  color: rgba(255, 255, 255, 0.6);
}

:global(.dark) .lang-btn:hover,
:global([data-theme="dark"]) .lang-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

:global(.dark) .lang-btn.active,
:global([data-theme="dark"]) .lang-btn.active {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}
</style>
