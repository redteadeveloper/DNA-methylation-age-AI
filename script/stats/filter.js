const fs = require('fs')
const es = require('event-stream')

let list1 = []
let list2 = []

let trainFirstLine = true
let testFirstLine = true

fs.writeFileSync('../../json/raw/TRAIN_betas_high_coef.json', '{')
fs.writeFileSync('../../json/raw/TRAIN_mvalues_high_coef.json', '{')

var s1 = fs.createReadStream('../../json/raw/TRAIN_betas_spearman.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg") && !line.toString().includes('e-')) {
            let coefficient = line.slice(12).match(/-?0.[0-9]+/g).map((x) => parseFloat(x))
            if (Math.abs(coefficient) > 0.612) {
                list1.push(`"${line.toString().trim().slice(0, 12).replaceAll("\"", "")}"`)
                fs.appendFileSync('../../json/raw/TRAIN_betas_high_coef.json', `${trainFirstLine ? "" : ","}\n\t${line.toString().trim().slice(0, -1)}`)
                trainFirstLine = false
            }
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFileSync('../../json/raw/TRAIN_betas_high_coef.json', '\n}')
            console.log("Done betas")
        })
    )

var s2 = fs.createReadStream('../../json/raw/TRAIN_mvalues_spearman.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s2.pause()
        if (line.toString().trim().startsWith("\"cg") && !line.toString().includes('e-')) {
            let coefficient = line.slice(12).match(/-?0.[0-9]+/g).map((x) => parseFloat(x))
            if (Math.abs(coefficient) > 0.612) {
                list2.push(`"${line.toString().trim().slice(0, 12).replaceAll("\"", "")}"`)
                fs.appendFileSync('../../json/raw/TRAIN_mvalues_high_coef.json', `${testFirstLine ? "" : ","}\n\t${line.toString().trim().slice(0, -1)}`)
                testFirstLine = false
            }
        }
        s2.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFileSync('../../json/raw/TRAIN_mvalues_high_coef.json', '\n}')
            console.log("Done mvalues")
            let obj = JSON.parse(fs.readFileSync('../../json/raw/TRAIN_mvalues_high_coef.json', 'utf-8'))
            fs.writeFileSync('../../json/sites.json', JSON.stringify(Object.keys(obj).sort((a, b) => Math.abs(obj[b]) - Math.abs(obj[a]))))
        })
    )