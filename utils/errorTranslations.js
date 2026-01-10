/**
 * Utility to translate common Laravel validation error messages
 * Maps English error patterns to Spanish translations
 */

const errorPatterns = [
  // Date validation errors
  {
    pattern: /The (.+) field must be a date after (.+)\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe ser una fecha posterior a ${translateFieldName(match[2])}.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must be a date after or equal to (.+)\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe ser una fecha igual o posterior a ${translateFieldName(match[2])}.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must be a valid date\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe ser una fecha válida.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field is required\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} es obligatorio.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must be at least (\d+) characters\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe tener al menos ${match[2]} caracteres.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must not be greater than (\d+) characters\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} no debe tener más de ${match[2]} caracteres.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must be a number\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe ser un número.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must be an integer\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe ser un número entero.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must be greater than (\d+)\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe ser mayor que ${match[2]}.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must be at least (\d+)\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe ser al menos ${match[2]}.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) has already been taken\./i,
    es: (match) => `El ${translateFieldName(match[1])} ya está en uso.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must be a valid email address\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe ser un correo electrónico válido.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must be a valid URL\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe ser una URL válida.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field format is invalid\./i,
    es: (match) => `El formato del campo ${translateFieldName(match[1])} es inválido.`,
    en: (match) => match[0]
  },
  {
    pattern: /The selected (.+) is invalid\./i,
    es: (match) => `El ${translateFieldName(match[1])} seleccionado es inválido.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must be an image\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe ser una imagen.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must not be greater than (\d+) kilobytes\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} no debe ser mayor a ${match[2]} kilobytes.`,
    en: (match) => match[0]
  },
  {
    pattern: /The (.+) field must be a file of type: (.+)\./i,
    es: (match) => `El campo ${translateFieldName(match[1])} debe ser un archivo de tipo: ${match[2]}.`,
    en: (match) => match[0]
  }
]

// Field name translations
const fieldNameTranslations = {
  'name': 'nombre',
  'description': 'descripción',
  'email': 'correo electrónico',
  'password': 'contraseña',
  'starts at': 'fecha de inicio',
  'starts_at': 'fecha de inicio',
  'ends at': 'fecha de fin',
  'ends_at': 'fecha de fin',
  'date': 'fecha',
  'time': 'hora',
  'location': 'ubicación',
  'address': 'dirección',
  'city': 'ciudad',
  'state': 'estado',
  'country': 'país',
  'zip': 'código postal',
  'phone': 'teléfono',
  'price': 'precio',
  'quantity': 'cantidad',
  'capacity': 'capacidad',
  'image': 'imagen',
  'file': 'archivo',
  'title': 'título',
  'slug': 'slug',
  'status': 'estado',
  'type': 'tipo',
  'group': 'grupo',
  'category': 'categoría',
  'timezone': 'zona horaria',
  'organizer name': 'nombre del organizador',
  'organizer_name': 'nombre del organizador',
  'organizer description': 'descripción del organizador',
  'organizer_description': 'descripción del organizador'
}

/**
 * Translate a field name to Spanish
 */
function translateFieldName(fieldName) {
  if (!fieldName) return fieldName
  const normalized = fieldName.toLowerCase().replace(/_/g, ' ')
  return fieldNameTranslations[normalized] || fieldNameTranslations[fieldName.toLowerCase()] || fieldName
}

/**
 * Translate an error message based on the current language
 * @param {string} message - The error message to translate
 * @param {string} language - The current language ('es' or 'en')
 * @returns {string} - The translated error message
 */
export function translateError(message, language = 'es') {
  if (!message || typeof message !== 'string') return message

  // If language is English, return as-is
  if (language === 'en') return message

  // Try to match against patterns
  for (const { pattern, es } of errorPatterns) {
    const match = message.match(pattern)
    if (match) {
      return es(match)
    }
  }

  // Return original if no pattern matches
  return message
}

/**
 * Translate multiple error messages (for field errors object)
 * @param {Object} errors - Object with field names as keys and error arrays as values
 * @param {string} language - The current language
 * @returns {Object} - Translated errors object
 */
export function translateErrors(errors, language = 'es') {
  if (!errors || typeof errors !== 'object') return errors

  const translated = {}
  for (const [field, messages] of Object.entries(errors)) {
    if (Array.isArray(messages)) {
      translated[field] = messages.map(msg => translateError(msg, language))
    } else if (typeof messages === 'string') {
      translated[field] = translateError(messages, language)
    } else {
      translated[field] = messages
    }
  }
  return translated
}
