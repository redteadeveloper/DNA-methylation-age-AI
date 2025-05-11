const fs = require('fs')
const es = require('event-stream')
const SpearmanRHO = require('spearman-rho')
const sampleAge = JSON.parse(fs.readFileSync('../../json/TRAIN_samples.json'), 'utf8').map(n => parseInt(n[0]))

fs.appendFile('../../json/TRAIN_mvalues_spearman.json', '{\n', function (err) { if (err) console.log(err) })

var s1 = fs.createReadStream('../../json/TRAIN_mvalues.json')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().trim().startsWith("\"cg")) {
            let m = line.slice(12).match(/0\.[0-9]+|0|1/g).map((x) => parseFloat(x))
            const spearmanRHO = new SpearmanRHO(m, sampleAge)
            spearmanRHO.calc()
                .then(value => {
                    fs.appendFile('../../json/TRAIN_mvalues_spearman.json', `\t"${line.toString().trim().slice(0, 12).replaceAll("\"", "")}": ${value},\n`, function (err) {
                        if (err) console.log(err)
                    })
                })
                .catch(err => console.error(err))
        }
        s1.resume()
    })
        .on('error', function (err) { console.log('Error:', err) })
        .on('end', function () {
            fs.appendFile('../../json/TRAIN_mvalues_spearman.json', '}', function (err) { if (err) console.log(err) })
            console.log("done")
        })
    )