import Auth from '../views/Auth.js'
// redirect and rerender view
const navigateTo = (href) => {
    history.pushState(null, null, href)
    router()
}
// read pathname and render matched views
const router = async () => {
    const routes = [
        { path: "/auth", view: Auth },
    ]
    const potentialMatches = routes.map(route => (
        { route, isMatch: location.pathname === route.path }
    ))
    const match = potentialMatches.find(potentialMatch => potentialMatch.isMatch)
        || { route: routes[0], isMatch: true }
    const view = new match.route.view()
    view.mount()
}
// prevent refreshing and navigateTo
document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (e) {
        if (e.target.matches("[data-link]")) {
            e.preventDefault()
            navigateTo(e.target.href)
        }
    })
})
// enable view rerendering when history back
window.addEventListener("popstate", router)
