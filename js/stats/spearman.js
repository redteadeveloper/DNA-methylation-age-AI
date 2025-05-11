const fs = require('fs')
const es = require('event-stream')
const SpearmanRHO = require('spearman-rho')
const sampleAge = JSON.parse(fs.readFileSync('../../json/TRAIN_samples.json'), 'utf8').map(n => parseInt(n[0]))

const betasJSONLocation = '../../json/raw/TRAIN_betas_spearman.json'
const mvaluesJSONLocation = '../../json/raw/TRAIN_mvalues_spearman.json'

let betasFirstLine = true
let mvaluesFirstLine = true

let betasCount = 0
let mvaluesCount = 0

fs.writeFileSync(betasJSONLocation, '{')
fs.writeFileSync(mvaluesJSONLocation, '{')

var s1 = fs.createReadStream('../../json/raw/TRAIN_betas.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg")) {
            let betaArray = line.slice(12).match(/0\.[0-9]+|0|1/g).map((x) => parseFloat(x))
            const spearmanRHO = new SpearmanRHO(betaArray, sampleAge)
            spearmanRHO.calc()
                .then(value => {
                    fs.appendFileSync(betasJSONLocation, `${betasFirstLine ? "" : ","}\n\t"${line.toString().trim().slice(0, 12).replaceAll("\"", "")}": ${value}`)
                    betasFirstLine = false
                    betasCount++
                })
                .catch(err => console.error(err))
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFileSync(betasJSONLocation, '\n}')
            console.log(`Successfully calculated ${betasCount} cpg sites of TRAIN_betas`)
        })
    )

var s2 = fs.createReadStream('../../json/raw/TRAIN_mvalues.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s2.pause()
        if (line.toString().trim().startsWith("\"cg")) {
            let mvalueArray = line.slice(12).match(/0\.[0-9]+|0|1/g).map((x) => parseFloat(x))
            const spearmanRHO = new SpearmanRHO(mvalueArray, sampleAge)
            spearmanRHO.calc()
                .then(value => {
                    fs.appendFileSync(mvaluesJSONLocation, `${mvaluesFirstLine ? "" : ","}\n\t"${line.toString().trim().slice(0, 12).replaceAll("\"", "")}": ${value}`)
                    mvaluesFirstLine = false
                    mvaluesCount++
                })
                .catch(err => console.error(err))
        }
        s2.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFileSync(mvaluesJSONLocation, '\n}')
            console.log(`Successfully calculated ${mvaluesCount} cpg sites of TRAIN_betas`)
        })
    )