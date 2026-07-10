import dotenv from "dotenv";

dotenv.config();

const emailConfiguration = {
    service:"gmail",
    auth :{ 
        user:process.env.PORTAL_EMAIL,
        pass:process.env.PORTAL_PASSWORD
    }
}

export default emailConfiguration;