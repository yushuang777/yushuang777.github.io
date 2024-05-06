import HomeList from '../utils/json/homeList.json'

export function getUrlParams(url) {
    const matches = url.match(/([^?=&]+)(=([^&]*))/g);
    const result = {};
    let name = "";

    if (matches) {
        matches.forEach((match) => {
            const [key, value] = match.split('=');
            result[key] = decodeURIComponent(value); // 解码 URL 参数的值
        });

        HomeList.map((item) => {
            if (item.classname === result.classname) {
                name = item.name;
            }
        });
    }

    return { result, name };
}
