---
title: How iMagine uses AI4EOSC to classify marine species at scale
type: Case study
date: 2026-05-01
excerpt: The iMagine project deployed a suite of underwater imaging models on AI4EOSC, enabling automated species identification across thousands of images from European marine research sites.
icon: "📡"
gradient: primary
image: /images/stories/placeholder1.jpeg
---

## The challenge

Marine biodiversity research depends on the analysis of enormous volumes of underwater imagery — footage from ROVs, trawl surveys and fixed-camera deployments that collectively generate hundreds of thousands of images per expedition. Manually annotating this data is slow, expensive and inconsistent across research teams.

The iMagine consortium set out to change this. Their goal: deploy production-ready AI models for species classification and image segmentation directly in the hands of marine biologists across Europe, without requiring each research group to manage their own infrastructure.

## Why AI4EOSC

iMagine evaluated several cloud and HPC platforms before choosing AI4EOSC as their deployment base. The decisive factors were:

- **EOSC authentication** — single sign-on with institutional credentials, covering all major European research universities
- **DEEPaaS API** — a standardised REST interface that abstracts model deployment; researchers access AI through a consistent API regardless of the underlying model
- **OSCAR integration** — serverless, event-driven inference that scales to zero when idle, keeping compute costs proportional to actual usage
- **Federated learning support** — critical for datasets that cannot leave national borders due to data sovereignty regulations

> "We didn't want to build and maintain a platform — we wanted to do science. AI4EOSC gave us a ready-made infrastructure that let our team focus on the models, not the ops."
>
> — Dr. Silvia Ruiz, iMagine Technical Lead, CSIC

## What was deployed

The iMagine gateway runs three core models on AI4EOSC:

**Species classifier** — a ResNet-50 fine-tuned on 120,000 annotated images from the MBARI and HCMR datasets, covering 847 Mediterranean and Atlantic species. Achieves 91.4% top-5 accuracy on held-out test sets.

**Image segmentation** — a Mask R-CNN variant adapted for low-visibility underwater conditions, used to isolate organisms from complex backgrounds in turbid or deep-sea footage.

**Biodiversity monitor** — a pipeline model that combines classifier outputs with spatial metadata to generate per-site diversity indices, enabling longitudinal tracking of ecosystem health.

## Results

In the 18 months since deployment, the iMagine gateway has processed over **2.3 million images** from 14 active research cruises. Key outcomes:

- Annotation time reduced from an average of **4 minutes per image** (manual) to **under 2 seconds** (automated)
- 6 research groups across Spain, Greece, France and Portugal onboarded without any local infrastructure setup
- Models retrained quarterly using new annotations contributed by the community, improving accuracy by ~3% per cycle

## What's next

The iMagine team is now integrating video stream processing, moving from still-image analysis to real-time classification of underwater video feeds. They are also contributing their fine-tuned models back to the AI4EOSC model catalogue so other marine science gateways can build on their work.
