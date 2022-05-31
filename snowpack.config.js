module.exports = {
    mount: {
        public: "/",
        src: "/src"
    },
    devOptions: {
        port: 8000,
    },
    buildOptions: {
        out: "_build"
    },
    optimize: {
        bundle: true,
        minify: true,
        sourcemap: false
    }
};