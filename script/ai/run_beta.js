const fs = require('fs')
const brain = require('brain.js')
const testSampleAge = JSON.parse(fs.readFileSync('../../json/TEST_samples.json'), 'utf-8').map(n => parseInt(n[0]))
const testSampleSex = JSON.parse(fs.readFileSync('../../json/TEST_samples.json'), 'utf8').map(n => n[1])
const testSampleEthnicity = JSON.parse(fs.readFileSync('../../json/TEST_samples.json'), 'utf8').map(n => n[2])

for (let n of [30]) {
    // console.log(`Running n=${n}...`)
    let totalError = 0
    let count = 0
    const sites = JSON.parse(fs.readFileSync(`../../json/sites.json`, 'utf-8')).slice(0, n)
    const betas = JSON.parse(fs.readFileSync(`../../json/TEST_betas_high.json`, 'utf-8'))

    for (let i = 0; i < testSampleAge.length; i++) {
        let obj = {}

        // if(testSampleAge[i] > 65) continue
        // if(testSampleEthnicity[i] != "Hispanic") continue
        if(testSampleSex[i] != "F") continue;

        count++
        for (const site of sites) obj[site] = betas[site][i]

        const net = new brain.NeuralNetwork()
        net.fromJSON(JSON.parse(fs.readFileSync(`./model/beta_n=${n}_M.json`, 'utf-8')))

        let res = Math.round(net.run(obj)['age'] * 100)
        // console.log(`Result for sample ${i}(${testSampleAge[i]}): ${res}`)
        totalError = totalError + (res - testSampleAge[i]) ** 2
    }

    const RMSE = Math.sqrt(totalError / count)
    console.log(`RMSE at n=${n} = ${RMSE.toFixed(3)}`)
}