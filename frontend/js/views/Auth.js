import AbstractView from './AbstractView.js'

export default class extends AbstractView {
    constructor() {
        super('main', `
        <div id="toAuth">
          <h1>You need to login first</h1>
          <a href="/login">Click here to login</a>
        </div>
        `)
    }
}