# Kodu Design System

Version 1.0, 8 November 2026. Covers the prototype in [/prototype/](../../prototype/). A visual reference with live components is in [index.html](./index.html).

Kodu should feel calm, trustworthy and local: warm ivory backgrounds, a deep Baltic green for trust, and one terracotta accent kept for money moments. Screens are uncluttered so the language and trust signals stand out.

## 1. Principles
1. **Trust is visible.** Verification, escrow and language match are shown where the decision is made, not buried in settings.
2. **Money moments are unmistakable.** Terracotta is used only for paying, so the user always knows when money moves.
3. **Every language is first class.** Layouts allow for text 30 percent longer than English, and translated text always shows its original.
4. **One clear action per screen.** Each screen has one primary button, pinned to the bottom on phones.
5. **Same app, two sides.** Expats and providers share every component. Providers get a Provider tag next to the logo.

## 2. Brand
**Name.** Kodu, Estonian for home. Written in lower case in the logo (kodu) and capitalised in sentences (Kodu).

**Logo mark.** A house in ink (#16201D) with a K cut through it in mint or ivory, and a terracotta dot as the window. Minimum size 24 px high. Keep clear space of half the mark's height on all sides. Do not recolour the dot, rotate the mark or place it on busy photos.

**Voice.** Plain, warm and direct. Short sentences, no jargon, no exclamation marks in system messages. Say what happens next: "Released to Mart when you confirm the job" rather than "Funds pending".

## 3. Colour

| Token | Hex | Use |
|---|---|---|
| `--ink` | #16201D | Primary text, dark surfaces, selected chips, logo |
| `--green` | #0E5A4C | Primary buttons, success pills, links, progress |
| `--mint` | #BFE3D6 | Soft buttons, info notes, highlights, logo cut on dark |
| `--terra` | #D9643A | Payment buttons only, logo dot, error borders |
| `--yellow` | #F2C14E | In review and waiting pills, Top rated badge |
| `--ivory` | #F6F2EA | Screen background |
| `--ground` | #E9E4DA | Page behind the app on desktop, tracks, segmented controls |
| `--white` | #FFFFFF | Cards, inputs, chips |
| `--line` | #D8D2C6 | Borders and dividers |
| `--body` | #3B4541 | Body copy |
| `--muted` | #56605C | Secondary text, captions |
| `--err` | #C2451C | Error text |
| Error surface | #F9DED3 with #9C3517 text | Disputes, rejected checks |
| Warning surface | #FFFBF2 with #E4BE73 border | Change orders waiting for approval |

**Contrast (WCAG 2.2).** Ink on ivory 14.9:1, body on white 9.9:1, muted on ivory 5.8:1, white on green 8.1:1, ink on mint 12.1:1, ink on yellow 9.9:1, error text on white 5.1:1: all pass AA. **White on terracotta is 3.6:1**, which passes only for large text. Payment buttons use 17 px bold text, so the next version should darken the button to **#BA502B (4.9:1)** while keeping #D9643A for the logo dot.

## 4. Typography

| Role | Font | Size and weight | Notes |
|---|---|---|---|
| Display (landing) | Sora | 54 px, 700, line height 1.05 | Desktop landing only |
| Title | Sora | 28 px phone, 30 px desktop, 700 | Letter spacing −0.02em |
| Section heading | Sora | 17 px, 700 | Card and section titles |
| Figures | Sora | 17 to 32 px, 700 | Prices, totals, stats |
| Body | DM Sans | 15 to 16 px, 400 to 500 | Line height 1.45 |
| Secondary | DM Sans | 13 px, 400 | Captions, help text |
| Labels and pills | DM Sans | 12 to 13 px, 700 | Field labels, status pills |

Both fonts are free on Google Fonts. Prices always use Sora so numbers read as figures. Never set body text below 13 px.

## 5. Spacing, shape and elevation
**Spacing scale:** 4, 6, 8, 10, 12, 14, 16, 18, 20, 24 px. Screens use a 20 px side margin on phones and 48 to 64 px on desktop, with 18 px between blocks.

| Element | Radius |
|---|---|
| Buttons and pills | Full (half the height) |
| Cards and provider cards | 20 px |
| Inputs, photo tiles, day pickers | 14 px |
| Notes, time slots | 12 px |
| Chat bubbles | 18 px, with a 4 px corner on the sender's side |

Elevation is mostly flat: white cards with a 1 px `--line` border on ivory. Shadows are reserved for floating layers such as toasts, sheets and the presenter bar.

## 6. Layout and breakpoints
1. **Phone (up to 899 px):** single column, 390 by 844 reference frame, bottom navigation with five items, primary action pinned in a footer.
2. **Desktop (900 px and up):** fixed left sidebar of 220 px replaces the bottom navigation, content up to 1080 px wide, cards in two column grids, chat in two panes with the conversation list on the left.
3. Touch targets are at least 44 by 44 px.

## 7. Iconography
Twenty line icons drawn on a 24 px grid with a 1.8 px stroke and round caps and joins: back, check, globe, home, shield, lock, pin, plus, eye, user, search, filter, calendar, chat, star, send, flag, sparkle, wrench, truck. Icons sit inside 36 to 44 px rounded squares (`.eic`) when they lead a row. Category icons: Plumbing home, Electrical check, Painting star, Cleaning sparkle, Handyman wrench, Moving truck.

## 8. Components

### Buttons
| Variant | Class | Look | Use |
|---|---|---|---|
| Primary | `.btn.p` | Green, white text | The main action on a screen |
| Pay | `.btn.a` | Terracotta, lock icon | Paying or approving money only |
| Soft | `.btn.g` | Mint, ink text | Secondary actions such as Chat or Add |
| Outline | `.btn.s` | Transparent, 1.5 px ink border | Cancel, Back, Decline |
| Small | `.sm` | 44 px high, 15 px text | Inside cards |
| Link | `.link` | Green text | Inline actions such as See all |

Height 56 px, full width on phones, 28 px radius. Disabled buttons drop to 40 percent opacity.

### Inputs and selection
1. **Text field** (`.f` with `.in`): label above, 52 px white field, 14 px radius. Errors turn the border terracotta and add red text below.
2. **Chip** (`.chip`): 36 px filter or option. Selected chips turn ink with white text.
3. **Segmented control** (`.segm`): two or three options on a ground track, for example Fixed price, Price range, Site visit first.
4. **Toggle** (`.tog`): 52 by 32 px, green when on.
5. **Radio** (`.radio`): 22 px circle for single choices such as payment method or cancellation policy.
6. **Day and slot pickers** (`.day`, `.slot`): 44 by 60 px day tiles and 40 px time slots. Unavailable days are faded.
7. **Photo tile** (`.photo`): dashed 92 px square with a plus. Turns green with a check once added.

### Status and feedback
1. **Pills** (`.pill`): ok green for paid or verified, rev yellow for waiting or in review, err for problems, gray for neutral, dark for counts.
2. **Note** (`.note`): mint info box with a 16 px icon. Used for escrow, translation and privacy explanations.
3. **Toast**: dark bar at the bottom, 2.5 seconds, confirms an action in one short sentence.
4. **Progress bar** (`.bar`): 8 px track for steps, profile strength and release timers.
5. **Empty state** (`.empty`): icon, one line title, one line explanation and an action. Never a dead end.

### Trust elements
1. **Badges:** Verified ID (green shield), Licensed (mint check), Top rated (yellow star), Insured (green pill), Escrow protected (green lock).
2. **Language chip** (`.lc`): language code and level, such as EN C1. Highlighted when it matches the viewer.
3. **Translation line:** "Translated ES ⇄ ET automatically" above chats, and the original text in small type under each message.

### Composite components
1. **Provider card** (`.pc`): avatar initials, name with shield, trade and district, rating, price per hour or per job, language chips, why it matches, reply time and View.
2. **Quote card** (`.qcard`): green border bubble in chat with the total, what it includes, the slot and actions.
3. **Change order card** (`.cocard`): warm surface with the extra amount, reason, photo and Approve or Decline.
4. **Service menu row** (`.mrow`): job name, duration, fixed price and Book.
5. **Portfolio tile** (`.ptile`): square photo with a Before and after tag, caption, district and date.
6. **Review card** with an optional provider reply block (`.rreply`) with a green left border.
7. **Insight blocks:** KPI tiles (`.kpi`), horizontal bars (`.ibar`), price range marker (`.prange`) and the demand heat grid (`.heat`).
8. **Navigation:** bottom bar on phones, left sidebar on desktop, with unread badges.

## 9. Motion
1. Screens slide in 24 px from the right over 0.28 s, ease out, and back the other way.
2. Bars and charts grow from zero over 0.9 s when they appear.
3. Toasts fade in and out.
4. Everything respects the reduced motion setting.

## 10. Accessibility checklist
1. Text contrast at least 4.5:1, and 3:1 for large text and icons.
2. Every icon button has an aria label, such as Back or Report this profile.
3. Status is never shown by colour alone: pills always carry a word.
4. Forms keep labels visible above fields and explain errors in words.
5. Text can grow to 200 percent without breaking layouts.
6. Machine translation is labelled and the original is always available.

## 11. Using these tokens in code
```css
:root{
  --ink:#16201D; --green:#0E5A4C; --mint:#BFE3D6; --terra:#D9643A;
  --yellow:#F2C14E; --ivory:#F6F2EA; --ground:#E9E4DA; --white:#FFFFFF;
  --line:#D8D2C6; --body:#3B4541; --muted:#56605C; --err:#C2451C;
}
body{font-family:'DM Sans',sans-serif;color:var(--ink);background:var(--ivory)}
h1,h2,.figure{font-family:'Sora',sans-serif;font-weight:700;letter-spacing:-.02em}
```
