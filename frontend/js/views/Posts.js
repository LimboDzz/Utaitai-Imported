import AbstractView from './AbstractView.js'

export default class extends AbstractView{
    constructor(){
        super()
        this.setTitle("Posts")
    }

    async getHTML(){
        return `
        <h1>This is the post page</h1>
        <p>Enjoy your posts!</p>
        <a data-link href="/settings>Go to settings</a>
        `
    }
}