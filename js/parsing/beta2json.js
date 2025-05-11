const fs = require('fs')
const es = require('event-stream')

const trainJSONLocation = '../../json/TRAIN_betas.json'
const testJSONLocation = '../../json/TEST_betas.json'

let trainFirstLine = true
let testFirstLine = true

let trainCount = 0
let testCount = 0

fs.writeFileSync(trainJSONLocation, '{')
fs.writeFileSync(testJSONLocation, '{')

// TRAIN data
var s1 = fs.createReadStream('../../GSE40279/GSE40279_series_matrix.txt')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().startsWith("\"cg")) {
            const cpgID = line.toString().slice(0, 12).replaceAll("\"", "")
            const betaArray = line.toString().replace(/("cg)\d{8}"\t/, "").split("\t").map((x) => parseFloat(x))

            if(betaArray.length != 656) {
                console.log(`Error at ${cpgID} of TRAIN`)
                console.log(line)
                console.log(`Length is ${betaArray.length}`)
                return
            }

            fs.appendFileSync(trainJSONLocation, `${trainFirstLine ? "" : ","}\n\t"${cpgID}": ${JSON.stringify(betaArray)}`)
            trainFirstLine = false
            trainCount++
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFileSync(trainJSONLocation, '\n}')
            console.log(`Done parsing ${trainCount} TRAIN data`)
        })
    )

// TEST data
var s2 = fs.createReadStream('../../GSE72775/GSE72775_datBetaNormalized.csv')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s2.pause()
        if (line.toString().startsWith("\"cg")) {
            const cpgID = line.toString().slice(0, 13).replaceAll("\"", "").replace(",", "")
            const betaArray = line.toString().replace(/("cg)\d{8}",/, "").split(",").map((x) => parseFloat(x.replaceAll("\"", "")))

            if(betaArray.length != 335) {
                console.log(`Error at ${cpgID} of TEST`)
                console.log(line)
                console.log(`Length is ${betaArray.length}`)
                return
            }

            fs.appendFileSync(testJSONLocation, `${testFirstLine ? "" : ","}\n\t"${cpgID}": ${JSON.stringify(betaArray)}`)
            testFirstLine = false
            testCount++
        }
        s2.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFileSync(testJSONLocation, '\n}')
            console.log(`Done parsing ${testCount} TRAIN data`)
        })
    )