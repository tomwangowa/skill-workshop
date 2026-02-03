---
description: Based on the user's PR summary, decide whether it needs a review or a test and explain why.
---

# Output

A JSON result as below:
```
{
  "need_review": true | false,
  "need_tests": true | false,
  "reason": "A sentence describing why, and why not need review or test."
}
```