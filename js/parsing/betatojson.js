const fs = require('fs')
const es = require('event-stream')

fs.appendFile('GSE72775_betas.json', '{\n', function (err) { if (err) console.log(err) })
fs.appendFile('GSE40279_betas.json', '{\n', function (err) { if (err) console.log(err) })

var s1 = fs.createReadStream('../../GSE40279/GSE40279_series_matrix.txt')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().startsWith("\"cg")) {
            fs.appendFile('GSE40279_betas.json', `\t"${line.toString().slice(0, 12).replaceAll("\"", "")}": ${JSON.stringify(line.toString().replace(/("cg)\d{8}"\t/, "").split("\t").map((x) => parseFloat(x)))},\n`, function (err) {
                if (err) console.log(err)
            })
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFile('GSE40279_betas.json', '}', function (err) {
                if (err) console.log(err)
            })
            console.log("done 1")
        })
    )

var s2 = fs.createReadStream('../../GSE72775/GSE72775_datBetaNormalized.csv')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s2.pause()
        if (line.toString().startsWith("\"cg")) {
            fs.appendFile('GSE72775_betas.json', `\t"${line.toString().slice(0, 13).replaceAll("\"", "").replace(",", "")}": ${JSON.stringify(line.toString().replace(/("cg)\d{8}",/, "").split(",").map((x) => parseFloat(x.replaceAll("\"", ""))))},\n`, function (err) {
                if (err) console.log(err)
            })
        }
        s2.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFile('GSE72775_betas.json', '}', function (err) {
                if (err) console.log(err)
            })
            console.log("done 2")
        })
    )