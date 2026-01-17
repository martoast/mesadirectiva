# Current Task: E-Ticket QR Scanner

## Overview
Add QR code scanning to the attendees page so admins can quickly check in attendees by scanning their e-ticket.

---

## Frontend Tasks

### 1. Install QR Scanner Library
- [ ] Run: `yarn add html5-qrcode`
- [ ] Library docs: https://github.com/mebjas/html5-qrcode

### 2. Update useAttendees Composable
- [ ] Add `scanCheckIn(eventSlug, ticketCode)` method
  ```javascript
  const scanCheckIn = async (eventSlug, ticketCode) => {
    return await post(`/events/${eventSlug}/attendees/scan`, { ticket_code: ticketCode })
  }
  ```

### 3. Add Scanner to Attendees Page
Location: `pages/app/admin/events/[slug]/attendees.vue`

- [ ] Add "Scan Ticket" button in header (next to search)
- [ ] Create scanner modal/overlay component
- [ ] Scanner states:
  - Idle (camera off)
  - Scanning (camera active, viewfinder visible)
  - Success (green flash, attendee name shown)
  - Error (red flash, error message)
  - Already checked in (warning state)

### 4. Scanner UI Design

```
┌────────────────────────────────────┐
│  ← Back              Scan Ticket   │
├────────────────────────────────────┤
│                                    │
│    ┌──────────────────────────┐    │
│    │                          │    │
│    │                          │    │
│    │     [ CAMERA FEED ]      │    │
│    │                          │    │
│    │    ┌────────────────┐    │    │
│    │    │   VIEWFINDER   │    │    │
│    │    └────────────────┘    │    │
│    │                          │    │
│    │                          │    │
│    └──────────────────────────┘    │
│                                    │
│    Point camera at QR code         │
│                                    │
│    ─────────────────────────────   │
│                                    │
│    Last scanned:                   │
│    ✓ John Doe - VIP Access         │
│                                    │
│    [ Scan Another ]                │
│                                    │
└────────────────────────────────────┘
```

### 5. Scanner UX Requirements

**Visual Feedback:**
- [ ] Green flash/border on successful scan
- [ ] Red flash/border on error
- [ ] Yellow/amber for already checked in
- [ ] Vibration on mobile (if supported)

**After Successful Scan:**
- [ ] Show attendee name prominently
- [ ] Show ticket type (tier or table/seat)
- [ ] Show "Checked In!" confirmation
- [ ] "Scan Another" button for continuous mode
- [ ] Auto-clear after 3 seconds if in continuous mode

**Error Handling:**
- [ ] "Invalid ticket code" - not found in system
- [ ] "Already checked in" - show who/when
- [ ] "Wrong event" - ticket is for different event
- [ ] "Camera permission denied" - show instructions
- [ ] "Camera not available" - fallback to manual entry

**Manual Entry Fallback:**
- [ ] Text input to type ticket code manually
- [ ] Useful if QR is damaged/unreadable
- [ ] Same validation as scan

### 6. Mobile Optimizations
- [ ] Full-screen scanner on mobile
- [ ] Large viewfinder area
- [ ] Touch-friendly buttons
- [ ] Works in landscape and portrait
- [ ] Fast camera initialization

### 7. Translations

```javascript
const translations = {
  scanTicket: { es: 'Escanear boleto', en: 'Scan Ticket' },
  scanning: { es: 'Escaneando...', en: 'Scanning...' },
  pointCamera: { es: 'Apunta la cámara al código QR', en: 'Point camera at QR code' },
  scanAnother: { es: 'Escanear otro', en: 'Scan Another' },
  lastScanned: { es: 'Último escaneado', en: 'Last scanned' },
  checkedIn: { es: 'Registrado', en: 'Checked In' },
  alreadyCheckedIn: { es: 'Ya registrado', en: 'Already checked in' },
  invalidCode: { es: 'Código inválido', en: 'Invalid code' },
  wrongEvent: { es: 'Boleto de otro evento', en: 'Ticket for different event' },
  cameraPermission: { es: 'Se requiere acceso a la cámara', en: 'Camera access required' },
  manualEntry: { es: 'Ingresar código manual', en: 'Enter code manually' },
  enterCode: { es: 'Ingresa el código del boleto', en: 'Enter ticket code' },
  close: { es: 'Cerrar', en: 'Close' }
}
```

---

## Files to Modify

- `package.json` - Add html5-qrcode
- `composables/useAttendees.js` - Add scanCheckIn method
- `pages/app/admin/events/[slug]/attendees.vue` - Add scanner button and modal

---

## Testing Checklist
- [ ] Scanner button appears in header
- [ ] Clicking opens camera modal
- [ ] Camera permission prompt works
- [ ] QR code is detected and decoded
- [ ] Valid code checks in attendee
- [ ] Success feedback shown
- [ ] Already checked-in shows warning
- [ ] Invalid code shows error
- [ ] Manual entry works
- [ ] Works on mobile (iOS Safari, Android Chrome)
- [ ] Works on desktop (Chrome, Firefox, Safari)
- [ ] Translations work for ES/EN

---

# Previously Completed

## Translation System (Done)
- Created useLanguage composable
- Created LanguageToggle component
- Added translations to all admin and public pages

## Attendees Check-In System (Done)
- Created useAttendees composable
- Created attendees page with search/filters
- Added check-in/undo functionality
- Added link from event detail page
- Full responsive design
