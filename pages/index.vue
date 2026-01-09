<template>
  <div class="landing">
    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-inner">
        <NuxtLink to="/" class="nav-brand">
          <div class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.9"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="brand-text">MesaDirectiva</span>
        </NuxtLink>

        <div class="nav-links">
          <NuxtLink to="/app/events" class="nav-link">Events</NuxtLink>
          <a href="#features" class="nav-link">Features</a>
          <a href="#pricing" class="nav-link">Pricing</a>
        </div>

        <div class="nav-actions">
          <NuxtLink to="/login" class="nav-signin">Sign In</NuxtLink>
          <NuxtLink to="/app/admin/events/create" class="nav-cta">Get Started Free</NuxtLink>
        </div>

        <button class="mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="mobile-menu">
          <NuxtLink to="/app/events" class="mobile-link">Events</NuxtLink>
          <a href="#features" class="mobile-link" @click="mobileMenuOpen = false">Features</a>
          <a href="#pricing" class="mobile-link" @click="mobileMenuOpen = false">Pricing</a>
          <div class="mobile-divider"></div>
          <NuxtLink to="/login" class="mobile-link">Sign In</NuxtLink>
          <NuxtLink to="/app/admin/events/create" class="mobile-cta">Get Started Free</NuxtLink>
        </div>
      </Transition>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-gradient"></div>
        <div class="hero-grid"></div>
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </span>
          <span>Mexico's Leading Event Platform</span>
        </div>

        <h1 class="hero-title">
          <span class="title-line">Create Events.</span>
          <span class="title-line accent">Sell Tickets.</span>
        </h1>

        <p class="hero-subtitle">
          The all-in-one ticketing and event management platform built for Mexico.
          Create beautiful event pages, sell tickets online, and grow your audience — all for free.
        </p>

        <div class="hero-actions">
          <NuxtLink to="/app/admin/events/create" class="btn-primary">
            <span>Get started for free</span>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </NuxtLink>
          <a href="#contact" class="btn-secondary">
            <span>Contact Sales</span>
          </a>
        </div>

        <div class="hero-trust">
          <span class="trust-text">Trusted by event organizers across Mexico</span>
          <div class="trust-logos">
            <div class="trust-logo"></div>
            <div class="trust-logo"></div>
            <div class="trust-logo"></div>
            <div class="trust-logo"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stats-inner">
        <div class="stat-item">
          <span class="stat-number">10,000+</span>
          <span class="stat-label">Events Created</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">500K+</span>
          <span class="stat-label">Tickets Sold</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">2,500+</span>
          <span class="stat-label">Event Organizers</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">98%</span>
          <span class="stat-label">Customer Satisfaction</span>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="features-header">
        <span class="section-tag">Features</span>
        <h2 class="section-title">Tools that get your tickets<br>selling faster than ever</h2>
        <p class="section-subtitle">Everything you need to create, promote, and manage successful events</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/>
            </svg>
          </div>
          <span class="feature-tag">Ticketing</span>
          <h3 class="feature-title">Create your event for free</h3>
          <p class="feature-desc">
            Easily create, manage, and deliver memorable in-person or virtual event experiences on a trusted platform.
            Set up beautiful event pages with custom pricing tiers in minutes.
          </p>
          <ul class="feature-list">
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Unlimited free events</span>
            </li>
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Custom event pages</span>
            </li>
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Multiple ticket tiers</span>
            </li>
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Seated & GA events</span>
            </li>
          </ul>
          <NuxtLink to="/app/admin/events/create" class="feature-link">
            <span>Start creating</span>
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
          </NuxtLink>
        </div>

        <div class="feature-card featured">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/>
            </svg>
          </div>
          <span class="feature-tag">Growth</span>
          <h3 class="feature-title">Built for growth</h3>
          <p class="feature-desc">
            Tap into Mexico's largest events marketplace and expand your reach with social marketing tools
            powered by exclusive data insights and audience analytics.
          </p>
          <ul class="feature-list">
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Events marketplace</span>
            </li>
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Social sharing tools</span>
            </li>
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Audience analytics</span>
            </li>
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Revenue insights</span>
            </li>
          </ul>
          <NuxtLink to="/app/admin/events" class="feature-link">
            <span>Explore analytics</span>
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
          </NuxtLink>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
            </svg>
          </div>
          <span class="feature-tag">Community</span>
          <h3 class="feature-title">Build your community</h3>
          <p class="feature-desc">
            Stay connected to your attendees and drive online ticket sales with advanced marketing tools,
            targeted notifications, and real-time insights that get results.
          </p>
          <ul class="feature-list">
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Email campaigns</span>
            </li>
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Push notifications</span>
            </li>
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Attendee profiles</span>
            </li>
            <li>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span>Repeat buyer insights</span>
            </li>
          </ul>
          <NuxtLink to="/app/admin/events" class="feature-link">
            <span>Learn more</span>
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
      <div class="how-inner">
        <div class="how-header">
          <span class="section-tag">How It Works</span>
          <h2 class="section-title">Get started in minutes</h2>
        </div>

        <div class="steps-grid">
          <div class="step">
            <div class="step-number">01</div>
            <div class="step-content">
              <h3>Create your event</h3>
              <p>Set up your event page with all the details — name, date, location, description, and images. It takes less than 5 minutes.</p>
            </div>
          </div>
          <div class="step-connector"></div>
          <div class="step">
            <div class="step-number">02</div>
            <div class="step-content">
              <h3>Set up ticketing</h3>
              <p>Choose your ticket types, set prices, and configure capacity. Support for general admission, seated events, VIP tables, and more.</p>
            </div>
          </div>
          <div class="step-connector"></div>
          <div class="step">
            <div class="step-number">03</div>
            <div class="step-content">
              <h3>Publish & sell</h3>
              <p>Go live and start selling. Share your event link, track sales in real-time, and receive payments directly to your account.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Teaser -->
    <section id="pricing" class="pricing">
      <div class="pricing-inner">
        <div class="pricing-content">
          <span class="section-tag light">Pricing</span>
          <h2 class="pricing-title">Simple, transparent pricing</h2>
          <p class="pricing-desc">
            Create unlimited free events. Only pay a small fee when you sell tickets.
            No monthly subscriptions, no hidden costs.
          </p>

          <div class="pricing-highlights">
            <div class="pricing-item">
              <div class="pricing-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="pricing-text">
                <span class="pricing-label">Free to create</span>
                <span class="pricing-detail">$0 platform fee for free events</span>
              </div>
            </div>
            <div class="pricing-item">
              <div class="pricing-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="pricing-text">
                <span class="pricing-label">Low fees on sales</span>
                <span class="pricing-detail">3.5% + $0.99 per paid ticket</span>
              </div>
            </div>
            <div class="pricing-item">
              <div class="pricing-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="pricing-text">
                <span class="pricing-label">Fast payouts</span>
                <span class="pricing-detail">Get paid within 2-3 business days</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pricing-card">
          <div class="card-header">
            <span class="card-label">Most Popular</span>
            <h3 class="card-title">Pay as you go</h3>
            <p class="card-desc">Perfect for event organizers of all sizes</p>
          </div>
          <div class="card-price">
            <span class="price-amount">$0</span>
            <span class="price-period">to get started</span>
          </div>
          <NuxtLink to="/app/admin/events/create" class="card-cta">
            Start for free
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </NuxtLink>
          <p class="card-note">No credit card required</p>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section id="contact" class="final-cta">
      <div class="cta-inner">
        <div class="cta-content">
          <h2 class="cta-title">Ready to create your next event?</h2>
          <p class="cta-desc">
            Join thousands of event organizers who trust MesaDirectiva to power their events.
            Get started in minutes — no credit card required.
          </p>
          <div class="cta-actions">
            <NuxtLink to="/app/admin/events/create" class="btn-cta-primary">
              <span>Get started for free</span>
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </NuxtLink>
            <a href="mailto:sales@evently.mx" class="btn-cta-secondary">
              <span>Contact Sales</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-main">
          <div class="footer-brand">
            <div class="brand-mark">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" opacity="0.9"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>MesaDirectiva</span>
          </div>
          <p class="footer-tagline">Mexico's leading event ticketing platform. Create, promote, and sell — all in one place.</p>
        </div>

        <div class="footer-links">
          <div class="footer-col">
            <h4>Platform</h4>
            <NuxtLink to="/app/events">Browse Events</NuxtLink>
            <NuxtLink to="/app/admin/events/create">Create Event</NuxtLink>
            <NuxtLink to="/app/admin/events">Dashboard</NuxtLink>
            <a href="#pricing">Pricing</a>
          </div>
          <div class="footer-col">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
            <a href="#careers">Careers</a>
            <a href="#press">Press</a>
          </div>
          <div class="footer-col">
            <h4>Resources</h4>
            <a href="#help">Help Center</a>
            <a href="#guides">Guides</a>
            <a href="#api">API Docs</a>
            <a href="#status">Status</a>
          </div>
          <div class="footer-col">
            <h4>Legal</h4>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-inner">
          <p>&copy; 2025 MesaDirectiva. All rights reserved.</p>
          <div class="footer-social">
            <a href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'default'
})

const mobileMenuOpen = ref(false)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');

.landing {
  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;

  --color-bg: #fafafa;
  --color-bg-alt: #f5f5f5;
  --color-bg-dark: #0c0c0f;
  --color-bg-card: #ffffff;

  --color-text: #0f0f0f;
  --color-text-secondary: #52525b;
  --color-text-muted: #a1a1aa;

  --color-primary: #6366f1;
  --color-primary-light: #818cf8;
  --color-primary-dark: #4f46e5;
  --color-accent: #f97316;

  --color-border: #e4e4e7;
  --color-border-light: #f4f4f5;

  font-family: var(--font-body);
  background: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
}

/* ============================================
   NAVIGATION
   ============================================ */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(250, 250, 250, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brand-mark {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.brand-mark svg {
  width: 20px;
  height: 20px;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.nav-links {
  display: none;
  align-items: center;
  gap: 8px;
}

.nav-link {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.nav-link:hover {
  color: var(--color-text);
  background: var(--color-border-light);
}

.nav-actions {
  display: none;
  align-items: center;
  gap: 12px;
}

.nav-signin {
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.nav-signin:hover {
  color: var(--color-text);
}

.nav-cta {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-cta:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.mobile-toggle {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-toggle span {
  width: 22px;
  height: 2px;
  background: var(--color-text);
  border-radius: 1px;
  transition: all 0.2s ease;
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-link {
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.mobile-link:hover {
  background: var(--color-border-light);
}

.mobile-divider {
  height: 1px;
  background: var(--color-border);
  margin: 12px 0;
}

.mobile-cta {
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: var(--color-primary);
  border-radius: 10px;
  text-decoration: none;
  text-align: center;
  margin-top: 8px;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ============================================
   HERO
   ============================================ */
.hero {
  position: relative;
  padding: 80px 24px 100px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-gradient {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 150%;
  height: 100%;
  background: radial-gradient(ellipse 50% 80% at 50% 0%, rgba(99, 102, 241, 0.08) 0%, transparent 60%);
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 70%);
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  top: 10%;
  left: 10%;
  width: 300px;
  height: 300px;
  background: rgba(99, 102, 241, 0.15);
  animation-delay: 0s;
}

.shape-2 {
  top: 40%;
  right: 5%;
  width: 250px;
  height: 250px;
  background: rgba(249, 115, 22, 0.1);
  animation-delay: -7s;
}

.shape-3 {
  bottom: 10%;
  left: 30%;
  width: 200px;
  height: 200px;
  background: rgba(99, 102, 241, 0.1);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.hero-content {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 8px 12px;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.badge-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
}

.hero-title {
  font-family: var(--font-display);
  font-size: 52px;
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin-bottom: 24px;
}

.title-line {
  display: block;
}

.title-line.accent {
  color: var(--color-primary);
}

.hero-subtitle {
  font-size: 18px;
  line-height: 1.7;
  color: var(--color-text-secondary);
  max-width: 580px;
  margin: 0 auto 40px;
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 48px;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 28px;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}

.btn-primary svg {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.btn-primary:hover svg {
  transform: translateX(3px);
}

.btn-secondary {
  background: white;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-border-light);
  border-color: var(--color-text-muted);
}

.hero-trust {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.trust-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.trust-logos {
  display: flex;
  align-items: center;
  gap: 24px;
  opacity: 0.4;
}

.trust-logo {
  width: 80px;
  height: 28px;
  background: var(--color-text-muted);
  border-radius: 4px;
}

/* ============================================
   STATS
   ============================================ */
.stats {
  padding: 0 24px;
  margin-top: -40px;
  position: relative;
  z-index: 10;
}

.stats-inner {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 40px 32px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.06);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.stat-divider {
  display: none;
  width: 1px;
  background: var(--color-border);
}

/* ============================================
   FEATURES
   ============================================ */
.features {
  padding: 120px 24px;
  max-width: 1280px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-tag {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 100px;
  margin-bottom: 20px;
}

.section-tag.light {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.section-title {
  font-family: var(--font-display);
  font-size: 38px;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--color-text);
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 17px;
  color: var(--color-text-secondary);
  max-width: 500px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.feature-card {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 36px 32px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.08);
  transform: translateY(-4px);
}

.feature-card.featured {
  background: linear-gradient(135deg, #fefefe 0%, #f8f7ff 100%);
  border-color: rgba(99, 102, 241, 0.2);
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.feature-icon svg {
  width: 28px;
  height: 28px;
  color: var(--color-primary);
}

.feature-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-accent);
  margin-bottom: 12px;
}

.feature-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.feature-desc {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 28px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--color-text);
}

.feature-list svg {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  transition: gap 0.2s ease;
}

.feature-link:hover {
  gap: 10px;
}

.feature-link svg {
  width: 18px;
  height: 18px;
}

/* ============================================
   HOW IT WORKS
   ============================================ */
.how-it-works {
  padding: 100px 24px;
  background: var(--color-bg-alt);
}

.how-inner {
  max-width: 1000px;
  margin: 0 auto;
}

.how-header {
  text-align: center;
  margin-bottom: 64px;
}

.steps-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 16px;
}

.step-number {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 800;
  color: var(--color-primary);
  opacity: 0.2;
  line-height: 1;
}

.step-content h3 {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.step-content p {
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.step-connector {
  width: 2px;
  height: 32px;
  background: var(--color-border);
  margin: 0 auto;
}

/* ============================================
   PRICING
   ============================================ */
.pricing {
  padding: 120px 24px;
  background: var(--color-bg-dark);
}

.pricing-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
}

.pricing-content {
  text-align: center;
}

.pricing-title {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.pricing-desc {
  font-size: 17px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  max-width: 480px;
  margin: 0 auto 40px;
}

.pricing-highlights {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.pricing-item {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
}

.pricing-icon {
  width: 40px;
  height: 40px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pricing-icon svg {
  width: 22px;
  height: 22px;
  color: var(--color-primary-light);
}

.pricing-label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin-bottom: 2px;
}

.pricing-detail {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.pricing-card {
  background: white;
  border-radius: 24px;
  padding: 40px 36px;
  text-align: center;
}

.card-header {
  margin-bottom: 32px;
}

.card-label {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 100px;
  margin-bottom: 16px;
}

.card-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.card-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
}

.card-price {
  margin-bottom: 32px;
}

.price-amount {
  font-family: var(--font-display);
  font-size: 56px;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.03em;
}

.price-period {
  display: block;
  font-size: 15px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.card-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px 24px;
  background: var(--color-primary);
  color: white;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-bottom: 16px;
}

.card-cta:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

.card-cta svg {
  width: 18px;
  height: 18px;
}

.card-note {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* ============================================
   FINAL CTA
   ============================================ */
.final-cta {
  padding: 120px 24px;
  background: linear-gradient(180deg, var(--color-bg) 0%, rgba(99, 102, 241, 0.03) 100%);
}

.cta-inner {
  max-width: 700px;
  margin: 0 auto;
}

.cta-content {
  text-align: center;
}

.cta-title {
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.cta-desc {
  font-size: 17px;
  line-height: 1.7;
  color: var(--color-text-secondary);
  max-width: 500px;
  margin: 0 auto 40px;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 32px;
  background: var(--color-primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 14px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
}

.btn-cta-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}

.btn-cta-primary svg {
  width: 20px;
  height: 20px;
}

.btn-cta-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 18px 32px;
  background: transparent;
  color: var(--color-text);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  border: 2px solid var(--color-border);
  border-radius: 14px;
  transition: all 0.2s ease;
}

.btn-cta-secondary:hover {
  border-color: var(--color-text-muted);
  background: white;
}

/* ============================================
   FOOTER
   ============================================ */
.footer {
  background: var(--color-bg-dark);
  padding: 80px 24px 0;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  padding-bottom: 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.footer-brand .brand-mark {
  background: var(--color-primary);
}

.footer-brand span {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: white;
}

.footer-tagline {
  font-size: 15px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.5);
  max-width: 280px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.footer-col h4 {
  font-size: 13px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 20px;
}

.footer-col a {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  padding: 6px 0;
  transition: color 0.15s ease;
}

.footer-col a:hover {
  color: white;
}

.footer-bottom {
  padding: 28px 24px;
}

.footer-bottom-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.footer-bottom p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
}

.footer-social {
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer-social a {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s ease;
}

.footer-social a:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.footer-social svg {
  width: 18px;
  height: 18px;
}

/* ============================================
   RESPONSIVE - TABLET
   ============================================ */
@media (min-width: 640px) {
  .nav-links,
  .nav-actions {
    display: flex;
  }

  .mobile-toggle {
    display: none;
  }

  .hero {
    padding: 120px 40px 140px;
  }

  .hero-title {
    font-size: 68px;
  }

  .hero-actions {
    flex-direction: row;
    justify-content: center;
  }

  .stats-inner {
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    padding: 48px 40px;
  }

  .stat-divider {
    display: block;
  }

  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .steps-grid {
    flex-direction: row;
    align-items: flex-start;
  }

  .step {
    flex: 1;
  }

  .step-connector {
    width: 48px;
    height: 2px;
    margin-top: 80px;
  }

  .pricing-inner {
    grid-template-columns: 1fr 380px;
    gap: 64px;
    align-items: center;
  }

  .pricing-content {
    text-align: left;
  }

  .pricing-highlights {
    margin: 0;
  }

  .cta-actions {
    flex-direction: row;
    justify-content: center;
  }

  .footer-inner {
    grid-template-columns: 1fr 2fr;
  }

  .footer-links {
    grid-template-columns: repeat(4, 1fr);
  }

  .footer-bottom-inner {
    flex-direction: row;
    justify-content: space-between;
  }
}

/* ============================================
   RESPONSIVE - DESKTOP
   ============================================ */
@media (min-width: 1024px) {
  .hero {
    padding: 160px 40px 180px;
  }

  .hero-title {
    font-size: 84px;
  }

  .hero-subtitle {
    font-size: 19px;
  }

  .section-title {
    font-size: 44px;
  }

  .features {
    padding: 160px 40px;
  }

  .feature-card {
    padding: 44px 40px;
  }

  .how-it-works {
    padding: 140px 40px;
  }

  .pricing {
    padding: 160px 40px;
  }

  .final-cta {
    padding: 160px 40px;
  }

  .cta-title {
    font-size: 44px;
  }
}
</style>
