const fs = require('fs')
const brain = require('brain.js')
const beta = JSON.parse(fs.readFileSync('./data.json', 'utf8'))['cg00000029']
const sampleAge = JSON.parse(fs.readFileSync('../json/GSE40279_samples.json'), 'utf8').map(n => parseInt(n[0]))

let data = []

const config = {
    binaryThresh: 0.5,
    hiddenLayers: [5], 
    activation: 'sigmoid', 
    leakyReluAlpha: 0.01, 
}

for (var x in beta) {
    if(sampleAge[x > 100]) continue
    data.push({input: [beta[x]], output: [sampleAge[x]/100]})
}

const net = new brain.NeuralNetwork(config)
net.train(data)

let output = net.run([0.5])

console.log(Math.round(output[0]*100))