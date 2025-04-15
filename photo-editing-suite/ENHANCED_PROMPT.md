# All-in-One AI-Powered Photo Editing Suite - Enhanced Prompt

## Objective
Design PhotoMaster Pro, a unified photo editing platform integrating essential photo editing functions into a single tool. Prioritize seamless integration of professional-grade tools, AI automation, and mobile/desktop interoperability with a lightweight, intuitive interface for casual users and professionals.

## Core Requirements

### Feature Categories to Integrate
- Basic Tools: Crop, rotate, resize, exposure/contrast, color correction.
- Retouching: Blemish removal, clone stamp, content-aware fill, red-eye correction.
- Advanced Editing: Layer/mask support, curves/levels, selective adjustments, liquify.
- AI Automation: Auto-enhance, sky replacement, object removal, portrait retouching.
- Creative Effects: Presets/filters, double exposure, HDR merge, text/overlay tools.
- Workflow: Batch processing, history panel, non-destructive editing, cloud sync.
- Output: Format conversion, metadata editing, social media templates, watermarking.

### AI-Powered Enhancements
- Smart Enhance: Auto-detect and fix lighting/color issues.
- Contextual Suggestions: Recommend edits based on image type.
- Generative Fill: Expand canvas or replace backgrounds using diffusion models.
- AI Presets: Style transfer (e.g., Van Gogh painting).

## Technical Specifications
- Frontend: React UI with GPU acceleration for real-time previews.
- Backend: Python (PyTorch/TensorFlow) for AI models; C++ for performance-critical tasks.
- Cloud: AWS S3 for storage; serverless functions for batch processing.
- Mobile: React Native core with native camera integration.
- Performance: <1s response time for AI edits on 4K images.

## Key Workflows
- One-Click Fix: Auto-crop + auto-color + blemish removal.
- Pro Mode: Layer-based editing with blend modes and masking.
- Social Media Pipeline: Upload → AI crop → Add trending filter → Export with watermark.

## User Experience Guidelines
- UI Modes: Beginner (guided tutorials), Pro (customizable panels).
- Collaboration: Shared projects, comment/annotation tools.
- Performance: Offline-first, background rendering.

## Code Snippets to Include
- AI Sky Replacement (Python)
- Non-Destructive Editing (JavaScript)
- Content-Aware Fill (TensorFlow.js)

## Monetization & Compliance
- Freemium Model: Free basic tools, premium AI features.
- Data Privacy: On-device processing, GDPR/CCPA compliance.

## Deliverables
- System Architecture Diagram
- Development Roadmap (Phases 1-3)
- Testing Protocol (Alpha/Beta)
- Success Metrics (Performance, accuracy, retention)

## Adaptations
- Casual Users: Simplified UI, AI auto-edits.
- Professionals: CMYK support, print export profiles.
- Developers: API for custom integrations.

---

This enhanced prompt guides the development of a comprehensive AI-powered photo editing suite.
