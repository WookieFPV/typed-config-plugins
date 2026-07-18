import type { ExportCheckResult } from "./verifyExportType";

// `moduleNotFound` on a path that reaches past what a package's `exports` map allows external
// tools to import (`packageExport: true`, see `computePackageExportFlag`) is an *expected*
// consequence of that restriction, not evidence the type shape is wrong - the path was chosen
// specifically because a matching `.d.ts` was found on disk (see `findBestConfigPluginTypePathCombined`).
// Treat it as valid so codegen keeps the real, richly-typed import (suppressed with
// `@ts-expect-error [Package uses \`exports\`...]`), instead of discarding it for `unknown`.
export const isExpectedExportsBlock = (result: ExportCheckResult, packageExport: boolean | undefined): boolean => !result.valid && result.moduleNotFound && !!packageExport;
