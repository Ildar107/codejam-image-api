export default class Authorize {
    constructor(){
        this.clientId = '9a3a299faadbd0e23606';
        this.clientSecret = '580d19c958745ac45a31c36bfbbe64aec6276e67';
        this.redirectUri = 'https://ildar107.github.io/codejam-image-api/codejam-image-api/';
        this.postUrl = 'https://github.com/login/oauth/access_token/';
    } 

    signIn () {
        document.location = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=http%3A%2F%2Flocalhost%3A5500%2Fcodejam-image-api%2Findex.html`;
    }

    getAccess_token(code) {
        let data = {
            code: code,
            client_id: this.clientId,
            client_secret: this.clientSecret
        }
        fetch(this.postUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Accept': 'application/vnd.github.machine-man-preview+json',
            },
            body: JSON.stringify(data), 
        })
        .then(response => response.json())
        .then(data => localStorage.setItem('token', data))
        .catch(err => alert(err)); 
    }

    parseQueryString(string) {
        if(string == "") { return {}; }
        var segments = string.split("&").map(s => s.split("=") );
        var queryString = {};
        segments.forEach(s => queryString[s[0]] = s[1]);
        return queryString;
    }
}  
