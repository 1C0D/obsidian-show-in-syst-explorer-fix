# Obsidian Sample Plugin Modif

multifiles in src folder  
i18next

### package.json

- `npm start` -> opening main.ts in VSC + npm install + npm run dev
- `npm run startf` -> opening src folder in VSC + npm install + npm run dev
- `npm run acp` -> add + commit + push. with a prompt asking for the commit name 
- `npm run version` -> new version, with prompt asking for version update option:
  - patch(1.0.1)
  - minor(1.1.0)
  - major(2.0.0) 
  version updated in local manifest, package and versions 
    + add, commit, push, with a commit name as "updated to version x.x.x(the new version)" 