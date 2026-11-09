# English translation status

The Chinese metadata is retained as the primary source layer. English values in the initial release combine recovered existing translations, curated glossary mappings, rule-based compositions, and local machine-generated drafts.

The local draft pass used `Qwen/Qwen2.5-1.5B-Instruct` revision `989aa7980e4cf806f80c7fef2b1adb7bc71aa306` with MLX 0.29.1 and 4-bit quantization. Outputs containing residual Chinese text, prompt echoes, non-linguistic text, or unstable repetition were rejected and are shown as `Translation pending` in the Explorer.

Machine-draft values are not treated as human-validated translations. Detailed provenance and review status are available in `releases/latest/metadata/records_with_provenance.csv`. Future releases will replace reviewed drafts without changing stable `WY-P` identifiers.
