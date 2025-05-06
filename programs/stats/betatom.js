const fs = require('fs')
const es = require('event-stream')

fs.appendFile('GSE40279_mvalues.json', '{\n', function (err) { if (err) console.log(err) })
fs.appendFile('GSE72775_mvalues.json', '{\n', function (err) { if (err) console.log(err) })

var s1 = fs.createReadStream('../../json/GSE40279.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg")) {
            let beta = line.slice(12).match(/0\.[0-9]+|0/g).map((x) => parseFloat(x))
            let mvalues = beta.map((x) => {
                if (x == 0) return 0
                else if (x == 1) return 1
                else {
                    let m = Math.log2(x / (1 - x))
                    if (m > 8) return 1
                    else if (m < -8) return 0
                    else return ((m + 8) / 16).toFixed(7)
                }
            })
            fs.appendFile('GSE40279_mvalues.json', `\t"${line.toString().trim().slice(0, 12).replaceAll("\"", "")}": [${mvalues.toString()}],\n`, function (err) {
                if (err) console.log(err)
            })
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFile('GSE40279_mvalues.json', '}', function (err) { if (err) console.log(err) })
            console.log("done 1")
        })
    )

var s2 = fs.createReadStream('../../json/GSE72775.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s2.pause()
        if (line.toString().trim().startsWith("\"cg")) {
            let beta = line.slice(12).match(/0\.[0-9]+|0/g).map((x) => parseFloat(x))
            let mvalues = beta.map((x) => {
                if (x == 0) return 0
                else if (x == 1) return 1
                else {
                    let m = Math.log2(x / (1 - x))
                    if (m > 8) return 1
                    else if (m < -8) return 0
                    else return ((m + 8) / 16).toFixed(7)
                }
            })
            fs.appendFile('GSE72775_mvalues.json', `\t"${line.toString().trim().slice(0, 12).replaceAll("\"", "")}": [${mvalues.toString()}],\n`, function (err) {
                if (err) console.log(err)
            })
        }
        s2.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFile('GSE72775_mvalues.json', '}', function (err) { if (err) console.log(err) })
            console.log("done 2")
        })
    )