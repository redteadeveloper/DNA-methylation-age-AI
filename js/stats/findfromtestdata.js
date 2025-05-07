const fs = require('fs')
const es = require('event-stream')
const list = JSON.parse(fs.readFileSync('../../json/n=50/GSE40279_mvalues_high_coef (50).json'), 'utf8')['list']

fs.appendFile('GSE72775_mvalues_high (50).json', '{\n', function (err) { if (err) console.log(err) })

var s1 = fs.createReadStream('../../json/GSE72775_mvalues.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg") && list.includes(line.toString().trim().slice(0, 12).replaceAll("\"", ""))) {
            fs.appendFile('GSE72775_mvalues_high (50).json', `\t${line.toString().trim()}\n`, function (err) {
                if (err) console.log(err)
            })
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFile('GSE72775_mvalues_high (50).json', '}', function (err) { if (err) console.log(err) })
            console.log("done")
        })
    )