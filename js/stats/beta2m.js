const fs = require('fs')
const es = require('event-stream')

var rx = /^([\d.]+?)e-(\d+)$/
var floatToString = function (flt) {
    var details, num, cnt, fStr = flt.toString()
    if (rx.test(fStr)) {
        details = rx.exec(fStr)
        num = details[1]
        cnt = parseInt(details[2], 10);
        cnt += (num.replace(/\./g, "").length - 1)
        return flt.toFixed(cnt)
    }
    return fStr
};

const trainJSONLocation = '../../json/TRAIN_mvalues.json'
const testJSONLocation = '../../json/TEST_mvalues.json'

let trainFirstLine = true
let testFirstLine = true

let trainCount = 0
let testCount = 0

fs.writeFileSync(trainJSONLocation, '{')
fs.writeFileSync(testJSONLocation, '{')

// TRAIN data
var s1 = fs.createReadStream('../../json/TRAIN_betas.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg")) {
            const cpgID = line.toString().trim().slice(0, 12).replaceAll("\"", "")
            const betaArray = line.slice(12).match(/0\.[0-9]+|0|1|null/g).map((x) => parseFloat(x))

            if (betaArray.length != 656) {
                console.log(`Error at ${cpgID} of TRAIN`)
                console.log(line)
                console.log(`Length is ${betaArray.length}`)
                return
            }

            let mvalueArray = betaArray.map((x) => {
                if (!x) return '0'
                else if (x == 1) return '1'
                else {
                    let m = Math.log2(x / (1 - x))
                    if (m > 8) return '1'
                    else if (m < -8) return '0'
                    else return floatToString(((m + 8) / 16).toFixed(7))
                }
            })

            fs.appendFileSync(trainJSONLocation, `${trainFirstLine ? "" : ","}\n\t"${cpgID}": [${mvalueArray.toString()}]`)
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

// TEST data
var s2 = fs.createReadStream('../../json/TEST_betas.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s2.pause()
        if (line.toString().trim().startsWith("\"cg")) {
            const cpgID = line.toString().trim().slice(0, 12).replaceAll("\"", "")
            const betaArray = line.slice(12).match(/0\.[0-9]+|0|1|null/g).map((x) => parseFloat(x))

            if (betaArray.length != 335) {
                console.log(`Error at ${cpgID} of TEST`)
                console.log(line)
                console.log(`Length is ${betaArray.length}`)
                return
            }

            let mvalueArray = betaArray.map((x) => {
                if (!x) return '0'
                else if (x == 1) return '1'
                else {
                    let m = Math.log2(x / (1 - x))
                    if (m > 8) return '1'
                    else if (m < -8) return '0'
                    else return floatToString(((m + 8) / 16).toFixed(10))
                }
            })

            fs.appendFileSync(testJSONLocation, `${testFirstLine ? "" : ","}\n\t"${cpgID}": [${mvalueArray.toString()}]`)
            testFirstLine = false
            testCount++
        }
        s2.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFileSync(testJSONLocation, '\n}')
            console.log(`Successfully converted ${testCount} TEST data`)
        })
    )