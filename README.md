# Ambrogio model

Product-wide part of the Reqvire engineering model of Ambrogio, and the tools that check the model across repositories.

Ambrogio is modelled as one Reqvire model spread over the repositories of the product, checked out side by side in one workspace folder:

```text
<workspace>/
├── ambrogio-model/      product capabilities, shared vocabulary, cross-cutting decisions, workspace scripts
├── ambrogio-backend/
├── ambrogio-satellite/
├── ambrogio-cli/
└── ambrogio-web/
```

The product repositories link to this one; this repository links to none of them.
