# RYS — Remove YouTube Suggestions
#### A Browser Extension

---
### Diff with upstream
Removes paywall, whole project is under MPL 2.0 licence so technically im not doing anything wrong. I dont like paywalls, it should have been donation based as before but that is a decision doest concern me. Anyways if anyone wants to use this version, I spend some time with Claude to remove paywall so you dont pay and you dont spend time to use "the features you have already been achieved".

### What it does
A browser extension that lets you hide recommendations, customize the interface, and take control of your YouTube experience.

---

### Feedback and Support
Leave a review!
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/remove-youtube-s-suggestions)
- [Chrome](https://chrome.google.com/webstore/detail/remove-youtube-suggestion/cdhdichomdnlaadbndgmagohccgpejae)
- [Google Form](https://docs.google.com/forms/d/1AzQQxTWgG6M5N87jinvXKQkGS6Mehzg19XV4mjteTK0/edit)

Free to use with optional [premium features](https://lawrencehook.com/rys/premium/).

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
