const fs = require('fs')
const es = require('event-stream')

let list1 = []
let list2 = []

fs.appendFile('GSE40279_betas_high_coef.json', '{\n', function (err) { if (err) console.log(err) })
fs.appendFile('GSE40279_mvalues_high_coef.json', '{\n', function (err) { if (err) console.log(err) })

var s1 = fs.createReadStream('../../json/GSE40279_betas_spearman.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg") && !line.toString().includes('e-')) {
            let coefficient = line.slice(12).match(/-?0.[0-9]+/g).map((x) => parseFloat(x))
            if (coefficient > 0.557) {
                list1.push(`"${line.toString().trim().slice(0, 12).replaceAll("\"", "")}"`)
                fs.appendFile('GSE40279_betas_high_coef.json', `\t${line.toString().trim()}\n`, function (err) {
                    if (err) console.log(err)
                })
            }
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFile('GSE40279_betas_high_coef.json', '}', function (err) { if (err) console.log(err) })
            console.log("done 1")
            console.log("list1: " + list1)
        })
    )

var s2 = fs.createReadStream('../../json/GSE40279_mvalues_spearman.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s2.pause()
        if (line.toString().trim().startsWith("\"cg") && !line.toString().includes('e-')) {
            let coefficient = line.slice(12).match(/-?0.[0-9]+/g).map((x) => parseFloat(x))
            if (coefficient > 0.557) {
                list2.push(`"${line.toString().trim().slice(0, 12).replaceAll("\"", "")}"`)
                fs.appendFile('GSE40279_mvalues_high_coef.json', `\t${line.toString().trim()}\n`, function (err) {
                    if (err) console.log(err)
                })
            }
        }
        s2.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFile('GSE40279_mvalues_high_coef.json', '}', function (err) { if (err) console.log(err) })
            console.log("done 2")
            console.log("list2: " + list2)
        })
    )