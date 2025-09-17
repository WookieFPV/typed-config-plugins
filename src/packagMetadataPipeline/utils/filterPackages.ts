import type { RnDep } from "./types";

export const isPackageNotUnmaintained = (dep: RnDep) => dep.unmaintained !== true;
