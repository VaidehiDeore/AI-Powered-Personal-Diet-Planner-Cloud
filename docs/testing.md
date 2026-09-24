# Testing Strategy

## Automated

Run:

```bash
cd backend
pytest -q
```

Current automated coverage includes calculation logic, diet filtering, plan structure, health endpoint, profile save, targets and plan generation.

## Manual / integration checklist

| ID | Scenario | Expected |
|---|---|---|
| T01 | New registration | Account created |
| T02 | Existing email | Registration rejected |
| T03 | Valid login | User reaches dashboard |
| T04 | Invalid login | Authentication error |
| T05 | Protected route | Unauthenticated user is redirected |
| T06 | Profile creation | Profile saved |
| T07 | Plan generation | Plan returned and saved |
| T08 | Vegetarian preference | Non-vegetarian foods excluded |
| T09 | Vegan preference | Dairy/egg/non-vegan foods excluded |
| T10 | Different goal | Target estimate changes |
| T11 | AI/ML service unavailable | Local baseline remains usable |
| T12 | Saved plan retrieval | Only current user's plans returned |
| T13 | File upload | Valid demo file accepted |
| T14 | Invalid file | Rejected |
| T15 | User isolation | User cannot access another user's records |
| T16 | Logout | Session ends |

Record Actual Result and Pass/Fail only after running the test.
