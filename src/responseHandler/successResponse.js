const successRes = (res,message,data= null ,token =null, statusCode = 200,extras={})=>{
    if(token){
        return res.status(statusCode).json({
            status:true,
            message,
            data,
            token,
            extras
        })
    }
    return res.status(statusCode).json({
        status:true,
        message,
        data,
        extras
    })
}

export default successRes;