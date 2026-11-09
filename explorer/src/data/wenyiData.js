const trimTrailingSlash = (value) => (value || '').replace(/\/+$/, '');

export const DATA_BASE_URL = trimTrailingSlash(import.meta.env.VITE_DATA_BASE_URL);
export const IMAGE_BASE_URL = trimTrailingSlash(import.meta.env.VITE_IMAGE_BASE_URL);

const CANONICAL_LABELS = {
  vessel: { zh: '器物', en: 'Vessel' },
  architecture_sculpture: { zh: '建筑与雕塑', en: 'Architecture & Sculpture' },
  textile: { zh: '织绣', en: 'Textile' },
  adornment: { zh: '装饰', en: 'Adornment' },
  pictorial_work: { zh: '平面绘画', en: 'Pictorial Work' },
  implement: { zh: '工具', en: 'Implement' },
  unknown: { zh: '不详', en: 'Unknown' },
  auspiciousness: { zh: '吉祥', en: 'Auspiciousness' },
  narrativity: { zh: '叙事', en: 'Narrativity' },
  identity: { zh: '身份', en: 'Identity' },
  ideology: { zh: '思想', en: 'Ideology' },
  aestheticity: { zh: '审美', en: 'Aestheticity' },
  animal: { zh: '动物', en: 'Animal' },
  plant: { zh: '植物', en: 'Plant' },
  nature: { zh: '自然', en: 'Nature' },
  human_artifact: { zh: '人与人造物', en: 'Human & Artifact' },
  single: { zh: '单体', en: 'Single' },
  repeat_tile: { zh: '重复与平铺', en: 'Repeat and Tile' },
  scene_combination: { zh: '场景性组合', en: 'Scene Combination' },
  decorative_combination: { zh: '装饰性组合', en: 'Decorative Combination' },
  realistic: { zh: '写实', en: 'Realistic' },
  abstract: { zh: '抽象', en: 'Abstract' },
  stone_age: { zh: '石器时代', en: 'Stone Age' },
  neolithic: { zh: '新石器时代', en: 'Neolithic' },
  shang: { zh: '商代', en: 'Shang' },
  western_zhou: { zh: '西周', en: 'Western Zhou' },
  spring_autumn: { zh: '春秋', en: 'Spring and Autumn' },
  warring_states: { zh: '战国', en: 'Warring States' },
  qin: { zh: '秦代', en: 'Qin' },
  han: { zh: '汉代', en: 'Han' },
  western_han: { zh: '西汉', en: 'Western Han' },
  eastern_han: { zh: '东汉', en: 'Eastern Han' },
  wei_jin: { zh: '魏晋', en: 'Wei and Jin' },
  northern_southern: { zh: '南北朝', en: 'Northern and Southern Dynasties' },
  sui: { zh: '隋代', en: 'Sui' },
  tang: { zh: '唐代', en: 'Tang' },
  five_dynasties: { zh: '五代', en: 'Five Dynasties' },
  song: { zh: '宋代', en: 'Song' },
  liao: { zh: '辽代', en: 'Liao' },
  yuan: { zh: '元代', en: 'Yuan' },
  ming: { zh: '明代', en: 'Ming' },
  qing: { zh: '清代', en: 'Qing' },
  modern: { zh: '近现代', en: 'Modern' },
};

const VALUE_ALIASES = {
  '建筑和雕塑': 'architecture_sculpture',
  '人和人造物': 'human_artifact',
};

const FACET_ORDERS = {
  carrierCategories: [
    'vessel',
    'architecture_sculpture',
    'textile',
    'adornment',
    'pictorial_work',
    'implement',
    'unknown',
  ],
  semanticDomains: ['auspiciousness', 'narrativity', 'identity', 'ideology', 'aestheticity'],
  motifCategories: ['animal', 'plant', 'nature', 'human_artifact'],
  visualStructures: ['single', 'repeat_tile', 'scene_combination', 'decorative_combination'],
  visualStyles: ['realistic', 'abstract'],
  periods: [
    'stone_age',
    'neolithic',
    'shang',
    'western_zhou',
    'spring_autumn',
    'warring_states',
    'qin',
    'han',
    'western_han',
    'eastern_han',
    'wei_jin',
    'northern_southern',
    'sui',
    'tang',
    'five_dynasties',
    'song',
    'liao',
    'yuan',
    'ming',
    'qing',
    'modern',
    'unknown',
  ],
};

const LABEL_BY_TEXT = Object.fromEntries(
  Object.values(CANONICAL_LABELS).flatMap((labels) => [
    [labels.zh, labels],
    [labels.en, labels],
  ]),
);

const CODE_BY_TEXT = Object.fromEntries(
  Object.entries(CANONICAL_LABELS).flatMap(([code, labels]) => [
    [labels.zh, code],
    [labels.en, code],
  ]),
);

function canonicalValue(value) {
  if (typeof value !== 'string') return value;
  if (CANONICAL_LABELS[value]) return value;
  if (VALUE_ALIASES[value]) return VALUE_ALIASES[value];
  return CODE_BY_TEXT[value] || value;
}

export function isStaticDataMode() {
  return Boolean(DATA_BASE_URL);
}

function dataUrl(filename) {
  return `${DATA_BASE_URL}/${filename}`;
}

async function fetchJson(filename) {
  const response = await fetch(dataUrl(filename), { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Unable to load ${filename}: HTTP ${response.status}`);
  }
  return response.json();
}

function encodeRelativePath(path) {
  return String(path || '')
    .split('/')
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join('/');
}

export function resolveImageUrl(image) {
  if (!image) return null;
  if (image.publicUrl) {
    try {
      return new URL(image.publicUrl, `${DATA_BASE_URL}/`).href;
    } catch {
      return image.publicUrl;
    }
  }
  if (!IMAGE_BASE_URL || !image.localReference) return null;
  return `${IMAGE_BASE_URL}/${encodeRelativePath(image.localReference)}`;
}

function prepareRecord(record) {
  return {
    ...record,
    image: {
      ...(record.image || {}),
      resolvedUrl: resolveImageUrl(record.image),
    },
  };
}

function labelObject(value) {
  if (value && typeof value === 'object') {
    return value.labels || value.label || value;
  }
  const canonical = canonicalValue(value);
  if (CANONICAL_LABELS[canonical]) return CANONICAL_LABELS[canonical];
  if (LABEL_BY_TEXT[value]) return LABEL_BY_TEXT[value];
  return /[\u3400-\u9fff]/.test(String(value || ''))
    ? { zh: value, en: '' }
    : { zh: '', en: value };
}

export function localizedValue(value, language = 'Chinese') {
  const labels = labelObject(value);
  return language === 'English'
    ? (labels.en || (labels.zh ? 'Translation pending' : ''))
    : (labels.zh || labels.en || value || '');
}

export function localizedList(container, key, language = 'Chinese') {
  if (!container) return [];
  const englishKey = `${key}En`;
  const labelKey = `${key}Labels`;
  const values = language === 'English' && Array.isArray(container[englishKey]) && container[englishKey].length
    ? container[englishKey]
    : (Array.isArray(container[labelKey]) && container[labelKey].length
      ? container[labelKey]
      : (container[key] || []));
  return values.map((value) => localizedValue(value, language)).filter(Boolean);
}

export function facetOptions(facets, name, language = 'Chinese') {
  const entries = facets?.facets?.[name];
  if (!Array.isArray(entries)) return [];
  const optionsByValue = new Map();
  entries.forEach((entry, sourceIndex) => {
    const value = canonicalValue(entry.code || entry.value);
    if (!value) return;
    const option = {
      value,
      label: localizedValue(entry.labels || entry.label || value, language),
      count: Number(entry.count || 0),
      order: Number.isFinite(Number(entry.order)) ? Number(entry.order) : null,
      sourceIndex,
    };
    const existing = optionsByValue.get(value);
    if (existing) {
      existing.count += option.count;
      return;
    }
    optionsByValue.set(value, option);
  });

  const preferredOrder = FACET_ORDERS[name] || [];
  return [...optionsByValue.values()].sort((left, right) => {
    if (left.order !== null || right.order !== null) {
      return (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
    }
    const leftIndex = preferredOrder.indexOf(left.value);
    const rightIndex = preferredOrder.indexOf(right.value);
    const leftRank = leftIndex === -1 ? preferredOrder.length : leftIndex;
    const rightRank = rightIndex === -1 ? preferredOrder.length : rightIndex;
    if (leftRank !== rightRank) return leftRank - rightRank;
    return left.sourceIndex - right.sourceIndex;
  });
}

export function matchesFacetValues(values, selected) {
  if (!selected.length) return true;
  const normalized = new Set((values || []).map((value) => canonicalValue(value)));
  return selected.some((value) => normalized.has(canonicalValue(value)));
}

export async function loadStaticDataset() {
  if (!isStaticDataMode()) {
    throw new Error('VITE_DATA_BASE_URL is not configured.');
  }
  const [records, facets, version] = await Promise.all([
    fetchJson('records.json'),
    fetchJson('facets.json'),
    fetchJson('version.json'),
  ]);
  if (!Array.isArray(records)) {
    throw new Error('records.json must contain an array.');
  }
  return {
    records: records.map(prepareRecord),
    facets,
    version,
  };
}

export function recordSearchText(record) {
  const values = [
    record.id,
    record.title?.zh,
    record.title?.en,
    record.description?.zh,
    record.description?.en,
    record.sourceReference,
    ...(record.motifs?.categories || []),
    ...(record.motifs?.categoriesEn || []),
    ...localizedList(record.motifs, 'categories', 'Chinese'),
    ...localizedList(record.motifs, 'categories', 'English'),
    ...(record.motifs?.types || []),
    ...(record.motifs?.typesEn || []),
    ...localizedList(record.motifs, 'types', 'Chinese'),
    ...localizedList(record.motifs, 'types', 'English'),
    ...(record.context?.carrierCategories || []),
    ...(record.context?.carrierCategoriesEn || []),
    ...localizedList(record.context, 'carrierCategories', 'Chinese'),
    ...localizedList(record.context, 'carrierCategories', 'English'),
    ...(record.context?.carrierTypes || []),
    ...(record.context?.carrierTypesEn || []),
    ...localizedList(record.context, 'carrierTypes', 'Chinese'),
    ...localizedList(record.context, 'carrierTypes', 'English'),
    ...(record.context?.periods || []),
    ...(record.context?.periodsEn || []),
    ...localizedList(record.context, 'periods', 'Chinese'),
    ...localizedList(record.context, 'periods', 'English'),
    record.context?.periodDetail,
    record.context?.carrierDetail,
    record.context?.place?.zh,
    record.context?.place?.en,
    ...(record.semantics?.domains || []),
    ...(record.semantics?.domainsEn || []),
    ...localizedList(record.semantics, 'domains', 'Chinese'),
    ...localizedList(record.semantics, 'domains', 'English'),
    ...(record.semantics?.keywords || []),
    ...(record.semantics?.keywordsEn || []),
    ...localizedList(record.semantics, 'keywords', 'Chinese'),
    ...localizedList(record.semantics, 'keywords', 'English'),
    record.semantics?.description?.zh,
    record.semantics?.description?.en,
    ...(record.visualForm?.structures || []),
    ...(record.visualForm?.structuresEn || []),
    ...localizedList(record.visualForm, 'structures', 'Chinese'),
    ...localizedList(record.visualForm, 'structures', 'English'),
    ...(record.visualForm?.morphologies || []),
    ...(record.visualForm?.styles || []),
    ...(record.visualForm?.stylesEn || []),
    ...localizedList(record.visualForm, 'styles', 'Chinese'),
    ...localizedList(record.visualForm, 'styles', 'English'),
    ...(record.visualForm?.qualities || []),
  ];
  return values.filter(Boolean).join(' ').toLocaleLowerCase();
}

export function facetValues(facets, name) {
  return facetOptions(facets, name).map((entry) => entry.value);
}
