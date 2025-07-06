<div align="center">

# TradeComplianceClassifier

_Instant HS Code Predictions and Trade Insights_

![typescript](https://img.shields.io/badge/TypeScript-100%25-blue)
![languages](https://img.shields.io/badge/languages-3-blue)

### Built with the tools and technologies:

![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white) ![v0.dev](https://img.shields.io/badge/v0.dev-black?logo=data:image/svg+xml;base64,...)

</div>

## Overview

**TradeComplianceClassifier** is a web application that helps automate the classification of products by predicting Harmonized System (HS) codes and determining trade compliance features such as FTA eligibility, MPF exemption, and duty rates.

Live site: [Coming Soon]  
GitHub: https://github.com/mdmahbubreza/TradeComplianceClassifier

## Why TradeComplianceClassifier?

This project streamlines trade operations with:

- 🧰 **Classifier**: Suggests top 3 HS codes with reasoned explanations and confidence levels
- 🌍 **FTA Checker**: Evaluates Free Trade Agreement eligibility with origin requirements
- ⚖️ **Duty Analyzer**: Displays duty rates (general, special, column 2), MPF status
- 📊 **History Tracker**: Auto-saves up to 50 past queries with editable and exportable records
- 📄 **Knowledge Base**: Upload product manuals/specs to improve future model performance

## Prerequisites

- **Node.js 18+**
- **pnpm** or **npm/yarn** for dependency management

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/mdmahbubreza/TradeComplianceClassifier.git
cd TradeComplianceClassifier
```

2. **Install dependencies:**

```bash
pnpm install  # or npm install / yarn install
```

3. **Start the development server:**

```bash
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Features

### HS Code Classification
- `/api/classify` parses a public HTS CSV file
- Performs keyword-based search with basic scoring and fuzzy logic
- Returns top 3 HS codes with reasoning and confidence estimates

### Trade Insights
- Evaluates general, special, and column 2 rates
- Determines MPF exemption based on product origin and value
- FTA logic checks origin country and rules of origin applicability

### UI & User Experience
- Built using `Next.js` App Router (v15)
- Components styled with `Tailwind CSS` and `shadcn/ui`
- Form: title, description, origin, upload documents, etc.
- Tabs: **Classify** and **History**
- Cards with badges, tooltips, expandable detail panels

### History and Storage
- Stores last 50 classification results in `localStorage`
- View details, delete entries, export to JSON, reload into form

### File Upload & Knowledge Base
- Upload PDFs, DOCs, or images containing product specs
- Stores document list in local state for future refinement

## Configuration

- No external API key needed
- HTS reference CSV file is embedded and loaded at runtime

## Usage

1. Run the development server:
```bash
pnpm dev
```
2. Navigate to `http://localhost:3000`
3. Fill in product details and submit for classification
4. Review top 3 HS codes and trade-related outcomes
5. Export or save results to revisit later

## How It Works

1. **Text Input:**
   - User provides product title, description, origin country, and optional technical specs

2. **Classification Logic:**
   - A local CSV dataset of HTS codes is searched using keyword matching
   - Each match is scored based on term overlap and order

3. **Trade Evaluation:**
   - Using mappings for FTA countries and duty tables, results are enriched with trade flags

4. **Rendering:**
   - Results are displayed using dynamic components with interactivity and download options

## Troubleshooting

- ⚠️ **Missing Matches:**
  - Ensure that product descriptions contain keywords aligned with HTS terminologies

- 🚧 **Empty Classification:**
  - If the dataset fails to load, check the CSV path in `/lib/hts.ts`

## Contributing

Have ideas to improve HTS scoring or want to add LLM support? Feel free to fork, raise issues, or open PRs.

---

Made with ❤️ by [@mdmahbubreza](https://github.com/mdmahbubreza)
