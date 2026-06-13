# RYS Libre — Remove YouTube Suggestions
#### A Browser Extension

> **Independent fork — not affiliated with, sponsored by, or endorsed by the original author ([Lawrence Hook](https://lawrencehook.com)).**
> "RYS Libre" is this fork's own name. The original project's product name, logos, and branding remain the trademarks of their owner. This fork uses the Mozilla Public License 2.0's **copyright** grant only; it claims no trademark rights in the upstream project.

---
### Diff with upstream
This fork removes the premium **paywall**: every feature that upstream gated behind a paid license/subscription is unlocked for all users, with no sign-in and no contact with any licensing server. The whole project is licensed under the **MPL 2.0**, which grants the right to modify and redistribute the source — so this is permitted, provided the MPL obligations below are met.

The paywall removal is implemented entirely in the client by treating every user as the `PREMIUM` tier (see `src/content-script/main.js` and `src/shared/license.js`). No upstream feature code was deleted — only the gating checks were neutralized.

### License & redistribution (MPL 2.0)
This fork complies with the Mozilla Public License 2.0:
- The original `LICENSE` (full MPL 2.0 text) is retained unchanged.
- Every modified source file remains licensed under the MPL 2.0 and carries the MPL 2.0 header.
- Full corresponding source is available in this repository.
- Trademark: the extension has been renamed ("RYS Libre"), branding URLs repointed to this fork, and an independence/non-endorsement notice added. MPL grants copyright, not trademark.

### What it does
A browser extension that lets you hide recommendations, customize the interface, and take control of your YouTube experience.

---

### Feedback and Support
Leave a review!
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/remove-youtube-s-suggestions)
- [Chrome](https://chrome.google.com/webstore/detail/remove-youtube-suggestion/cdhdichomdnlaadbndgmagohccgpejae)
- [Google Form](https://docs.google.com/forms/d/1AzQQxTWgG6M5N87jinvXKQkGS6Mehzg19XV4mjteTK0/edit)

All features are free in this fork — the upstream premium paywall has been removed.

---

### Why I made it
YouTube's recommendation algorithm optimizes for the most _engaging_ videos, not the ones you actually want to watch — and it's easy to lose hours to the rabbit hole. This extension lets you cut the noise and use YouTube on your own terms.

Available for download at the links below:
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/remove-youtube-s-suggestions)
- [Chrome](https://chrome.google.com/webstore/detail/remove-youtube-suggestion/cdhdichomdnlaadbndgmagohccgpejae)

---

### Development
This project is 100% open source. Created and maintained by me, [Lawrence Hook](https://lawrencehook.com).  

Have a feature request or found a bug? Feel free to create a Github issue, submit a PR, or contact me at lawrencehook@gmail.com.

```bash
git clone https://github.com/lawrencehook/remove-youtube-suggestions.git
cd remove-youtube-suggestions
npm install --global web-ext

./dev.sh firefox     # opens Firefox with the extension loaded
./dev.sh chrome      # builds dist/chrome/ — load as unpacked in chrome://extensions
```
