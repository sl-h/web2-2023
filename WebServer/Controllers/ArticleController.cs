using System.Web.Http.Cors;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebServer.DTOs;
using WebServer.Interfaces;
using WebServer.Models;
using WebServer.Repository;


namespace WebServer.Controllers;



[ApiController]
[Route("api/[controller]")]
[EnableCors(origins: "*", headers: "*", methods: "*")]
public class ArticleController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _dtoMapper;
    private readonly IArticleService _articleService;

    public ArticleController(IUnitOfWork unitOfWork, IMapper dtoMapper, IArticleService articleService)
    {
        _unitOfWork = unitOfWork;
        _dtoMapper = dtoMapper;
        _articleService = articleService;
    }   
    
    

    [HttpGet("get-articles")]
    [AllowAnonymous]
    public async Task<ActionResult<List<ArticleDto>>> GetArticles()
    {
        var articles = await _articleService.GetAllArticles(Request);
        
        return Ok(articles);
    }


    [HttpGet ("get-article/{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ArticleDto>> GetArticle(int id, HttpRequest Request)
    {
        var article = await _articleService.GetArticle(id, Request);
        return Ok(article);
    }
    
    
    [HttpGet("get-articles-by-category")]
    [AllowAnonymous]
    public async Task<ActionResult<List<Article>>> GetArticlesByCategory(string category)
    {
        var articles = await _articleService.GetByCategory(category);
        return Ok(articles);
    }

    
    [HttpGet("salesman-articles")] 
    [Authorize(Roles = "Salesman")]
    
    public async Task<ActionResult<List<ArticleDto>>> GeSalesmantArticles(string email)
    {
        var articles = await _articleService.GetSalesmanArticles(email, Request);
        return Ok(articles);
    }
    
    
    [HttpPost ("create-article")]
    [Authorize(Roles = "Salesman")]
    public async Task<ActionResult> CreateArticle([FromForm]ArticleDto request)
    {
        var result = await _articleService.CreateArticle(request, request.Email);
        
        if(result > 0 )
            return Ok("Article successfully added");
        
        return BadRequest("Article is not added");
    }

    

    [HttpPut( "update-article")]
    [Authorize(Roles = "Salesman")]
    
    public async Task<ActionResult> UpdateArticle( [FromForm]ArticleDto request)
    {
        var result = await _articleService.UpdateArticle(request);
        
        if(result > 0 )
            return Ok("Article successfully updated");
        
        return BadRequest("Article is not updated");
    }



    [Authorize(Roles = "Salesman")]
    [HttpDelete ("delete-article/{id}")]
    public async Task<ActionResult> DeleteArticle(int id)
    {
        int result = await _articleService.DeleteArticle(id);

        return Ok(result> 0 ? "Article successfully deleted" : "Article is not deleted");
    }


  
}

