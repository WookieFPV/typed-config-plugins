/**
 * Converts an npm package name to camelCase.
 *
 * Examples:
 * - "react-dom" → "reactDom"
 * - "@angular/core" → "angularCore"
 * - "lodash.get" → "lodashGet"
 * - "@react-native-firebase/app" → "reactNativeFirebaseApp"
 *
 * @param packageName The npm package name to convert
 * @returns The camelCase version of the package name
 */
export function packageNameToCamelCase(packageName: string): string {
    // Handle scoped packages by removing @ and replacing / with -
    const normalizedName = packageName.replace(/^@/, "").replace(/\//g, "-");

    // Split by common separators (hyphen, dot)
    const parts = normalizedName.split(/[-.]/);

    // Convert to camelCase
    return parts
        .map((part, index) => {
            // Keep first part lowercase, capitalize others
            if (index === 0) {
                return part.toLowerCase();
            }

            // Capitalize first letter of other parts
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join("");
}
