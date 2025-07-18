const fs = require('fs')
const brain = require('brain.js')
const sampleAge = JSON.parse(fs.readFileSync('../../json/TRAIN_samples.json'), 'utf8').map(n => parseInt(n[0]))
const sampleSex = JSON.parse(fs.readFileSync('../../json/TRAIN_samples.json'), 'utf8').map(n => n[1])
const sampleEthnicity = JSON.parse(fs.readFileSync('../../json/TRAIN_samples.json'), 'utf8').map(n => n[2])

const config = {
    binaryThresh: 0.5,
    hiddenLayers: [10, 10, 5],
    activation: 'sigmoid',
    leakyReluAlpha: 0.01,
}

for (let n of [30]) {
    console.log(`Starting training n=${n}`)

    const sites = JSON.parse(fs.readFileSync(`../../json/sites.json`, 'utf-8')).slice(0, n)
    const betas = JSON.parse(fs.readFileSync(`../../json/TRAIN_betas_high.json`, 'utf-8'))

    let data = []
    let count = 0

    for (let i = 0; i < sampleAge.length; i++) {
        let obj = {}

        if (sampleSex[i] != "M") continue;

        count++

        for (const site of sites) obj[site] = betas[site][i]
        data.push({ input: obj, output: { age: sampleAge[i] / 100 } })
        // console.log(`Created data for sample ${i+1}`)
    }

    const net = new brain.NeuralNetwork(config)
    net.train(data)

    fs.writeFileSync(`./model/beta_n=${n}_M.json`, JSON.stringify(net.toJSON()))
    console.log(`Done training n=${n}`)
    console.log(count)
}