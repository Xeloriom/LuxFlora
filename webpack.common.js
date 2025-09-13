const path = require('path');

module.exports = {
  mode: 'development', // ou 'production' selon besoin
  entry: './js/app.js', // point d'entrée unique sans objet si simple projet
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/app.bundle.js', // fichier bundle de sortie (évitez de mettre ./ ici)
    clean: true, // nettoie le dossier dist avant build
  },
  resolve: {
    extensions: ['.js', '.json'], // extensions reconnues
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'], // chemins modules
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000, // port local pour dev server
  },
  module: {
    rules: [
      // ajoutez ici des loaders si besoin (Babel, CSS, etc.)
    ],
  },
};
