<!-- components/admin/EventForm.vue -->
<!-- 7-step event form wizard with auto-save, media, and tickets -->
<template>
  <div class="event-form">
    <!-- Draft Saved Indicator -->
    <div v-if="savedSlug && !initialData" class="draft-indicator">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      Draft saved
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        :class="['step', { active: currentStep === index, completed: currentStep > index }]"
        @click="goToStep(index)"
      >
        <div class="step-number">
          <svg v-if="currentStep > index" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span class="step-label">{{ step.label }}</span>
      </div>
    </div>

    <!-- Step Content -->
    <div class="step-content">
      <!-- Step 1: Basic Info -->
      <div v-show="currentStep === 0" class="step-panel">
        <div class="panel-header">
          <h2>Basic Information</h2>
          <p>Start with the essentials for your event</p>
        </div>

        <div class="form-grid">
          <!-- Group Selection -->
          <div class="form-field full-width">
            <label for="group_id">Group <span class="required">*</span></label>
            <select id="group_id" v-model="form.group_id" required>
              <option value="">Select a group</option>
              <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
          </div>

          <!-- Event Name -->
          <div class="form-field full-width">
            <label for="name">Event Name <span class="required">*</span></label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="e.g., Annual Gala 2025"
              required
            />
          </div>

          <!-- Seating Type -->
          <div class="form-field full-width">
            <label>Event Type <span class="required">*</span></label>
            <div class="type-selector">
              <button
                type="button"
                :class="['type-option', form.seating_type === 'general_admission' && 'active']"
                @click="form.seating_type = 'general_admission'"
              >
                <div class="type-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="type-content">
                  <strong>General Admission</strong>
                  <span>Ticket tiers with different pricing</span>
                </div>
                <div v-if="form.seating_type === 'general_admission'" class="type-check">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                </div>
              </button>
              <button
                type="button"
                :class="['type-option', form.seating_type === 'seated' && 'active']"
                @click="form.seating_type = 'seated'"
              >
                <div class="type-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div class="type-content">
                  <strong>Seated Event</strong>
                  <span>Tables and seat selection</span>
                </div>
                <div v-if="form.seating_type === 'seated'" class="type-check">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Seated event options -->
          <div v-if="form.seating_type === 'seated'" class="form-field">
            <label for="reservation_minutes">Reservation Hold (minutes)</label>
            <input
              id="reservation_minutes"
              v-model.number="form.reservation_minutes"
              type="number"
              min="5"
              max="60"
              placeholder="15"
            />
            <span class="field-hint">Time customers have to complete checkout after selecting seats</span>
          </div>
        </div>
      </div>

      <!-- Step 2: Date & Time -->
      <div v-show="currentStep === 1" class="step-panel">
        <div class="panel-header">
          <h2>Date & Time</h2>
          <p>When does your event take place?</p>
        </div>

        <div class="form-grid">
          <!-- Start Date/Time -->
          <div class="form-field">
            <label for="starts_at">Start Date & Time <span class="required">*</span></label>
            <input
              id="starts_at"
              v-model="form.starts_at"
              type="datetime-local"
              required
            />
          </div>

          <!-- End Date/Time -->
          <div class="form-field">
            <label for="ends_at">End Date & Time</label>
            <input
              id="ends_at"
              v-model="form.ends_at"
              type="datetime-local"
            />
            <span class="field-hint">Optional - leave empty if unknown</span>
          </div>

          <!-- Timezone -->
          <div class="form-field full-width">
            <label for="timezone">Timezone <span class="required">*</span></label>
            <select id="timezone" v-model="form.timezone" required>
              <optgroup label="Mexico">
                <option v-for="tz in mexicoTimezones" :key="tz.value" :value="tz.value">
                  {{ tz.label }}
                </option>
              </optgroup>
              <optgroup label="Other">
                <option v-for="tz in otherTimezones" :key="tz.value" :value="tz.value">
                  {{ tz.label }}
                </option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      <!-- Step 3: Location -->
      <div v-show="currentStep === 2" class="step-panel">
        <div class="panel-header">
          <h2>Location</h2>
          <p>Where will your event be held?</p>
        </div>

        <div class="form-grid">
          <!-- Location Type -->
          <div class="form-field full-width">
            <label>Location Type <span class="required">*</span></label>
            <div class="location-type-selector">
              <button
                type="button"
                :class="['location-option', form.location_type === 'venue' && 'active']"
                @click="form.location_type = 'venue'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Physical Venue</span>
              </button>
              <button
                type="button"
                :class="['location-option', form.location_type === 'online' && 'active']"
                @click="form.location_type = 'online'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Online Event</span>
              </button>
            </div>
          </div>

          <!-- Venue Location Fields -->
          <template v-if="form.location_type === 'venue'">
            <div class="form-field full-width">
              <label for="venue_name">Venue Name <span class="required">*</span></label>
              <input
                id="venue_name"
                v-model="form.location.name"
                type="text"
                placeholder="e.g., Grand Ballroom, Hotel Marriott"
                required
              />
            </div>

            <div class="form-field full-width">
              <label for="venue_address">Street Address</label>
              <input
                id="venue_address"
                v-model="form.location.address"
                type="text"
                placeholder="e.g., 123 Main Street"
              />
            </div>

            <div class="form-field">
              <label for="venue_city">City <span class="required">*</span></label>
              <input
                id="venue_city"
                v-model="form.location.city"
                type="text"
                placeholder="e.g., Mexico City"
                required
              />
            </div>

            <div class="form-field">
              <label for="venue_state">State</label>
              <input
                id="venue_state"
                v-model="form.location.state"
                type="text"
                placeholder="e.g., CDMX"
              />
            </div>

            <div class="form-field">
              <label for="venue_country">Country</label>
              <input
                id="venue_country"
                v-model="form.location.country"
                type="text"
                placeholder="Mexico"
              />
            </div>

            <div class="form-field">
              <label for="venue_postal_code">Postal Code</label>
              <input
                id="venue_postal_code"
                v-model="form.location.postal_code"
                type="text"
                placeholder="e.g., 06600"
              />
            </div>

            <div class="form-field full-width">
              <label for="venue_map_url">Google Maps URL (optional)</label>
              <input
                id="venue_map_url"
                v-model="form.location.map_url"
                type="url"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </template>

          <!-- Online Location Fields -->
          <template v-if="form.location_type === 'online'">
            <div class="form-field">
              <label for="online_platform">Platform <span class="required">*</span></label>
              <select id="online_platform" v-model="form.location.platform" required>
                <option value="">Select platform</option>
                <option v-for="p in onlinePlatforms" :key="p.value" :value="p.value">
                  {{ p.label }}
                </option>
              </select>
            </div>

            <div class="form-field">
              <label for="online_url">Event URL</label>
              <input
                id="online_url"
                v-model="form.location.url"
                type="url"
                placeholder="https://zoom.us/j/..."
              />
              <span class="field-hint">You can add this later before the event</span>
            </div>

            <div class="form-field full-width">
              <label for="online_instructions">Access Instructions</label>
              <textarea
                id="online_instructions"
                v-model="form.location.instructions"
                rows="3"
                placeholder="Any special instructions for joining the event..."
              ></textarea>
            </div>
          </template>
        </div>
      </div>

      <!-- Step 4: Media -->
      <div v-show="currentStep === 3" class="step-panel">
        <div class="panel-header">
          <h2>Event Media</h2>
          <p>Add images and video to showcase your event</p>
        </div>

        <div v-if="!eventSlug" class="media-blocked">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-8V7m0 0V5m0 2h2m-2 0H9m12 8a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Complete the previous steps first to enable media uploads</p>
        </div>

        <AdminEventMediaStep
          v-else
          :event-slug="eventSlug"
          :initial-data="mediaData"
          @update:media="handleMediaUpdate"
          @upload-main-image="handleMainImageUpload"
          @upload-gallery-image="handleGalleryImageUpload"
        />
      </div>

      <!-- Step 5: Tickets -->
      <div v-show="currentStep === 4" class="step-panel">
        <div class="panel-header">
          <h2>{{ form.seating_type === 'seated' ? 'Tables & Seating' : 'Ticket Tiers' }}</h2>
          <p>{{ form.seating_type === 'seated' ? 'Set up tables for your seated event' : 'Create ticket options with different prices' }}</p>
        </div>

        <div v-if="!eventSlug" class="media-blocked">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-8V7m0 0V5m0 2h2m-2 0H9m12 8a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Complete the previous steps first to enable ticket setup</p>
        </div>

        <AdminEventTicketsStep
          v-else
          ref="ticketsStepRef"
          :event-slug="eventSlug"
          :seating-type="form.seating_type"
          @update:tiers="(t) => ticketTiers = t"
          @update:tables="(t) => eventTables = t"
        />
      </div>

      <!-- Step 6: Details -->
      <div v-show="currentStep === 5" class="step-panel">
        <div class="panel-header">
          <h2>Additional Details</h2>
          <p>Add extra information about your event</p>
        </div>

        <div class="form-grid">
          <!-- Description -->
          <div class="form-field full-width">
            <label for="description">Event Description <span class="required">*</span></label>
            <textarea
              id="description"
              v-model="form.description"
              rows="6"
              placeholder="Tell attendees what this event is about, what to expect, and why they should attend..."
              required
            ></textarea>
          </div>

          <!-- Organizer Info -->
          <div class="form-field">
            <label for="organizer_name">Organizer Name</label>
            <input
              id="organizer_name"
              v-model="form.organizer_name"
              type="text"
              placeholder="e.g., School Alumni Association"
            />
          </div>

          <div class="form-field">
            <label for="organizer_description">Organizer Description</label>
            <input
              id="organizer_description"
              v-model="form.organizer_description"
              type="text"
              placeholder="Brief description of the organizer"
            />
          </div>

          <!-- Options -->
          <div class="form-field full-width">
            <label>Event Options</label>
            <div class="checkbox-group">
              <label class="checkbox-option">
                <input type="checkbox" v-model="form.is_private" />
                <span class="checkbox-label">
                  <strong>Private Event</strong>
                  <span>Only visible via direct link</span>
                </span>
              </label>
              <label class="checkbox-option">
                <input type="checkbox" v-model="form.show_remaining" />
                <span class="checkbox-label">
                  <strong>Show Remaining Tickets</strong>
                  <span>Display how many tickets are left</span>
                </span>
              </label>
            </div>
          </div>

          <!-- FAQ Section -->
          <div class="form-field full-width">
            <div class="section-header">
              <label>Frequently Asked Questions</label>
              <button type="button" class="add-btn" @click="addFaqItem" v-if="form.faq_items.length < 20">
                + Add FAQ
              </button>
            </div>

            <div v-if="form.faq_items.length === 0" class="empty-state">
              <p>No FAQs added yet. Add common questions and answers to help attendees.</p>
            </div>

            <div v-for="(faq, index) in form.faq_items" :key="index" class="list-item">
              <div class="list-item-header">
                <span>FAQ {{ index + 1 }}</span>
                <button type="button" @click="removeFaqItem(index)" class="remove-btn">Remove</button>
              </div>
              <input
                v-model="faq.question"
                type="text"
                placeholder="Question"
                class="mb-2"
              />
              <textarea
                v-model="faq.answer"
                rows="2"
                placeholder="Answer"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 7: Review -->
      <div v-show="currentStep === 6" class="step-panel">
        <div class="panel-header">
          <h2>Review & Publish</h2>
          <p>Make sure everything looks good before publishing</p>
        </div>

        <div class="review-sections">
          <!-- Basic Info Summary -->
          <div class="review-card">
            <div class="review-card-header">
              <h3>Basic Information</h3>
              <button type="button" @click="goToStep(0)" class="edit-btn">Edit</button>
            </div>
            <div class="review-grid">
              <div class="review-item">
                <span class="review-label">Event Name</span>
                <span class="review-value">{{ form.name || '—' }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Event Type</span>
                <span class="review-value">{{ form.seating_type === 'seated' ? 'Seated Event' : 'General Admission' }}</span>
              </div>
            </div>
          </div>

          <!-- Date & Time Summary -->
          <div class="review-card">
            <div class="review-card-header">
              <h3>Date & Time</h3>
              <button type="button" @click="goToStep(1)" class="edit-btn">Edit</button>
            </div>
            <div class="review-grid">
              <div class="review-item">
                <span class="review-label">Starts</span>
                <span class="review-value">{{ formatReviewDateTime(form.starts_at) }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Ends</span>
                <span class="review-value">{{ form.ends_at ? formatReviewDateTime(form.ends_at) : 'Not specified' }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Timezone</span>
                <span class="review-value">{{ getTimezoneLabel(form.timezone) }}</span>
              </div>
            </div>
          </div>

          <!-- Location Summary -->
          <div class="review-card">
            <div class="review-card-header">
              <h3>Location</h3>
              <button type="button" @click="goToStep(2)" class="edit-btn">Edit</button>
            </div>
            <div class="review-grid">
              <div class="review-item full-width">
                <span class="review-label">{{ form.location_type === 'online' ? 'Platform' : 'Venue' }}</span>
                <span class="review-value">{{ formatLocationForReview() }}</span>
              </div>
            </div>
          </div>

          <!-- Media Summary -->
          <div class="review-card">
            <div class="review-card-header">
              <h3>Media</h3>
              <button type="button" @click="goToStep(3)" class="edit-btn">Edit</button>
            </div>
            <div class="review-grid">
              <div class="review-item">
                <span class="review-label">Main Image</span>
                <span class="review-value">{{ mediaData.image_url ? 'Uploaded' : 'Not set' }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Gallery</span>
                <span class="review-value">{{ mediaData.gallery?.length || 0 }} images</span>
              </div>
              <div class="review-item">
                <span class="review-label">Video</span>
                <span class="review-value">{{ mediaData.video_url ? 'Added' : 'None' }}</span>
              </div>
            </div>
          </div>

          <!-- Tickets Summary -->
          <div class="review-card">
            <div class="review-card-header">
              <h3>{{ form.seating_type === 'seated' ? 'Tables' : 'Tickets' }}</h3>
              <button type="button" @click="goToStep(4)" class="edit-btn">Edit</button>
            </div>
            <div class="review-grid">
              <div v-if="form.seating_type === 'general_admission'" class="review-item full-width">
                <span class="review-label">Ticket Tiers</span>
                <span class="review-value">{{ ticketTiers.length }} tier{{ ticketTiers.length !== 1 ? 's' : '' }} configured</span>
              </div>
              <div v-else class="review-item full-width">
                <span class="review-label">Tables</span>
                <span class="review-value">{{ eventTables.length }} table{{ eventTables.length !== 1 ? 's' : '' }} configured</span>
              </div>
            </div>
          </div>

          <!-- Details Summary -->
          <div class="review-card">
            <div class="review-card-header">
              <h3>Details</h3>
              <button type="button" @click="goToStep(5)" class="edit-btn">Edit</button>
            </div>
            <div class="review-grid">
              <div class="review-item full-width">
                <span class="review-label">Description</span>
                <span class="review-value description">{{ truncateText(form.description, 200) }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">FAQs</span>
                <span class="review-value">{{ form.faq_items.length }} items</span>
              </div>
              <div class="review-item">
                <span class="review-label">Options</span>
                <span class="review-value">
                  {{ form.is_private ? 'Private' : 'Public' }}
                  {{ form.show_remaining ? '• Shows remaining' : '' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Ready to Publish -->
          <div class="publish-ready-hint">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong>Your event is ready!</strong>
              <p>Review the details above, then publish to make your event live.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="form-error">
      {{ error }}
    </div>

    <!-- Navigation Buttons -->
    <div class="step-navigation">
      <button
        v-if="currentStep > 0"
        type="button"
        class="btn-back"
        @click="previousStep"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <div v-else></div>

      <div class="nav-right">
        <template v-if="currentStep < steps.length - 1">
          <button
            type="button"
            class="btn-next"
            @click="nextStep"
            :disabled="!canProceed"
          >
            Next
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </template>
        <template v-else>
          <button
            type="button"
            class="btn-draft"
            @click="handleSaveDraft"
            :disabled="submitting"
          >
            {{ submitting ? 'Saving...' : 'Save as Draft' }}
          </button>
          <button
            type="button"
            class="btn-publish"
            @click="handlePublish"
            :disabled="submitting"
          >
            {{ submitting ? 'Publishing...' : 'Publish Event' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { MEXICO_TIMEZONES, ALL_TIMEZONES, getTimezoneLabel as getTzLabel, isoToLocal, localToISO } from '~/utils/dateTime'
import { ONLINE_PLATFORMS, getEmptyVenueLocation, getEmptyOnlineLocation, formatLocation, getPlatformLabel } from '~/utils/location'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'draft', 'publish', 'slug-created'])

const { getGroups } = useGroups()
const { createEvent, updateEvent, uploadEventImage, addMedia } = useEvents()

// State
const groups = ref([])
const currentStep = ref(0)
const submitting = ref(false)
const error = ref('')
const savedSlug = ref('')
const autoSaving = ref(false)
const ticketsStepRef = ref(null)

// Media & Tickets data
const mediaData = reactive({
  image_url: '',
  gallery: [],
  video_url: ''
})
const ticketTiers = ref([])
const eventTables = ref([])

// Computed event slug (from initialData or auto-saved)
const eventSlug = computed(() => {
  return props.initialData?.slug || savedSlug.value
})

// Steps configuration (7 steps)
const steps = [
  { id: 'basic', label: 'Basics' },
  { id: 'datetime', label: 'Date' },
  { id: 'location', label: 'Location' },
  { id: 'media', label: 'Media' },
  { id: 'tickets', label: 'Tickets' },
  { id: 'details', label: 'Details' },
  { id: 'review', label: 'Review' }
]

// Timezone data
const mexicoTimezones = MEXICO_TIMEZONES
const otherTimezones = ALL_TIMEZONES.filter(tz => !MEXICO_TIMEZONES.some(mtz => mtz.value === tz.value))

// Online platforms
const onlinePlatforms = ONLINE_PLATFORMS

// Form data with new API structure
const form = reactive({
  // Basic
  group_id: '',
  name: '',
  seating_type: 'general_admission',
  reservation_minutes: 15,

  // Date & Time
  starts_at: '',
  ends_at: '',
  timezone: 'America/Mexico_City',

  // Location
  location_type: 'venue',
  location: getEmptyVenueLocation(),

  // Details
  description: '',
  organizer_name: '',
  organizer_description: '',
  is_private: false,
  show_remaining: true,
  faq_items: []
})

// Initialize form with initial data if provided
const initializeForm = () => {
  if (props.initialData) {
    const data = props.initialData

    form.group_id = data.group_id || data.group?.id || ''
    form.name = data.name || ''
    form.seating_type = data.seating_type || 'general_admission'
    form.reservation_minutes = data.reservation_minutes || 15

    // Convert ISO dates to local datetime format for inputs
    form.starts_at = data.starts_at ? isoToLocal(data.starts_at) : ''
    form.ends_at = data.ends_at ? isoToLocal(data.ends_at) : ''
    form.timezone = data.timezone || 'America/Mexico_City'

    form.location_type = data.location_type || 'venue'
    if (data.location) {
      form.location = { ...form.location, ...data.location }
    }

    form.description = data.description || ''
    form.organizer_name = data.organizer_name || ''
    form.organizer_description = data.organizer_description || ''
    form.is_private = data.is_private || false
    form.show_remaining = data.show_remaining ?? true
    form.faq_items = data.faq_items?.length ? [...data.faq_items] : []

    // Initialize media data
    mediaData.image_url = data.image_url || ''
    mediaData.gallery = data.gallery || []
    mediaData.video_url = data.video_url || ''
  }
}

// Fetch groups on mount
const fetchGroups = async () => {
  try {
    const response = await getGroups()
    groups.value = response.groups || []
  } catch (e) {
    console.error('Failed to load groups', e)
  }
}

onMounted(() => {
  fetchGroups()
  initializeForm()
})

// Validation per step
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0: // Basic Info
      return form.group_id && form.name && form.seating_type
    case 1: // Date & Time
      return form.starts_at && form.timezone
    case 2: // Location
      if (form.location_type === 'venue') {
        return form.location.name && form.location.city
      }
      return form.location.platform
    case 3: // Media (optional but needs slug)
      return true
    case 4: // Tickets (optional but needs slug)
      return true
    case 5: // Details
      return form.description
    default:
      return true
  }
})

// Auto-save draft after step 2 (Location)
const autoSaveDraft = async () => {
  if (props.initialData || savedSlug.value || autoSaving.value) return

  autoSaving.value = true
  error.value = ''

  try {
    const data = prepareData()
    data.status = 'draft'

    const response = await createEvent(data)
    savedSlug.value = response.event.slug
    emit('slug-created', savedSlug.value)
  } catch (e) {
    error.value = e.message || 'Failed to save draft'
  } finally {
    autoSaving.value = false
  }
}

// Navigation
const nextStep = async () => {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    // Auto-save after Location step (step 2)
    if (currentStep.value === 2 && !eventSlug.value) {
      await autoSaveDraft()
    }
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const goToStep = (index) => {
  // Only allow going back or to completed steps
  if (index <= currentStep.value) {
    currentStep.value = index
  }
}

// FAQ helpers
const addFaqItem = () => {
  form.faq_items.push({ question: '', answer: '' })
}

const removeFaqItem = (index) => {
  form.faq_items.splice(index, 1)
}

// Media handlers
const handleMediaUpdate = (data) => {
  if (data.mainImageUrl) mediaData.image_url = data.mainImageUrl
  if (data.videoUrl !== undefined) mediaData.video_url = data.videoUrl
}

const handleMainImageUpload = async (imageData) => {
  if (!eventSlug.value) return

  try {
    if (imageData.type === 'file') {
      const response = await uploadEventImage(eventSlug.value, imageData.file)
      mediaData.image_url = response.image_url || response.url
    } else if (imageData.type === 'url') {
      // For URL-based images, we just store the URL
      mediaData.image_url = imageData.url
      // Optionally update the event with the image URL
      await updateEvent(eventSlug.value, { image_url: imageData.url })
    }
  } catch (e) {
    error.value = e.message || 'Failed to upload image'
  }
}

const handleGalleryImageUpload = async (imageData) => {
  if (!eventSlug.value) return

  try {
    if (imageData.type === 'file') {
      const response = await addMedia(eventSlug.value, {
        type: 'image',
        file: imageData.file
      })
      if (response.media) {
        mediaData.gallery.push(response.media)
      }
    }
  } catch (e) {
    error.value = e.message || 'Failed to upload gallery image'
  }
}

// Handle location type change
watch(() => form.location_type, (newType) => {
  if (newType === 'venue') {
    form.location = getEmptyVenueLocation()
  } else {
    form.location = getEmptyOnlineLocation()
  }
})

// Prepare data for API
const prepareData = () => {
  const data = {
    group_id: form.group_id,
    name: form.name,
    seating_type: form.seating_type,
    starts_at: form.starts_at ? localToISO(form.starts_at) : null,
    ends_at: form.ends_at ? localToISO(form.ends_at) : null,
    timezone: form.timezone,
    location_type: form.location_type,
    location: { ...form.location },
    description: form.description,
    organizer_name: form.organizer_name || null,
    organizer_description: form.organizer_description || null,
    is_private: form.is_private,
    show_remaining: form.show_remaining,
    faq_items: form.faq_items.filter(f => f.question && f.answer)
  }

  if (form.seating_type === 'seated') {
    data.reservation_minutes = form.reservation_minutes || 15
  }

  // Add media data if using URL
  if (mediaData.image_url && !mediaData.image_url.startsWith('blob:')) {
    data.image_url = mediaData.image_url
  }
  if (mediaData.video_url) {
    data.video_url = mediaData.video_url
  }

  // Clean empty location fields
  Object.keys(data.location).forEach(key => {
    if (!data.location[key]) delete data.location[key]
  })

  return data
}

// Submit handlers
const handleSaveDraft = async () => {
  submitting.value = true
  error.value = ''
  try {
    const data = prepareData()
    data.status = 'draft'

    if (eventSlug.value) {
      // Update existing event
      await updateEvent(eventSlug.value, data)
      emit('draft', { ...data, slug: eventSlug.value })
    } else {
      // Create new event
      const response = await createEvent(data)
      savedSlug.value = response.event.slug
      emit('draft', response.event)
    }
  } catch (e) {
    error.value = e.message || 'Failed to save draft'
  } finally {
    submitting.value = false
  }
}

const handlePublish = async () => {
  submitting.value = true
  error.value = ''
  try {
    const data = prepareData()
    data.status = 'live'

    if (eventSlug.value) {
      // Update existing event
      await updateEvent(eventSlug.value, data)
      emit('publish', { ...data, slug: eventSlug.value })
    } else {
      // Create new event
      const response = await createEvent(data)
      savedSlug.value = response.event.slug
      emit('publish', response.event)
    }
  } catch (e) {
    error.value = e.message || 'Failed to publish event'
  } finally {
    submitting.value = false
  }
}

// Review helpers
const formatReviewDateTime = (dateStr) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const getTimezoneLabel = (tz) => {
  return getTzLabel(tz)
}

const formatLocationForReview = () => {
  if (form.location_type === 'online') {
    return getPlatformLabel(form.location.platform) || 'Online Event'
  }
  return formatLocation(form.location, 'venue') || 'No venue specified'
}

const truncateText = (text, maxLength) => {
  if (!text) return '—'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.event-form {
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-success: #10b981;
  --color-success-hover: #059669;
  --color-border: #e5e7eb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-bg: #ffffff;
  --color-bg-subtle: #f9fafb;
  --radius: 8px;

  max-width: 800px;
  margin: 0 auto;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  cursor: pointer;
  position: relative;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 16px;
  left: calc(50% + 20px);
  width: calc(100% - 40px);
  height: 2px;
  background: var(--color-border);
}

.step.completed:not(:last-child)::after {
  background: var(--color-primary);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  color: var(--color-text-muted);
  position: relative;
  z-index: 1;
  transition: all 0.2s;
}

.step.active .step-number {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}

.step.completed .step-number {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}

.step-label {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-align: center;
}

.step.active .step-label {
  color: var(--color-primary);
}

.step.completed .step-label {
  color: var(--color-text);
}

/* Step Content */
.step-content {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  margin-bottom: 1.5rem;
}

.step-panel {
  padding: 2rem;
}

.panel-header {
  margin-bottom: 2rem;
}

.panel-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.panel-header p {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.form-field .required {
  color: #ef4444;
}

.form-field input,
.form-field select,
.form-field textarea {
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-field textarea {
  resize: vertical;
  min-height: 100px;
}

.field-hint {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.375rem;
}

/* Type Selector */
.type-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.type-option:hover {
  border-color: #d1d5db;
}

.type-option.active {
  border-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.04);
}

.type-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-subtle);
  border-radius: 8px;
  flex-shrink: 0;
}

.type-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-text-muted);
}

.type-option.active .type-icon svg {
  color: var(--color-primary);
}

.type-content {
  flex: 1;
}

.type-content strong {
  display: block;
  font-size: 0.9375rem;
  color: var(--color-text);
  margin-bottom: 2px;
}

.type-content span {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.type-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border-radius: 50%;
  color: white;
  flex-shrink: 0;
}

.type-check svg {
  width: 14px;
  height: 14px;
}

/* Location Type Selector */
.location-type-selector {
  display: flex;
  gap: 0.75rem;
}

.location-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: all 0.2s;
}

.location-option:hover {
  border-color: #d1d5db;
}

.location-option.active {
  border-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.04);
  color: var(--color-primary);
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-option input {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: var(--color-primary);
}

.checkbox-label {
  display: flex;
  flex-direction: column;
}

.checkbox-label strong {
  font-size: 0.9375rem;
  color: var(--color-text);
}

.checkbox-label span {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header label {
  margin-bottom: 0;
}

.add-btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.08);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-btn:hover {
  background: rgba(99, 102, 241, 0.12);
}

/* List Items */
.list-item {
  padding: 1rem;
  background: var(--color-bg-subtle);
  border-radius: var(--radius);
  margin-bottom: 0.75rem;
}

.list-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.list-item-header span {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: var(--color-text-muted);
}

.remove-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
}

.list-item input,
.list-item textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg);
}

.list-item input.mb-2 {
  margin-bottom: 0.5rem;
}

.empty-state {
  padding: 1.5rem;
  background: var(--color-bg-subtle);
  border-radius: var(--radius);
  text-align: center;
}

.empty-state p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Review Section */
.review-sections {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.review-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  background: var(--color-bg-subtle);
  border-bottom: 1px solid var(--color-border);
}

.review-card-header h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.edit-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.review-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.review-item.full-width {
  grid-column: 1 / -1;
}

.review-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: var(--color-text-muted);
}

.review-value {
  font-size: 0.9375rem;
  color: var(--color-text);
}

.review-value.description {
  line-height: 1.5;
  white-space: pre-wrap;
}

/* Draft Indicator */
.draft-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #059669;
  background: #d1fae5;
  border-radius: 50px;
}

/* Media Blocked State */
.media-blocked {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 2rem;
  background: var(--color-bg-subtle);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius);
  text-align: center;
}

.media-blocked svg {
  color: var(--color-text-muted);
}

.media-blocked p {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

/* Publish Ready Hint */
.publish-ready-hint {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius);
}

.publish-ready-hint svg {
  flex-shrink: 0;
  color: #059669;
}

.publish-ready-hint strong {
  display: block;
  font-size: 0.875rem;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.publish-ready-hint p {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

/* Form Error */
.form-error {
  padding: 0.875rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius);
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

/* Navigation */
.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-right {
  display: flex;
  gap: 0.75rem;
}

.btn-back,
.btn-next,
.btn-draft,
.btn-publish {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.btn-back:hover {
  background: var(--color-bg-subtle);
  color: var(--color-text);
}

.btn-next {
  background: var(--color-primary);
  border: none;
  color: white;
}

.btn-next:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-draft {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-draft:hover:not(:disabled) {
  background: var(--color-bg-subtle);
}

.btn-draft:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-publish {
  background: var(--color-success);
  border: none;
  color: white;
}

.btn-publish:hover:not(:disabled) {
  background: var(--color-success-hover);
}

.btn-publish:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 640px) {
  .step-indicator {
    padding: 0;
  }

  .step-label {
    font-size: 10px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .location-type-selector {
    flex-direction: column;
  }

  .review-grid {
    grid-template-columns: 1fr;
  }

  .step-navigation {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-right {
    width: 100%;
    flex-direction: column;
  }

  .btn-back,
  .btn-next,
  .btn-draft,
  .btn-publish {
    width: 100%;
    justify-content: center;
  }
}
</style>
