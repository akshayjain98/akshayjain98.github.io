# Portfolio content

Everything shown on the site comes from the files in this folder. Edit them and rebuild — no code changes needed.

| File | What it controls |
|---|---|
| `profile.json` | Name, title, summary, hero stats, story, education, achievements, social links. Optional: `photo` (e.g. `"/profile.jpg"`, file in `public/`), `openTo` (availability badge in the hero, empty = hidden), `siteUrl` (your live domain, used for link previews) |
| `experience.json` | List of employers (`type`: `"Full-time"` or `"Part-time"`), each with a role-by-role timeline |
| `skills.json` | Skill groups |
| `projects/NN-name.json` | One file per project. Cards appear in filename order (`01-`, `02-`, …). |

## Adding a project
Copy an existing file in `projects/`, give it the next number, and change `slug` to something unique.

Required: `slug`, `title`, `tagline`, `client`, `period`, `engagement` (`"Full-time"`, `"Part-time · Freelance"` or `"Hourly · Freelance"`), `categories` (any of `"AI"`, `"Full-stack"`, `"Backend"`, `"Frontend"`, `"Data"`, used by the filters), `role`, `summary`, `overview`, `tech`, `contributions`, `achievements`.
Optional: `ongoing` (shows the "Ongoing" badge), `stats` + `statsNote` (commit numbers), `workSplit` (backend/frontend bar), and `layer` on each contribution (`"Backend"`, `"Frontend"` or `"Full-stack"`).

If a required field is missing, the build stops and names the file.

## Rules
- Project names as on the resume; general names for projects not on the resume.
- Dates follow the resume. Projects not on the resume use their git dates.
- No email or phone number on the public site.

## Resume
`/resume` is generated from these same files, so it is always in sync. "Download PDF" uses the browser's Save-as-PDF.
It shows the first 4 bullet points of each role.

## Sharing a project
Opening a project changes the URL to `/#project=<slug>`; that link opens the case study directly.
