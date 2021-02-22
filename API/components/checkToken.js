require('dotenv').config();
const jwt =require('jsonwebtoken');

module.exports ={
    authenticateToken(req, res, next) {
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.SUPER_SECRET_KEY, (err, data) => {

      if (err) return res.sendStatus(403)
      req.email = data.email
      req.iduser = data.iduser
      next()
    })
  } 
}
