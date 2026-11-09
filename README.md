# WenYi Dataset

WenYi is a structured dataset of traditional Chinese patterns. It organizes pattern records through four dimensions: Context, Content, Cultural Semantics, and Visual Form.

## Access

- [Browse the dataset repository](https://github.com/WenYiSet/Dataset)
- [Open the interactive WenYi Explorer](https://wenyiset.github.io/Dataset/)
- [Download the latest compact metadata table](releases/latest/metadata/patterns.csv)
- [Read the latest release notes](releases/latest/README.md)

## Current release

The initial public working release contains 3,146 pattern records. This evolving release extends beyond the corpus snapshot used in the WenYi paper. Stable `WY-P` identifiers connect metadata records, images, and the Explorer.

The release includes bilingual metadata, normalized vocabularies, provenance fields, and static web data. Missing source information remains blank. Machine-draft translations and image-derived title suggestions are explicitly marked for continuing review.

See [TRANSLATION.md](TRANSLATION.md) for the translation method and review status.

## Repository structure

```text
PatternImages/             Source image collection
releases/latest/metadata/  Reusable CSV metadata and mappings
releases/latest/web/       Static data consumed by the Explorer
releases/latest/README.md  Release contents and quality status
explorer/                  Source code for the public Explorer
```

## Updating the data

The metadata CSV files are the public data layer. The Explorer reads generated JSON files from `releases/latest/web`. Later metadata and annotation revisions can update these files without changing the repository or Explorer URLs.

## Data availability statement

The WenYi dataset and supporting metadata are available at https://github.com/WenYiSet/Dataset. An interactive exploration system is available at https://wenyiset.github.io/Dataset/.

## License and image rights

Repository metadata and software are provided under the repository license. Rights in individual source images and publications remain with their respective rights holders. See [RIGHTS.md](RIGHTS.md) before reusing images.

## Citation

Please cite the WenYi paper when using the dataset. Full publication details and DOI will be added after publication.
