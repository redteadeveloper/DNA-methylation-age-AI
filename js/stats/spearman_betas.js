const fs = require('fs')
const es = require('event-stream')
const SpearmanRHO = require('spearman-rho')
const sampleAge = JSON.parse(fs.readFileSync('../../json/GSE40279_samples.json'), 'utf8').map(n => parseInt(n[0]))

fs.appendFile('GSE40279_betas_spearman.json', '{\n', function (err) { if (err) console.log(err) })

var s1 = fs.createReadStream('../../json/GSE40279_betas.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg")) {
            let beta = line.slice(12).match(/0\.[0-9]+|0/g).map((x) => parseFloat(x))
            const spearmanRHO = new SpearmanRHO(beta, sampleAge)
            spearmanRHO.calc()
                .then(value => {
                    fs.appendFile('GSE40279_betas_spearman', `\t"${line.toString().trim().slice(0, 12).replaceAll("\"", "")}": ${value},\n`, function (err) {
                        if (err) console.log(err)
                    })
                })
                .catch(err => console.error(err))
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFile('GSE40279_betas_spearman', '}', function (err) { if (err) console.log(err) })
            console.log("done")
        })
    )