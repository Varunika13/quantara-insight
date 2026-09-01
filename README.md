# Quantum Insight

Build and upgrade a responsive web application called "QUANTARA" — a scalable multi-agent AI investment intelligence dashboard for retail investors in India.

Tagline:

"No single voice decides — every angle does."

All prices and currency must be displayed in Indian Rupees (₹).

The application should demonstrate a complete agentic reasoning pipeline where multiple specialized AI agents independently analyze a stock from different perspectives, retrieve supporting evidence, and pass structured outputs to a synthesis agent.

IMPORTANT:

QUANTARA must no longer be limited to a fixed set of stocks such as Reliance, TCS, or Infosys.

Build the application around a scalable stock registry and dynamic data architecture so new stocks can be added without changing downstream agent, RAG, signal, portfolio, or watchlist code.

Use the uploaded QUANTARA logo as the official application logo.

════════════════════════════════════

APP OPENING / LOGO SPLASH SCREEN

════════════════════════════════════

When the QUANTARA application first opens or refreshes, show a full-screen splash screen before loading the main application.

Use the uploaded QUANTARA logo image as the central visual element.

Requirements:

- Display the uploaded QUANTARA logo prominently in the center.

- Preserve the logo exactly as uploaded.

- Do not redraw, recolor, crop, distort, or replace the logo.

- Maintain original proportions.

- Make the logo responsive on desktop and mobile.

- Keep the splash screen premium and minimal.

Below the logo display:

"Initializing intelligence from every angle..."

Add a subtle minimal loading indicator.

Animation sequence:

1. Splash screen fades in.

2. QUANTARA logo gently fades and scales into view.

3. Initialization text appears.

4. Loading indicator runs.

5. Smoothly transition into the application after approximately 2–3 seconds.

Flow:

QUANTARA Logo Splash Screen

        ↓

Initialize Intelligence

        ↓

Smooth Fade Transition

        ↓

Main Dashboard

The splash screen should only appear when the application initially loads or refreshes.

Do not add navigation or unnecessary buttons to the splash screen.

════════════════════════════════════

DESIGN & COLOR PALETTE

════════════════════════════════════

Create a clean, premium, modern fintech interface.

Use:

Background:

Warm off-white #F8F7F4

Primary dark:

Deep charcoal-black #181818

Secondary dark:

Near-black #111111

Brand accent:

Muted gold #C9A44C

Use gold sparingly and intentionally.

Gold should primarily be used for:

- QUANTARA branding

- Logo-related elements

- Tagline accents

- Synthesis Agent card border

- Synthesis confidence number

- Active navigation tab indicator

- Important highlights

Do not flood the UI with gold.

Functional signal colors must remain separate from branding.

Use:

Muted green for:

- Bullish signals

- Positive movement

- Positive indicators

Muted coral-red for:

- Bearish signals

- Caution

- Negative movement

Neutral signals should use muted gray or charcoal.

Do not use gold to represent bullish or bearish signals.

Layout:

- Consistent rounded corners between 14px and 16px.

- No harsh borders.

- Generous whitespace.

- Clear hierarchy.

- Consistent spacing.

- Mobile responsive.

- Desktop optimized.

- Clean and uncluttered.

Typography:

Heading font:

Playfair Display or Sora.

Body font:

Inter.

Icons:

Use one consistent line-icon set throughout the entire application.

Use Lucide or Feather-style icons.

Requirements:

- Same stroke weight.

- Approximately 20–24px.

- Charcoal or muted gold depending on context.

- Never mix icon styles.

The QUANTARA Synthesis card must be the visual hero.

Make it:

- Larger than individual agent cards.

- Visually distinct.

- Gold-bordered.

- Optionally dark background.

- Gold and white text.

- Clearly the final intelligence output.

════════════════════════════════════

NAVIGATION

════════════════════════════════════

Create a clean responsive navigation system.

Main tabs:

1. Dashboard

2. Watchlist

3. Portfolio

4. History

5. Metrics

6. Architecture

7. Profile

Each tab should contain:

- A consistent line icon.

- A short label.

On smaller screens, collapse navigation into a compact mobile-friendly layout.

Use muted gold only for the active tab indicator.

════════════════════════════════════

CORE DATA ARCHITECTURE

════════════════════════════════════

Do not hardcode business logic around specific stocks.

Create a configurable Stock Registry.

Each stock object should contain:

{

  "symbol": "",

  "company_name": "",

  "sector": "",

  "data_source_id": "",

  "current_price": 0,

  "daily_change_percent": 0,

  "trading_volume": 0,

  "volume_change_percent": 0,

  "price_history": [],

  "sentiment_feed": [],

  "document_ids": []

}

The stock registry should be the single source of truth.

All downstream systems must dynamically use registry data:

- Stock selector

- Watchlist

- Signal classification

- RAG documents

- Agents

- Portfolio

- Charts

- Recommendations

Do not create conditional business logic such as:

if stock == Reliance

if stock == TCS

if stock == Infosys

Instead, dynamically read stock metadata and associated data from the registry.

════════════════════════════════════

SCALABLE STOCK UNIVERSE

════════════════════════════════════

Create a searchable stock selector.

The user should be able to:

- Search stocks by company name.

- Search by NSE-style ticker/symbol.

- Select stocks.

- Add stocks to a personal watchlist.

- Remove stocks from the watchlist.

Initially provide a larger demo registry containing at least 8–12 representative NSE-style stocks across sectors.

Examples can include:

- RELIANCE — Energy / Conglomerate

- TCS — Technology

- INFY — Technology

- HDFCBANK — Banking

- ICICIBANK — Banking

- SBIN — Banking

- ITC — Consumer

- HINDUNILVR — FMCG

- SUNPHARMA — Healthcare

- MARUTI — Automotive

Clearly label all demo market data as demo/mock data unless a real data API is later connected.

Structure the application so additional NSE-listed stocks can be added through the registry without changing the agent pipeline.

When a stock is added to the watchlist:

- Signals update dynamically.

- RAG documents are loaded dynamically.

- Agent analysis uses the selected stock.

- Portfolio can reference the stock.

- Dashboard updates accordingly.

════════════════════════════════════

DASHBOARD TAB

════════════════════════════════════

At the top display:

- QUANTARA logo.

- QUANTARA branding.

- Tagline:

"No single voice decides — every angle does."

Subtitle:

"Multi-Agent AI Investment Intelligence for Retail Investors"

Include:

- Search/select stock component.

- Add to watchlist button.

- Risk profile selector.

- Generate QUANTARA Intelligence button.

════════════════════════════════════

STOCK SNAPSHOT

════════════════════════════════════

For the selected stock dynamically display:

- Company name.

- Symbol.

- Sector.

- Current price in ₹.

- Today's percentage change.

- Trading volume.

- Volume change percentage.

All values must come dynamically from the selected stock registry entry.

════════════════════════════════════

USER RISK PROFILE

════════════════════════════════════

Create three selectable risk profiles:

Conservative

Moderate

Aggressive

The user must select or configure a profile.

Also allow the user to save a default profile in the Profile tab.

The selected profile must visibly affect the final synthesis recommendation.

Conservative:

Use cautious and hedged language.

Emphasize:

- Risk.

- Volatility.

- Capital preservation.

- Monitoring.

Example:

"For your Conservative profile, positive signals are present, but current uncertainty suggests caution and continued monitoring before increasing exposure."

Moderate:

Use balanced language.

Example:

"For your Moderate profile, the current signal presents a potential opportunity while maintaining awareness of market risk."

Aggressive:

Use more decisive but still responsible language.

Example:

"For your Aggressive profile, the current positive signals may support stronger consideration, while market conditions should continue to be monitored."

IMPORTANT:

Use the same underlying market data and visibly demonstrate how the wording and emphasis change according to the selected profile.

Include a small comparison area where appropriate:

Conservative Perspective

Moderate Perspective

Aggressive Perspective

Clearly highlight:

"Your selected profile: [PROFILE]"

════════════════════════════════════

PORTFOLIO INPUT

════════════════════════════════════

Allow users to input portfolio holdings.

Each holding should include:

- Stock symbol.

- Number of shares.

- Average purchase price.

Automatically calculate using available data:

- Current value.

- Allocation percentage.

- Portfolio concentration.

- Basic risk concentration score.

Portfolio data must dynamically reference stocks from the Stock Registry.

Do not hardcode portfolio logic for specific tickers.

════════════════════════════════════

SIGNAL CLASSIFICATION MODULE

════════════════════════════════════

For every selected stock, compute at least three independent signal dimensions.

1. Price Momentum Signal

2. Volume Anomaly Signal

3. Sentiment Signal

Each signal output must include:

- Classification:

  Bullish / Neutral / Bearish

- Confidence:

  Numeric score from 0 to 100%

- Short cited reasoning:

  A concise explanation referencing the relevant data.

Use a consistent structure:

{

  "signal_type": "",

  "classification": "Bullish | Neutral | Bearish",

  "confidence": 0,

  "reasoning": "",

  "source": ""

}

Display these signals as labeled cards or badges near the selected stock.

Example:

PRICE MOMENTUM

Bullish

78% confidence

"Price remains above the short-term average with sustained upward momentum."

Source:

30-Day Price History

VOLUME ANOMALY

Neutral

64% confidence

"Trading activity remains close to the recent average."

Source:

Trading Volume + Volume Change

SENTIMENT

Bullish

71% confidence

"Recent demo news sentiment is predominantly positive."

Source:

Sentiment Feed

════════════════════════════════════

PRICE TREND CHART

════════════════════════════════════

Create a clean line chart using the selected stock's 30-day price history.

Requirements:

- Approximately 30 days.

- Clear overall trend.

- Highlight only the 3–4 most significant upward movements.

- Use muted green labels such as:

+4.2%

- Highlight significant drops with muted coral labels such as:

-3.1%

Do not label minor daily fluctuations.

Only label significant movements.

If the overall trend is downward, subtly shade declining portions with muted coral.

Keep the chart clean and uncluttered.

════════════════════════════════════

SENTIMENT DATA

════════════════════════════════════

Create a configurable demo sentiment feed for stocks.

Each sentiment item can include:

{

  "headline": "",

  "sentiment": "Positive | Neutral | Negative",

  "score": 0,

  "timestamp": "",

  "source_name": ""

}

The sentiment signal must be computed dynamically from available sentiment feed data.

Clearly label mock sentiment feeds as:

Demo Sentiment Feed

until real news APIs are connected.

════════════════════════════════════

RETRIEVAL-AUGMENTED GENERATION (RAG)

════════════════════════════════════

Build a small document corpus associated dynamically with stocks in the registry.

Documents can include clearly labeled synthetic demo documents such as:

- Demo SEBI Filing

- Demo Earnings Transcript

- Demo Corporate Disclosure

- Demo Financial Update

Each document should contain:

{

  "document_id": "",

  "stock_symbol": "",

  "document_title": "",

  "document_type": "",

  "date": "",

  "content": "",

  "chunks": []

}

Create two to three realistic fictional demo documents for each major stock in the demo registry.

The documents should include a mix of:

- Growth opportunities.

- Revenue performance.

- Expansion.

- Operational risks.

- Margin pressure.

- Market uncertainty.

- Regulatory challenges.

Clearly label all synthetic content:

"Fictional Demo Document"

════════════════════════════════════

SEMANTIC RETRIEVAL

════════════════════════════════════

Implement a retrieval layer.

Preferred approach:

- Vector search or embeddings when supported.

Fallback:

- Keyword-based relevance search.

When an agent requires supporting evidence:

1. Create a query.

2. Search the selected stock's document corpus.

3. Retrieve the most relevant chunks.

4. Pass retrieved chunks to the appropriate agent.

5. Store source attribution.

Every retrieved result should include:

- Document title.

- Document type.

- Relevant quoted snippet.

- Relevance information where available.

Every AI-generated recommendation must show visible source attribution.

Never hide source attribution only in logs.

Render sources directly in the UI.

Example:

SOURCE ATTRIBUTION

Demo Q2 Earnings Transcript

"Management highlighted continued growth in digital services while noting possible margin pressure from increased operating costs."

════════════════════════════════════

MULTI-AGENT ARCHITECTURE

════════════════════════════════════

Implement at least three specialized agents running independently and in parallel.

Agents:

1. Fundamentals Agent

2. Technical Agent

3. Sentiment Agent

Their outputs feed into:

4. QUANTARA Synthesis Agent

The first three agents should run in parallel where technically possible.

════════════════════════════════════

STRUCTURED AGENT OUTPUT CONTRACT

════════════════════════════════════

Every specialized agent must return the same structured contract:

{

  "agent_name": "",

  "verdict": "Bullish | Neutral | Bearish | Unavailable",

  "confidence": 0,

  "reasoning": "",

  "sources": [

    {

      "document": "",

      "snippet": ""

    }

  ]

}

Validate:

- Agent name.

- Verdict.

- Confidence between 0 and 100.

- Reasoning.

- Sources.

════════════════════════════════════

FUNDAMENTALS AGENT

════════════════════════════════════

Name:

Fundamentals Agent

Purpose:

Analyze:

- Filings.

- Earnings information.

- Corporate disclosures.

- Financial opportunities.

- Financial risks.

Use the RAG retrieval system.

The agent should receive only relevant retrieved evidence.

Return:

- Verdict.

- Confidence.

- Concise reasoning.

- Visible source citations.

Do not generate unsupported claims.

If no relevant evidence is retrieved:

Return:

{

  "agent_name": "Fundamentals Agent",

  "verdict": "Unavailable",

  "confidence": 0,

  "reasoning": "No relevant supporting financial document was available for this analysis.",

  "sources": []

}

════════════════════════════════════

TECHNICAL AGENT

════════════════════════════════════

Name:

Technical Agent

Analyze:

- Price momentum.

- Price trend.

- Trading volume.

- Volume anomalies.

- Signal classifications.

Inputs:

- Current price.

- Daily percentage change.

- 30-day price history.

- Trading volume.

- Volume change.

Return:

- Verdict.

- Confidence.

- Concise reasoning.

- Source data references.

Example:

Source:

30-Day Price History + Trading Volume

════════════════════════════════════

SENTIMENT AGENT

════════════════════════════════════

Name:

Sentiment Agent

Analyze:

- Demo news sentiment.

- Available market sentiment.

- Positive and negative headlines.

Return:

- Verdict.

- Confidence.

- Concise reasoning.

- Source attribution.

Example:

Source:

Demo Sentiment Feed

════════════════════════════════════

QUANTARA SYNTHESIS AGENT

════════════════════════════════════

Name:

QUANTARA Synthesis Agent

This is the final intelligence layer.

It receives:

- Fundamentals Agent output.

- Technical Agent output.

- Sentiment Agent output.

- Selected stock.

- Signal classifications.

- User risk profile.

- Portfolio context where available.

The synthesis agent combines available evidence into one final output.

Return:

{

  "agent_name": "QUANTARA Synthesis Agent",

  "recommendation": "Bullish | Neutral | Bearish | Cautious Opportunity",

  "confidence": 0,

  "summary": "",

  "risk_profile_explanation": "",

  "reasoning_trace_summary": "",

  "what_would_change_this": "",

  "sources": []

}

The synthesis card must visibly show:

- Final recommendation.

- Overall confidence.

- Personalized risk profile explanation.

- Supporting agent verdicts.

- Source citations.

- What Would Change This.

════════════════════════════════════

VISIBLE MULTI-AGENT REASONING TRACE

════════════════════════════════════

Make the reasoning pipeline visually obvious because this is the core differentiator of QUANTARA.

Display:

FUNDAMENTALS AGENT

        ↓

TECHNICAL AGENT

        ↓

SENTIMENT AGENT

These agents should visually appear as independent perspectives.

Then:

Independent Perspectives

        ↓

Unified Intelligence

        ↓

QUANTARA SYNTHESIS AGENT

Display each agent's:

- Verdict.

- Confidence.

- Concise reasoning.

- Sources.

Do not expose hidden chain-of-thought.

Show only concise, structured, user-facing reasoning summaries.

════════════════════════════════════

AGENT DISAGREEMENT

════════════════════════════════════

Compare available agent verdicts.

If two or more agents conflict:

Show a prominent banner:

⚠ Conflicting Agent Signals

Example:

"Technical Agent is Bullish while Fundamentals Agent is Neutral due to identified financial risks."

Clearly display:

- Which agents disagree.

- Their verdicts.

- Their confidence.

- Brief reasons.

Do not silently average away disagreement.

The synthesis agent must account for conflicting signals.

════════════════════════════════════

GRACEFUL DEGRADATION

════════════════════════════════════

Simulate at least one failure scenario.

Examples:

- Missing data feed.

- Missing RAG documents.

- Agent API failure.

- Conflicting signals.

Create a clear degraded state.

Example:

⚠ DEGRADED DATA

"Live data is temporarily unavailable for this stock. QUANTARA is using available cached or demo data."

Display which components remain available:

Technical Data:

Available / Unavailable

Fundamental Documents:

Available / Unavailable

Sentiment Feed:

Available / Unavailable

When data is missing:

- Do not crash.

- Do not fabricate evidence.

- Do not invent uncited sources.

- Continue using valid agent outputs.

- Reduce confidence where appropriate.

- Clearly tell the user what is unavailable.

════════════════════════════════════

WATCHLIST TAB

════════════════════════════════════

Create a dynamic watchlist.

Users should be able to:

- Search stocks.

- Add stocks.

- Remove stocks.

- Select a stock for analysis.

For every stock in the watchlist display:

- Company.

- Symbol.

- Current price.

- Daily change.

- Price Momentum classification.

- Volume classification.

- Sentiment classification.

- Latest synthesis recommendation if available.

All values must dynamically come from registry and analysis data.

════════════════════════════════════

PORTFOLIO TAB

════════════════════════════════════

Allow users to manage holdings.

Show:

- Holdings.

- Current value.

- Allocation percentage.

- Concentration.

Calculate:

Portfolio Risk Concentration Score

Use a simple understandable scale.

Example:

Low / Moderate / High

or:

0–100 score.

Clearly explain the score:

"Portfolio concentration measures how heavily your portfolio depends on a small number of holdings."

════════════════════════════════════

WHAT WOULD CHANGE THIS

════════════════════════════════════

Below every final recommendation display:

What would change this?

Show one concise sentence explaining what new information could significantly alter the recommendation.

Example:

"A sustained decline in momentum combined with negative earnings evidence could shift this analysis toward a more cautious stance."

════════════════════════════════════

REMINDER BANNER

════════════════════════════════════

Create a dismissible reminder:

"New signals update as fresh data comes in — revisit this analysis periodically."

════════════════════════════════════

HISTORY TAB

════════════════════════════════════

Store and display analysis sessions.

Use four or five initial mock sessions.

Each entry should show:

- Stock name.

- Symbol.

- Date.

- Risk profile.

- Final recommendation.

- Confidence.

- Whether signals conflicted.

- Whether degraded data was present.

When clicked, expand the session.

Show the complete reasoning trace.

Reuse the same agent card components.

════════════════════════════════════

PERFORMANCE LOGGING

════════════════════════════════════

Log at least three metrics per analysis session.

1. Signal Accuracy Tracking Placeholder

Compare the generated signal with a mock 30-day forward return.

Example fields:

Predicted Signal:

Bullish

Mock 30-Day Return:

+4.8%

Accuracy Placeholder:

Matched Direction

Clearly label this as demo/mock evaluation data.

2. Agent Response Latency

Track response time in milliseconds for:

- Fundamentals Agent.

- Technical Agent.

- Sentiment Agent.

- Synthesis Agent.

3. Portfolio Risk Concentration Score

Record the current portfolio concentration score.

════════════════════════════════════

METRICS TAB

════════════════════════════════════

Create a Session Log / Metrics tab.

Display session history.

Include:

- Session ID.

- Date/time.

- Stock.

- Agent response latency.

- Total response time.

- Final confidence.

- Signal accuracy placeholder.

- Mock forward return.

- Portfolio concentration score.

- Degraded data status.

Use clear tables or cards.

Keep this simple and demo-friendly.

════════════════════════════════════

SESSION STATS

════════════════════════════════════

After every analysis show a Session Intelligence panel.

Display:

Total Response Time

Overall Confidence

Number of Sources Cited

Also optionally show:

Agent Latency

Conflicting Signals Status

Data Health Status

════════════════════════════════════

AI ASSISTANT — ASK QUANTARA

════════════════════════════════════

Add a lightweight contextual AI assistant.

Label:

Ask Quantara

The user can ask questions such as:

"Why is the Technical Agent bullish?"

"What makes this risky for my Conservative profile?"

"Which source supports the Fundamentals Agent?"

"Should I consider this based on my current portfolio?"

The assistant must use:

- Existing agent outputs.

- Existing reasoning summaries.

- Retrieved sources.

- Selected stock.

- Selected risk profile.

- Portfolio context.

Do not create an entirely separate reasoning pipeline.

Frame it as:

"Ask Quantara about this analysis."

The assistant should not invent uncited facts.

════════════════════════════════════

PROFILE TAB

════════════════════════════════════

Create a simple user profile.

Display:

User Name:

Investor

Default Risk Profile.

Allow selection of:

- Conservative.

- Moderate.

- Aggressive.

Show:

- Total analyses run.

- Most-viewed stock.

- Most common signal.

- Number of stocks in watchlist.

Use mock/local data.

No real authentication is required.

════════════════════════════════════

ARCHITECTURE / ABOUT TAB

════════════════════════════════════

Create a simple Architecture page designed specifically for hackathon judges to skim quickly.

Title:

How QUANTARA Works

Create four clear sections.

1. MULTI-AGENT INTELLIGENCE

Explain:

Fundamentals Agent

→ analyzes financial documents using RAG.

Technical Agent

→ analyzes price momentum and volume signals.

Sentiment Agent

→ analyzes news and sentiment.

Synthesis Agent

→ combines independent perspectives.

2. RAG GROUNDING

Explain:

QUANTARA retrieves relevant financial documents before generating grounded analysis.

Display flow:

User selects stock

        ↓

Document retrieval

        ↓

Relevant evidence chunks

        ↓

Fundamentals Agent

        ↓

Visible source citations

3. PERSONALIZED INTELLIGENCE

Explain:

The same market data can produce different advice depending on:

- Conservative profile.

- Moderate profile.

- Aggressive profile.

4. GRACEFUL DEGRADATION

Explain:

If a data feed or agent is unavailable, QUANTARA:

- Clearly reports missing information.

- Does not fabricate evidence.

- Uses available agents.

- Reduces confidence where appropriate.

Add a simple visual architecture diagram:

STOCK REGISTRY

      ↓

SIGNAL CLASSIFICATION

      ↓

RAG RETRIEVAL

      ↓

FUNDAMENTALS AGENT

TECHNICAL AGENT

SENTIMENT AGENT

      ↓

      ↓

      ↓

QUANTARA SYNTHESIS AGENT

      ↓

PERSONALIZED INVESTMENT INTELLIGENCE

════════════════════════════════════

FREE ACCESS MESSAGE

════════════════════════════════════

Near the bottom of the application display:

"All features free — because good financial guidance shouldn't be behind a paywall."

Do not create:

- Premium tiers.

- Paywalls.

- Subscription prompts.

- Login-gated features.

════════════════════════════════════

DISCLAIMER

════════════════════════════════════

Under every investment recommendation display:

"This is an AI-generated signal for informational purposes, not financial advice."

Keep it visible but subtle.

Never guarantee:

- Profits.

- Returns.

- Investment success.

════════════════════════════════════

DASHBOARD FLOW

════════════════════════════════════

The Dashboard should follow this flow:

1. QUANTARA logo and branding.

2. Tagline.

3. Search/select stock.

4. Add stock to watchlist.

5. Risk profile selection.

6. Generate QUANTARA Intelligence button.

7. Stock snapshot.

8. Current signal classifications.

9. 30-day price trend chart.

10. Fundamentals Agent.

11. Technical Agent.

12. Sentiment Agent.

13. Visible RAG source citations.

14. Label:

"Independent Perspectives → Unified Intelligence"

15. QUANTARA Synthesis Agent.

16. Conflicting Signals banner if applicable.

17. Degraded Data banner if applicable.

18. Personalized risk profile explanation.

19. What Would Change This.

20. Expandable full reasoning trace.

21. Reminder banner.

22. Session Intelligence metrics.

23. Free-access message.

24. Disclaimer.

════════════════════════════════════

INTERACTION FLOW

════════════════════════════════════

1. User opens QUANTARA.

2. Logo splash screen appears.

3. Application loads Dashboard.

4. User searches the scalable stock registry.

5. User selects a stock.

6. User can add it to the watchlist.

7. User selects risk profile.

8. User clicks:

Generate QUANTARA Intelligence

9. Display:

"QUANTARA agents are analyzing from every angle..."

10. Load current stock data.

11. Compute independent signals.

12. Retrieve relevant RAG documents.

13. Run Fundamentals, Technical, and Sentiment Agents in parallel.

14. Capture structured agent outputs.

15. Detect disagreement.

16. Detect degraded data.

17. Pass valid outputs to the Synthesis Agent.

18. Generate personalized intelligence.

19. Display visible source citations.

20. Save the session to History and Metrics.

21. Allow contextual questions through Ask Quantara.

════════════════════════════════════

AI API IMPLEMENTATION

════════════════════════════════════

Structure the application with modular functions.

Suggested services:

searchStocks()

getStockData()

addToWatchlist()

computePriceMomentumSignal()

computeVolumeAnomalySignal()

computeSentimentSignal()

retrieveDocuments()

analyzeFundamentals()

analyzeTechnical()

analyzeSentiment()

synthesizeRecommendation()

calculatePortfolioRisk()

logSessionMetrics()

askQuantara()

The three specialized agents must run in parallel where possible.

The Synthesis Agent should run only after available specialized outputs are returned.

Implement robust parsing and validation.

════════════════════════════════════

AI API SECURITY

════════════════════════════════════

IMPORTANT:

Never expose AI API keys in frontend/client-side code.

Use:

- Secure backend functions.

- Server-side API endpoints.

- Supabase Edge Functions where appropriate.

- Environment variables.

Handle:

- API failure.

- Timeout.

- Invalid JSON.

- Missing fields.

If an AI agent fails:

- Mark it unavailable.

- Record the failure.

- Continue with remaining valid agents.

- Inform the synthesis agent.

- Clearly display the degraded state.

════════════════════════════════════

FINAL REQUIREMENTS

════════════════════════════════════

The final QUANTARA application must clearly demonstrate:

✓ A scalable stock registry.

✓ Dynamic stock selection beyond three hardcoded stocks.

✓ Dynamic watchlist support.

✓ Price momentum classification.

✓ Volume anomaly classification.

✓ Sentiment classification.

✓ Numeric confidence scores.

✓ Cited reasoning.

✓ RAG retrieval with visible source attribution.

✓ At least three specialized agents.

✓ Parallel agent execution.

✓ Structured agent outputs.

✓ Synthesis layer.

✓ Visible multi-agent reasoning trace.

✓ Agent disagreement detection.

✓ User risk profiling.

✓ Portfolio holdings.

✓ Personalized recommendations.

✓ Session performance logging.

✓ Agent response latency metrics.

✓ Signal accuracy placeholder.

✓ Portfolio concentration score.

✓ Graceful degradation.

✓ History tab.

✓ Metrics tab.

✓ Architecture page for judges.

✓ Context-aware Ask Quantara assistant.

✓ Responsive design.

✓ Clear informational disclaimer.

Prioritize the following for the hackathon demo:

1. Visible multi-agent reasoning.

2. Source citations.

3. Agent disagreement.

4. Risk-profile personalization.

5. Graceful degradation.

6. Scalable stock architecture.

The application should feel polished and functional enough for a live 24-hour hackathon demonstration.

Do not hardcode downstream logic to Reliance, TCS, Infosys, or any specific company.

All modules must dynamically work from the Stock Registry.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5f6b17ca-455e-43ad-aa1f-ff762c71d3d4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
