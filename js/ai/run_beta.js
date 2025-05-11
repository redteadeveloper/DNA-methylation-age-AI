const fs = require('fs')
const brain = require('brain.js')
const testSampleAge = JSON.parse(fs.readFileSync('../../json/TEST_samples.json'), 'utf8').map(n => parseInt(n[0]))

let ns = [10, 30, 50]

console.log(testSampleAge.length)

for (let n of ns) {
    console.log(`Running n=${n}...`)
    let totalError = 0
    const sites = JSON.parse(fs.readFileSync(`../../json/n=${n}/TEST_betas_high (${n}).json`, 'utf8'))
    for (let i = 0; i < testSampleAge.length; i++) {    // person
        let res = 0
        for (let site in sites) {
            const net = new brain.NeuralNetwork()
            const model = JSON.parse(fs.readFileSync(`./model_beta/n=${n}/${site}.json`, 'utf8'))
            net.fromJSON(model)
            res = res + Math.round(net.run([sites[site][i]]) * 100)
        }
        res = res / n
        // console.log(`Result for sample ${i}(${testSampleAge[i]}): ${res}`)
        totalError = totalError + (res - testSampleAge[i]) ** 2
    }
    const RMSE = Math.sqrt(totalError / testSampleAge.length)
    console.log(`RMSE at n=${n} = ${RMSE}`)
}