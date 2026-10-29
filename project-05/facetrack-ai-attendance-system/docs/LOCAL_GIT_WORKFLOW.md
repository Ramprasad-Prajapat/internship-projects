# FaceTrack-AI — Local Git Workflow

This project uses **local Git only**. There is **no remote** and nothing is ever
pushed. Commits are **manual checkpoints** that you (the user) approve.

> Run all git commands from the project root:
> `r:\Inernship\WebDevelopment\Project\FaceTrack-AI` (this is where `.git` lives).

## Golden rules

- **Local only** — no remote repository, no `git push`, no `git remote add`.
- **Commits are manual checkpoints.** Claude must **never** commit on its own.
- Claude only commits when you explicitly say one of:
  **"commit now"**, **"make checkpoint"**, **"create local commit"**,
  **"create baseline commit"**.
- Before changing code, Claude runs `git status`.
- After changing code, Claude reports status + changed files (+ build result if
  frontend changed) and states clearly that **no commit was created** unless you
  asked.

## Check what changed

```bash
git status                 # what is modified / staged / untracked
git diff                   # exact line changes (unstaged)
git diff --stat            # summary of changed files + line counts
```

## Create a checkpoint (ONLY when you approve)

```bash
git add .
git commit -m "checkpoint: describe the change"
```

Use a clear message, e.g. `checkpoint: employee attendance sign-in/out toggle`.

## See commit history

```bash
git log --oneline --decorate --graph
```

## Roll back UNCOMMITTED changes (working directory)

```bash
git restore .                  # discard ALL uncommitted changes (careful!)
git restore path/to/file       # discard changes to ONE file only
```

> `git restore` permanently drops uncommitted edits to the affected files.
> Always run `git status` first so you know what you would lose.

## Roll back to a PREVIOUS COMMITTED state

```bash
git log --oneline              # find the commit hash you want
git reset --hard COMMIT_HASH   # move the project back to that commit
```

> ⚠️ **`git reset --hard` deletes all uncommitted changes** and rewinds history.
> Always run `git status` first and confirm before using it. If you have work you
> are not ready to lose, stash it (below) or make a checkpoint commit first.

## Temporarily save uncommitted work WITHOUT committing

```bash
git stash push -m "temporary save before rollback"
```

Restore it later:

```bash
git stash list                 # see saved stashes
git stash pop                  # re-apply the most recent stash (and remove it)
```

## Helper scripts (read-only, never commit)

From the project root:

```powershell
powershell -ExecutionPolicy RemoteSigned -File scripts/git-status.ps1   # status + recent history
powershell -ExecutionPolicy RemoteSigned -File scripts/git-diff.ps1     # status + diff stat + full diff
```

Neither script stages, commits, pushes, or modifies anything.

## Rolling back a docs cleanup (or any uncommitted change)

If a cleanup/edit is **not committed yet** and you don't like it, discard all
uncommitted changes:

```bash
git restore .
```

> This reverts every tracked file back to the last commit. Newly created
> (untracked) files are not touched by `git restore` — remove those manually if
> needed. Run `git status` first to see exactly what will change.

If the cleanup **looks good** and you want to keep it, ask Claude:

```text
commit now: docs cleanup and consolidate markdown files
```

(Claude will not commit until you say one of the explicit checkpoint phrases.)

## Rollback flow Claude follows when you ask to "roll back"

1. Run `git status` first.
2. Explain whether the changes are **committed** or **uncommitted**.
3. Suggest the **safest** matching command (`git restore` for uncommitted,
   `git stash` to set work aside, `git reset --hard` only for committed rewind).
4. Run destructive commands (`git reset --hard`, `git restore .`) **only after
   your explicit confirmation**.
