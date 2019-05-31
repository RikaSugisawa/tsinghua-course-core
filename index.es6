import CourseManager from './src/CourseManager'
import {token} from './pref.config.json'

const mgr = new CourseManager();
(async function () {
  mgr.loginMgr._login(token)
  return await mgr.crsMgr.getOpeningInfo()
})().then(
  (e) =>
    console.log(e))
