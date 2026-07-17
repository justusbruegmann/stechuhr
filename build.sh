
set -euo pipefail

cd "$(dirname "$0")"

echo "Backend build"
(cd backend && npm install && npx tsc)

echo "Frontend Build"
(cd frontend && npm install && npm run build)

echo "done"