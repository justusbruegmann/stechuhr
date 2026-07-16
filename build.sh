
set -euo pipefail

cd "$(dirname "$0")"

echo "Backend build"
(cd backend && npx tsc)

echo "Frontend Build"
(cd frontend && npm run build)

echo "done"