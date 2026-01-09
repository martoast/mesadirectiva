<template>
  <div class="space-y-6">
    <div class="mb-8">
      <NuxtLink
        to="/app/admin/users"
        class="text-primary-600 hover:text-primary-700 font-semibold mb-4 inline-block"
      >
        {{ t.backToUsers }}
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">{{ t.createNewUser }}</h1>
      <p class="text-gray-600 mt-2">{{ t.pageSubtitle }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="max-w-2xl space-y-6">
      <!-- User Information -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">{{ t.userInformation }}</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t.fullName }} *</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            :placeholder="t.fullNamePlaceholder"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t.emailAddress }} *</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            :placeholder="t.emailPlaceholder"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t.password }} *</label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="8"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            :placeholder="t.passwordPlaceholder"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t.confirmPassword }} *</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            :placeholder="t.confirmPasswordPlaceholder"
          />
          <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">{{ t.passwordsMismatch }}</p>
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="form.is_active"
            type="checkbox"
            id="is_active"
            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label for="is_active" class="text-sm font-medium text-gray-700">{{ t.active }}</label>
          <span class="text-sm text-gray-500">{{ t.inactiveNote }}</span>
        </div>
      </div>

      <!-- Group Permissions -->
      <div class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">{{ t.groupPermissions }}</h2>
        <p class="text-sm text-gray-600">
          {{ t.groupPermissionsDescription }}
        </p>

        <div v-if="loadingGroups" class="text-center py-4">
          <p class="text-gray-600">{{ t.loadingGroups }}</p>
        </div>

        <div v-else-if="groups.length === 0" class="text-center py-4">
          <p class="text-gray-600">{{ t.noGroupsAvailable }}</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="group in groups"
            :key="group.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: group.color }"
              ></div>
              <span class="font-medium text-gray-900">{{ group.name }}</span>
            </div>
            <select
              v-model="groupPermissions[group.id]"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">{{ t.noAccess }}</option>
              <option value="view">{{ t.viewOnly }}</option>
              <option value="edit">{{ t.viewAndEdit }}</option>
              <option value="manage">{{ t.fullControl }}</option>
            </select>
          </div>
        </div>

        <!-- Permission Legend -->
        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm font-semibold text-blue-900 mb-2">{{ t.permissionLevels }}</p>
          <ul class="text-sm text-blue-800 space-y-1">
            <li><strong>{{ t.viewPermission }}</strong> {{ t.viewPermissionDesc }}</li>
            <li><strong>{{ t.editPermission }}</strong> {{ t.editPermissionDesc }}</li>
            <li><strong>{{ t.managePermission }}</strong> {{ t.managePermissionDesc }}</li>
          </ul>
        </div>
      </div>

      <!-- Form Error -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="flex gap-4 justify-between">
        <NuxtLink
          to="/app/admin/users"
          class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
        >
          {{ t.cancel }}
        </NuxtLink>
        <button
          type="submit"
          :disabled="submitting || passwordMismatch"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50"
        >
          {{ submitting ? t.creating : t.createUser }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'super-admin']
})

const { t: createT } = useLanguage()

const translations = {
  // Header
  backToUsers: { es: '← Volver a Usuarios', en: '← Back to Users' },
  createNewUser: { es: 'Crear Nuevo Usuario', en: 'Create New User' },
  pageSubtitle: { es: 'Agrega un nuevo administrador o visor al sistema.', en: 'Add a new admin or viewer to the system.' },

  // User Information
  userInformation: { es: 'Información del Usuario', en: 'User Information' },
  fullName: { es: 'Nombre Completo', en: 'Full Name' },
  fullNamePlaceholder: { es: 'María García', en: 'Maria Garcia' },
  emailAddress: { es: 'Correo Electrónico', en: 'Email Address' },
  emailPlaceholder: { es: 'maria@escuela.com', en: 'maria@school.com' },
  password: { es: 'Contraseña', en: 'Password' },
  passwordPlaceholder: { es: 'Mínimo 8 caracteres', en: 'Minimum 8 characters' },
  confirmPassword: { es: 'Confirmar Contraseña', en: 'Confirm Password' },
  confirmPasswordPlaceholder: { es: 'Confirmar contraseña', en: 'Confirm password' },
  passwordsMismatch: { es: 'Las contraseñas no coinciden', en: 'Passwords do not match' },
  active: { es: 'Activo', en: 'Active' },
  inactiveNote: { es: '(Los usuarios inactivos no pueden iniciar sesión)', en: '(Inactive users cannot log in)' },

  // Group Permissions
  groupPermissions: { es: 'Permisos de Grupo', en: 'Group Permissions' },
  groupPermissionsDescription: { es: 'Asigna a qué grupos puede acceder este usuario y qué permisos tiene.', en: 'Assign which groups this user can access and what permissions they have.' },
  loadingGroups: { es: 'Cargando grupos...', en: 'Loading groups...' },
  noGroupsAvailable: { es: 'No hay grupos disponibles. Crea grupos primero.', en: 'No groups available. Create groups first.' },
  noAccess: { es: 'Sin acceso', en: 'No access' },
  viewOnly: { es: 'Solo ver', en: 'View only' },
  viewAndEdit: { es: 'Ver y Editar', en: 'View & Edit' },
  fullControl: { es: 'Control total', en: 'Full control' },

  // Permission Legend
  permissionLevels: { es: 'Niveles de Permiso:', en: 'Permission Levels:' },
  viewPermission: { es: 'Ver:', en: 'View:' },
  viewPermissionDesc: { es: 'Puede ver eventos en este grupo (solo lectura)', en: 'Can see events in this group (read-only)' },
  editPermission: { es: 'Editar:', en: 'Edit:' },
  editPermissionDesc: { es: 'Puede crear y actualizar eventos', en: 'Can create and update events' },
  managePermission: { es: 'Gestionar:', en: 'Manage:' },
  managePermissionDesc: { es: 'Control total - crear, actualizar y eliminar eventos', en: 'Full control - create, update, and delete events' },

  // Actions
  cancel: { es: 'Cancelar', en: 'Cancel' },
  creating: { es: 'Creando...', en: 'Creating...' },
  createUser: { es: 'Crear Usuario', en: 'Create User' },
  failedToCreate: { es: 'Error al crear usuario', en: 'Failed to create user' }
}

const t = createT(translations)

const router = useRouter()
const { createUser, assignGroups } = useUsers()
const { getGroups } = useGroups()

const groups = ref([])
const loadingGroups = ref(true)
const error = ref('')
const submitting = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'admin',
  is_active: true
})

// Track permissions for each group
const groupPermissions = reactive({})

const passwordMismatch = computed(() => {
  return form.password && form.password_confirmation && form.password !== form.password_confirmation
})

const fetchGroups = async () => {
  loadingGroups.value = true
  try {
    const response = await getGroups()
    groups.value = response.groups || []
    // Initialize permissions as empty (no access)
    groups.value.forEach(group => {
      groupPermissions[group.id] = ''
    })
  } catch (e) {
    // Groups are optional
  } finally {
    loadingGroups.value = false
  }
}

const handleSubmit = async () => {
  if (passwordMismatch.value) return

  submitting.value = true
  error.value = ''

  try {
    // 1. Create the user
    const userData = {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      role: form.role,
      is_active: form.is_active
    }

    const response = await createUser(userData)
    const userId = response.user.id

    // 2. Assign group permissions (if any selected)
    const selectedGroups = Object.entries(groupPermissions)
      .filter(([_, permission]) => permission !== '')
      .map(([id, permission]) => ({
        id: parseInt(id),
        permission
      }))

    if (selectedGroups.length > 0) {
      await assignGroups(userId, selectedGroups)
    }

    // Success - redirect to users list
    router.push('/app/admin/users')
  } catch (e) {
    error.value = e.message || t.failedToCreate
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchGroups()
})
</script>
