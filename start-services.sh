#!/bin/bash

# start-services.sh - A script to run all backend services concurrently with nodemon.

# Setup cleanup function to terminate all background services on exit/Ctrl+C
cleanup() {
    echo ""
    echo "============================================="
    echo " Stopping all services...                    "
    echo "============================================="
    # Disable the trap to prevent potential recursive loops
    trap - EXIT INT TERM
    # Kill all background processes spawned by this script
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Trap exit signals
trap cleanup EXIT INT TERM

echo "============================================="
echo " Starting all PrepView Backend Services...   "
echo " Press Ctrl+C to stop all services.          "
echo "============================================="

# Colors for terminal output prefixing
COLOR_AI=$(printf '\033[1;34m')     # Bold Blue
COLOR_DB=$(printf '\033[1;32m')     # Bold Green
COLOR_OCR=$(printf '\033[1;35m')    # Bold Magenta
COLOR_ORCH=$(printf '\033[1;36m')   # Bold Cyan
COLOR_ASSEMBLY=$(printf '\033[1;33m') # Bold Yellow
COLOR_RESET=$(printf '\033[0m')

# Start each service using nodemon from its directory to ensure correct working directory context.
# We redirect standard output and error through sed to prefix the console logs with colored service names.

echo "Launching AI Service..."
(cd Backend/AI_service && nodemon server.js) 2>&1 | sed -u "s/^/${COLOR_AI}[AI Service]${COLOR_RESET} /" &

echo "Launching DB Service..."
(cd Backend/DB_service && nodemon server.js) 2>&1 | sed -u "s/^/${COLOR_DB}[DB Service]${COLOR_RESET} /" &

echo "Launching OCR Service..."
(cd Backend/OCR_Service && nodemon server.js) 2>&1 | sed -u "s/^/${COLOR_OCR}[OCR Service]${COLOR_RESET} /" &

echo "Launching Orchestration Service..."
(cd Backend/Orchestration_service && nodemon server.js) 2>&1 | sed -u "s/^/${COLOR_ORCH}[Orchestration]${COLOR_RESET} /" &

echo "Launching Assembly Service..."
(cd Backend/Assembly_service && nodemon server.js) 2>&1 | sed -u "s/^/${COLOR_ASSEMBLY}[Assembly Service]${COLOR_RESET} /" &

# Wait for all background services to run
wait
