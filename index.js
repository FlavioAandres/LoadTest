const FormData = require('form-data');
process.setMaxListeners(0);
const axios = require('axios')
const URL_TO_TEST = 'https://api.attachments.providers.test.cebroker.com/upload'
const TOKEN = 'Bearer w96mbdxOwhWpOO68Sj8QB7Xe2NqN05JvK26XNOuYeZ7N6iHv5_IbQ07DeASI1D6g3yd_7mkYKX65TofjUeCGAzXKHcQRCWijcZGyCuXvz3c4nXJ-UUT7cv071it7EKsAEN-vad2zlspf9RUCvOId0PVB72QgZgipn1VV86EPHBi57TBrtHEPmS7vGU6SjNrwzeAhRyaHwg9VRwJAtgMkJPfirhs'
let URL_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/1/16/AsterNovi-belgii-flower-1mb.jpg'
const Stopwatch = require('statman-stopwatch');
const fs = require('fs')

const formFile = async () => {
    console.log('RequestFile::processing');

    try {
        let file = fs.readFileSync('images/image1.jpg');

        const form = new FormData();
        let contentType = 'image/jpg'
        form.append('upload', file, {
            contentType,
            filename: 'image1.jpg',
            knownLength: file.size

        });
        console.log('RequestFile::done');

        return form
    } catch (error) {
        console.error(error);
    }
    console.log('RequestFile::fails');

    return null
}

const request = (form) => {
    return axios(URL_TO_TEST, {
        data: form,
        method: 'post',
        headers: {
            Authorization: TOKEN,
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`
        }
    })
    //.catch(error => error)
}

const initApp = async (concurrency = 5, times = 10) => {
    let file = await formFile()
    if (!file) return null
    file.append('customCompletionId', '2403')
    const timer = new Stopwatch()
    let arrayRequest = []
    while (times-- > 0) {
        let errors = 0
        console.log('Test::request::' + times);

        while (concurrency-- > 0) {
            arrayRequest.push(request(file))
        }
        console.log('Test::waitingForParallelResponse');

        try {
            timer.start()
            await Promise.all(arrayRequest)
        } catch (error) {
            errors++
            console.error(error.message);
        }
        timer.stop()
        console.log('Test::request' + times + '::min:' + timer.read() / 6000);
        console.log('Test::request' + times + '::errors:' + errors);
        timer.reset()
        arrayRequest = []
    }
    console.log('Test::completed');
    process.exit(0)
}

initApp(5, 1)