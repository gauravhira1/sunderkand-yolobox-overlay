Sunderkand YoloBox Web URL Overlay

Files:
- overlay.html = use this URL in YoloBox Pro Web URL Overlay
- control.html = open this on iPhone to control pause/play, speed, reset, and font size
- netlify/functions/state.js = stores live control state using Netlify Blobs

Deploy:
1. Upload this folder to GitHub.
2. In Netlify, create a new site from Git.
3. Use:
   Build command: leave blank
   Publish directory: .
4. Deploy.
5. Open:
   https://your-site.netlify.app/control.html on iPhone
   https://your-site.netlify.app/overlay.html as Web URL Overlay on YoloBox Pro
