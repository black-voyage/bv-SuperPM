# Stage gate map

A launch can only be pushed to the next stage when **every** exit criterion below is met (task marked `[x]`). ◆ = Ben decision gate. "Mandatory departments" block the push; other departments may contribute without blocking.

| # | Stage → next | Mandatory departments | Exit criteria (all required to advance) |
|---|--------------|----------------------|------------------------------------------|
| 1 | Concept → Build | Product, Ben ◆ | Intake form complete (why, spec, customer, price); market research done; concept definition done; Ben concept sign-off ◆. (Catalog: competitor analysis — contributes.) |
| 2 | Build → Production | Product, Design, Ben ◆ | Prototype 1-2-3 approved; Ben validation ◆; costing & profit signed off; packaging / insert / manual locked; model name set. |
| 3 | Production → Content | Product, Logistics | Design freeze; pre-production sample approved + BOM provided; mass production complete; freight booked (sea bulk + air samples). |
| 4 | Content → Listing creation | Content, Design | Hero / lifestyle shoot done; post-production done; content exported (instruction / lifestyle / social clips); A+ / infographic assets ready. |
| 5 | Listing creation → Live | Catalog, Design, Ben ◆ | Amazon SKU created; Shopify SKU created; product data filed → marketing brief; brand language confirmed ◆; listing imagery / A+ uploaded. |
| 6 | Live → Marketing | Catalog, Marketing | Listings published live (Amazon + Shopify); product marketing brief finalized & marked "ready" (handoff that unblocks the influencer engine). |
| 7 | Marketing (final) | Marketing, Social, Ads | KOL / influencer projects live; channel posts live (IG / YouTube / TikTok); launch ads running; launch email sequence sent. (Email / CRM contribute.) |

Assumptions to confirm with Ben: Content is sequenced before Listing creation; the "marketing brief ready" gate sits at Live → Marketing.

## Machine-readable form (`config/gate-map.yaml`)

```yaml
stages: [Concept, Build, Production, Content, Listing creation, Live, Marketing]
gates:
  Concept:
    mandatory: [Product]
    ben_gate: true
    exit_criteria:
      - { task: "Form (intake)", dept: Product }
      - { task: "Market research", dept: Product }
      - { task: "Concept definition", dept: Product }
      - { task: "Ben concept sign-off ◆", dept: Product }
  Build:
    mandatory: [Product, Design]
    ben_gate: true
    exit_criteria:
      - { task: "Prototype 1-2-3 approved", dept: Product }
      - { task: "Ben validation ◆", dept: Product }
      - { task: "Costing & profit signed off", dept: Product }
      - { task: "Packaging / insert / manual locked", dept: Design }
      - { task: "Model name set", dept: Design }
  Production:
    mandatory: [Product, Logistics]
    ben_gate: false
    exit_criteria:
      - { task: "Design freeze", dept: Product }
      - { task: "Pre-production sample approved + BOM", dept: Product }
      - { task: "Mass production complete", dept: Product }
      - { task: "Freight booked (sea + air samples)", dept: Logistics }
  Content:
    mandatory: [Content, Design]
    ben_gate: false
    exit_criteria:
      - { task: "Hero / lifestyle shoot done", dept: Content }
      - { task: "Post-production done", dept: Content }
      - { task: "Content exported", dept: Content }
      - { task: "A+ / infographic assets ready", dept: Design }
  Listing creation:
    mandatory: [Catalog, Design]
    ben_gate: true
    exit_criteria:
      - { task: "Amazon SKU created", dept: Catalog }
      - { task: "Shopify SKU created", dept: Catalog }
      - { task: "Product data filed → marketing brief", dept: Catalog }
      - { task: "Brand language confirmed ◆", dept: Catalog }
      - { task: "Listing imagery / A+ uploaded", dept: Design }
  Live:
    mandatory: [Catalog, Marketing]
    ben_gate: false
    exit_criteria:
      - { task: "Listings published live (Amazon + Shopify)", dept: Catalog }
      - { task: "Marketing brief finalized & ready", dept: Marketing }
  Marketing:
    mandatory: [Marketing, Social, Ads]
    ben_gate: false
    final: true
    exit_criteria:
      - { task: "KOL / influencer projects live", dept: Marketing }
      - { task: "Channel posts live (IG / YouTube / TikTok)", dept: Social }
      - { task: "Launch ads running", dept: Ads }
      - { task: "Launch email sequence sent", dept: Email }
```
