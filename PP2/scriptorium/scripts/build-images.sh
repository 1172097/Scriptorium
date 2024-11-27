#!/bin/bash

cd "$(dirname "$0")/../docker"

languages=("python" "javascript" "java" "cpp" "golang" "ruby" "rust" "php" "csharp" "swift")

for lang in "${languages[@]}"; do
  echo "Building $lang image..."
  docker build --memory 2g -t "code-executor-$lang" "$lang/"
done

echo "All images built successfully!"