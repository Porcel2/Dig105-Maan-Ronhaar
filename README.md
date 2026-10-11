# Kodu

Kodu (Estonian for home) is a marketplace that connects expats in Estonia with verified local service providers who speak their language. Expats find plumbers, electricians, painters, cleaners, handymen and movers, chat with automatic translation, and pay into escrow that is released once the job is confirmed. Providers get requests, send quotes, manage availability and get paid out weekly or instantly.

This repository holds the course project for DIG105 by Maan Ronhaar.

## Prototype

`prototype/index.html` is a single file, clickable prototype of both sides of the app. Open it in a browser or on a phone.

Expat side: welcome, log in, registration, home, search with filters (category, city and district, language, pricing, date and time, rating), provider profile, request and quote, escrow payment, translated chat, bookings, reviews and profile.

Provider side: registration with verification and payout, home with requests, jobs with a calendar and availability, quoting, translated chat, earnings and payouts, profile.

Every registration step has a Skip that fills sample data. Once logged in, the Expat | Provider switch at the top of the phone jumps between the two apps and keeps each side's state. Reset all under the phone clears everything.

## Structure

```
prototype/index.html        built, self contained app
prototype/src/shell.html    styles, shared screens, onboarding
prototype/src/expat.js      expat screens and sample providers
prototype/src/provider.js   provider screens and scripted customers
prototype/data/providers.json   414 fictional providers across ten Estonian cities
tools/gen_providers.py      regenerates providers.json
tools/build.py              rebuilds prototype/index.html from src
```

Rebuild after editing the sources:

```
python3 tools/gen_providers.py   # optional, regenerates the provider data
python3 tools/build.py
```

## Brand

Mint `#BFE3D6`, Ink `#16201D`, Terracotta `#D9643A`, Deep green `#0E5A4C`, Ivory `#F6F2EA`. Headings in Sora, body in DM Sans. The logo system, app icons, splash screens, component library and screen mockups live on the Claude Design canvas linked in the project notes.

All names, reviews and numbers in the prototype are fictional.
