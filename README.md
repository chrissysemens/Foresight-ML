<p align="center">
	<img src="apps/web/public/logo.png" alt="Foresight ML logo" width="180" />
</p>

<h1 align="center">Foresight ML</h1>

<p align="center">
	A machine learning workspace for profiling datasets, training prediction models, and generating predictions from CSV data.
</p>

## Overview

Foresight ML turns a CSV dataset into a guided modeling workflow. The web app provides the interactive experience for uploading data, reviewing its profile, configuring a target, training a model, and producing predictions. The CLI and shared packages expose the same core workflow for local and scripted use.

## Monorepo structure

This repository uses npm workspaces:

```text
apps/
	web/       Next.js dashboard and API routes
	cli/       Command-line workflows for profiling, training, and prediction
packages/
	core/      Dataset parsing, profiling, experiments, and shared types
	ml/        Preprocessing, model training, and prediction services
```

## Setup

Requirements: Node.js 20 or newer and npm.

```bash
npm install

# Build the shared packages used by the apps
npm run build --workspace @predict-flow/core
npm run build --workspace @predict-flow/ml
```

## Web app

Start the local dashboard at [http://localhost:3000](http://localhost:3000):

```bash
npm run dev --workspace web
```

Useful checks:

```bash
npm run lint --workspace web
npm run build --workspace web
```

The web workflow accepts training and prediction CSV files, profiles the training data, trains a model, and lets you review or download prediction results.

## CLI

The CLI reads and writes files under `apps/cli/data` and `apps/cli/output`.

```bash
npm run profile --workspace cli
npm run train --workspace cli
npm run predict --workspace cli
```

Use the CLI when you want to run the data workflow from a terminal or automate it in a script. Adjust the input and output paths in the CLI source or command options as the workflow evolves.

## Shared packages

Build or type-check the reusable packages independently:

```bash
npm run build --workspace @predict-flow/core
npm run typecheck --workspace @predict-flow/core

npm run build --workspace @predict-flow/ml
npm run typecheck --workspace @predict-flow/ml
```

`@predict-flow/core` owns CSV parsing, dataset profiling, experiments, and shared domain types. `@predict-flow/ml` builds on it with preprocessing, TensorFlow.js model training, and prediction services.

## Data and generated files

Sample CSV files and the demo model are kept with the relevant app. Local dependencies, Next.js build output, package build output, and generated prediction output are excluded by [`.gitignore`](.gitignore).
