using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.API.DTOs.Project;
using TaskFlow.API.Services.Interfaces;

namespace TaskFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // ← Toutes les routes de ce controller sont protégées
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    // Méthode helper pour récupérer l'Id de l'utilisateur connecté
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    // GET api/projects
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var projects = await _projectService.GetAllAsync(GetUserId());
        return Ok(projects);
    }

    // GET api/projects/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var project = await _projectService.GetByIdAsync(id, GetUserId());

        if (project == null)
            return NotFound(new { message = "Projet non trouvé" });

        return Ok(project);
    }
    

    // POST api/projects
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
    {
        var project = await _projectService.CreateAsync(dto, GetUserId());
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }

    // PUT api/projects/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateProjectDto dto)
    {
        var project = await _projectService.UpdateAsync(id, dto, GetUserId());

        if (project == null)
            return NotFound(new { message = "Projet non trouvé" });

        return Ok(project);
    }

    // DELETE api/projects/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _projectService.DeleteAsync(id, GetUserId());

        if (!result)
            return NotFound(new { message = "Projet non trouvé" });

        return NoContent(); // 204 — supprimé avec succès
    }
}