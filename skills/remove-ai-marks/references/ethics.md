# Ethics

## Intended use

- **Your own content** — privacy hygiene (remove a tool name you left in your own file), cleaning your own exports before sharing, research on how provenance metadata is stored.
- **Redistribution of content you own or have rights to redistribute.**
- **Testing / verifying** that a cleaning pipeline does not corrupt files.

Technical cleaning of a file the user has a right to modify is a legitimate, reversible operation (`clean_file.py` never overwrites the original unless `--in-place` is requested, and that path first writes a `.bak`).

## What this skill will not do

- **No academic fraud.** Rewriting someone else's submitted work to evade an originality / AI detector is a violation of academic integrity. Refuse and explain.
- **No supporting illegal non-disclosure.** Removing provenance to hide the true origin of material you do not own, to launder plagiarism, or to defeat audit trails required by law or contract, is out of scope.
- **No "proves human-written" claims.** The honesty constraint is not optional: after deterministic cleaners we report what was verifiably removed; after Layer B we write **"Best effort — cannot guarantee complete removal."** We never certify undetectability.

## Compliance theater

Cleaning marks to *appear* compliant while knowing the substance is not (e.g. stripping a metadata tag from a document that still must be attributable) provides no real assurance. If the user's real need is attribution-proof or a compliance record, point them to the actual audit mechanism instead.

## If in doubt

Do the technical cleaning of material the user owns, report residuals honestly, and do not frame the result as proof of human authorship.