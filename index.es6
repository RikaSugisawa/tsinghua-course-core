import CourseManager from './src/CourseManager'
import {JSESSIONID} from './pref.config.json'

const mgr = new CourseManager();
(async function () {
  mgr.loginMgr._login(JSESSIONID)
  return await mgr.crsMgr.getOpeningInfo()
})().then(
  (e) =>
    console.log(e))
