- Development: npm run dev
- Production:
  rm -r .next
  npm install
  npm run build
  npm run start

Notes:
if any error happens,

delete both folders .next and node_modules and run

npm cache clean --force

build with docker

docker-compose up --build -d
