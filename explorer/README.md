# WenYi Explorer

WenYi Explorer is an interactive interface for browsing the WenYi traditional Chinese pattern dataset. It supports bilingual search and filtering across Context, Content, Cultural Semantics, and Visual Form.

## Online access

- Explorer: https://wenyiset.github.io/Dataset/
- Dataset: https://github.com/WenYiSet/Dataset

## Data flow

The Explorer reads three generated files from the Dataset repository:

```text
releases/latest/web/records.json
releases/latest/web/facets.json
releases/latest/web/version.json
```

The interface derives its filters and record content from these files. Updating the published data does not require changes to the front-end source.

## Local development

Install dependencies:

```bash
npm install
```

Start the local data and image server:

```bash
cd python
python -m pip install -r requirements.txt
WENYI_WEB_DATA_DIR=../../../Dataset/release_staging/normalized_web_export \
WENYI_IMAGE_DIR=../../../Dataset/PatternImages \
PORT=5055 \
python app.py
```

Start the front end in another terminal:

```bash
VITE_DATA_BASE_URL=http://127.0.0.1:5055/data \
VITE_IMAGE_BASE_URL=http://127.0.0.1:5055/images \
npm run dev
```

Build a production bundle:

```bash
VITE_DATA_BASE_URL=https://raw.githubusercontent.com/WenYiSet/Dataset/main/releases/latest/web \
VITE_IMAGE_BASE_URL=https://raw.githubusercontent.com/WenYiSet/Dataset/main/PatternImages \
npm run build -- --base=/Dataset/
```

## Annotation status

English fields may come from existing annotations, curated project glossaries, or local machine-generated drafts. The data records retain translation provenance and review status. When no usable English value is available, the English interface displays `Translation pending` rather than silently displaying Chinese.

Image-derived titles and machine-draft translations remain reviewable data. Later reviewed values can replace them without changing stable record IDs or the Explorer URL.

## Favorites

Favorites are stored in the browser's local storage. They can be added or removed from gallery cards, record details, or the favorites drawer. Clearing site data also clears the saved favorites.

## License

See the repository license. Image rights remain source-specific and are documented separately in the Dataset repository.
