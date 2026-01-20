<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Side - Branding -->
      <div class="login-branding">
        <div class="branding-content">
          <AppLogo to="/" variant="light" size="large" />
          <div class="branding-text">
            <h1>{{ t.welcomeBack }}</h1>
            <p>{{ t.signInDescription }}</p>
          </div>
          <div class="branding-features">
            <div class="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ t.manageEvents }}</span>
            </div>
            <div class="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ t.trackSales }}</span>
            </div>
            <div class="feature-item">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ t.viewAnalytics }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Form -->
      <div class="login-form-section">
        <div class="form-container">
          <div class="form-header">
            <LanguageToggle class="login-lang-toggle" />
            <h2>{{ t.signIn }}</h2>
            <p>{{ t.enterCredentials }}</p>
          </div>

          <!-- Error Messages -->
          <div v-if="errorMessage" class="error-alert">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="email">{{ t.emailAddress }}</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                :placeholder="t.emailPlaceholder"
                :class="{ 'has-error': errors.email }"
              />
              <p v-if="errors.email" class="field-error">{{ errors.email[0] }}</p>
            </div>

            <div class="form-group">
              <label for="password">{{ t.password }}</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                required
                :placeholder="t.passwordPlaceholder"
                :class="{ 'has-error': errors.password }"
              />
              <p v-if="errors.password" class="field-error">{{ errors.password[0] }}</p>
            </div>

            <div class="form-options">
              <NuxtLink to="/forgot-password" class="forgot-link">
                {{ t.forgotPassword }}
              </NuxtLink>
            </div>

            <button type="submit" class="btn-submit" :disabled="loading">
              <span v-if="loading" class="loading-state">
                <svg class="spinner" viewBox="0 0 24 24">
                  <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" />
                  <path class="spinner-path" d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" />
                </svg>
                {{ t.signingIn }}
              </span>
              <span v-else>{{ t.signIn }}</span>
            </button>

            <!-- Google OAuth - Commented out for now, may bring back later
            <div class="divider">
              <span>{{ t.orContinueWith }}</span>
            </div>

            <a :href="googleRedirectUrl" class="btn-google">
              <svg viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {{ t.signInWithGoogle }}
            </a>
            -->
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  middleware: 'guest'
})

const { login, getGoogleRedirectUrl, isAuthenticated } = useAuth()
const { t: createT, language } = useLanguage()
const router = useRouter()
const route = useRoute()

// Translations
const translations = {
  welcomeBack: { es: 'Bienvenido de nuevo', en: 'Welcome back' },
  signInDescription: { es: 'Inicia sesión para acceder a tu panel de administración de eventos.', en: 'Sign in to access your event management dashboard and continue creating amazing experiences.' },
  manageEvents: { es: 'Gestionar eventos', en: 'Manage events' },
  trackSales: { es: 'Seguir ventas', en: 'Track sales' },
  viewAnalytics: { es: 'Ver analíticas', en: 'View analytics' },
  signIn: { es: 'Iniciar sesión', en: 'Sign in' },
  enterCredentials: { es: 'Ingresa tus credenciales para acceder a tu cuenta', en: 'Enter your credentials to access your account' },
  emailAddress: { es: 'Correo electrónico', en: 'Email address' },
  emailPlaceholder: { es: 'tu@ejemplo.com', en: 'you@example.com' },
  password: { es: 'Contraseña', en: 'Password' },
  passwordPlaceholder: { es: 'Ingresa tu contraseña', en: 'Enter your password' },
  forgotPassword: { es: '¿Olvidaste tu contraseña?', en: 'Forgot password?' },
  signingIn: { es: 'Iniciando sesión...', en: 'Signing in...' },
  orContinueWith: { es: 'o continúa con', en: 'or continue with' },
  signInWithGoogle: { es: 'Iniciar sesión con Google', en: 'Sign in with Google' }
}

const t = createT(translations)

// Error messages by language
const errorMessages = {
  user_not_found: {
    es: 'No se encontró una cuenta con este correo. Por favor contacta a un administrador.',
    en: 'No account found with this email. Please contact an administrator.'
  },
  account_deactivated: {
    es: 'Tu cuenta ha sido desactivada. Por favor contacta a un administrador.',
    en: 'Your account has been deactivated. Please contact an administrator.'
  },
  oauth_failed: {
    es: 'Error de autenticación. Por favor intenta de nuevo.',
    en: 'Authentication failed. Please try again.'
  },
  invalid_credentials: {
    es: 'Credenciales inválidas. Por favor intenta de nuevo.',
    en: 'Invalid credentials. Please try again.'
  }
}

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')
const errors = ref({})

const googleRedirectUrl = getGoogleRedirectUrl()

// Handle OAuth errors from redirect
onMounted(() => {
  const error = route.query.error
  if (error && errorMessages[error]) {
    errorMessage.value = errorMessages[error][language.value]
  }

  // Redirect if already authenticated
  if (isAuthenticated.value) {
    router.push('/app/admin/events')
  }
})

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''
  errors.value = {}

  try {
    await login(form.value.email, form.value.password)
    router.push('/app/admin/events')
  } catch (e) {
    if (e.errors) {
      errors.value = e.errors
    }
    errorMessage.value = e.message || errorMessages.invalid_credentials[language.value]
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.login-page {
  --font-sans: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --color-text: #0a0a0a;
  --color-text-secondary: #525252;
  --color-text-muted: #a3a3a3;
  --color-bg: #fafafa;
  --color-bg-card: #ffffff;
  --color-bg-dark: #0a0a0a;
  --color-border: #e5e5e5;
  --color-primary: #6366f1;
  --color-primary-light: #818cf8;
  --color-error: #ef4444;

  font-family: var(--font-sans);
  min-height: 100vh;
  background: var(--color-bg);
}

.login-container {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
}

/* Left Side - Branding */
.login-branding {
  display: none;
  background: var(--color-bg-dark);
  padding: 48px;
  position: relative;
  overflow: hidden;
}

.login-branding::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 20%, rgba(99, 102, 241, 0.15), transparent),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(99, 102, 241, 0.1), transparent);
}

.branding-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 400px;
}

.branding-content :deep(.app-logo) {
  margin-bottom: 48px;
}

.branding-text h1 {
  font-size: 36px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.branding-text p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin-bottom: 40px;
}

.branding-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
}

.feature-item svg {
  width: 18px;
  height: 18px;
  color: var(--color-primary-light);
}

/* Right Side - Form */
.login-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.form-container {
  width: 100%;
  max-width: 380px;
}

.form-header {
  margin-bottom: 32px;
}

.login-lang-toggle {
  margin-bottom: 24px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.form-header p {
  font-size: 14px;
  color: var(--color-text-secondary);
}

/* Error Alert */
.error-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  margin-bottom: 24px;
}

.error-alert svg {
  width: 18px;
  height: 18px;
  color: var(--color-error);
  flex-shrink: 0;
  margin-top: 1px;
}

.error-alert span {
  font-size: 14px;
  color: #991b1b;
  line-height: 1.4;
}

/* Form Groups */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  outline: none;
  transition: all 0.15s ease;
}

.form-group input::placeholder {
  color: var(--color-text-muted);
}

.form-group input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-group input.has-error {
  border-color: var(--color-error);
}

.form-group input.has-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.field-error {
  font-size: 12px;
  color: var(--color-error);
  margin-top: 6px;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.forgot-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.forgot-link:hover {
  color: var(--color-primary-light);
}

/* Submit Button */
.btn-submit {
  width: 100%;
  padding: 14px 20px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-primary-light);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
}

.spinner-track {
  opacity: 0.25;
}

.spinner-path {
  opacity: 1;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.divider span {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Google Button */
.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-google:hover {
  background: var(--color-bg);
  border-color: #d4d4d4;
}

.btn-google svg {
  width: 18px;
  height: 18px;
}

/* Tablet and Desktop */
@media (min-width: 768px) {
  .login-container {
    grid-template-columns: 1fr 1fr;
  }

  .login-branding {
    display: block;
  }

  .login-form-section {
    padding: 48px;
  }
}

@media (min-width: 1024px) {
  .login-branding {
    padding: 64px;
  }

  .branding-text h1 {
    font-size: 42px;
  }

  .form-container {
    max-width: 400px;
  }
}
</style>
