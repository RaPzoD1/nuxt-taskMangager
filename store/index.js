import JWTDecode from 'jwt-decode'
import cookieparser from 'cookieparser'

export const actions = {
   nuxtServerInit({commit},{req}) {
        if (!req.headers.cookie) {return}

        const parsed = cookieparser.parse(req.headers.cookie)
        const accessTokenCookie = parsed.access_token

        if(!accessTokenCookie) { return }

        const accessToken = JWTDecode( accessTokenCookie)
        if(accessToken) {
            commit('users/SET_USER',{uid: accessToken.user_id, email: accessToken.email})
        }
    }
}