<?php
class mail
{
    public static function send_email($email)
    {
        switch ($email['type']) {
            case 'register';
                $email['fromEmail'] = 'secondchanceonti@gmail.com';
                $email['inputEmail'] = 'secondchanceonti@gmail.com';
                $email['inputMatter'] = 'Email verification';
                $email['inputMessage'] = "<h2>Email verification.</h2><a href='http://localhost/Ejercicios/Framework_PHP_OO_MVC/module/login/register/$email[token]'>Click here for verify your email.</a>";
                break;
            case 'recover';
                $email['fromEmail'] = 'secondchanceonti@gmail.com';
                $email['inputEmail'] = 'secondchanceonti@gmail.com';
                $email['inputMatter'] = 'Recover password';
                $email['inputMessage'] = "<a href='http://localhost/Ejercicios/Framework_PHP_OO_MVC/module/login/recover/$email[token]'>Click here for recover your password.</a>";
                break;
        }
        return self::send_mailgun($email);
    }

    public static function send_mailgun($values)
    {
        // Include Composer autoload file to load Resend SDK classes...
        require __DIR__ . '/vendor/autoload.php';

        // Assign a new Resend Client instance to $resend variable, which is automatically autoloaded...
        $resend = Resend::client('');

        try {
            $result = $resend->emails->send([
                'from' => 'Acme <onboarding@resend.dev>',
                'to' => ['dasaga26@gmail.com'],
                'subject' => 'Hello world',
                'html' => '<strong>It works!</strong>',
            ]);
        } catch (\Exception $e) {
            exit('Error: ' . $e->getMessage());
        }

        // Show the response of the sent email to be saved in a log...
        echo "Done";
    }
}
