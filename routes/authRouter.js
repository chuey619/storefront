const authRouter = require('express').Router()

const passport = require('../services/local')

const usersController = require('../controllers/usersController')

authRouter.post('/register', usersController.create)

authRouter.post('/login', async(req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(401).json({
                data: {
                    error : 
                        {
                            title: 'Invalid Login',
                            description: 'Username or Password was incorrect'
                        }
                }
            })
        }
        req.login(user, async (err) => {
            if (err) {
                return next(err)
            }
            return res.status(200).json({
                data: {
                    user: {
                        username: user.username,
                        password_digest: user.password_digest,
                        name: user.name,
                        id: user.id,
                        email: user.email
                    }
                }
            })
        })
    })(req, res, next)
})


authRouter.get('/me', async (req, res) => {
    if (req.user)
      return res.status(200).json({
          data: {
              user: {
                  username: req.user.username,
                  password_digest: req.user.password_digest,
                  name: req.user.name,
                  id: req.user.id
              }
          }
      })
      else
        return res.status(200).json({
            message: 'Retry Login',
            data: {
                user: null
            }
        })
})
authRouter.get('/logout', (req, res) => {
    req.logout()
    res.json({
        message: 'Logged out',
        auth: false,
        data: {
            user: null
        }
    })
})

module.exports = authRouter