// update-paths.js
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

async function getConfigBasePath() {
    const astroConfig = await import("./astro.config.mjs"); // Dynamically import config
    const basePath = astroConfig.default.base;
    const site = astroConfig.default.site;
    return `${site}/${basePath}`;
}

const __dirname = new URL(".", import.meta.url).pathname;

async function updatePaths(basePath) {
    const distDir = join(__dirname, "dist");

    function updateFilePaths(filePath) {
        let content = readFileSync(filePath, "utf8");
        content = content.replace(/href="\.\//g, `href="${basePath}/`)
            .replace(/src="\.\//g, `src="${basePath}/`);

        // account for rel paths in the data-mapstyle attribute as well
        const dataMapstyleRegex = /data-mapstyle="([^"]*)"/g;
        const dataLayersRegex = /data-layers="([^"]*)"/g;
        
        content = content.replace(dataLayersRegex, (match, jsonStr) => {
            try {
                // Decode the JSON-like string
                const decoded = JSON.parse(
                    jsonStr.replace(/&quot;/g, "\"").replace(/&#34;/g, "\"")
                );

                // Update each layer's URL if it’s a relative path
                const updatedLayers = decoded.map(layer => {
                    if (layer.url && layer.url.startsWith("./")) {
                        layer.url = `${basePath}${layer.url.slice(1)}`; // Remove './' and prepend base path
                    }
                    return layer;
                });

                // Re-encode the updated JSON with escaped double quotes
                const encoded = JSON.stringify(updatedLayers).replace(/"/g, "&quot;");
                return `data-layers="${encoded}"`;
            } catch (error) {
                console.error(`Failed to parse data-layers JSON in file ${filePath}:`, error);
                return match; // Return original if parsing fails
            }
        }).replace(dataMapstyleRegex, (match, jsonStr) => {
            try {
                // Decode the JSON-like string
                const decoded = JSON.parse(
                    jsonStr.replace(/&quot;/g, "\"").replace(/&#34;/g, "\"")
                );

                // Update each layer's URL if it’s a relative path
                const updatedLayers = decoded.map(layer => {
                    if (layer.url && layer.url.startsWith("./")) {
                        layer.url = `${basePath}${layer.url.slice(1)}`; // Remove './' and prepend base path
                    }
                    return layer;
                });

                // Re-encode the updated JSON with escaped double quotes
                const encoded = JSON.stringify(updatedLayers).replace(/"/g, "&quot;");
                return `data-mapstyle="${encoded}"`;
            } catch (error) {
                console.error(`Failed to parse data-layers JSON in file ${filePath}:`, error);
                return match; // Return original if parsing fails
            }
        });
        writeFileSync(filePath, content, "utf8");
    }



    function processDirectory(dir) {
        readdirSync(dir).forEach((file) => {
            const filePath = join(dir, file);
            if (statSync(filePath).isDirectory()) {
                processDirectory(filePath);
            } else if (file.endsWith(".html")) {
                updateFilePaths(filePath);
            }
        });
    }

    processDirectory(distDir);
}

// Run the script with the base path from astro.config.mjs
getConfigBasePath().then((basePath) => {
    console.log(`Using base path: ${basePath}`);
    updatePaths(basePath);
}).catch((err) => {
    console.error("Error reading base path from astro.config.mjs:", err);
});
