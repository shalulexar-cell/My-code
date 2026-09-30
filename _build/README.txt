Optional: replace the Tailwind CDN script with compiled CSS (faster, no flash of unstyled content).

1. In this folder run:   npm i -D tailwindcss@3
2. Then run:             npx tailwindcss -c tailwind.config.js -i input.css -o ../tailwind.css --minify
3. In every .html file replace
       <script src="https://cdn.tailwindcss.com"></script>
   with
       <link rel="stylesheet" href="/tailwind.css">
   (e.g.  find .. -name "*.html" -exec sed -i 's#<script src="https://cdn.tailwindcss.com"></script>#<link rel="stylesheet" href="/tailwind.css">#' {} +  )
4. Re-run step 2 whenever you add new Tailwind classes. Do not upload the _build folder.
