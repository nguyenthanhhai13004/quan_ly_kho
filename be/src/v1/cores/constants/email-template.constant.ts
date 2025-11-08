const RESET_PASSWORD_USER_FROM_ADMIN_EMAIL_TEMPLATE = {
  html:`
  <!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Đặt lại mật khẩu</title>
  <style>
    body,table,td,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table,td{ mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img{ -ms-interpolation-mode:bicubic; }

    body{ margin:0; padding:0; width:100% !important; background-color:#f4f4f7; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color:#333; }
    .container{ max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.08); }
    .header{ padding:20px; text-align:left; background:#ffffff; }
    .logo{ max-height:40px; }
    .content{ padding:28px; line-height:1.5; }
    .btn{ display:inline-block; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:600; }
    .btn-primary{ background:#2563eb; color:#ffffff; }
    .code-box{ display:block; background:#f7f7fb; border:1px dashed #d1d5db; padding:12px; border-radius:6px; font-family:monospace; font-size:16px; margin:14px 0; word-break:break-all; }
    .small{ font-size:13px; color:#6b7280; }
    .footer{ padding:18px 28px; font-size:12px; color:#9ca3af; text-align:center; }
    @media (max-width:480px){
      .container{ margin:18px; }
      .content{ padding:18px; }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <div class="container" role="article" aria-label="Email đặt lại mật khẩu">
          <div class="content">
            <h2 style="margin-top:0;">Đặt lại mật khẩu</h2>

            <p>Chào <strong>{{username}}</strong>,</p>

            <p>Bạn đã yêu cầu đặt lại mật khẩu. Dưới đây là mật khẩu tạm thời của bạn — vui lòng đăng nhập và đổi mật khẩu ngay lập tức.</p>

            <div class="code-box" role="textbox" aria-label="Mật khẩu tạm thời">
              {{temp_password}}
            </div>

            <p style="margin:0 0 18px 0;">
              Nhấn nút bên dưới để đăng nhập:
            </p>
            <p>
              <a class="btn btn-primary" href="{{login_url}}" target="_blank" rel="noopener noreferrer">Đăng nhập</a>
            </p>
            <p class="small" style="margin-top:14px;">
              Nếu bạn không yêu cầu thay đổi mật khẩu, hãy bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ.
            </p>
            <hr style="border:none;border-top:1px solid #eef2f7;margin:20px 0;" />
            <p class="small" style="margin:0;">
              Gợi ý bảo mật: sau khi đăng nhập, hãy đổi mật khẩu thành một mật khẩu mạnh (ít nhất 8 ký tự, kết hợp chữ hoa, chữ thường, số và ký hiệu) và không chia sẻ với người khác.
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>

  `,
  title:`Đặt lại mật khẩu`
}

const CREATE_NEW_USER_EMAIL_TEMPLATE = {
  html:`<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Tạo tài khoản thành công</title>
  <style>
    body,table,td,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table,td{ mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img{ -ms-interpolation-mode:bicubic; }

    body{ margin:0; padding:0; width:100% !important; background-color:#f4f4f7; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color:#333; }
    .container{ max-width:600px; margin:40px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.08); }
    .header{ padding:20px; text-align:left; background:#ffffff; }
    .logo{ max-height:40px; }
    .content{ padding:28px; line-height:1.5; }
    .btn{ display:inline-block; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:600; }
    .btn-primary{ background:#2563eb; color:#ffffff; }
    .code-box{ display:block; background:#f7f7fb; border:1px dashed #d1d5db; padding:12px; border-radius:6px; font-family:monospace; font-size:16px; margin:14px 0; word-break:break-all; }
    .small{ font-size:13px; color:#6b7280; }
    .footer{ padding:18px 28px; font-size:12px; color:#9ca3af; text-align:center; }
    @media (max-width:480px){
      .container{ margin:18px; }
      .content{ padding:18px; }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <div class="container" role="article" aria-label="Mật khẩu mới">
          <div class="content">
            <h2 style="margin-top:0;">Thông tin đăng nhập</h2>

            <p>Chào <strong>{{username}}</strong>,</p>

            <p>Dưới đây là mật khẩu tạm thời của bạn — vui lòng đăng nhập và đổi mật khẩu ngay lập tức.</p>

            <div class="code-box" role="textbox" aria-label="Mật khẩu tạm thời">
              {{temp_password}}
            </div>

            <p style="margin:0 0 18px 0;">
              Nhấn nút bên dưới để đăng nhập:
            </p>

            <p>
              <a class="btn btn-primary" href="{{login_url}}" target="_blank" rel="noopener noreferrer">Đăng nhập</a>
            </p>


            <hr style="border:none;border-top:1px solid #eef2f7;margin:20px 0;" />

            <p class="small" style="margin:0;">
              Gợi ý bảo mật: sau khi đăng nhập, hãy đổi mật khẩu thành một mật khẩu mạnh (ít nhất 8 ký tự, kết hợp chữ hoa, chữ thường, số và ký hiệu) và không chia sẻ với người khác.
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`,
  title:"Tạo tài khoản thành công"
};
export {RESET_PASSWORD_USER_FROM_ADMIN_EMAIL_TEMPLATE,CREATE_NEW_USER_EMAIL_TEMPLATE}