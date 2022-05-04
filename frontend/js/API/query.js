import Toast from "../utils/Toast.js";

/**
 * 
 * @param {String} from "eng"|"jpn"
 * @returns a promise
 */
export default async function (query, from, to = "chi") {
    // todo use better queryAPI
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'link-bilingual-dictionary.p.rapidapi.com',
            'X-RapidAPI-Key': '0e97c64ec8mshba7213fc4475dacp1f0fa9jsn12a1a1b5f0a8'
        }
    };

    return fetch(`https://link-bilingual-dictionary.p.rapidapi.com/${from}/${to}/${query}`, options)
        .then(response => response.json())
        .then(({ results }) => results.map(result => result.word))
        .then(wordList => wordList.join('; '))
        .then(body => body.length > 0 ? body.substr(0, 35) + "..." : "No result.")
        .catch(err => Toast.send(err.message, 'failure'))
}