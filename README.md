# lastminute_mobile

npm i

-----
Install cross-env:
sh
Copy
Edit
npm install cross-env --save-dev
Update your package.json script:
json
Copy
Edit
"scripts": {
  "dev": "cross-env EXPO_NO_TELEMETRY=1 expo start"
}
Run:
sh
Copy
Edit
npm run dev
