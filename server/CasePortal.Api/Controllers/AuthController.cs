using CasePortal.Api.Models.Requests;
using CasePortal.Api.Models.Responses;
using CasePortal.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CasePortal.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService auth) : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var token = auth.Login(request.Email, request.Password);
        if (token is null)
            return Unauthorized(new ApiError
            {
                Code    = "UNAUTHORIZED",
                Message = "Invalid email or password.",
            });

        return Ok(new LoginResponse { Token = token, ExpiresIn = 86400 });
    }

    [HttpPost("logout")]
    public IActionResult Logout() => NoContent();
}
