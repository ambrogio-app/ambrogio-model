#!/usr/bin/env bash
# reqvire-workspace.sh — shared helpers of the workspace scripts. Source it, do not run it.
#
#   workspace_root [DIR]      -> absolute workspace root: DIR, default the folder that contains
#                                ambrogio-model (the parent of this repository)
#   workspace_worktrees ROOT  -> prints the repositories of the model, one per line, relative to
#                                ROOT: every immediate child folder that is the top level of a valid
#                                Git worktree and contains system-model/
#   workspace_mirror ROOT     -> prints a temporary folder with, for every repository of the model, the
#                                files Git sees (tracked, or untracked and not ignored) and an empty Git
#                                worktree: Reqvire reads it in seconds, while on the real folder it also
#                                walks the installed dependencies. The caller removes the folder.
#   reqvire_cmd               -> sets REQVIRE_CMD (array) to run Reqvire at the exact pinned version:
#                                $REQVIRE (local binary), else npx with $REQVIRE_NPX_PACKAGE, else the
#                                version in ambrogio-model/.reqvire-version; never a floating version
set -euo pipefail

MODEL_REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

workspace_root() {
  cd "${1:-$MODEL_REPO/..}" && pwd
}

workspace_worktrees() {
  local root="$1" d top
  for d in "$root"/*/; do
    d="${d%/}"
    [ -d "$d/system-model" ] || continue
    top="$(git -C "$d" rev-parse --show-toplevel 2>/dev/null)" || continue
    [ "$top" = "$(cd "$d" && pwd -P)" ] && basename "$d"
  done
}

workspace_mirror() {
  local root="$1" mirror r
  mirror="$(mktemp -d)"
  while read -r r; do
    mkdir -p "$mirror/$r"
    (cd "$root/$r" && git ls-files -co --exclude-standard -z | xargs -0 -r cp --parents -t "$mirror/$r" 2>/dev/null || true)
    git -C "$mirror/$r" init -q
  done < <(workspace_worktrees "$root")
  echo "$mirror"
}

reqvire_cmd() {
  local package=""
  if [ -n "${REQVIRE:-}" ]; then
    REQVIRE_CMD=("$REQVIRE")
    return
  fi
  package="${REQVIRE_NPX_PACKAGE:-}"
  if [ -z "$package" ] && [ -f "$MODEL_REPO/.reqvire-version" ]; then
    package="$(tr -d '[:space:]' < "$MODEL_REPO/.reqvire-version")"
    case "$package" in *@*) ;; *) package="@reqvire-org/reqvire@$package" ;; esac
  fi
  case "$package" in
    ""|*@latest|*@next) echo "reqvire version not pinned: write the exact version in $MODEL_REPO/.reqvire-version" >&2; return 1 ;;
  esac
  export npm_config_loglevel=error
  REQVIRE_CMD=(npx -y "$package")
}
