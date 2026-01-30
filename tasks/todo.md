# Current Task: Email & Ticket CMS (Per-Event Customization)

## Overview
Add an admin page where event organizers can customize the confirmation email and PDF ticket text per event. This connects to the new `email_settings` JSON field on the events API.

---

## Plan

### 1. Update `useEvents` composable
- `updateEvent(slug, data)` already exists and supports any event field
- No new composable methods needed — just pass `email_settings` in the update payload

### 2. Create admin page: `pages/app/admin/events/[slug]/email-settings.vue`
- New page at `/app/admin/events/{slug}/email-settings`
- Follows existing admin page patterns (breadcrumb nav, card layout)
- **Form fields** (all optional, show placeholder with defaults):
  - **Email Subject** — text input, placeholder: "Tus boletos para {event_name}"
  - **Greeting** — text input, placeholder: "Hola {customer_name},"
  - **Intro Text** — textarea, placeholder: "Tus boletos están adjuntos a este correo."
  - **Instructions** — textarea, placeholder: "Por favor ten tu boleto (impreso o en tu teléfono) listo en la entrada."
  - **Email Footer** — text input, placeholder: "¡Te esperamos!"
  - **Ticket Footer** — text input, placeholder: "Presenta este boleto en la entrada"
- **Placeholders info box** — show available placeholders: `{event_name}`, `{customer_name}`
- **Save button** — calls `updateEvent(slug, { email_settings: { ... } })`
- **Reset to defaults button** — clears all fields (saves `email_settings: null`)
- **Live preview section** — optional, shows a mini preview of how the email will look

### 3. Add link to email settings from event detail page
- In `pages/app/admin/events/[slug]/index.vue`
- Add a new quick-action link in the Actions Card: "Email y Boletos" / "Email & Tickets"
- Links to `/app/admin/events/{slug}/email-settings`

### 4. Translations
```javascript
{
  emailSettings: { es: 'Email y Boletos', en: 'Email & Tickets' },
  emailSettingsDescription: { es: 'Personaliza el correo de confirmación y los boletos PDF para este evento.', en: 'Customize the confirmation email and PDF tickets for this event.' },
  emailSubject: { es: 'Asunto del correo', en: 'Email Subject' },
  emailGreeting: { es: 'Saludo', en: 'Greeting' },
  emailIntro: { es: 'Texto de introducción', en: 'Intro Text' },
  emailInstructions: { es: 'Instrucciones', en: 'Instructions' },
  emailFooter: { es: 'Pie del correo', en: 'Email Footer' },
  ticketFooter: { es: 'Pie del boleto PDF', en: 'PDF Ticket Footer' },
  availablePlaceholders: { es: 'Placeholders disponibles', en: 'Available Placeholders' },
  resetDefaults: { es: 'Restablecer valores predeterminados', en: 'Reset to Defaults' },
  leaveEmptyForDefault: { es: 'Deja vacío para usar el texto predeterminado', en: 'Leave empty to use default text' },
  saved: { es: 'Guardado', en: 'Saved' },
  saveChanges: { es: 'Guardar Cambios', en: 'Save Changes' }
}
```

---

## Files to Create
- `pages/app/admin/events/[slug]/email-settings.vue`

## Files to Modify
- `pages/app/admin/events/[slug]/index.vue` — add quick-action link

---

## UI Design Notes
- Follow existing admin card layout pattern
- Each field shows the Spanish default as placeholder text
- Info callout box explaining placeholders (`{event_name}`, `{customer_name}`)
- Subtitle under page title: "Deja vacío para usar el texto predeterminado"
- Toast/success message on save

---

# Previously Completed

## E-Ticket QR Scanner (Done)
- QR scanner on attendees page
- Camera-based scanning with manual fallback
- Check-in confirmation with visual feedback

## Translation System (Done)
- useLanguage composable
- LanguageToggle component
- All admin and public pages translated

## Attendees Check-In System (Done)
- useAttendees composable
- Attendees page with search/filters
- Check-in/undo functionality
