---
title: Measuring the energy footprint of AI model training in EOSC
type: Research
date: 2026-03-15
excerpt: FLUID-AI publishes first results on green computing metrics for AI workloads on the AI4EOSC platform, revealing significant variation in energy cost across model types and infrastructure configurations.
image: /images/stories/placeholder3.png
---

## Background

As AI workloads grow across the EOSC infrastructure, so does their energy consumption. The FLUID-AI project — one of the associated projects in the AI4EOSC ecosystem — has spent the past year developing tools and metrics to make this consumption visible, comparable and ultimately reducible.

This post summarises their first published results, covering 847 training jobs run on AI4EOSC infrastructure between September 2025 and February 2026.

## Methodology

The FLUID-AI team instrumented the AI4EOSC training pipeline with lightweight energy monitoring agents that capture:

- **Wall-clock energy** — total Wh consumed per training job, measured at the PDU level
- **Carbon intensity** — gCO₂eq per kWh, sourced from the real-time grid data of the host data centre's national grid
- **Efficiency ratio** — useful FLOPs per Wh, normalised across hardware types to enable cross-site comparison

Jobs were anonymised and tagged with model architecture family, dataset size and hardware type (GPU model, cluster configuration), enabling analysis across these dimensions without exposing researcher data.

## Key findings

**Transformer models cost 4–8× more than CNNs of equivalent task performance.** For image classification tasks where both architectures achieve comparable accuracy, transformer-based models consumed significantly more energy during training, largely due to attention mechanism overhead at larger sequence lengths.

**Infrastructure location matters as much as model choice.** The same training job run on different EOSC sites varied in carbon footprint by up to **3.4×**, driven entirely by differences in grid carbon intensity. A job in a site powered predominantly by renewables had a dramatically lower carbon cost than one in a site with higher fossil fuel dependency.

**Transfer learning reduces energy cost by 60–85%.** Fine-tuning a pre-trained model on a domain-specific dataset consumed between 15% and 40% of the energy of training from scratch, with no statistically significant difference in final task accuracy for the datasets studied.

> "We expected to find that bigger models were more expensive — that was obvious. What surprised us was how much the _when_ and _where_ of training mattered. The same model, trained at the same site, at different times of day, could have a 2× difference in carbon footprint."
>
> — Dr. Antoine Moreau, FLUID-AI, CNRS

## Implications for AI4EOSC

These results are already informing changes to the AI4EOSC platform. The team is working on:

- **Green scheduling** — routing training jobs to sites with lower carbon intensity at the time of submission, when the job's time-to-result tolerance allows it
- **Energy estimates at submission time** — showing researchers an estimated energy cost and carbon footprint before they launch a training job
- **Transfer learning recommendations** — surfacing relevant pre-trained models from the catalogue when a user submits a from-scratch training request

The full dataset and analysis code are available in the AI4EOSC research repository under an open licence.
