module.exports = {
    productionSourceMap: false,
    devServer: {
        proxy: { // 设置代理
            '/api': {
                // target: 'https://anfo.fun',
                target: 'http://localhost:3000',
                // changeOrigin: true,
            }
        },
    },
    outputDir: '../remember-server/static',
}
