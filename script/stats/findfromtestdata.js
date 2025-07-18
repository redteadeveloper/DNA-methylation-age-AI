const fs = require('fs')
const es = require('event-stream')
const list = Object.keys(JSON.parse(fs.readFileSync('../../json/raw/TRAIN_mvalues_high_coef.json'), 'utf8'))

fs.writeFileSync('../../json/TEST_betas_high.json', '{\n')
fs.writeFileSync('../../json/TEST_mvalues_high.json', '{\n')

var s1 = fs.createReadStream('../../json/raw/TEST_betas.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg") && list.includes(line.toString().trim().slice(0, 12).replaceAll("\"", ""))) {
            fs.appendFileSync('../../json/TEST_betas_high.json', `\t${line.toString().trim()}\n`)
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFileSync('../../json/TEST_betas_high.json', '}')
            console.log("done betas")
        })
    )

var s2 = fs.createReadStream('../../json/raw/TEST_mvalues.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s2.pause()
        if (line.toString().trim().startsWith("\"cg") && list.includes(line.toString().trim().slice(0, 12).replaceAll("\"", ""))) {
            fs.appendFileSync('../../json/TEST_mvalues_high.json', `\t${line.toString().trim()}\n`)
        }
        s2.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFileSync('../../json/TEST_mvalues_high.json', '}')
            console.log("done mvalues")
        })
    )