const fs = require('fs')
const es = require('event-stream')
const list = JSON.parse(fs.readFileSync('../../json/GSE40279_mvalues_high_coef.json'), 'utf8')['list']

fs.appendFile('GSE40279_mvalues_high.json', '{\n', function (err) { if (err) console.log(err) })

var s1 = fs.createReadStream('../../json/GSE40279_mvalues.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg") && list.includes(line.toString().trim().slice(0, 12).replaceAll("\"", ""))) {
            fs.appendFile('GSE40279_mvalues_high.json', `\t${line.toString().trim()}\n`, function (err) {
                if (err) console.log(err)
            })
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFile('GSE40279_mvalues_high.json', '}', function (err) { if (err) console.log(err) })
            console.log("done")
        })
    )