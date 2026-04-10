#!/bin/sh
set -e

URL=$(vercel --prod 2>&1 | grep -o 'https://design-prototyping-[a-z0-9]*-sianking3-gmailcoms-projects\.vercel\.app' | head -1)

echo "Production deployed to: $URL"

vercel alias "$URL" algolia-agentic-prototyping.vercel.app

echo "Alias updated."
