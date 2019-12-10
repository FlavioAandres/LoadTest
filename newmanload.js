let path = require('path'),
    async = require('async'), //https://www.npmjs.com/package/async
    newman = require('newman'),

    parametersForTestRun = {
        collection: path.join(__dirname, 'Attachments.postman_collection.json'), // your collection
        // environment: path.join(__dirname, 'postman_environment.json'), //your env
    };

parallelCollectionRun = function (done) {
    newman.run(parametersForTestRun, done);
};

// Runs the Postman sample collection thrice, in parallel.

let cuantity = 1
let timing = 0
let requestArray = Array(cuantity).fill(parallelCollectionRun)

async.parallel([
    ...requestArray
    // parallelCollectionRun,
    // parallelCollectionRun,
    // parallelCollectionRun
],
    function (err, results) {
        err && console.error(err);

        results.forEach(function (result, i) {
            console.log(i, result.run.timings.responseMax / 1000);

            timing += result.run.timings.responseMax
            var failures = result.run.failures;
            console.info(failures.length ? JSON.stringify(failures, null, 2) : '')
            // `${result.collection.name} ran successfully.`);
        });


        console.log(((timing / 1000) / cuantity).toString())
    }
);
