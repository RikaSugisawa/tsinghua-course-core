import BaseRequester, {Options as RequestOpt} from './BaseRequester'
import LoginManager from './LoginManager'
import * as $ from 'cheerio'
import {RemainInfo, OpeningInfo} from './Structures'
import * as assert from "assert";

export default class CourseQueryer extends BaseRequester {
    _token: string
    last_token_refreshed: Date
    static readonly MAX_RETRY = 100

    private get xnxq(): string {
        return this.lgnMgr.xnxq
    }

    static TOKEN_LIFE_SPAN = 1000 * 60 * 10//ms
    private lgnMgr: LoginManager;


    constructor(cookieJar, lgnMgr: LoginManager) {
        super(cookieJar);
        this.lgnMgr = lgnMgr;

    }

    private async token(isForce: boolean = false): Promise<string> {
        if (!isForce && Number(new Date()) - Number(this.last_token_refreshed)
            < CourseQueryer.TOKEN_LIFE_SPAN)
            return this._token
        try {
            const res: string = (await this.request({
                url: "http://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksJxjhBs.do?m=kkxxSearch&p_xnxq=" + this.xnxq,
                encoding: 'gb2312'
            }))

            this._token = new RegExp("<input type=\"hidden\" name=\"token\" value=\"([0-9a-f]{32})\">").exec(res)[1]
            this.last_token_refreshed = new Date()
            return this._token
        } catch (e) {
            throw e
        }
    }

    /**
     * Only used for get the number of pages
     * DO NOT use this for scrapping pages
     */
    private async getOnePage(url, m, page = 1): Promise<string> {
        let retry_cnt = 0
        while (retry_cnt < CourseQueryer.MAX_RETRY) {
            try {
                const body: string = await this.request({
                    url: url + "?t=" + Math.random().toString(),
                    method: 'POST',
                    form: {
                        m: m,
                        page: page,
                        token: await this.token(),
                        "p_sort.asc1": true,
                        "p_sort.asc2": true,
                        p_xnxq: this.xnxq,
                        goPageNumber: page == 1 ? 1 : page - 1,
                    },
                    encoding: 'gb2312'
                },)

                if (body.indexOf('trr2') < 0)  // noinspection ExceptionCaughtLocallyJS
                    throw new Error('Empty body')

                const get_page = Number(new RegExp(/第 (\d+) 页/).exec(body)[1])
                assert(get_page == page,
                    new Error(`Page invalid, require ${page} get ${get_page}`))

                return body
            } catch (e) {
                retry_cnt++
                if (retry_cnt >= CourseQueryer.MAX_RETRY - 1)
                    console.log(e)
            }
        }
        return ''
    }


    public async getOpeningInfo(): Promise<Array<OpeningInfo>> {
        const url = "http://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksJxjhBs.do",
            m = 'kkxxSearch'
        const res1 = await this.getOnePage(url, m)
        let max_page = Number(new RegExp("共 (\\d+) 页").exec(res1)[1])
        const options: RequestOpt[] = []
        for (let i = 1; i <= max_page; i++)
            options.push({
                url: url,
                method: 'POST',
                form: {
                    m: m,
                    page: i,
                    token: await this.token(),
                    "p_sort.asc1": true,
                    "p_sort.asc2": true,
                    p_xnxq: this.xnxq,
                },
                encoding: 'gb2312'
            })
        const strs = await this.requestBatch(options)
        const trs1 = $('<root>' + strs.reduce(
            (_, __) => _ + __) + '</root>')
            .find('tr.trr2')
        return trs1.map(
            (_) => new OpeningInfo(
                $(trs1[_]).find('td').map(function () {
                    return $(this).text().replace(/\s+/g, '')
                })))

    }

    public async getRemainInfo(): Promise<Array<RemainInfo>> {
        const url = "http://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksJxjhBs.do",
            m = 'kylSearch'
        const res1 = await this.getOnePage(url, m)
        let max_page = Number(new RegExp("共 (\\d+) 页").exec(res1)[1])
        const options: RequestOpt[] = []
        for (let i = 1; i <= max_page; i++)
            options.push({
                url: url,
                method: 'POST',
                form: {
                    m: m,
                    page: i,
                    token: await this.token(),
                    "p_sort.asc1": true,
                    "p_sort.asc2": true,
                    p_xnxq: this.xnxq,
                },
                encoding: 'gb2312'
            })
        const strs = await this.requestBatch(options)

        const trs1 = $('<root>' + strs.reduce(
            (_, __) => _ + __) + '</root>')
            .find('tr.trr2')
        const _ = trs1.map(
            (_) => new RemainInfo(
                $(trs1[_]).find('td').map(function () {
                    return $(this).text().replace(/\s+/g, '')
                })))
        return _

    }


}
