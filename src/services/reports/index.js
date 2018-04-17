import config from '@/config'

export default {
    open(params) {
        let url = config.reports + '?';
        url += Object.keys(params).map(k => `${k}=${params[k]}`).join('&');
        window.open(url, '_blank');
    }
}