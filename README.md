TruliCare repository

Why you saw the error:
- Git reported `error: src refspec main does not match any` because there was no commit on a `main` branch yet. You ran `git add .` earlier, but there were no files tracked because empty directories are not tracked by Git. Without any commits, there is no `main` ref to push.

What I added locally:
- `backend/.gitkeep` and `frontend/.gitkeep` so those directories can be tracked.
- This `README.md` with instructions.

How to finish (PowerShell):

```powershell
# from E:\trulicare
git add .
# create the initial commit (use the same message you wanted)
git commit -m "initial folder structure"
# rename the branch to main (if not already done)
git branch -M main
# push to the remote (you already added origin earlier)
git push -u origin main
```

If `git commit` still says "nothing to commit", run `git status` and ensure files are listed as staged. If you previously added `origin`, you don't need to re-add it; if adding a remote fails, remove with `git remote remove origin` and re-add.
