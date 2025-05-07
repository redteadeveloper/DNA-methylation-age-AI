const fs = require('fs')
const brain = require('brain.js')
const sampleAge = JSON.parse(fs.readFileSync('../../json/GSE40279_samples.json'), 'utf8').map(n => parseInt(n[0]))

const config = {
    binaryThresh: 0.5,
    hiddenLayers: [10, 10],
    activation: 'sigmoid',
    leakyReluAlpha: 0.01,
}

let ns = [10, 30, 50]

for (let n of ns) {
    console.log(`Starting training n=${n}`)
    const sites = JSON.parse(fs.readFileSync(`../../json/n=${n}/GSE40279_betas_high (${n}).json`, 'utf8'))
    for (let site in sites) {
        let data = []
        let beta = sites[site]
        console.log(`Training ${site} of n = ${n}`)
        for (var x in beta) {
            if (sampleAge[x > 100]) continue
            data.push({ input: [beta[x]], output: [sampleAge[x] / 100] })
        }
        const net = new brain.NeuralNetwork(config)
        net.train(data)
        fs.appendFileSync(`./model/n=${n}/${site}.json`, '')
        fs.writeFileSync(`./model/n=${n}/${site}.json`, JSON.stringify(net.toJSON()))
    }
    console.log(`Done training n=${n}`)
}