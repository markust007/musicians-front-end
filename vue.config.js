module.exports = {
    devServer: {
        proxy: {
            "/": {
                // target: "http://localhost:3001"
                target: 'https://musicians-back-end.herokuapp.com'
            }
        }
    }
}
