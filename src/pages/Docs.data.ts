import { useParams, useLocation, RouteDataFunc } from 'solid-app-router';
import { createResource } from 'solid-js';
import { useI18n } from '@solid-primitives/i18n';

export type DataParams = {
  version: string;
  lang: string;
  resource: string;
};

const currentVersion = '1.0.0';
const availableLangs = ['br', 'en', 'de', 'pt', 'fr', 'id', 'it', 'ja', 'pt', 'ru', 'zh-cn'];

const cache = new Map<string, Promise<string>>();

function mdFetcher({ version, lang, resource }: DataParams) {
  const cacheKey = `${version}-${resource}-${lang}`;
  if (!cache.has(cacheKey)) {
    const markdown = fetch(`/docs/${version}/${lang}/${resource}.json`).then((r) => r.json());
    cache.set(cacheKey, markdown);
  }
  return cache.get(cacheKey);
}

export const DocsData: RouteDataFunc = () => {
  const params = useParams();
  const [, { locale }] = useI18n();
  const location = useLocation();
  const paramList = (): DataParams => {
    const version =
      params.version && params.version !== 'latest' ? params.version! : currentVersion;
    const lang = location.query.locale ? (location.query.locale as string) : locale();
    const resource = location.pathname.includes('/guide') ? 'guide' : 'api';
    return {
      version,
      lang: availableLangs.includes(lang) ? lang : 'en',
      resource,
    };
  };
  const [doc] = createResource(paramList, mdFetcher);
  return {
    get langAvailable() {
      const lang = location.query.locale ? (location.query.locale as string) : locale();
      return !availableLangs.includes(lang);
    },
    get doc() {
      return doc();
    },
    get loading() {
      return doc.loading;
    },
    get version() {
      return paramList().version;
    },
    get params() {
      return paramList;
    },
  };
};
