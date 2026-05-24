---
title: EOSC-ARENA joins the ecosystem with new agent capabilities
type: News
date: 2026-04-10
excerpt: The AI4EOSC initiative welcomes EOSC-ARENA, a new Horizon Europe project that will extend the platform with autonomous AI agent capabilities and multi-step workflow orchestration.
icon: "🌍"
gradient: secondary
image: /images/stories/placeholder2.jpg
---

## A new project in the ecosystem

The AI4EOSC initiative has welcomed EOSC-ARENA as its newest associated project. Funded under Horizon Europe, EOSC-ARENA will extend the existing AI4EOSC platform with a framework for autonomous AI agents — systems that can plan, execute and monitor multi-step scientific workflows without constant manual intervention.

The project officially started in January 2025 and runs until the end of 2027. It brings together 8 partner institutions across 5 countries, including IFCA-CSIC (Spain), EGI (Netherlands) and several leading European research universities.

## What are AI agents on EOSC?

Traditional AI on the platform works in a request-response model: a researcher submits data, a model processes it, results are returned. EOSC-ARENA extends this with **agentic workflows** — sequences of AI actions that can:

- Select appropriate models based on intermediate results
- Trigger additional data retrieval from EOSC storage or external APIs
- Loop, branch and retry based on confidence thresholds
- Hand off between specialist models in a pipeline

This is particularly valuable for complex scientific analyses that today require a researcher to manually supervise each step — for example, iterative parameter optimisation in climate modelling or multi-stage genomic analysis pipelines.

## What EOSC-ARENA adds to AI4EOSC

The project will deliver four main additions to the platform:

**Agent framework** — a lightweight orchestration layer built on top of the existing DEEPaaS API, enabling models to be composed into multi-step agents.

**Tool use** — agents will be able to call external tools (database queries, simulation runners, plotting libraries) as part of their workflow, not just inference models.

**Agent monitoring** — a dashboard for tracking running agents, inspecting intermediate states and intervening when workflows stall or produce unexpected outputs.

**Workflow library** — a growing catalogue of reusable agent templates for common scientific tasks, contributed by the research community.

## Timeline

The project is currently in its first phase, focused on architecture design and prototyping. A developer preview of the agent framework is expected in Q3 2026, with the full integration into the AI4EOSC platform planned for early 2027.

Research communities interested in participating in the early testing programme can get in touch through the AI4EOSC support portal.
