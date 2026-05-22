---
"@codewithagents/api-errors": patch
---

fix: skip null/unknown values in RFC 7807 errors map instead of stringifying them

Also adds test coverage for all previously untested edge cases and expands the README with fetch integration, typed RHF, options on mapApiErrors, and a note on multiple errors per field.
