import LoginManager from './LoginManager'
import * as request from 'request-promise-native'
import CourseQueryer from './CourseQueryer'

export default class CourseManager {
    crsMgr: CourseQueryer
    loginMgr: LoginManager
    private readonly _cookirJar: request.RequestJar = request.jar()

    constructor() {
        this.loginMgr = new LoginManager(this._cookirJar)
        this.crsMgr = new CourseQueryer(this._cookirJar, this.loginMgr)
    }
}
