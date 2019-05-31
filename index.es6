import CourseManager from './src/CourseManager'
import {JSESSIONID} from './pref.config.json'

const mgr = new CourseManager();
(async function () {
  return await mgr.loginMgr.getCaptcha()
})().then(
  (e) =>
    console.log(e))
