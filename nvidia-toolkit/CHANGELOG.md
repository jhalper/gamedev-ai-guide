# NVIDIA GameDev Guide — Changelog

## v1.9.5 — 2026-05-01
- Updated NVIDIA ACE entry: added Nemotron 3 Nano Omni (released April 28, 2026) — open multimodal model unifying vision, audio, and language in a single system; 30B params / 3B active (MoE); 9x throughput vs comparable open multimodal models; runs on a single GPU
- Nemotron 3 Nano Omni available as NVIDIA NIM, Hugging Face, OpenRouter — open weights, commercial license (NVIDIA Open Model License Agreement)
- Updated RTX Neural Texture Compression (NTC) entry — SDK 0.9: BC7 encoding 6x faster vs 0.8, inference 20-40% faster, Inference on Feedback hybrid decode path added
- Tom's Hardware benchmark (April 2026) confirmed: up to 85% VRAM reduction in practice, 2-4x inference throughput on Ada/Blackwell with Cooperative Vectors
- NTC custom engine notes updated: CUDA 12.9 required for DX12 Cooperative Vectors path (CUDA 13 incompatible with 590.26 preview driver)
- Added Intel Neural Compression competitive context to NTC entry — cross-vendor standardization accelerating

## v1.9.4 — 2026-04-24
- Updated DLSS SR entry: DLSS 4.5 SDK released April 22 via Streamline SDK — Dynamic MFG now available for native developer integration, not just NVIDIA app consumer override
- 6X MFG mode (5 AI-generated frames per rendered frame) documented — RTX 50 Series exclusive; RTX 40 Series tops out at 4X Dynamic MFG
- Enhanced Frame Generation model added to SDK — improves HUD/UI clarity at high frame multipliers
- Custom engine notes updated with Streamline API integration details for Dynamic MFG (sl::DLSSGOptions, dynamicFrameGeneration flag, static multiplier options)
- Limitations updated: Dynamic MFG native integration requires April 22 Streamline SDK release specifically

## v1.9.3 — 2026-04-16
- Renamed to NVIDIA GameDev Guide — nav label updated to "NVIDIA GameDev", clearer independent positioning, avoids overlap with official NVIDIA "Toolkit" branding
- Added non-affiliation disclosure to hero: "Independent resource. Not affiliated with or endorsed by NVIDIA Corporation."
- Added RTX Neural Shaders / Cooperative Vectors as new Rendering & Graphics entry covering NTC, NRC, and Neural Materials
- DX12 Cooperative Vectors live in Agility SDK 1.717.x-preview (Shader Model 6.9), cross-vendor in spec
- Engine matrix row added for RTX Neural Shaders
- Tool count: 83 → 84

## v1.9.2 — 2026-04-10
- Updated Omniverse entry: modular libraries (ovrtx, ovphysx, ovstorage) now in early access on GitHub/NGC with C/Python APIs
- Omniverse shift: developers can now embed RTX rendering or PhysX simulation standalone, without the full Omniverse container stack
- Updated DLSS SR entry: Dynamic Multi Frame Generation confirmed live since March 31 via NVIDIA app beta
- Added detail: Dynamic MFG auto-adjusts frame multipliers in real time to match display refresh rate (up to 6X on RTX 50 Series)
- Added detail: Enhanced Frame Generation model for improved UI clarity in select titles
- Tool count: 83 (unchanged)

## v1.9.1 — 2026-04-07
- Nav order updated: Home, AI Tools, Perspectives, Job Search, NVIDIA Toolkit
- Cleaned up hero stats for accuracy
- Ongoing maintenance and accuracy checks

## v1.9.0 — 2026-03-22
- Added floating "Back to Top" button — appears after 500px scroll, smooth scroll back, NVIDIA green accent
- Added tool count badges inside all filter dropdown options (e.g., "Rendering & Graphics 30")
- Added sort dropdown — sort by name (A→Z / Z→A), category, pricing (free first), maturity, or difficulty (easy first)
- Where to Start cards now apply a real curated filter, narrowing the tool list to the relevant 5-7 tools
- Active WTS card highlighted with green border; click again to deactivate and restore full list
- Clear All button resets sort, WTS selection, search, and all filters
- Tool count: 83 (unchanged)

## v1.8.1 — 2026-03-20
- Removed redundant site header — hub nav now serves as the single sticky navigation
- Merged section links (Where to Start, Engine Matrix, All Tools) and theme toggle into hub nav
- Moved "What's New" changelog into the hero section as an inline collapsible pill
- Reduced vertical overhead — content is immediately visible with less stacking
- Fixed sticky offsets: filter-bar and scroll-padding adjusted for single-bar layout
- Section links hidden on tablets (< 900px), reappear in mobile hamburger menu
- Tool count: 83 (unchanged)

## v1.8.0 — 2026-03-20
- Replaced dismissible NEW banner with persistent collapsible "What's New" panel
- Full version history now accessible from the hero section at any time (timeline layout, reverse-chronological)
- Changelog data embedded in app.js — all 12 versions rendered dynamically
- Confirmed no new GTC 2026 gaming announcements beyond v1.7.0 coverage
- Mobile responsive: timeline dots hidden on small screens, clean stacked layout
- Tool count: 83 (unchanged)

## v1.7.0 — 2026-03-18
- Added DLSS 5 (Neural Rendering) as new tool entry — GTC 2026 headline announcement, Fall 2026 launch
- Added NemoClaw (Agentic AI Framework) as new tool entry — open-source long-running AI agent stack
- Updated DLSS SR entry with 20 new GDC 2026 game integrations and March 31 DLSS 4.5 override beta
- Updated RTX Mega Geometry with foliage system open-sourcing details and CONTROL Resonant integration
- Updated GeForce NOW with March 19 VR 90 FPS launch date and CloudXR 4K 120 FPS details
- Updated RTX Kit entry to reference DLSS 5
- Updated GTC/GDC Developer Resources entry with GTC 2026 keynote highlights
- Updated NEW banner to reflect v1.7.0 with 83 tools
- Tool count: 81 → 83

## v1.6.0 — 2026-03-18
- Added philosophy statement to hero: tools extend developers and their engines, not replace them
- Rewrote 13 whyGameDev one-liners that used replacement-adjacent or engine-competitive language
- All phrasing now frames NVIDIA tools as augmenting engines and developer craft, not competing with or bypassing them
- Engine Matrix description updated to emphasize integration and enhancement
- Full language audit across 81 tools, use cases, and descriptions
- Fixed hero text to show 80+ tools (was incorrectly showing 60+)

## v1.5.0 — 2026-03-17
- Restructured Overview tab to fix "wall of text" problem
- Added quick-glance info bar (Pricing / Maturity / Difficulty) at top of Overview
- Smart sentence splitting extracts a concise lead sentence from each tool description
- Remaining description hidden behind collapsible "Read more" toggle
- Replaced verbose yellow warning boxes with subtle "Things to know" collapsible toggle
- Limitations split into scannable bullet points, hidden by default
- Overviews are now scannable at a glance instead of dense AI-generated paragraphs

## v1.4.2 — 2026-03-17
- Added SVG favicon (NVIDIA green hexagon with dot on dark background)

## v1.4.1 — 2026-03-17
- Legend line break: description and dot key now on separate lines

## v1.4.0 — 2026-03-17
- Replaced confusing 1-5 number scores in Engine Matrix with colored dots (green/yellow/red/gray)
- Integration type labels (Official Plugin, External, Manual/API, etc.) now the primary info per cell
- Updated legend to use colored dot indicators

## v1.3.0 — 2026-03-17
- Fixed 9 matrix cells that showed a number score alongside "Not Available" — now correctly show gray dash
- Tightened matrix row spacing (padding, font sizes, badge sizes)
- Added subtle alternating row backgrounds for better eye-tracking

## v1.2.0 — 2026-03-17
- Improved inactive tab styling — tabs no longer look "greyed out" / disabled
- Inactive tabs now use brighter text color and green glow hover state
- Hover shows green bottom border preview for clearer affordance

## v1.1.0 — 2026-03-17
- Added tabbed expanded details (Overview, Use Cases, Engine Support, Details)
- Added "Why Game Dev?" one-liners for all 81 tools
- Added hyperlinked tool names, use case cards with checkmarks
- Rebuilt engine integration matrix with engineMatrix data
- Added "Where to Start" scenario cards
- Added light/dark mode toggle
- Added "NEW" features banner

## v1.0.0 — 2026-03-16
- Initial release — 81 tools, filters, search, NVIDIA dark theme
- Joe Halper credit with LinkedIn link
- No Perplexity attribution per user request
