import jwt from "jsonwebtoken"

//userID monongodb se denge
export const gettoken = (userId) => {
    try {
        const token = jwt.sign(
            { userId: userId },
            process.env.JWT_SECRET,
            { expiresIn: "10d" }
        )
        return token;
    } catch (error) {
        console.log(error)
    }
}