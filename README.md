<p align="center">
  <img src=".github/logo.svg" alt="Ambrogio" width="160">
</p>

# Ambrogio model

**Ambrogio**: talk to it like Alexa, chat with it like ChatGPT — one self-hosted AI assistant for your whole homelab. Multi-agent by design: each agent you configure handles one job, such as the house, music, weather or your documents, using the services you already host.

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
