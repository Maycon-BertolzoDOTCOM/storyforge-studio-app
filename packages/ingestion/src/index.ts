export type {
  IngestionConfig,
  Product,
  CatalogResult,
  VideoSummary,
  CompetitorResult,
} from "./types";

export {
  scrapeCatalog,
  extractCatalogViaBrowser,
  monitorCompetitor,
} from "./http-scraper";

export { summarizeNoteGPT } from "./notept";
