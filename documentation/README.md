# Kodu Research and User Testing

This folder holds the interview notes, empathy map summaries and usability test logs behind the Kodu prototype. The prototype itself was built with Claude rather than Lovable.ai; its code lives in [/prototype/](../prototype/).

## Research so far
* Empathy maps for two personas: Sofia, an exchange student from Madrid renting in Kesklinn, and Mart, a Tallinn plumber who loses expat customers because of language and payment risk.
* Competitor teardown of TaskRabbit, Yoojo and Facebook expat groups (see [/miro-boards/](../miro-boards/)).
* Customer journey map for the expat side.

## Interview transcript template
Copy this block for every interview and save it as `interviews/<date>-<role>-<initials>.md`.

```
# Interview: <role> (expat or provider), <initials>
* Date:
* Length:
* Language of interview:
* Profile: nationality, time in Estonia, city and district, housing situation (rented, owned, shared), languages spoken with level

## Questions and answers
1. Tell me about the last time something broke at home. What did you do?
2. How did you find someone to fix it? What went wrong?
3. How did you communicate with them? Where did language get in the way?
4. How did you pay, and did you feel safe doing it?
5. What would have made the whole thing easier?

## Pains
*
## Gains
*
## Says / Does
*
## Quotes worth keeping
*
```

## User test log template
Copy this block for every session and save it as `tests/<date>-<initials>.md`.

```
# User test: <initials>, <expat or provider>
* Date:
* Device: phone or desktop
* Prototype version: commit hash or date
* Facilitator:

## Tasks
| # | Task given | Completed | Time | Where they hesitated or failed |
|---|------------|-----------|------|--------------------------------|
| 1 | Register as an expat and set your languages | | | |
| 2 | Find a plumber who speaks your language in your district | | | |
| 3 | Request a quote for a leaking tap for Tuesday morning | | | |
| 4 | Read the quote and pay into escrow | | | |
| 5 | Confirm the job is done and leave a review | | | |

## Observations
*
## Quotes
*
## Severity of issues found
| Issue | Severity (1 cosmetic to 4 blocking) | Fix planned |
|-------|-------------------------------------|-------------|
| | | |

## Decisions after the session
*
```

## Planned Sprint 1 tests
Three expats (different native languages, at least one with no Estonian) and two providers, each walking through the five tasks above on the prototype. Results are logged here and summarised in the Sprint 2 video diary.
