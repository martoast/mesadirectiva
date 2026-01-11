<template>
  <div class="space-y-6">
    <div class="mb-8">
      <NuxtLink
        to="/app/admin/users"
        class="text-primary-600 hover:text-primary-700 font-semibold mb-4 inline-block"
      >
        ← {{ t.backToUsers }}
      </NuxtLink>
      <h1 class="text-3xl font-bold text-gray-900">{{ t.editUser }}</h1>
      <p v-if="user" class="text-gray-600 mt-2">{{ user.name }} ({{ user.email }})</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-card p-12 text-center">
      <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600">{{ t.loadingUser }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {{ loadError }}
    </div>

    <!-- Edit Form -->
    <form v-else-if="user" @submit.prevent="handleSubmit" class="max-w-2xl space-y-6">
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
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t.emailAddress }} *</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t.newPassword }}</label>
          <input
            v-model="form.password"
            type="password"
            minlength="8"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            :placeholder="t.leaveEmptyPassword"
          />
        </div>

        <div v-if="form.password">
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t.confirmPassword }}</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            :placeholder="t.confirmNewPassword"
          />
          <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">{{ t.passwordsMismatch }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t.role }} *</label>
          <select
            v-model="form.role"
            required
            :disabled="user.role === 'super_admin'"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
          >
            <option v-if="user.role === 'super_admin'" value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="viewer">{{ t.viewer }}</option>
          </select>
          <p v-if="user.role === 'super_admin'" class="mt-1 text-sm text-gray-500">
            {{ t.superAdminCantChange }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="form.is_active"
            type="checkbox"
            id="is_active"
            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label for="is_active" class="text-sm font-medium text-gray-700">{{ t.active }}</label>
          <span class="text-sm text-gray-500">({{ t.inactiveUsersNote }})</span>
        </div>
      </div>

      <!-- Group Permissions -->
      <div v-if="user.role !== 'super_admin'" class="bg-white rounded-xl shadow-card p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900">{{ t.groupPermissions }}</h2>
        <p class="text-sm text-gray-600">
          {{ t.groupPermissionsDesc }}
        </p>

        <div v-if="groups.length === 0" class="text-center py-4">
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
          <p class="text-sm font-semibold text-blue-900 mb-2">{{ t.permissionLevels }}:</p>
          <ul class="text-sm text-blue-800 space-y-1">
            <li><strong>{{ t.viewOnly }}:</strong> {{ t.viewDesc }}</li>
            <li><strong>{{ t.viewAndEdit }}:</strong> {{ t.editDesc }}</li>
            <li><strong>{{ t.fullControl }}:</strong> {{ t.manageDesc }}</li>
          </ul>
        </div>
      </div>

      <div v-else class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
        {{ t.superAdminFullAccess }}
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
          {{ submitting ? t.saving : t.saveChanges }}
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

const route = useRoute()
const router = useRouter()
const { getUser, updateUser, assignGroups } = useUsers()
const { getGroups } = useGroups()
const { t: createT } = useLanguage()

const translations = {
  backToUsers: { es: 'Volver a Usuarios', en: 'Back to Users' },
  editUser: { es: 'Editar Usuario', en: 'Edit User' },
  loadingUser: { es: 'Cargando usuario...', en: 'Loading user...' },
  userInformation: { es: 'Información del Usuario', en: 'User Information' },
  fullName: { es: 'Nombre Completo', en: 'Full Name' },
  emailAddress: { es: 'Correo Electrónico', en: 'Email Address' },
  newPassword: { es: 'Nueva Contraseña', en: 'New Password' },
  leaveEmptyPassword: { es: 'Dejar vacío para mantener la contraseña actual', en: 'Leave empty to keep current password' },
  confirmPassword: { es: 'Confirmar Nueva Contraseña', en: 'Confirm New Password' },
  confirmNewPassword: { es: 'Confirmar nueva contraseña', en: 'Confirm new password' },
  passwordsMismatch: { es: 'Las contraseñas no coinciden', en: 'Passwords do not match' },
  role: { es: 'Rol', en: 'Role' },
  viewer: { es: 'Visor', en: 'Viewer' },
  superAdminCantChange: { es: 'El rol de Super Admin no se puede cambiar.', en: 'Super Admin role cannot be changed.' },
  active: { es: 'Activo', en: 'Active' },
  inactiveUsersNote: { es: 'Los usuarios inactivos no pueden iniciar sesión', en: 'Inactive users cannot log in' },
  groupPermissions: { es: 'Permisos de Grupo', en: 'Group Permissions' },
  groupPermissionsDesc: { es: 'Asigna a qué grupos puede acceder este usuario y qué permisos tiene.', en: 'Assign which groups this user can access and what permissions they have.' },
  noGroupsAvailable: { es: 'No hay grupos disponibles.', en: 'No groups available.' },
  noAccess: { es: 'Sin acceso', en: 'No access' },
  viewOnly: { es: 'Solo ver', en: 'View only' },
  viewAndEdit: { es: 'Ver y Editar', en: 'View & Edit' },
  fullControl: { es: 'Control total', en: 'Full control' },
  permissionLevels: { es: 'Niveles de Permiso', en: 'Permission Levels' },
  viewDesc: { es: 'Puede ver eventos en este grupo (solo lectura)', en: 'Can see events in this group (read-only)' },
  editDesc: { es: 'Puede crear y actualizar eventos', en: 'Can create and update events' },
  manageDesc: { es: 'Control total - crear, actualizar y eliminar eventos', en: 'Full control - create, update, and delete events' },
  superAdminFullAccess: { es: 'Los Super Admins tienen acceso completo a todos los grupos y no necesitan permisos específicos.', en: "Super Admins have full access to all groups and don't need group-specific permissions." },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  saving: { es: 'Guardando...', en: 'Saving...' },
  saveChanges: { es: 'Guardar Cambios', en: 'Save Changes' }
}

const t = createT(translations)

const user = ref(null)
const groups = ref([])
const loading = ref(true)
const loadError = ref('')
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

// Track permissions for each group - use ref for better reactivity with dynamic keys
const groupPermissions = ref({})

const passwordMismatch = computed(() => {
  return form.password && form.password_confirmation && form.password !== form.password_confirmation
})

const fetchData = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const [userResponse, groupsResponse] = await Promise.all([
      getUser(route.params.id),
      getGroups()
    ])

    user.value = userResponse.user
    groups.value = groupsResponse.groups || []

    // Populate form with user data
    form.name = user.value.name
    form.email = user.value.email
    form.role = user.value.role
    form.is_active = user.value.is_active

    // Initialize group permissions - build object then assign for proper reactivity
    const perms = {}
    groups.value.forEach(group => {
      perms[group.id] = ''
    })

    // Set existing permissions
    if (user.value.groups) {
      user.value.groups.forEach(group => {
        perms[group.id] = group.pivot?.permission || group.permission || ''
      })
    }

    groupPermissions.value = perms
  } catch (e) {
    loadError.value = e.message || 'Failed to load user'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (passwordMismatch.value) return

  submitting.value = true
  error.value = ''

  try {
    // 1. Update user info
    const userData = {
      name: form.name,
      email: form.email,
      role: form.role,
      is_active: form.is_active
    }

    // Only include password if provided
    if (form.password) {
      userData.password = form.password
      userData.password_confirmation = form.password_confirmation
    }

    await updateUser(route.params.id, userData)

    // 2. Update group permissions (if not super_admin)
    if (user.value.role !== 'super_admin') {
      const selectedGroups = Object.entries(groupPermissions.value)
        .filter(([_, permission]) => permission !== '')
        .map(([id, permission]) => ({
          id: parseInt(id),
          permission
        }))

      await assignGroups(route.params.id, selectedGroups)
    }

    // Success - redirect to users list
    router.push('/app/admin/users')
  } catch (e) {
    error.value = e.message || 'Failed to update user'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
