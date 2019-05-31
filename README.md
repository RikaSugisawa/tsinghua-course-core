# tsinghua-course-core
该项目希望实现对于清华大学教务选课系统的部分功能的API

### Example
登录并获取当前开课信息
```javascript
import CourseManager from './src/CourseManager'

const mgr = new CourseManager();
(async function () {
  const img=await mgr.loginMgr.getCaptcha()
  // Pass the captcha to user to get reply
  // Also you can get the cookie JSESSIONID from a web page and pass it to 
  // - mgr.loginMgr._login()
  await mgr.loginMgr.login(username, password, captcha)
  return await mgr.crsMgr.getOpeningInfo()
})().then((e)=>console.log(e))
```
