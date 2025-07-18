const fs = require('fs')
const es = require('event-stream')
const sampleSex = JSON.parse(fs.readFileSync('../../json/TRAIN_samples.json'), 'utf8').map(n => n[1])

const trainJSONLocation = '../../json/raw/TRAIN_betas_sex.json'

let trainFirstLine = true

let trainCount = 0

fs.writeFileSync(trainJSONLocation, '{')

// TRAIN data
var s1 = fs.createReadStream('../../json/raw/TRAIN_betas.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg")) {
            const cpgID = line.toString().trim().slice(0, 12).replaceAll("\"", "")
            const betaArray = line.slice(12).match(/0\.[0-9]+|0|1|null/g).map((x) => parseFloat(x))

            const M = []
            const F = []

            if (betaArray.length != 656) {
                console.log(`Error at ${cpgID} of TRAIN`)
                console.log(line)
                console.log(`Length is ${betaArray.length}`)
                return
            }

            for (let i = 0; i < betaArray.length; i++) {
                if (sampleSex[i] == "M") M.push(betaArray[i])
                else if (sampleSex[i] == "F") F.push(betaArray[i])
            }

            fs.appendFileSync(trainJSONLocation, `${trainFirstLine ? "" : ","}\n\t"${cpgID}": [[${M.toString()}],[${F.toString()}]]`)
            trainFirstLine = false
            trainCount++
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFileSync(trainJSONLocation, '\n}')
            console.log(`Successfully converted ${trainCount} TRAIN data`)
        })
    )
