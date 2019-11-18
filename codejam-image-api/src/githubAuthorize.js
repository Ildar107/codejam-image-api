import User from './user.js';

export default class Authorize {
  constructor() {
    this.clientId = '9a3a299faadbd0e23606';
    this.clientSecret = '580d19c958745ac45a31c36bfbbe64aec6276e67';
    this.redirectUri = 'https://ildar107.github.io/codejam-image-api/codejam-image-api/';
    this.postUrl = 'https://github.com/login/oauth/access_token';
    this.userUrl = 'https://api.github.com/user';
    this.proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    this.accessToken = '';
    this.user = {};
  }

  signIn() {
    document.location = `https://github.com/login/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}`;
  }

  async getAccessToken(code) {
    const data = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };
    try {
      const response = await fetch(this.proxyUrl + this.postUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (json.error === 'bad_verification_code') {
        document.location.search = '';
      } else {
        this.accessToken = json.access_token;
        this.getUser();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getUser() {
    try {
      this.userUrl += `?access_token=${this.accessToken}&client_id=this.clientId&client_secret=this.clientSecret`;
      const response = await fetch(this.proxyUrl + this.userUrl, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          Connection: 'close',
          'User-Agent': window.navigator.userAgent,
        },
      });
      const json = await response.json();
      this.user = new User(json.login, json.avatar_url);
      this.setUserDataInHtml();
    } catch (err) {
      console.log(err);
    }
  }

  signOut= () => {
    const avatar = document.getElementById('avatar');
    const login = document.getElementById('login');
    const authorizationBtn = document.getElementById('authorization');
    avatar.style.display = 'none';
    login.innerHTML = '';
    authorizationBtn.innerHTML = 'Sign In';
    document.location.search = '';
  }

  setUserDataInHtml() {
    const avatar = document.getElementById('avatar');
    const login = document.getElementById('login');
    const authorizationBtn = document.getElementById('authorization');
    avatar.src = this.user.avatarUrl;
    avatar.style.display = 'inline-block';
    login.innerHTML = this.user.login;
    authorizationBtn.innerHTML = 'Sign out';
  }

  parseQueryString= (string) => {
    if (string === '') { return {}; }
    const segments = string.split('&').map((s) => s.split('='));
    const queryString = {};
    segments.forEach((s) => {
      queryString[s[0]] = s[1];
    });
    return queryString;
  }
}
