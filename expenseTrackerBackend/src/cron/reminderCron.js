import cron from 'node-cron';
import User from '../models/users.js';
import { sendRemainderEmail } from '../services/emailService.js';
export const startCronJobs=()=>{
    //Runs every minute to check if emails should be sent
    cron.schedule('* * * * *',async ()=>{
        console.log('Cron Job running every minute to check for remainders...');
        const now=new Date();
        const currentHour=now.getHours().toString().padStart(2,'0');
        const currentMinute=now.getMinutes().toString().padStart(2,'0');
        const currentTime= `${currentHour}:${currentMinute}`;
        try{
            const users=await User.find({
                remaindersEnabled:true,
                notificationTime:currentTime
            });

            for(const user of users){
                await sendRemainderEmail(user.email,user.name);
            }
        }
        catch(err)
        {
            console.error("Error in reminder cron job",err);
        }
    })
}