const errorMiddleware =(err,req,res,next)=>{

    console.log("errror middleware chlaa -->");
    
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status:true,
        message:err.message || "Server Internal Error"
    });
}


export default errorMiddleware;