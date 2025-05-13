const fs = require('fs')
const brain = require('brain.js')
const testSampleAge = JSON.parse(fs.readFileSync('../../json/TEST_samples.json'), 'utf-8').map(n => parseInt(n[0]))

console.log(testSampleAge.length)

for (let n of [10, 20, 30, 40, 50]) {
    // console.log(`Running n=${n}...`)
    let totalError = 0
    const sites = JSON.parse(fs.readFileSync(`../../json/sites.json`, 'utf-8')).slice(0, n)
    const mvalues = JSON.parse(fs.readFileSync(`../../json/TEST_mvalues_high.json`, 'utf-8'))

    for (let i = 0; i < testSampleAge.length; i++) {    // person
        let obj = {}
        for (const site of sites) obj[site] = mvalues[site][i]

        const net = new brain.NeuralNetwork()
        net.fromJSON(JSON.parse(fs.readFileSync(`./model/mvalue_n=${n}.json`, 'utf-8')))

        let res = Math.round(net.run(obj)['age'] * 100)
        // console.log(`Result for sample ${i}(${testSampleAge[i]}): ${res}`)
        totalError = totalError + (res - testSampleAge[i]) ** 2
    }

    const RMSE = Math.sqrt(totalError / testSampleAge.length)
    console.log(`RMSE at n=${n} = ${RMSE.toFixed(5)}`)
}