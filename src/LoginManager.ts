import BaseRequester from './BaseRequester'
import * as request from 'request-promise-native'
import {Cookie} from 'tough-cookie'

export default class LoginManager extends BaseRequester {
    private is_inited: boolean = false
    xnxq: string = '2019-2020-1'

    private async _init() {
        this.is_inited = true
        await this.request({
            url: "http://zhjwxk.cic.tsinghua.edu.cn/xklogin.do",
        })
    }

    async getCaptcha(): Promise<ArrayBuffer> {
        this.is_inited || this._init()
        return await this.request({
            url: "http://zhjwxk.cic.tsinghua.edu.cn/login-jcaptcah.jpg?captchaflag=login1",
            encoding: null,
        })
    }

    _login(value: string) {
        this._cookieJar._jar.store.idx['zhjwxk.cic.tsinghua.edu.cn'] = {
            '/': {
                'JSESSIONID':
                    new Cookie({
                        key: 'JSESSIONID',
                        value: value,
                        domain: 'zhjwxk.cic.tsinghua.edu.cn',
                        path: '/'
                    })
            }
        }

    }

    async login(username: string, password: string, captcha: string): Promise<void> {
        const res: string = await this.request({
            url: "https://zhjwxk.cic.tsinghua.edu.cn/j_acegi_formlogin_xsxk.do",
            method: 'POST',
            form: {
                j_username: username,
                j_password: password,
                captchaflag: "login1",
                _login_image_: captcha
            }
        })
        this.xnxq = new RegExp("m=showTree&p_xnxq=(\d{4}-\d{4}-\d)").exec(res)[1]
    }
}
