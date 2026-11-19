# Portfolio content

Everything shown on the site comes from the files in this folder. Edit them and rebuild — no code changes needed.

| File | What it controls |
|---|---|
| `profile.json` | Name, title, summary, hero stats, story, education, achievements, social links |
| `experience.json` | Company and the role-by-role timeline |
| `skills.json` | Skill groups |
| `projects/NN-name.json` | One file per project. Cards appear in filename order (`01-`, `02-`, …). |

## Adding a project
Copy an existing file in `projects/`, give it the next number, and change `slug` to something unique.

Required: `slug`, `title`, `tagline`, `client`, `period`, `role`, `summary`, `overview`, `tech`, `contributions`, `achievements`.
Optional: `ongoing` (shows the "Ongoing" badge), `stats` + `statsNote` (commit numbers), `workSplit` (backend/frontend bar), and `layer` on each contribution (`"Backend"`, `"Frontend"` or `"Full-stack"`).

If a required field is missing, the build stops and names the file.

## Rules
- Project names as on the resume; general names for projects not on the resume.
- Dates follow the resume. Projects not on the resume use their git dates.
- No email or phone number on the public site.
