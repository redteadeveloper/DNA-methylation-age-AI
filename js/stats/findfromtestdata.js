const fs = require('fs')
const es = require('event-stream')
const list = JSON.parse(fs.readFileSync('../../json/n=30/TRAIN_mvalues_high_coef (30).json'), 'utf8').keys()

fs.appendFile('../../json/TEST_mvalues_high (30).json', '{\n', function (err) { if (err) console.log(err) })

var s1 = fs.createReadStream('../../json/TEST_mvalues.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg") && list.includes(line.toString().trim().slice(0, 12).replaceAll("\"", ""))) {
            fs.appendFile('../../json/TEST_mvalues_high (30).json', `\t${line.toString().trim()}\n`, function (err) {
                if (err) console.log(err)
            })
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFile('../../json/TEST_mvalues_high (30).json', '}', function (err) { if (err) console.log(err) })
            console.log("done")
        })
    )