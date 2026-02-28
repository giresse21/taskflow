using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.API.DTOs.Task;
using TaskFlow.API.Services.Interfaces;

namespace TaskFlow.API.Controllers;

[ApiController]
[Route("api/projects/{projectId}/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    // GET api/projects/1/tasks
    [HttpGet]
    public async Task<IActionResult> GetAll(int projectId)
    {
        var tasks = await _taskService.GetAllAsync(projectId, GetUserId());
        return Ok(tasks);
    }

    // GET api/projects/1/tasks/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int projectId, int id)
    {
        var task = await _taskService.GetByIdAsync(id, projectId, GetUserId());
        if (task == null)
            return NotFound(new { message = "Tâche non trouvée" });
        return Ok(task);
    }

    // POST api/projects/1/tasks
    [HttpPost]
    public async Task<IActionResult> Create(int projectId, [FromBody] CreateTaskDto dto)
    {
        try
        {
            var task = await _taskService.CreateAsync(dto, projectId, GetUserId());
            return CreatedAtAction(nameof(GetById), new { projectId, id = task.Id }, task);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT api/projects/1/tasks/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int projectId, int id, [FromBody] CreateTaskDto dto)
    {
        var task = await _taskService.UpdateAsync(id, dto, projectId, GetUserId());
        if (task == null)
            return NotFound(new { message = "Tâche non trouvée" });
        return Ok(task);
    }

    // PATCH api/projects/1/tasks/5/toggle
    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> Toggle(int projectId, int id)
    {
        var task = await _taskService.ToggleCompleteAsync(id, projectId, GetUserId());
        if (task == null)
            return NotFound(new { message = "Tâche non trouvée" });
        return Ok(task);
    }

    // DELETE api/projects/1/tasks/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int projectId, int id)
    {
        var result = await _taskService.DeleteAsync(id, projectId, GetUserId());
        if (!result)
            return NotFound(new { message = "Tâche non trouvée" });
        return NoContent();
    }
}