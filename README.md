# Hugh E. Jones website

The site is built with Quarto and published to GitHub Pages by
`.github/workflows/publish.yml`.

## Publishing

Commit changes to the `.qmd` pages, configuration, or static assets and merge
them into `master`. GitHub Actions renders the site and deploys `_site/`
automatically. Pull requests run the same render without deploying.
The workflow can also be run manually on `master` from the Actions tab.
Generated `_site/` and legacy `docs/` output should not be committed.

## Local preview

Install Quarto 1.4.551 (the version pinned in the workflow), then run
`quarto preview`. For a production build, run `quarto render`.
If Quarto skips rendering in a checkout under a hidden directory such as
`.copilot`, preview from a separate clone outside that directory.
CI checks out the repository in a normal directory and does not need this
workaround.

## Updating MassSpecToolkit components

Until package-release downloads are integrated, sync a local toolkit build:

```powershell
uv run scripts\sync_toolkit.py --toolkit C:\path\to\MassSpecToolkit --build
```

`--build` runs the toolkit build (including Wasm generation) and its browser
ESM build. To sync an existing browser build instead, omit `--build`; it uses
`dist/browser/`. Set `MS_TOOLKIT_PATH` instead of supplying `--toolkit` if
preferred.

The sync copies the complete browser ESM distribution (including chunks and
worker/Wasm assets) while leaving package declaration files out. Without
`--build`, it uses an existing `dist/browser/` build. Commit the updated
`tools/ms-toolkit/` assets. Publishing does not require a local Quarto render or
committing generated HTML.
