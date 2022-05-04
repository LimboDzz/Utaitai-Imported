import Toast from "./Toast.js"

/**
 * create and Upload note to db
 * @param {String} head 
 * @param {String} body
 */
export default async function (head, body) {
    // ?upload to db
    let res
    try {
        res = await fetch("/note", {
            method: "post",
            body: JSON.stringify({ head, body }),
            headers: {
                "Content-type": "application/json"
            }
        })
    } catch (error) {
        Toast.send(error.message, "failure")
        return
    }
    const { msg, _id, createAt } = await res.json()
    if (msg) {
        Toast.send(msg, 'failure')
        return
    }
    // ?insert noteLi to noteList
    const noteLi = document.createElement("note-li")
    noteLi.head = head
    noteLi.body = body
    noteLi._id = _id
    noteLi.createAt = createAt
    const noteList = document.querySelector('#noteList')
    noteList.insertBefore(noteLi, noteList.firstElementChild)
}