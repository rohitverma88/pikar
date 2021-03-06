// @dynamic
export class ProductUtilities {
    static generateQueryString(data) {
        for (const item in data) {
            if (data[item] === null || data[item] === undefined || data[item] === '' ) {
              delete data[item];
            }
        }
        return Object.keys(data).map(key => key + '=' + data[key]).join('&');
    }
}
