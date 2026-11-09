# WenYi Dataset 0.1.0

This is the first usable public working release of the WenYi traditional Chinese pattern dataset. It contains 3,146 pattern records organized through Context, Content, Cultural Semantics, and Visual Form.

## Files

- `metadata/patterns.csv` provides a compact bilingual table for reuse.
- `metadata/records_with_provenance.csv` retains detailed normalization, translation, and review provenance.
- `metadata/data_dictionary.csv` describes the compact table.
- `metadata/value_mapping.csv` documents normalized controlled values.
- `metadata/filename_mapping.csv` links source paths to stable WenYi identifiers and proposed public filenames.
- `metadata/title_suggestions_review.csv` records image-derived title suggestions and review flags.
- `web/` contains the static data used by the online Explorer.

## Quality status

This is an evolving release. Missing source metadata remains blank. Machine-draft translations and image-derived titles are explicitly marked and will be refined in later versions. Stable `WY-P` identifiers will not be reassigned.

See the repository-level `TRANSLATION.md` for the translation method and review status.

## Images and rights

Image files remain in the repository's `PatternImages` directory. Metadata and software licensing does not override rights held by the original image or publication sources. See the repository-level `RIGHTS.md` before reuse.
