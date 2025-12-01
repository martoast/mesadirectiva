import { ref } from 'vue'

const mockEvents = ref([
  {
    id: '1',
    slug: 'summer-music-fest-2025',
    name: 'Summer Music Fest 2025',
    date: '2025-07-15',
    time: '18:00',
    location: 'Central Park, NYC',
    price: 75,
    maxTickets: 500,
    ticketsSold: 234,
    status: 'live',
    heroTitle: 'The Summer Event of the Year',
    heroSubtitle: 'Join us for an unforgettable night of music and celebration',
    heroImage: '/mock/hero-1.png',
    about: 'Experience an unforgettable summer evening with world-class music performances. From indie rock to electronic beats, our lineup features the hottest artists of 2025. Enjoy food trucks, craft beverages, and dancing under the stars at Central Park.',
    stripeProductId: 'prod_summer_2025',
    stripePriceId: 'price_summer_2025'
  },
  {
    id: '2',
    slug: 'tech-conference-2025',
    name: 'Tech Conference 2025',
    date: '2025-08-20',
    time: '09:00',
    location: 'San Francisco Convention Center',
    price: 199,
    maxTickets: 1000,
    ticketsSold: 567,
    status: 'live',
    heroTitle: 'The Future of Technology',
    heroSubtitle: 'Innovation, insights, and industry leaders',
    heroImage: '/mock/hero-1.png',
    about: 'Join us for the most anticipated tech conference of the year. Network with industry leaders, attend expert-led workshops, and discover cutting-edge technologies. Three days of keynotes, panel discussions, and hands-on sessions covering AI, blockchain, and cloud computing.',
    stripeProductId: 'prod_tech_2025',
    stripePriceId: 'price_tech_2025'
  },
  {
    id: '3',
    slug: 'art-exhibition-fall',
    name: 'Contemporary Art Exhibition',
    date: '2025-09-10',
    time: '17:00',
    location: 'MoMA, New York',
    price: 25,
    maxTickets: 300,
    ticketsSold: 89,
    status: 'draft',
    heroTitle: 'Modern Expressions',
    heroSubtitle: 'Exploring contemporary art in the 21st century',
    heroImage: '/mock/hero-1.png',
    about: 'A curated exhibition of works from emerging and established contemporary artists. Featuring paintings, sculptures, digital art, and interactive installations that challenge traditional perspectives on art and society.',
    stripeProductId: null,
    stripePriceId: null
  },
  {
    id: '4',
    slug: 'marathon-race-2025',
    name: 'City Marathon 2025',
    date: '2025-10-05',
    time: '08:00',
    location: 'Downtown Marathon Route',
    price: 65,
    maxTickets: 5000,
    ticketsSold: 3421,
    status: 'live',
    heroTitle: 'Run the City',
    heroSubtitle: 'Join thousands of runners for an epic marathon experience',
    heroImage: '/mock/hero-1.png',
    about: 'The annual city marathon returns with a brand new route showcasing the best landmarks and neighborhoods. Whether you\'re a seasoned runner or this is your first marathon, we have a pace group for you. Includes professional timing, medical support, and post-race festivities.',
    stripeProductId: 'prod_marathon_2025',
    stripePriceId: 'price_marathon_2025'
  }
])

export const useMockEvents = () => {
  // Get all events
  const getEvents = () => {
    return mockEvents.value
  }

  // Get single event by slug
  const getEventBySlug = (slug) => {
    return mockEvents.value.find(event => event.slug === slug)
  }

  // Get all live events
  const getLiveEvents = () => {
    return mockEvents.value.filter(event => event.status === 'live')
  }

  // Create new event
  const createEvent = (eventData) => {
    const newEvent = {
      id: String(Math.max(...mockEvents.value.map(e => parseInt(e.id)), 0) + 1),
      slug: eventData.slug || eventData.name.toLowerCase().replace(/\s+/g, '-'),
      ...eventData,
      ticketsSold: 0,
      status: eventData.status || 'draft',
      stripeProductId: null,
      stripePriceId: null
    }
    mockEvents.value.push(newEvent)
    return newEvent
  }

  // Update event
  const updateEvent = (slug, eventData) => {
    const index = mockEvents.value.findIndex(e => e.slug === slug)
    if (index !== -1) {
      // If name changed, update slug
      if (eventData.name && eventData.name !== mockEvents.value[index].name) {
        eventData.slug = eventData.name.toLowerCase().replace(/\s+/g, '-')
      }
      mockEvents.value[index] = {
        ...mockEvents.value[index],
        ...eventData
      }
      return mockEvents.value[index]
    }
    return null
  }

  // Delete event
  const deleteEvent = (slug) => {
    const index = mockEvents.value.findIndex(e => e.slug === slug)
    if (index !== -1) {
      mockEvents.value.splice(index, 1)
      return true
    }
    return false
  }

  // Publish event (change status from draft to live)
  const publishEvent = (slug) => {
    return updateEvent(slug, { status: 'live' })
  }

  // Save as draft
  const saveDraft = (slug, eventData) => {
    return updateEvent(slug, { ...eventData, status: 'draft' })
  }

  return {
    mockEvents: mockEvents.value,
    getEvents,
    getEventBySlug,
    getLiveEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    publishEvent,
    saveDraft
  }
}
