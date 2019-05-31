import * as request from 'request-promise-native'
import * as Iconv from 'iconv-lite'
import * as PromisePool from 'es6-promise-pool'
import * as $ from 'cheerio'

export interface Options {
    url: string
    method?: string
    form?: object
    encoding?: string | null
}

class AuthenticationRequired extends Error {
    constructor(message) {
        super(message)
        this.name = 'AuthenticationRequired'
    }
}

export default class BaseRequester {
    /*
    由于我校奇葩的服务器逻辑，并发超过1时会发生奇怪的bug<s>牛头不对马嘴</s>
     */
    static readonly MAX_THREAD = 1

    protected readonly _cookieJar: request.RequestJar

    constructor(cookieJar: request.RequestJar) {
        this._cookieJar = cookieJar
    }

    /**
     * @param options
     *  - encoding - If set to null then will return Buffer
     * @param encoding
     *  - deprecated
     * @return Promise<string | Buffer>
     */
    protected async request(options: Options, encoding = null) {
        options["jar"] = this._cookieJar || true
        encoding = encoding || options['encoding'] || null
        // options['encoding'] = encoding
        if (encoding) options['encoding'] = null
        const ret = encoding ? Iconv.decode((await request(options)), encoding).toString() : await request(options)
        if (ret.indexOf("用户登陆超时"))
            throw new AuthenticationRequired("用户登陆超时或访问内容不存在。请重试，如访问仍然失败，请与系统管理员联系。")
        return ret
    }

    /**
     * @param options_arr
     * @param callback(e) - When every request succeed
     *  e:{
     *      target:    the PromisePool itself
     *      data:{
     *          promise: the Promise that got fulfilled,
     *          result:  the result of that Promise
     *      }
     *  }
     * @return  Promise<(string | Buffer)[]>
     */
    protected async requestBatch(options_arr: Options[], callback: Function = null): Promise<any[]> {
        const thisVal = this
        const generatePromises = function* () {
            for (let i = 0; i < options_arr.length; i++)
                yield thisVal.request(options_arr[i])
        }
        const rs: string[] = []
        // @ts-ignore 构造函数中的迭代器写法未被ts支持
        const pool = new PromisePool(generatePromises(), BaseRequester.MAX_THREAD)
        pool.addEventListener('fulfilled', (e) => {
            rs.push(e.data.result)
            callback && callback(e)
        })
        await pool.start()
        return rs

    }

}
