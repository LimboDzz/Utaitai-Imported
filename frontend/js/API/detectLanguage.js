import Toast from "../utils/Toast.js";

export default function (text) {
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Host': 'fast-and-highly-accurate-language-detection.p.rapidapi.com',
            'X-RapidAPI-Key': '0e97c64ec8mshba7213fc4475dacp1f0fa9jsn12a1a1b5f0a8'
        },
        body: `{"text":"${text}","includePredictions":true}`
    };

    return fetch('https://fast-and-highly-accurate-language-detection.p.rapidapi.com/detect', options)
        .then(response => response.json())
        .then(({ predictions }) => predictions.map(prediction => prediction.lang))
        .then(langList => {
            if (langList.includes('ja')) return "jpn"
            if (langList.includes('en')) return "eng"
            return "other"
        })
        .catch(err => Toast.send(err.message, 'failure'))
}