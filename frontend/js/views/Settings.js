
import AbstractView from './AbstractView.js'
export default class extends AbstractView{
    constructor(){
        super()
        this.setTitle("Settings")
    }
    async getHTML(){
        return `
        <h1>Make some settings</h1>
        <select>
            <option>Dark</option>
            <option>Light</option>
        </select>
        <a data-link href="/dashboard">Back to main page</a>
        `
    }
}