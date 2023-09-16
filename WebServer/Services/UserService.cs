using AutoMapper;
using WebServer.DTOs;
using WebServer.Errors;
using WebServer.Interfaces;
using WebServer.Models;
using WebServer.Repository;
using WebServer.Services.Email;


namespace WebServer.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtService _jwtService;
    private readonly IMapper _dtoMapper;
    private readonly IEmailService _emailService;
    private readonly string _relativeImagePath = @"Images\user images\";
    

    public UserService(IUnitOfWork unitOfWork,  JwtService jwtService, IMapper dtoMapper,
        IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _dtoMapper = dtoMapper;
        _emailService = emailService;
    }
    

    public async Task<UserDto> Login(LoginDto request, HttpRequest httpRequest)
    {
        var encryptedPassword = HashingService.GetHash(request.Password);

        var user = await _unitOfWork.Users.FindOne(user =>
            user.Email == request.Email && user.Password == encryptedPassword);
        
        if (user == null)
        {
            throw new UserNotFoundException(request.Email);
        }

        user.Address = _unitOfWork.Users.GetUserAddress(user.AddressId);
        user.ImageSrc = GenrateImageSrc(user.ImageName, httpRequest);
        
        var userDto = _dtoMapper.Map<UserDto>(user);
        userDto.token = _jwtService.CreateToken(user);
        
        return userDto;
    }


    public async Task<UserDto> GoogleLogin(string accessToken, HttpRequest httpRequest)
    {
        var httpClient = new HttpClient();
        var requestUrl = $"https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={accessToken}";

        try
        {
            var response = await httpClient.GetAsync(requestUrl);

            if (!response.IsSuccessStatusCode)
                throw new Exception("Google login verification failed");

            var googleTokenDto = await response.Content.ReadFromJsonAsync<GoogleTokenDto>();
            var user = await _unitOfWork.Users.FindOne(u => u.Email == googleTokenDto.Email);

            if (user == null)
                throw new Exception("user with that credentials does not exists.");
            
            user.Address = _unitOfWork.Users.GetUserAddress(user.AddressId);
            var userDto = _dtoMapper.Map<UserDto>(user);
            
            userDto.token = _jwtService.CreateToken(user);
            userDto.ImageSrc = GenrateImageSrc(userDto.ImageName, httpRequest);
            
            
            return userDto;
        }
        catch(Exception e)
        {
            throw new Exception("Google login verification failed");
        }
        
    }

    
    public async Task<UserDto> Register(UserDto request)
    {
        var user = await _unitOfWork.Users.FindOne(user =>
            user.Email == request.Email || user.Username == request.Username);
        
        if (user != null)
            throw new UserAlreadyExistsException(request.Email);

        var encryptedPassword = HashingService.GetHash(request.Password);
        
        var newUser = _dtoMapper.Map<User>(request);
        newUser.Password = encryptedPassword;
        newUser.ImageName = await Common.SaveImageFile(newUser,_relativeImagePath);
        
        var registrationMessage =
            $"Dear {newUser.Username},\n\n your registration was successful. Wish you a pleasant shopping experience. \n\n Best regards, \n\n The WebShop Team";
        var subject = "Registration successful";
        _emailService.SendEmail(newUser.Email, subject, registrationMessage);


        await _unitOfWork.Users.Add(newUser);
        _unitOfWork.SaveChanges();

        return _dtoMapper.Map<UserDto>(newUser);
    }
    
    
    public async Task<UserDto> EditUserProfile(UserDto request, HttpRequest httpRequest)
    {
        var user = await _unitOfWork.Users.FindOne(u => u.Email == request.Email);

        
        if (user == null)
            throw new UserNotFoundException(request.Email);
        
        
        user.Email = request.Email; 
        user.FullName = request.FullName;
        user.Address = _unitOfWork.Users.GetUserAddress(user.AddressId);
        user.Address.Street = request.Address.Street;
        user.Address.City = request.Address.City;
        user.Address.StreetNumber = request.Address.StreetNumber;
        user.Address.PostCode = request.Address.PostCode;
        user.Birthday = request.Birthday;
        if(request.Password != null)
            user.Password = HashingService.GetHash(request.Password);
        if (request.ImageFile != null)
        {
            user.ImageFile = request.ImageFile;
            user.ImageName = await Common.SaveImageFile(user,_relativeImagePath);
        }
            user.ImageSrc = GenrateImageSrc(user.ImageName, httpRequest);

        _unitOfWork.Users.Update(user);
  

        if (_unitOfWork.SaveChanges() > 0)
            return _dtoMapper.Map<UserDto>(user);
        else
            throw new Exception("Error while saving changes");
    }


    public async Task<int> VerifyUser(string email)
    {
        var user = await _unitOfWork.Users.FindOne(u => u.Email == email );
        
        if (user == null)
            throw new UserNotFoundException(0);

        user.Verified = true;
        _unitOfWork.Users.Update(user);
        
        
        var verificationMessage =
            $"Dear {user.Username},\n\n your registration was verified. Wish you a pleasant working experience. " +
            $"\n\n Best regards, \n\n The WebShop Team";
        _emailService.SendEmail(user.Email, "Profile verification", verificationMessage);
        return _unitOfWork.SaveChanges();
    }


    public async Task<int> DeleteUser(int id)
    {
        await _unitOfWork.Users.Remove(id);
        return _unitOfWork.SaveChanges();
    }

    
    public async Task<List<UserDto>> GetAllUsers()
    {
        var users = await _unitOfWork.Users.GetUsers();
        var usersDtos = users.Select(user => _dtoMapper.Map<UserDto>(user));
        
        return usersDtos.ToList();
    }

    
    public async Task<List<UserDto>> GetUsers(bool verified)
    {
        var users = await _unitOfWork.Users.GetUsers(verified);
        var usersDtos = users.Select(user => _dtoMapper.Map<UserDto>(user));
        
        return usersDtos.ToList();
    }

    
    public async Task<UserDto> GetUserById(int id)
    {
        var user = await _unitOfWork.Users.GetUserById(id);

        if (user == null)
            throw new UserNotFoundException(id);

        var userDto = _dtoMapper.Map<UserDto>(user);
        return userDto;
    }
    
    
    private string  GenrateImageSrc(string ImageName, HttpRequest Request)
    {
        return String.Format("{0}://{1}{2}/Images/user images/{3}", Request.Scheme, Request.Host, Request.PathBase, ImageName);
    }
}