import nodemailer from 'nodemailer';
const transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS//App password from google
    }
});

export const sendRemainderEmail=async (email, name)=>{
    const mailOptions={
        from:process.env.EMAIL_USER,
        to:email,
        subject:'Expense Tracker Reminder',
        text: `Hi ${name}, \n\n Just a Quick Remainder to log your expenses for today! \n \n Stay on top of your budget. \n- Expense Tracker Team`
    };
    try{
        await transporter.sendMail(mailOptions);
        console.log(`Remainder sent to ${email}`);
    }
    catch(err)
    {
        console.error(`Failed to send email to ${email}`,error)
    }

};