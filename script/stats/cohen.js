const fs = require('fs')
const es = require('event-stream')
const R = require('r-integration')

const trainJSONLocation = '../../json/raw/TRAIN_betas_cohensD.json'

let trainFirstLine = true
let trainCount = 0

fs.writeFileSync(trainJSONLocation, '{')

// TRAIN data
var s1 = fs.createReadStream('../../json/raw/TRAIN_betas_sex.json')
	.pipe(es.split())
	.pipe(es.mapSync(function (line) {
		s1.pause()
		if (line.toString().trim().startsWith("\"cg")) {
			const cpgID = line.toString().trim().slice(0, 12).replaceAll("\"", "")
			const betaArray = line.slice(15).slice(0, -1)

			if (betaArray.match(/0\.[0-9]+|0|1|null/g).map((x) => parseFloat(x)).length != 656) {
				console.log(`Error at ${cpgID} of TRAIN`)
				console.log(line)
				console.log(`Length is ${betaArray.length}`)
				return
			}

			// console.log(betaArray)

			let result = Math.abs(R.callMethod("./cohen.R", "cohen", {json_text: betaArray})[0])
			fs.appendFileSync(trainJSONLocation, `${trainFirstLine ? "" : ","}\n\t"${cpgID}": ${result}`)
			trainFirstLine = false
			trainCount++
		}
		s1.resume()
	})
		.on('error', function (err) { console.log('Error:', err) })
		.on('end', function () {
			fs.appendFileSync(trainJSONLocation, '\n}')
			console.log(`Successfully calculated ${trainCount} TRAIN data`)
		})
	)