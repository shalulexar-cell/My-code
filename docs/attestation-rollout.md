# QuickDocs Attestation Hub — rollout notes (17 October 2026)

## Implemented
- Expanded the existing MOFA service page with official-route guidance.
- Added four dedicated attestation landing pages: Indian, degree, marriage and birth certificates.
- Added a client-side requirement checker at /tools/attestation-checker.html.
- Added links from homepage, MOFA, family visa, newborn, equivalency, and blog pages.
- Added new canonical sitemap entries (38 -> 43 URLs).
- Added consent-gated, PII-minimising event hooks to public content pages.
- Updated privacy policy to disclose optional analytics.

## Analytics configuration — required before tracking can transmit
The new `assets/qd-analytics-config.js` has an intentionally empty GA4 Measurement ID. The site does not load Google Analytics until you put a valid `G-...` ID into that file **and** the visitor opts in. Configure this only after checking the following:
1. Confirm that the property is owned by QuickDocs and not already injected by hosting or a tag manager (avoid duplicate tracking).
2. **Disable automatic enhanced-measurement outbound-link clicks in the GA4 web stream settings** before enabling it. Some WhatsApp links contain prefilled messages and may include customer details; GA4 must not collect their URLs as `link_url`.
3. Verify in GA4 DebugView that custom events contain only `service`, `source`, and `page_path`, never WhatsApp URL/text, name, phone, email, passport number, or certificate content.
4. Review UAE privacy and consent obligations. An explicit opt-in notice is presented only when the measurement ID is configured.
5. Count `whatsapp_click` as click intent, not a verified lead. Use verified inbound messages to track conversions; do not call these events `generate_lead` automatically.

Supported events: `whatsapp_click`, `quote_request_click`, `phone_click`, `email_click`, `attestation_checker_start`, `attestation_checker_complete`.

## Deployment
1. Run `node tests/attestation.test.cjs` from the repository root.
2. Stage in a preview environment and visually test on iPhone/Android/tablet/desktop (not yet visually tested).
3. Test all three checker issuing-country choices, all certificate types and both destinations; verify WhatsApp prefilled text.
4. Confirm that the existing family visa calculators still work correctly with their unchanged fee logic.
5. Verify rich results/schema using official validation tooling; confirm 43 unique sitemap URLs and matching canonicals.
6. Review all authority statements and ensure QuickDocs offers the exact routes advertised.
7. Confirm GA4 consent and disable enhanced outbound URL collection **before** adding a Measurement ID.
8. Merge to `main` only after approval. This feature branch does not publish the site.

## Official references used
- UAE MOFA Document Attestation: https://www.mofa.gov.ae/en/Services/Attestation
- Embassy of India Attestation: https://www.indembassyuae.gov.in/page/attestation-services/
- 2026 outsourced Indian consular services: https://www.indembassyuae.gov.in/section/press-releases/outsourcing-of-indian-consular-passport-visa-and-attestation-services-in-uae6/
