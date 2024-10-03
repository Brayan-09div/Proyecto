import jwt from 'jsonwebtoken';

const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "Error en la petición"
        });
    }

    try {
        let usuario;

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        if (!uid) {
            return res.status(401).json({
                msg: "Error en la petición"
            });
        }

        usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: "Error en la petición! - usuario no existe DB"
            });
        }

        if (usuario.estado === 0) {
            return res.status(401).json({
                msg: "Token no válido!! - usuario con estado: false"
            });
        }

        req.usuario = usuario; 
        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({
            msg: "Token no válido"
        });
    }
};

export {  validarJWT };
