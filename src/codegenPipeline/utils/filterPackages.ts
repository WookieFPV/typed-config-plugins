import type { RnDep } from "./types";

export const isPackageNotUnmaintained = (dep: RnDep) => dep.unmaintained !== true;

export const sortByPackage = (a: RnDep, b: RnDep) => a?.npmPkg?.localeCompare(b?.npmPkg ?? "") ?? 0;
