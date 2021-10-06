module.exports = {
    outputDir: 'dist',

    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Manga Viewer';
                return args;
            })
    },

    transpileDependencies: [
      'vuetify'
    ]
};
