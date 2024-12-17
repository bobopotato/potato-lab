const fs = require("fs");
const path = require("path");

const componentsDir = path.join(__dirname, "./src/components");
const indexFile = path.join(__dirname, "./src/index.ts");

fs.readdir(componentsDir, (err, files) => {
  if (err) throw err;

  const exportStatements = files
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => {
      const name = path.basename(file, ".tsx");
      return `export * from './components/${name}';`;
    })
    .join("\n");

  fs.writeFile(indexFile, exportStatements, (err) => {
    if (err) throw err;
    console.log(
      "Shadcn Components Generator - index.ts generated successfully."
    );
  });
});
