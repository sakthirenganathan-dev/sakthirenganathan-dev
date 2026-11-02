# SHINOBI — setup guide

## 1. Create the profile repository
Create a **public** repository named exactly `sakthirenganathan-dev`. GitHub displays its `README.md` on your profile.

## 2. Upload the files
Upload `README.md`, the complete `assets/` directory and `.github/workflows/profile-city.yml` to the repository root.

## 3. Enable Actions
Open **Settings → Actions → General** and allow actions. Ensure the workflow has read/write repository permissions under **Settings → Actions → General → Workflow permissions**.

## 4. Run the contribution workflow
Open **Actions → Update Shinobi Contribution City → Run workflow**. The workflow generates the `profile-3d-contrib/` output and commits it. The first run can take a little while.

## 5. Personal anime avatar
The current package uses a custom Rinnegan-inspired vector identity, not a likeness of your face. To make the avatar genuinely look like you, provide one clear front-facing photo. The art can then be created as an original anime-style avatar and embedded as an asset.

## 6. Before publishing
- Verify your preferred public contact details.
- Confirm your portfolio URL and LinkedIn URL.
- Review each linked project and its description.
- Keep the repository public for the profile README to appear.

## Rendering notes
GitHub README sanitizes HTML and SVG. This package uses inline SVG artwork and SMIL animation; browser/GitHub rendering can differ. Test the uploaded version on GitHub desktop and mobile. Avoid scripts, external CSS and JavaScript: they do not run in a README.
