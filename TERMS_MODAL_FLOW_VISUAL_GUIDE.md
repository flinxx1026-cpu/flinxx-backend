# Terms & Conditions Login Flow - Visual Guide

## Login Page Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    User on Login Page                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
    ┌───▼────────────┐         ┌─────▼─────────────┐
    │ Click Google   │         │ Click Facebook    │
    │ Login Button   │         │ Login Button      │
    └───┬────────────┘         └──────┬────────────┘
        │                             │
        │ Check localStorage         │ Check localStorage
        │ for "termsAccepted"        │ for "termsAccepted"
        │                             │
    ┌───┴────────────────────────────┴────────────────┐
    │                                                  │
┌───▼────────────────┐                    ┌──────────▼──────────┐
│ Terms Already      │                    │ Terms NOT Yet       │
│ Accepted?          │                    │ Accepted?           │
│ (termsAccepted     │                    │ (termsAccepted      │
│  = 'true')         │                    │  = null/missing)    │
└───┬────────────────┘                    └──────────┬──────────┘
    │                                                  │
    │ YES                                             │ NO
    │                                                  │
┌───▼─────────────────────┐                ┌─────────▼────────────┐
│ Proceed Directly        │                │ Show Terms Modal     │
│ to OAuth Login          │                │ "Before you continue"│
│ (Google/Facebook)       │                │                      │
└───────────────────────┬─┘                └──────────┬───────────┘
                        │                             │
                        │                ┌────────────┴────────────┐
                        │                │                         │
                        │         ┌──────▼────────┐      ┌────────▼──────┐
                        │         │ Click Cancel  │      │ Click Continue│
                        │         │ in Modal      │      │ in Modal      │
                        │         └───┬───────────┘      └────────┬──────┘
                        │             │                          │
                        │             │                  ┌───────▼───────┐
                        │             │                  │ Save to       │
                        │             │                  │ localStorage: │
                        │             │                  │ termsAccepted │
                        │             │                  │ = 'true'      │
                        │             │                  └───────┬───────┘
                        │             │                          │
                        │             │                  ┌───────▼────────┐
                        │             │                  │ Close Modal    │
                        │             │                  │ & Redirect to  │
                        │             │                  │ OAuth Login    │
                        │             │                  └───────┬────────┘
                        │             │                          │
        ┌───────────────┴─────────────┴──────────────────────────┤
        │                                                          │
    ┌───▼──────────────────┐                          ┌──────────▼──────┐
    │ Nothing Happens      │                          │ Google/Facebook │
    │ Modal Closes         │                          │ OAuth Login     │
    │ User stays on Login  │                          │ Consent Screen  │
    │ Page                 │                          └─────────────────┘
    └──────────────────────┘
```

---

## Dashboard Access Flow

```
┌──────────────────────────────────────┐
│ User Navigates to /chat              │
│ (or OAuth redirect after successful  │
│  authentication)                     │
└──────────────┬───────────────────────┘
               │
        ┌──────▼──────────────────┐
        │ Chat Component Mounts   │
        │ (First useEffect Runs)  │
        └──────┬───────────────────┘
               │
        ┌──────▼──────────────────────────┐
        │ Check localStorage:              │
        │ localStorage.getItem(            │
        │  'termsAccepted'                │
        │ ) === 'true'                    │
        └──────┬───────────────────────────┘
               │
    ┌──────────┴────────────────┐
    │                           │
┌───▼─────────────────┐   ┌────▼──────────────┐
│ Terms Accepted?     │   │ Terms Accepted?    │
│ YES                 │   │ NO                 │
└───┬─────────────────┘   └────┬───────────────┘
    │                           │
    │ Set:                       │ Show TermsConfirmationModal
    │ termsCheckComplete=true    │
    │                           │ Set: showTermsModal=true
    │ Render Full Chat UI        │
    │                           │ Display: "Before you continue"
    │                           │ Modal
    │                           │
    │                      ┌────┴────────────────┐
    │                      │                     │
    │              ┌───────▼──────┐  ┌──────────▼──────┐
    │              │ Click Cancel │  │ Click Continue  │
    │              │              │  │                 │
    │              │ Redirect to  │  │ Save to         │
    │              │ /login       │  │ localStorage:   │
    │              │              │  │ termsAccepted   │
    │              └──────────────┘  │ = 'true'        │
    │                                 │                 │
    │                                 │ Set:            │
    │                                 │ showTermsModal  │
    │                                 │ = false         │
    │                                 │ termsCheck      │
    │                                 │ Complete = true │
    │                                 │                 │
    │                                 │ Render Full     │
    │                                 │ Chat UI         │
    │                                 └────────────────┘
    │
    └───────────────────────────────────────┐
                                           │
                              ┌────────────▼──────────────┐
                              │ Dashboard Fully Loaded    │
                              │ User can chat             │
                              └───────────────────────────┘
```

---

## localStorage State Diagram

```
┌─────────────────────────────────────────────────┐
│ localStorage States                             │
└─────────────────────────────────────────────────┘

┌─ State 1: Before Login ──────────────────────┐
│ {                                             │
│   // termsAccepted is NOT SET or null        │
│   other_keys: { ... }                        │
│ }                                            │
│                                              │
│ Result:                                      │
│ - Click Google/Facebook → Shows Modal        │
│ - Visit /chat → Shows Modal                  │
└──────────────────────────────────────────────┘

                    ↓↓↓
             [User Accepts Terms]
                    ↓↓↓

┌─ State 2: After Terms Accepted ──────────────┐
│ {                                             │
│   termsAccepted: 'true',                     │
│   user: { ... },                             │
│   authProvider: 'google',                    │
│   other_keys: { ... }                        │
│ }                                            │
│                                              │
│ Result:                                      │
│ - Click Google/Facebook → Direct to OAuth    │
│ - Visit /chat → Shows Dashboard               │
└──────────────────────────────────────────────┘

                    ↓↓↓
        [User Clears Browser Data]
                    ↓↓↓

┌─ State 1 Again: Before Login ────────────────┐
│ (Cycle repeats)                              │
└──────────────────────────────────────────────┘
```

---

## Timeline: First-Time User to Dashboard

```
TIME    EVENT                                    STORAGE               DISPLAY
────────────────────────────────────────────────────────────────────────────────
0:00    User arrives at /login                  [empty]              Login Page
0:05    User clicks "Continue with Google"      [empty]              Terms Modal
0:10    User reads terms                        [empty]              Terms Modal
0:15    User clicks "Continue" in modal         [empty]              (brief flash)
0:16    acceptTerms() called                    termsAccepted        Google OAuth
                                                 = 'true'             Screen
                                                                      (redirected)
0:45    User authorizes on Google              termsAccepted         (loading)
                                                 = 'true'
0:50    OAuth callback: /auth-success          termsAccepted         Redirect to
                                                 = 'true'             /chat
0:51    Chat component mounts                  termsAccepted         (check terms)
                                                 = 'true'
0:52    Terms check passes                     termsAccepted         Chat
                                                 = 'true'             Dashboard
                                                                      Loaded!
────────────────────────────────────────────────────────────────────────────────

Current Session: User stays on /chat
Next Session:    User returns to /chat
                 → Check finds termsAccepted='true'
                 → Dashboard loads immediately
                 → No modal shown
```

---

## Returning User Timeline

```
TIME    EVENT                                    STORAGE               DISPLAY
────────────────────────────────────────────────────────────────────────────────
0:00    User returns to app (/chat)             termsAccepted         (loading)
                                                 = 'true'
0:01    Chat component mounts                   termsAccepted         (check terms)
                                                 = 'true'
0:02    Terms check passes                      termsAccepted         Chat
                                                 = 'true'             Dashboard
                                                                      Loaded!
────────────────────────────────────────────────────────────────────────────────

No modal shown - instant access!
```

---

## Error Scenarios

```
SCENARIO 1: localStorage Unavailable (Private Browsing)
├─ Check localStorage → Error caught
├─ setTermsCheckComplete = true (allow access)
└─ Result: Dashboard loads (graceful fallback)

SCENARIO 2: User Clears localStorage Manually
├─ termsAccepted is deleted
├─ User visits /chat
├─ Check finds no termsAccepted
├─ Modal appears again
└─ Result: User must accept again (re-verification)

SCENARIO 3: User Opens Multiple Tabs
├─ Tab 1: Accept terms → localStorage updated
├─ Tab 2: Auto-detects via storage events
└─ Result: All tabs in sync

SCENARIO 4: Browser Back Button After OAuth Redirect
├─ User clicks back
├─ Modal appears again
├─ User can cancel or re-accept
└─ Result: Secure, no uncontrolled navigation
```

