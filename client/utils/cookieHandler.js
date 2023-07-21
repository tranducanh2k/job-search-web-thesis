const setLoginCookies = (token, accountId) => {
    let now = new Date();
    let time = now.getTime();
    let expireTime = time + 1000*3600*24;
    now.setTime(expireTime);
    document.cookie = `jwt=${token};expires=${+now.toUTCString()};path=/`;

    document.cookie = `accountId=${accountId};expires=${+now.toUTCString()};path=/`;
}

const getCookiesClientSide = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const clearCookies = () => {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

const clearCookiesServerSide = (cookies, res) => {
    try {
        let cookiesArr = [];
        // ## iterating over the list of cookie
        // ## and setting max-age to 0
        for (const cookie in cookies) {
            cookiesArr.push(`${cookie}=;Path=/;MAX-AGE=0`);
        }
        // ## reset the modified cookie list to res
        res.setHeader("set-cookie", cookiesArr);
    } catch (error) {
        console.log("error occured ", error);
    }
    return res;
};

export {setLoginCookies, clearCookies, clearCookiesServerSide, getCookiesClientSide};