# sophie-blue — project guide

Interior architect portfolio with an API-backed gallery, category filters, administrator login and upload/delete interfaces.

## Scope and source

This guide describes the default branch `main` reviewed on 3 October 2026. Commands were checked against committed manifests and configuration; applications and external integrations were not executed as part of this documentation update.

## Repository map

- `FrontEnd/index.html`
- `FrontEnd/script/base.js`
- `Backend/app.js`
- `Backend/server.js`
- `Backend/config/db.config.js`
- `Backend/swagger.yaml`

## Prerequisites and local use

Clone the repository and enter its root directory:

```sh
git clone https://github.com/sarabranco92/sophie-blue.git
cd sophie-blue
```

Use a modern browser. No npm install is required for the static frontend. With Python installed, serve the site locally:

```sh
cd "FrontEnd"
python -m http.server 8000
```

On Windows, use `py -m http.server 8000` if `python` is unavailable. Open http://localhost:8000/. This is a local preview server, not production hosting.

### Backend

```sh
cd Backend
npm install
npm start
```

The default port is 5678. Keep this terminal running. Serve `FrontEnd/` in another terminal. Configure backend token secrets referenced by the authentication code using local environment settings; do not reuse demo credentials for a live site. Existing demo account instructions are in [Backend/ReadMe.md](../Backend/ReadMe.md).

## Configuration and implementation notes

The frontend currently uses `http://localhost:5678` in its API calls. Changing the backend PORT alone does not update those URLs. SQLite is stored at `Backend/database.sqlite` when started from `Backend/`. The backend test script is a placeholder that exits with an error.

## Verification checklist

With the backend running, load projects and categories, filter the gallery, sign in with the documented demo account, and use a disposable image to check upload/delete. Inspect Swagger at http://localhost:5678/api-docs/.

No dedicated automated test/spec files were found in the reviewed application tree. Where a test script exists, its presence alone does not establish test coverage.

## Maintenance

Keep this guide in sync when routes, commands, environment variables or hosting paths change. Use development databases/accounts for integration checks. Keep private credentials in server-side environment configuration and out of documentation. No new license or ownership terms are introduced by this guide; retain existing repository notices.
