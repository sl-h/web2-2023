using System.Net;
using MailKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;


namespace WebServer.Services.Email;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public void SendEmail(string to, string subject, string body)
    {
        string smtpServer = _configuration["EmailSettings:SmtpServer"];
        int smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]);
        string username = _configuration["EmailSettings:Username"];
        string password = _configuration["EmailSettings:Password"];


        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("TireHeaven", username));
        message.To.Add(new MailboxAddress("user",to));
        message.Subject = subject;
        message.Body = new TextPart("plain") { Text = body };

        using (var client = new SmtpClient())
        {
            client.Connect(smtpServer , 
                smtpPort, SecureSocketOptions.StartTls);
            client.Authenticate(username, password);

            client.Send(message);
            client.Disconnect(true);
        }
    }

}